import {
  StyleSheet,
  Text,
  View,
  Alert,
  Pressable,
  PermissionsAndroid,
  ScrollView,
  useColorScheme,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import {useNavigation} from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import R from '../../resources/R';
import {TextInput} from 'react-native-paper';
import Button from '../../library/commons/Button';
import {Picker} from '@react-native-picker/picker';
import UserApi from '../../datalib/services/user.api';
import Toast from 'react-native-simple-toast';
import ValidationHelper from '../../helpers/ValidationHelper';
import {useSelector} from 'react-redux';
import {currentUserSelector} from '../../store/slices/user/user.slice';
import moment from 'moment';
import Loader from '../../library/commons/Loader';
import {Calendar,} from 'react-native-calendars';

const DATA = {
  Monday: '1',
  Tuesday: '2',
  Wednesday: '3',
  Thursday: '4',
  Friday: '5',
  Saturday: '6',
};
const DATA_ = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

const CreateNewCenter = ({}) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [centerName, setCenterName] = useState('');
  const [centerNo, setCenterNo] = useState(null);
  const [centerAddress, setCenterAddress] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [meetingDate, setMeetingDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [meetingDay, setMeetingDay] = useState(null);
  const [contactNo, setContactNo] = useState('');
  const [contactName, setContactName] = useState('');
  const [centerPlace, setCenterPlace] = useState('');
  const [pincode, setPincode] = useState('');
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const [centerNameChecked, setCenterNameChecked] = useState(false);
  const contactNameRef = useRef();
  const contactNoRef = useRef();
  const centerPlaceRef = useRef();
  const [selectedDays, setSelectedDays] = useState({});
  const user = useSelector(currentUserSelector);

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = time => {
    setMeetingTime(time);
    hideTimePicker();
  };

  useEffect(() => {
    if (centerName?.length >= 2 && user?.branchid && !centerNameChecked) {
      setCenterNameChecked(true);
      checkCenterName();
    }
  }, [centerName, user]);
  const checkCenterName = async () => {
    try {
      setLoading(true);
      const payload = {
        centerData: {
          branchid: user?.branchid,
          cename: centerName,
        },
      };
      const res = await new UserApi().checkCenterName(payload);
      console.log(res, 'res');
      if (res && res?.length >= 1) {
        if (res?.length == 1) {
          setCenterName(centerName + '-' + 1);
          setCenterNameChecked(true);
        } else {
          const name = res[0]?.cename?.split('-');
          const count = name[name?.length - 1];

          const finalCount = parseInt(count) + 1;
          setCenterName(res[0]?.cename?.replace(`-${count}`, '-' + finalCount));
          setCenterNameChecked(true);
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (meetingDay !== null) {
      async function getDayssForNext28Days() {
        const today = new Date();
        const calculatedDays = {};
        const daysToCheck = 29; // Total days to check

        for (let i = 1; i < daysToCheck; i++) {
          // debugger;
          const currentDate = new Date();
          currentDate.setDate(today.getDate() + i);
          // console.log(
          //   'currentDate.getDay() === DATA[meetingDay]',
          //   currentDate.getDay(),
          //   DATA[meetingDay],
          // );
          if (currentDate.getDay() == DATA[meetingDay]) {
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const day = String(currentDate.getDate()).padStart(2, '0');

            const formattedDate = `${year}-${month}-${day}`;
            calculatedDays[formattedDate] = {
              selected: true,
              marked: true,
              selectedColor: R.colors.BLUE,
            };
          }
        }
        // console.log(calculatedDays, 'calculatedDays');
        return calculatedDays;
      }

      // Await the result of the asynchronous function
      async function fetchDates() {
        const dates = await getDayssForNext28Days(); // Await the result here
        setSelectedDays(dates);
      }

      fetchDates(); // Call the async function inside useEffect
    }
  }, [meetingDay]);

  // const handleDateChange = date => {
  //   if (
  //     meetingDate &&
  //     moment(date).format('MM-DD-YYYY') !=
  //       moment(new Date()).format('MM-DD-YYYY')
  //   ) {
  //     const selectedDay =
  //       DATA_[new Date(moment(date).format('MM-DD-YYYY')).getDay()]; // Get day name based on numeric value
  //     if (meetingDay == null) {
  //       setMeetingDay(selectedDay); // Set the day name
  //     } else {
  //       console.log('meetingDay != selectedDay', meetingDay, selectedDay);
  //       if (meetingDay != selectedDay) {
  //         Alert.alert(
  //           `${moment(date).format('MM-DD-YYYY')} is not ${meetingDay}`,
  //         );
  //         setMeetingDate(new Date());
  //       }
  //     }
  //   }
  // };

  useEffect(() => {
    if (user) {
      requestLocationPermission();
      fetchMaxCenterNo();
    }
  }, [user]);

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
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchMaxCenterNo = async () => {
    try {
      const res = await new UserApi().getMaxCenterNo({
        branchId: user?.branchid,
      });
      if (res) {
        setCenterNo(parseInt(res.data) + 1);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // function extractStateAndPincode(address) {
  //   // Regular expression to match the state and pincode pattern
  //   const stateRegex = /,\s*([a-zA-Z\s]+)\s*\d{6},/; // matches the state before the pincode

  //   const stateMatch = address.match(stateRegex);

  //   const state = stateMatch ? stateMatch[1].trim() : null;

  //   return state;
  // }
  const today = new Date();
  const tomorrow = new Date(today);
  const afterOneMonth = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  afterOneMonth.setDate(today.getDate() + 28);

  const fetchGeolocation = async () => {
    try {
      setLoading(true);
      const API_KEY = 'AIzaSyBsc_32ip44ZxiwytqSxKdczopDmUAFpow';
      Geolocation.getCurrentPosition(
        async position => {
          const {latitude, longitude} = position.coords;
          setLat(latitude);
          setLong(longitude);
          const res = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`,
          );
          //            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${25.3618028},${83.0580068}&key=${API_KEY}`,
          const fetchedAddress = res?.data?.results[0]?.formatted_address;
          const shortAddressRegex = /,\s*([^,]+),/;
          const shortAddressMatch = fetchedAddress.match(shortAddressRegex);
          const shortAddress = shortAddressMatch
            ? shortAddressMatch[1].trim()
            : 'Unknown Locality';
          let add = '';
          for (
            let i = 0;
            i < res?.data?.results[0]?.address_components?.length;
            i++
          ) {
            const types = res?.data?.results[0]?.address_components[i];
            if (
              types?.types?.includes('sublocality') &&
              types?.types?.includes('sublocality_level_3')
            ) {
              add = types?.long_name;
            }
            if (
              types?.types?.includes('sublocality') &&
              types?.types?.includes('sublocality_level_1')
            ) {
              add = add + ' ' + types?.long_name;
            }
          }
          // console.log('add', res);
          const pincode = fetchedAddress.match(/\b\d{6}\b/);
          setCenterAddress(fetchedAddress);
          // console.log('pincode', pincode);
          setCenterName(add ? add?.trim() : shortAddress);
          // setState(extractStateAndPincode(fetchedAddress));
          setPincode(pincode[0]);
        },
        error => {
          Alert.alert('Error', 'Failed to fetch geolocation');
          console.log(error);
          setLoading(false);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const validate = () => {
    let valid = true;
    if (
      moment(meetingDate).format('MM-DD-YYYY') ==
      moment(new Date()).format('MM-DD-YYYY')
    ) {
      Toast.show('Please Select Meeting Date ', Toast.SHORT, Toast.TOP);
      valid = false;
      return valid;
    }
    if (centerNo === null) {
      Toast.show('Center No is required ', Toast.SHORT, Toast.TOP);
      valid = false;
      return valid;
    }

    if (!centerName?.trim().length) {
      Toast.show('Please Enter Center Name ', Toast.SHORT, Toast.TOP);
      valid = false;
      return valid;
    }
    if (!centerPlace?.trim().length) {
      Toast.show('Please Enter Center Place', Toast.SHORT, Toast.TOP);
      valid = false;
      centerPlaceRef.current.focus();
      return valid;
    }
    if (!contactName?.trim().length) {
      Toast.show('Please Enter Contact Name', Toast.SHORT, Toast.TOP);
      valid = false;
      contactNameRef.current.focus();
      return valid;
    }
    if (!ValidationHelper.isPhone(contactNo) || contactNo?.length < 10) {
      Toast.show('Please Enter Valid Contact No', Toast.SHORT, Toast.TOP);
      valid = false;
      contactNoRef.current.focus();
      return valid;
    }

    // console.log(meetingDay);
    if (!meetingDay?.trim().length) {
      Toast.show('Please Select Meeting Day', Toast.SHORT, Toast.TOP);
      valid = false;
      return valid;
    }
    if (!meetingTime) {
      Toast.show('Please Select Meeting Time', Toast.SHORT, Toast.TOP);
      valid = false;
      return valid;
    }
    if (!centerAddress?.trim()?.length) {
      Toast.show('Center Address is required', Toast.SHORT, Toast.TOP);
      valid = false;
      return valid;
    }
    if (pincode?.length != 6) {
      Toast.show('Please Enter Valid Pincode', Toast.SHORT, Toast.TOP);
      valid = false;
      return valid;
    }
    return valid;
  };

  const handleDaySelect = itemValue => {
    if (DATA_[new Date(meetingDate).getDay()] == itemValue) {
      setMeetingDay(itemValue);
    } else {
      Alert.alert(
        `${moment(meetingDate).format('DD-MMM-YYYY')} is not ${itemValue}`,
      );
    }
  };

  const validateAndSubmit = async () => {
    try {
      setLoading(true);
      if (validate()) {
        // Get the current date
        let currentDate = new Date();
        // Add 28 days to the current date
        let futureDate = new Date();
        futureDate.setDate(currentDate.getDate() + 28);
        const data = {
          branchid: user?.branchid,
          centreid: centerNo,
          cename: centerName,
          staffid: user?.staffid,
          ceaddress: centerAddress,
          cedate: meetingDate, // moment(meetingDate).format('DD MMM YYYY'),
          cetime: meetingTime?.toLocaleTimeString(),
          ceday: meetingDay,
          mobile: contactNo,
          dayno: DATA[meetingDay],
          latitude: lat,
          longitude: long,
          DateNextMeeting: null, //moment(futureDate).format('YYYY-MM-DD')
          Pincode: pincode,
          LeaderName: contactName,
          centerPlace: centerPlace,
        };
        const res = await new UserApi().createCenter(data);
        console.log(res);
        if (res && res.success) {
          fetchMaxCenterNo();
          navigation.goBack();
          Toast.show('Center Created Successfully', Toast.TOP, Toast.SHORT);
        } else {
          Alert.alert(`Time slot ${res?.data?.cetime} already assigned to Center No ${res?.data?.centreid}. 
          Please Change Meeting Time`);
          // fetchMaxCenterNo();
          // Toast.show('Center Created Successfully', Toast.TOP, Toast.SHORT);
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader
        screenName={'Create New Center'}
        style={{borderBottomWidth: 0.5}}
      />

      <View style={styles.categoryView}>
        <ScrollView>
          <View style={{marginBottom: 10}}>
            <TextInput
              value={centerNo?.toString()}
              onChangeText={setCenterName}
              style={[
                styles.input,
                {
                  borderBottomWidth: focused === 'centerNo' ? 1.5 : 1,
                },
              ]}
              activeUnderlineColor={
                focused === 'centerNo'
                  ? R.colors.primary
                  : R.colors.PRIMARI_DARK
              }
              label={'Center No*'}
              onFocus={() => setFocused('centerNo')}
              onBlur={() => setFocused(null)}
              mode="flat"
              editable={false}
            />
          </View>
          <View style={{marginBottom: 10}}>
            <TextInput
              value={centerName}
              onChangeText={setCenterName}
              style={[
                styles.input,
                {
                  borderBottomWidth: focused === 'centerName' ? 1.5 : 1,
                },
              ]}
              activeUnderlineColor={
                focused === 'centerName'
                  ? R.colors.primary
                  : R.colors.PRIMARI_DARK
              }
              label={'Center Name*'}
              onFocus={() => setFocused('centerName')}
              onBlur={() => setFocused(null)}
              mode="flat"
              editable={false}
            />
          </View>
          <View style={{marginBottom: 10}}>
            <TextInput
              label="Center Place*"
              value={centerPlace}
              onChangeText={setCenterPlace}
              mode="flat"
              ref={centerPlaceRef}
              style={[
                styles.input,
                {
                  borderBottomWidth: focused === 'centerPlace' ? 1.5 : 1,
                },
              ]}
              activeUnderlineColor={
                focused === 'centerPlace'
                  ? R.colors.primary
                  : R.colors.PRIMARI_DARK
              }
              onFocus={() => setFocused('centerPlace')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={{marginBottom: 10}}>
            <TextInput
              label="Contact Name*"
              value={contactName}
              onChangeText={setContactName}
              ref={contactNameRef}
              mode="flat"
              style={[
                styles.input,
                {
                  borderBottomWidth: focused === 'contactName' ? 1.5 : 1,
                },
              ]}
              activeUnderlineColor={
                focused === 'contactName'
                  ? R.colors.primary
                  : R.colors.PRIMARI_DARK
              }
              onFocus={() => setFocused('contactName')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={{marginBottom: 10}}>
            <TextInput
              value={contactNo}
              onChangeText={setContactNo}
              label="Contact No*"
              mode="flat"
              ref={contactNoRef}
              style={[
                styles.input,
                {
                  borderBottomWidth: focused === 'contactNo' ? 1.5 : 1,
                },
              ]}
              activeUnderlineColor={
                focused === 'contactNo'
                  ? R.colors.primary
                  : R.colors.PRIMARI_DARK
              }
              onFocus={() => setFocused('contactNo')}
              onBlur={() => setFocused(null)}
              maxLength={10}
              keyboardType="phone-pad"
            />
          </View>

          <View style={[pickerSelectStyles.viewInput]}>
            <Picker
              selectedValue={meetingDay}
              onValueChange={(itemValue, itemIndex) => {
                if (
                  moment(new Date()).format('DD/MM/YYYY') ==
                  moment(meetingDate).format('DD/MM/YYYY')
                ) {
                  setMeetingDay(itemValue);
                } else {
                  handleDaySelect(itemValue);
                  // Alert.alert('Please select Meeting Day First');
                }
              }}
              mode="dropdown"
              style={[
                styles.picker,
                {color: isDarkMode ? R.colors.PRIMARI_DARK : '#000000'},
              ]}
              dropdownIconColor={R.colors.DARKGRAY}>
              {meetingDay === null && (
                <Picker.Item label="Meeting Day" value={null} enabled={false} />
              )}
              <Picker.Item label="Monday" value="Monday" />
              <Picker.Item label="Tuesday" value="Tuesday" />
              <Picker.Item label="Wednesday" value="Wednesday" />
              <Picker.Item label="Thursday" value="Thursday" />
              <Picker.Item label="Friday" value="Friday" />
              <Picker.Item label="Saturday" value="Saturday" />
            </Picker>
          </View>
          <View style={{marginBottom: 10}}>
            <Pressable onPress={() => setOpen(!open)} style={styles.input}>
              <Text
                style={[
                  //   styles.input,
                  {
                    height: 60,
                    paddingBottom: 10,
                    fontSize: 16,
                    color: R.colors.PRIMARI_DARK,
                    textAlignVertical: 'center',
                    // borderWidth:1
                  },
                ]}>
                {'    Meeting Date* :      '}
                {moment(meetingDate).format('DD MMM YYYY') ==
                moment(new Date()).format('DD MMM YYYY')
                  ? '-- Select Meeting Date --'
                  : moment(meetingDate).format('DD-MMM-YYYY')}
              </Text>
              {open && (
                <Calendar
                  style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    height: 350,
                  }}
                  onDayPress={day => {
                    if (moment(new Date(day?.dateString)).day() === 0) {
                      Alert.alert('It is holiday on Sunday');
                      return;
                    }
                    if (
                      moment(new Date(day?.dateString)).format('MM-DD-YYYY') !==
                      moment(new Date()).format('MM-DD-YYYY')
                    ) {
                      const selectedDay =
                        DATA_[moment(new Date(day?.dateString)).day()]; // Get day name directly using moment
                      if (meetingDay == null) {
                        setMeetingDay(selectedDay); // Set the day name
                        setOpen(false);
                      } else {
                        if (meetingDay != selectedDay) {
                          Alert.alert(
                            `${moment(new Date(day?.dateString)).format(
                              'MM-DD-YYYY',
                            )} is not ${meetingDay}. It is ${selectedDay} `,
                          );
                          setMeetingDate(new Date());
                        } else {
                          setMeetingDate(new Date(day?.dateString));
                          setOpen(false);
                        }
                      }
                    }
                  }}
                  minDate={moment(tomorrow).format('YYYY-MM-DD')}
                  maxDate={moment(afterOneMonth).format('YYYY-MM-DD')}
                  markedDates={selectedDays}
                />
              )}
            </Pressable>
          </View>

          <View style={{marginBottom: 10}}>
            <Pressable onPress={showTimePicker} style={styles.input}>
              <Text
                style={[
                  {
                    height: 60,
                    paddingBottom: 10,
                    fontSize: 16,
                    color: R.colors.PRIMARI_DARK,
                    textAlignVertical: 'center',
                  },
                ]}>
                {'    Meeting Time* :  '}
                {meetingTime ? meetingTime?.toLocaleTimeString() : ''}
              </Text>
            </Pressable>
          </View>
          <View style={{marginBottom: 10}}>
            <DateTimePickerModal
              isVisible={isTimePickerVisible}
              mode="time"
              onConfirm={handleTimeConfirm}
              onCancel={hideTimePicker}
              display="inline"
              customStyles={{
                datePicker: {
                  backgroundColor: '#ccc', // Set your desired background color
                },
                dateInput: {
                  borderWidth: 0,
                  alignItems: 'flex-start',
                  paddingLeft: 10,
                  backgroundColor: R.colors.primary,
                  color: '#000000',
                },
                placeholderText: {
                  color: '#9B9B9B',
                },
                dateText: {
                  color: '#000000',
                },
              }}
            />
          </View>
          <View style={{marginBottom: 10}}>
            <TextInput
              value={centerAddress}
              onChangeText={setCenterAddress}
              mode="flat"
              label="Center Address*"
              style={[
                styles.input,
                {
                  borderBottomWidth: focused === 'centerAddress' ? 1.5 : 1,
                },
              ]}
              multiline
              activeUnderlineColor={
                focused === 'centerAddress'
                  ? R.colors.primary
                  : R.colors.PRIMARI_DARK
              }
              onFocus={() => setFocused('centerAddress')}
              onBlur={() => setFocused(null)}
              editable={false}
            />
          </View>
          <View style={{marginBottom: 10}}>
            <TextInput
              label="Pincode*"
              value={pincode}
              onChangeText={setPincode}
              keyboardType="numeric"
              mode="flat"
              style={[
                styles.input,
                {
                  borderBottomWidth: focused === 'pincode' ? 1.5 : 1,
                },
              ]}
              activeUnderlineColor={
                focused === 'pincode' ? R.colors.primary : R.colors.PRIMARI_DARK
              }
              onFocus={() => setFocused('pincode')}
              onBlur={() => setFocused(null)}
              // editable={false}
            />
          </View>
        </ScrollView>
        <Button
          title="Submit"
          onPress={validateAndSubmit}
          buttonStyle={{borderRadius: 8, marginBottom: 10}}
          textStyle={{fontWeight: 'bold'}}
        />
      </View>
      <Loader loading={loading} message={'please wait'} />
    </ScreenWrapper>
  );
};

export default CreateNewCenter;

const styles = StyleSheet.create({
  categoryView: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  input: {
    borderBottomWidth: 1,
    color: R.colors.PRIMARI_DARK,
    textAlignVertical: 'bottom',
    fontSize: 16,
    fontWeight: '500',
    backgroundColor: R.colors.WHITE,
  },
  picker: {
    width: '100%',
    color: R.colors.PRIMARI_DARK,
    marginRight: 10,
    alignSelf: 'left',
  },
  pickerStyle: {
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
  confirmTextStyle: {
    color: '#000',
    fontSize: 16,
  },
  cancelTextStyle: {
    color: '#ff0000',
    fontSize: 16,
  },
  titleTextStyle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeText: {
    marginTop: 20,
    fontSize: 18,
    color: '#000',
  },
});

const pickerSelectStyles = StyleSheet.create({
  viewInput: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'flex-end',
    marginVertical: 5,
    borderBottomWidth: 1.5,
  },
});
