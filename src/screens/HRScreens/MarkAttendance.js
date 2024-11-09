import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Alert, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Loader from '../../library/commons/Loader';
import axios from 'axios';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import Button from '../../library/commons/Button';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import moment from 'moment';
import R from '../../resources/R';
import {useSelector} from 'react-redux';
import {currentUserSelector} from '../../store/slices/user/user.slice';
import UserApi from '../../datalib/services/user.api';
import ConfirmationModal from '../../library/modals/ConfirmationModal';
import {useNavigation} from '@react-navigation/native';

const MarkAttendance = () => {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [addressFetched, setAddressFetched] = useState('');
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const [loading, setLoading] = useState(false);
  const [clockedIn, setClockedIn] = useState(false);
  const [isvIs, onModalClose] = useState(false);
  const [data, setData] = useState({});
  const user = useSelector(currentUserSelector);

  useEffect(() => {
    if (user) {
      fetchCurrentDayAtt();
    }
  }, [user]);
  const fetchCurrentDayAtt = async () => {
    try {
      setLoading(true);
      const payload = {
        data: {
          AttendanceDate: currentDate,
          AttendanceMonth: currentDate?.getMonth() + 1,
          AttendanceYear: currentDate?.getFullYear(),
          StaffID: user?.staffid,
        },
      };

      const response = await new UserApi().getCurrentDayAttendance(payload);
      if (response?.data != null) {
        setClockedIn(true);
        setData(response.data);
      } else {
        setData({});
        setClockedIn(false);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    requestLocationPermission();
    setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This app needs access to your location ' +
            'so we can know where you are.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        fetchGeolocation();
      } else {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to fetch geolocation.',
        );
        fetchGeolocation();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchGeolocation = async () => {
    try {
      setLoading(true);
      const API_KEY = 'AIzaSyBsc_32ip44ZxiwytqSxKdczopDmUAFpow';
      Geolocation.getCurrentPosition(
        async position => {
          const {latitude, longitude} = position.coords;
          setLat(latitude);
          setLong(longitude);
          //   console.log('add', latitude, longitude);
          const res = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`,
          );
          const fetchedAddress = res?.data?.results[0]?.formatted_address;

          //   console.log('add', fetchedAddress);
          setAddressFetched(fetchedAddress);
          setLoading(false);
        },
        error => {
          Alert.alert('Error', 'Failed to fetch geolocation');
          console.log(error);
          handleLocationError(error);
          setLoading(false);
        },
        {enableHighAccuracy: true, timeout: 60000, maximumAge: 10000},
      );
      // setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  // Function to handle location errors
  const handleLocationError = error => {
    switch (error.code) {
      case 1: // PERMISSION_DENIED
        Alert.alert('Error', 'Permission to access location was denied.');
        break;
      case 2: // POSITION_UNAVAILABLE
        Alert.alert('Error', 'Position unavailable. Please try again later.');
        break;
      case 3: // TIMEOUT
        Alert.alert('Error', 'Location request timed out. Please try again.');
        break;
      default:
        Alert.alert(
          'Error',
          'An unknown error occurred while fetching location.',
        );
    }
  };
  const handleMarkAttendance = async () => {
    try {
      setLoading(true);
      const currentDate = new Date();
      const date = currentDate.getDate();
      const month = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1
      const year = currentDate.getFullYear();
      const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(
        date,
      ).padStart(2, '0')}`;
      const payload = {
        data: {
          AttendanceDate: formattedDate,
          AttendanceMonth: currentDate?.getMonth() + 1,
          AttendanceYear: currentDate?.getFullYear(),
          StaffID: user?.staffid,
          ClockIn: new Date().toLocaleTimeString(),
          Status: null,
          LAT: lat,
          LONG: long,
        },
      };
      const response = await new UserApi().clockIn(payload);

      if (response?.success && response?.data) {
        fetchCurrentDayAtt();
        Alert.alert(response?.message);
        navigation.navigate(ScreensNameEnum.ATTENDANCE_LIST_SCREEN);
      } else {
        Alert.alert(response?.message);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const calculateWorkingHours = async (
    clockIn,
    clockOut = new Date().toLocaleTimeString(),
  ) => {
    const clockInTime = moment(clockIn, 'HH:mm:ss');
    const clockOutTime = moment(clockOut, 'HH:mm:ss');
    const duration = moment.duration(clockOutTime.diff(clockInTime));
    const hours = parseInt(duration.asHours());
    const minutes = parseInt(duration.minutes());
    return `${hours}h ${minutes}m`;
  };

  const handleClockOut = async () => {
    try {
      setLoading(true);
      const workingHours = await calculateWorkingHours(data.ClockIn);
      if (workingHours) {
        const payload = {
          data: {
            ID: data?.ID,
            StaffID: user?.staffid,
            ClockOut: new Date().toLocaleTimeString(),
            Status: 1,
            WorkingHours: workingHours,
          },
        };
        const response = await new UserApi().clockOut(payload);
        if (response?.success) {
          fetchCurrentDayAtt();
          Alert.alert(response?.message);
          navigation.navigate(ScreensNameEnum.ATTENDANCE_LIST_SCREEN);
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const onConfirm = () => {
    onModalClose(false);
    handleClockOut();
  };
  return (
    <ScreenWrapper header={false} backEnabled>
      <ChildScreensHeader screenName={ScreensNameEnum.MARK_ATTENDANCE_SCREEN} />
      <View style={styles.container}>
        <View style={styles.infoBox}>
          <Text style={styles.dateLabel}>
            {moment(currentDate).format('MMMM Do, YYYY')}
          </Text>
          <Text style={styles.timeLabel}>
            {currentDate.toLocaleTimeString()}
          </Text>
        </View>

        <View style={styles.locationBox}>
          {addressFetched ? (
            <Text style={styles.locationText}>📍 {addressFetched}</Text>
          ) : (
            <Text style={styles.locationText}>Fetching location...</Text>
          )}
        </View>

        <Loader loading={loading} message={'Please wait...'} />
      </View>

      {addressFetched?.length >= 5 && (
        <Button
          title={clockedIn ? 'Clock-out' : 'Clock-in'}
          //   color={styles.button.color}
          onPress={!clockedIn ? handleMarkAttendance : () => onModalClose(true)}
          buttonStyle={styles.buttonStyle}
          textStyle={styles.buttonTextStyle}
          backgroundColor={!clockedIn ? R.colors.primary : R.colors.RED}
        />
      )}
      {isvIs && (
        <ConfirmationModal
          isVisible={isvIs}
          onModalClose={onModalClose}
          confirmationText="Are you sure? you want to clock out"
          onConfirm={onConfirm}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  infoBox: {
    backgroundColor: '#E8F0FE',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 22,
    color: '#2C3E50',
    fontWeight: 'bold',
  },
  timeLabel: {
    fontSize: 18,
    color: '#2C3E50',
    marginTop: 5,
  },
  locationBox: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    borderColor: '#2980B9',
    borderWidth: 1,
  },
  locationText: {
    fontSize: 16,
    color: '#2980B9',
  },
  buttonStyle: {
    borderRadius: 6,
    margin: 10,
    width: '95%',
  },
  buttonTextStyle: {
    fontWeight: '800',
    fontSize: 16,
    textTransform: 'capitalize',
  },
});

export default MarkAttendance;
