import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, StyleSheet, Alert} from 'react-native';
import Modal from 'react-native-modal';
import Button from '../commons/Button';
import R from '../../resources/R';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {Picker} from '@react-native-picker/picker';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import UserApi from '../../datalib/services/user.api';
import {useDispatch, useSelector} from 'react-redux';
import {clockinSelector} from '../../store/slices/user/user.slice';
import {fetchClockinStatus} from '../../store/actions/userActions';
import Loader from '../commons/Loader';
/*
 * This function is used to create the confirmation modal
 * @author Kindajobs <mohitkumar.webdev@gmail.com>
 */

// Initialize Geocoder with your API key
Geocoder.init('AIzaSyDr7xXKTxIAB0t3HQN9WdolJMY0q93x0qE');
// Geocoder.init('AIzaSyB_wP45O2ebtcto3H3vHKigaKtP-5VeCWM')
const ClockInModal = ({
  isVisible,
  confirmationText = '',
  onModalClose,
  onConfirm,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const clockin = useSelector(clockinSelector);
  const handleConfirm = () => {
    onModalClose();
    onConfirm && onConfirm();
  };
  const [office, setOffice] = useState('Office');
  const [type, setType] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(null);
  // console.log(currentLocation, currentAddress);

  useEffect(() => {
    // Request permission to access location
    if (Platform.OS === 'android') {
      requestLocationPermission();
    } else {
      Geolocation.requestAuthorization();
    }
    // fetchCurrentPosition();
  }, []);
  async function fetchCurrentPosition() {
    // Geolocation.getCurrentPosition(
    //   position => {
    //     const {latitude, longitude} = position.coords;
    //     console.log("Current location:", latitude, longitude);
    //     Geocoder.from(latitude, longitude)
    //     .then(json => {
    //       console.log('______', json.results[0].formatted_address);
    //       const addressComponent = json.results[0].formatted_address;
    //       setCurrentAddress(addressComponent);
    //       setLoading(false);
    //     })
    //     .catch(error => {
    //       console.warn(error);
    //       setLoading(false);
    //     });
    //   },
    //   error => {
    //     console.error("Error getting location:", error);
    //   },
    //   {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
    // );


    // Get current location
    setLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log("__________",{latitude, longitude});
        setCurrentLocation({latitude, longitude});

        // Reverse geocode to get address
        Geocoder.from(latitude, longitude)
          .then(json => {
            console.log('______', json.results[0].formatted_address);
            const addressComponent = json.results[0].formatted_address;
            setCurrentAddress(addressComponent);
            setLoading(false);
          })
          .catch(error => {
            console.warn(error);
            setLoading(false);
          });
      },
      error => {
        alert(error.message);
        console.log(error);
        setLoading(false);
      },
      {enableHighAccuracy: true, timeout: 60000, maximumAge: 1000},
    );
  }

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app requires access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
        fetchCurrentPosition();
      } else {
        console.log('Location permission denied');
        // requestLocationPermission()
      }
    } catch (err) {
      console.warn(err);
    }
  };

  function getCurrentDateTime() {
    const currentDate = new Date();

    // Get day, month, and year
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = currentDate.getFullYear();

    // Get hours, minutes, and AM/PM
    let hours = currentDate.getHours();
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const amPM = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12-hour format

    // Construct the formatted date-time string
    const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes} ${amPM}`;

    return formattedDateTime;
  }

  const handleClockin = async () => {
    try {
      const res = await new UserApi().clockIn({
        currentLatitude: currentLocation?.latitude
          ? currentLocation?.latitude
          : null,
        currentLongitude: currentLocation?.longitude
          ? currentLocation?.longitude
          : null,
        working_from: office,
      });
      if (res) {
        Alert.alert(res?.message);
        await dispatch(fetchClockinStatus());
        onModalClose(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleClockout = async () => {
    try {
      const res = await new UserApi().clockOut({
        id: clockin?.attendance?.id,
      });
      if (res) {
        Alert.alert(res?.message);
        await dispatch(fetchClockinStatus());
        onModalClose(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(clockin?.attendance?.id, clockin);
  return (
    <Modal
      isVisible={isVisible}
      swipeDirection="down"
      onSwipeComplete={e => {
        onModalClose(false);
      }}
      onBackdropPress={e => {
        onModalClose(false);
      }}
      style={styles.modalContainer}>
      <View style={styles.modalInnerContainer}>
        <View
          style={{
            backgroundColor: R.colors.WHITE,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderColor: R.colors.LIGHTGRAY,
          }}>
          <Text
            style={{
              color: R.colors.PRIMARI_DARK,
              fontWeight: 'bold',
              padding: 10,
              textAlign: 'center',
              fontSize: R.fontSize.L,
            }}>
            Clock In
          </Text>
          <Icon
            name="close-thick"
            size={25}
            color={R.colors.PRIMARI_DARK}
            style={{padding: 10}}
            onPress={() => {
              onModalClose(false);
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '98%',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon
              name="clock-time-eight"
              size={25}
              color={R.colors.PRIMARI_DARK}
              style={{padding: 10}}
            />
            <Text style={[styles.modalHeaderText, {marginTop: 0}]}>
              {getCurrentDateTime()}
            </Text>
          </View>
          <Text
            style={{
              backgroundColor: R.colors.PRIMARI_DARK,
              color: R.colors.PRIMARY_LIGHT,
              padding: 5,
              borderRadius: 5,
              paddingHorizontal: 5,
              textAlign: 'center',
              marginLeft: 20,
            }}>
            General shift
          </Text>
          {/* <Button
            title="General shift"
            buttonStyle={{
              alignSelf: 'left',
              width: '40%',
              marginTop: 10,
              backgroundColor: R.colors.primary,
            }}
            textStyle={{fontWeight: 'bold'}}
          /> */}
        </View>
        <View style={{flexDirection: 'column', justifyContent: 'space-around'}}>
          <View style={styles.textView}>
            <Text
              style={[
                styles.text,
                {
                  fontSize: 16,
                  color: 'black',
                  paddingTop: 10,
                  paddingLeft: 8,
                  paddingLeft: 20,
                },
              ]}>
              Location
            </Text>
            <View style={[styles.TextInput]}>
              <Picker
                itemStyle={{fontSize: 20}}
                selectedValue={type}
                enabled={true}
                onValueChange={(itemValue, itemIndex) => {
                  setType(itemValue);
                }}>
                <Picker.Item label={currentAddress} value={currentAddress} />
              </Picker>
            </View>
          </View>
          <View style={{}}>
            <Text
              style={[
                styles.text,
                {
                  fontSize: 16,
                  color: 'black',
                  paddingTop: 10,
                  paddingLeft: 20,
                },
              ]}>
              Working From *
            </Text>

            <View style={[styles.TextInput]}>
              <Picker
                itemStyle={{fontSize: 20}}
                selectedValue={type}
                enabled={true}
                value={office}
                onValueChange={(itemValue, itemIndex) => {
                  setOffice(itemValue);
                }}>
                <Picker.Item label={'Office'} value={'Office'} />
                <Picker.Item label={'Home'} value={'Home'} />
                <Picker.Item label={'Other'} value={'Other'} />
              </Picker>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '65%',
            alignSelf: 'flex-end',
            margin: 20,
          }}>
          <Text
            style={{
              backgroundColor: R.colors.DARKGRAY,
              color: R.colors.PRIMARY_LIGHT,
              paddingHorizontal: 20,
              borderRadius: 20,
              paddingHorizontal: 15,
              // width: '45%',
              textAlign: 'center',
              textAlignVertical: 'center',
            }}
            onPress={() => onModalClose(false)}>
            Cancel
          </Text>
          {/* <Button
            title="Cancel"
            buttonStyle={{
              alignSelf: 'left',
              width: '40%',

              marginTop: 10,
              backgroundColor: R.colors.WHITE,
            }}
            textStyle={{fontWeight: 'bold', color: R.colors.PRIMARI_DARK}}
          /> */}
          <Text
            style={{
              // backgroundColor: '#4dc8d8',
              backgroundColor:
                clockin?.attendance?.clock_out_time == null &&
                clockin?.attendance != null
                  ? 'red'
                  : R.colors.primary,
              color: R.colors.PRIMARY_LIGHT,
              paddingHorizontal: 20,
              borderRadius: 20,
              paddingVertical: 10,
              // width: '55%',
              textAlign: 'center',
              textAlignVertical: 'center',
            }}
            onPress={
              clockin?.attendance?.clock_out_time == null &&
              clockin?.attendance != null
                ? handleClockout
                : handleClockin
            }>
            {clockin?.attendance?.clock_out_time == null &&
            clockin?.attendance != null
              ? 'Clock out'
              : 'Clock in'}
          </Text>
          {/* <Button
            title="Clock In"
            buttonStyle={{
              alignSelf: 'left',
              width: '40%',

              marginTop: 10,
              backgroundColor: R.colors.primary,
            }}
            textStyle={{fontWeight: 'bold'}}
          /> */}
        </View>
      </View>
      <Loader loading={loading} message={'Loading Current Location'} />
    </Modal>
  );
};

export default ClockInModal;

const styles = StyleSheet.create({
  modalHeaderText: {
    color: R.colors.PRIMARI_DARK,
    textAlign: 'center',
    fontFamily: R.fonts.Regular,
    fontSize: R.fontSize.M,
    paddingVertical: 10,
    marginBottom: 10,
  },
  modalContainer: {
    justifyContent: 'center',
    margin: 20,
    overflow: 'hidden',
  },
  modalInnerContainer: {
    backgroundColor: 'white',
    minHeight: 260,
    // justifyContent: 'space-between',
    borderRadius: 12,
  },
  modalFooterText: {
    flexDirection: 'row',
  },
  buttonText: {
    width: '50%',
    alignSelf: 'center',
    backgroundColor: R.colors.lightYellow,
  },
  modalHeaderText: {
    fontWeight: 'bold',
    color: R.colors.PRIMARI_DARK,
    marginTop: 10,
    fontSize: 15,
  },
  TextInput: {
    width: '90%',
    borderWidth: 0.5,
    borderRadius: 10,
    backgroundColor: R.colors.PRIMARY_LIGHT,
    textAlign: 'left',
    alignSelf: 'center',
  },
});
