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
import LoaderAnimation from '../../library/commons/LoaderAnimation';
import Toast from 'react-native-simple-toast';
import ValidationHelper from '../../helpers/ValidationHelper';
import {useSelector} from 'react-redux';
import {currentUserSelector} from '../../store/slices/user/user.slice';
import moment from 'moment';

const DATA = {
  Monday: '1',
  Tuesday: '2',
  Wednesday: '3',
  Thursday: '4',
  Friday: '5',
};

const CreateNewCenter = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [centerName, setCenterName] = useState('');
  const [centerNo, setCenterNo] = useState(null);
  const [centerAddress, setCenterAddress] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [meetingDay, setMeetingDay] = useState(null);
  const [contactNo, setContactNo] = useState('');
  const [contactName, setContactName] = useState('');
  const [centerPlace, setCenterPlace] = useState('');
  const [pincode, setPincode] = useState('');
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const contactNameRef = useRef();
  const contactNoRef = useRef();
  const centerPlaceRef = useRef();
  const user = useSelector(currentUserSelector);
  console.log(meetingTime);

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
        setCenterNo(res.data + 1);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
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
          const res = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`,
          );

          //   console.log(res);
          const fetchedAddress = res?.data?.results[0]?.formatted_address;
          setCenterAddress(fetchedAddress);
          setCenterName(
            res?.data?.results[0]?.address_components[2]?.long_name,
          );
          setPincode(res?.data?.results[0]?.address_components[9]?.long_name);
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
    if (!centerPlace?.trim().length) {
      Toast.show('Please Enter Center Place', Toast.SHORT, Toast.TOP);
      valid = false;
      centerPlaceRef.current.focus();
      return valid;
    }
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
          staffid: user?.staffid,
          ceaddress: centerAddress,
          cename: centerName,
          cedate: moment(new Date()).format('YYYY-MM-DD'),
          cetime: meetingTime?.toLocaleTimeString(),
          ceday: meetingDay,
          mobile: contactNo,
          dayno: DATA[meetingDay],
          latitude: lat,
          longitude: long,
          DateNextMeeting: null, //moment(futureDate).format('YYYY-MM-DD')
          Pincode: pincode,
          LeaderName: contactName,
        };
        const res = await new UserApi().createCenter(data);
        if (res && res.success) {
          fetchMaxCenterNo();
          navigation.goBack();
          Toast.show('Center Created Successfully', Toast.TOP, Toast.SHORT);
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
          <View style={[pickerSelectStyles.viewInput]}>
            <Picker
              selectedValue={meetingDay}
              onValueChange={(itemValue, itemIndex) => setMeetingDay(itemValue)}
              mode="dropdown"
              style={[
                styles.picker,
                {color: isDarkMode ? R.colors.PRIMARI_DARK : '#000000'},
            
              ]}
              dropdownIconColor={R.colors.DARKGRAY}
              >
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
            <Pressable onPress={showTimePicker} style={styles.input}>
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
              editable={false}
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
      <LoaderAnimation
        loading={loading}
        message={'Fetching Current Location'}
      />
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



// import {
//     StyleSheet,
//     Text,
//     View,
//     Alert,
//     Pressable,
//     PermissionsAndroid,
//     ScrollView,
//     useColorScheme,
//   } from 'react-native';
//   import React, {useEffect, useRef, useState} from 'react';
//   import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
//   import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
//   import {useNavigation} from '@react-navigation/native';
//   import DateTimePickerModal from 'react-native-modal-datetime-picker';
//   import Geolocation from 'react-native-geolocation-service';
//   import axios from 'axios';
//   import R from '../../resources/R';
//   import {TextInput} from 'react-native-paper';
//   import Button from '../../library/commons/Button';
//   import {Picker} from '@react-native-picker/picker';
//   import UserApi from '../../datalib/services/user.api';
//   import LoaderAnimation from '../../library/commons/LoaderAnimation';
//   import Toast from 'react-native-simple-toast';
//   import ValidationHelper from '../../helpers/ValidationHelper';
//   import {useSelector} from 'react-redux';
//   import {currentUserSelector} from '../../store/slices/user/user.slice';
//   import moment from 'moment';
  
//   const DATA = {
//     Monday: '1',
//     Tuesday: '2',
//     Wednesday: '3',
//     Thursday: '4',
//     Friday: '5',
//   };
  
//   const CreateNewCenter = () => {
//     const navigation = useNavigation();
//     const colorScheme = useColorScheme();
//     const isDarkMode = colorScheme === 'dark';
//     const [centerName, setCenterName] = useState('');
//     const [centerNo, setCenterNo] = useState(null);
//     const [centerAddress, setCenterAddress] = useState('');
//     const [meetingTime, setMeetingTime] = useState('');
//     const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
//     const [meetingDay, setMeetingDay] = useState(null);
//     const [contactNo, setContactNo] = useState('');
//     const [contactName, setContactName] = useState('');
//     const [centerPlace, setCenterPlace] = useState('');
//     const [pincode, setPincode] = useState('');
//     const [focused, setFocused] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [lat, setLat] = useState('');
//     const [long, setLong] = useState('');
//     const contactNameRef = useRef();
//     const contactNoRef = useRef();
//     const centerPlaceRef = useRef();
//     const user = useSelector(currentUserSelector);
//     console.log(meetingTime);
  
//     const showTimePicker = () => {
//       setTimePickerVisibility(true);
//     };
  
//     const hideTimePicker = () => {
//       setTimePickerVisibility(false);
//     };
  
//     const handleTimeConfirm = time => {
//       setMeetingTime(time);
//       hideTimePicker();
//     };
  
//     useEffect(() => {
//       if (user) {
//         requestLocationPermission();
//         fetchMaxCenterNo();
//       }
//     }, [user]);
  
//     const requestLocationPermission = async () => {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Permission',
//             message:
//               'This app needs access to your location ' +
//               'so we can know where you are.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           },
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           fetchGeolocation();
//         } else {
//           Alert.alert(
//             'Permission Denied',
//             'Location permission is required to fetch geolocation.',
//           );
//         }
//       } catch (err) {
//         console.warn(err);
//       }
//     };
  
//     const fetchMaxCenterNo = async () => {
//       try {
//         const res = await new UserApi().getMaxCenterNo({
//           branchId: user?.branchid,
//         });
//         if (res) {
//           setCenterNo(res.data + 1);
//         }
//       } catch (error) {
//         console.log(error);
//         setLoading(false);
//       }
//     };
  
//     const fetchGeolocation = async () => {
//       try {
//         setLoading(true);
//         const API_KEY = 'YOUR_API_KEY_HERE';
//         Geolocation.getCurrentPosition(
//           async position => {
//             const {latitude, longitude} = position.coords;
//             setLat(latitude);
//             setLong(longitude);
//             const res = await axios.get(
//               `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`,
//             );
  
//             //   console.log(res);
//             const fetchedAddress = res?.data?.results[0]?.formatted_address;
//             setCenterAddress(fetchedAddress);
//             setCenterName(
//               res?.data?.results[0]?.address_components[2]?.long_name,
//             );
//             setPincode(res?.data?.results[0]?.address_components[9]?.long_name);
//           },
//           error => {
//             Alert.alert('Error', 'Failed to fetch geolocation');
//             console.log(error);
//             setLoading(false);
//           },
//           {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
//         );
//         setLoading(false);
//       } catch (error) {
//         console.log(error);
//         setLoading(false);
//       }
//     };
  
//     const validate = () => {
//       let valid = true;
//       if (centerNo === null) {
//         Toast.show('Center No is required ', Toast.SHORT, Toast.TOP);
//         valid = false;
//         return valid;
//       }
//       if (!centerName?.trim().length) {
//         Toast.show('Please Enter Center Name ', Toast.SHORT, Toast.TOP);
//         valid = false;
//         return valid;
//       }
//       if (!contactName?.trim().length) {
//         Toast.show('Please Enter Contact Name', Toast.SHORT, Toast.TOP);
//         valid = false;
//         contactNameRef.current.focus();
//         return valid;
//       }
//       if (!ValidationHelper.isPhone(contactNo) || contactNo?.length < 10) {
//         Toast.show('Please Enter Valid Contact No', Toast.SHORT, Toast.TOP);
//         valid = false;
//         contactNoRef.current.focus();
//         return valid;
//       }
//       if (!centerPlace?.trim().length) {
//         Toast.show('Please Enter Center Place', Toast.SHORT, Toast.TOP);
//         valid = false;
//         centerPlaceRef.current.focus();
//         return valid;
//       }
//       if (!meetingDay?.trim().length) {
//         Toast.show('Please Select Meeting Day', Toast.SHORT, Toast.TOP);
//         valid = false;
//         return valid;
//       }
//       if (!meetingTime) {
//         Toast.show('Please Select Meeting Time', Toast.SHORT, Toast.TOP);
//         valid = false;
//         return valid;
//       }
//       if (!centerAddress?.trim()?.length) {
//         Toast.show('Center Address is required', Toast.SHORT, Toast.TOP);
//         valid = false;
//         return valid;
//       }
//       if (pincode?.length != 6) {
//         Toast.show('Please Enter Valid Pincode', Toast.SHORT, Toast.TOP);
//         valid = false;
//         return valid;
//       }
//       return valid;
//     };
  
//     const validateAndSubmit = async () => {
//       try {
//         setLoading(true);
//         if (validate()) {
//           // Get the current date
//           let currentDate = new Date();
//           // Add 28 days to the current date
//           let futureDate = new Date();
//           futureDate.setDate(currentDate.getDate() + 28);
//           const data = {
//             branchid: user?.branchid,
//             centreid: centerNo,
//             staffid: user?.staffid,
//             ceaddress: centerAddress,
//             cename: centerName,
//             cedate: moment(new Date()).format('YYYY-MM-DD'),
//             cetime: meetingTime?.toLocaleTimeString(),
//             ceday: meetingDay,
//             mobile: contactNo,
//             dayno: DATA[meetingDay],
//             latitude: lat,
//             longitude: long,
//             DateNextMeeting: null, //moment(futureDate).format('YYYY-MM-DD')
//             Pincode: pincode,
//             LeaderName: contactName,
//           };
//           const res = await new UserApi().createCenter(data);
//           if (res && res.success) {
//             fetchMaxCenterNo();
//             navigation.goBack();
//             Toast.show('Center Created Successfully', Toast.TOP, Toast.SHORT);
//           }
//         }
//         setLoading(false);
//       } catch (error) {
//         console.log(error);
//         setLoading(false);
//       }
//     };
//     return (
//       <ScreenWrapper header={false}>
//         <ChildScreensHeader
//           screenName={'Create New Center'}
//           style={{borderBottomWidth: 0.5}}
//         />
  
//         <View style={styles.categoryView}>
//           <ScrollView>
//             <View style={{marginBottom: 10}}>
//               <TextInput
//                 value={centerNo?.toString()}
//                 onChangeText={setCenterName}
//                 style={[
//                   styles.input,
//                   {
//                     borderBottomWidth: focused === 'centerNo' ? 1 : 0.5,
//                     borderBottomColor:
//                       focused === 'centerNo' ? 'blue' : 'grey',
//                   },
//                 ]}
//                 editable={false}
//                 activeUnderlineColor="transparent"
//                 placeholderTextColor="grey"
//                 outlineColor="transparent"
//                 label={'Center No'}
//                 theme={{
//                   colors: {
//                     primary: isDarkMode ? 'white' : 'black',
//                     text: isDarkMode ? 'white' : 'black',
//                     placeholder: isDarkMode ? 'lightgrey' : 'grey',
//                     background: isDarkMode ? 'black' : 'white',
//                   },
//                 }}
//               />
//             </View>
//             <View style={{marginBottom: 10}}>
//               <TextInput
//                 value={centerName}
//                 onChangeText={setCenterName}
//                 style={[
//                   styles.input,
//                   {
//                     borderBottomWidth: focused === 'centerName' ? 1 : 0.5,
//                     borderBottomColor:
//                       focused === 'centerName' ? 'blue' : 'grey',
//                   },
//                 ]}
//                 onFocus={() => setFocused('centerName')}
//                 onBlur={() => setFocused(null)}
//                 activeUnderlineColor="transparent"
//                 placeholderTextColor="grey"
//                 outlineColor="transparent"
//                 label={'Center Name'}
//                 theme={{
//                   colors: {
//                     primary: isDarkMode ? 'white' : 'black',
//                     text: isDarkMode ? 'white' : 'black',
//                     placeholder: isDarkMode ? 'lightgrey' : 'grey',
//                     background: isDarkMode ? 'black' : 'white',
//                   },
//                 }}
//               />
//             </View>
//             <View style={{marginBottom: 10}}>
//               <TextInput
//                 value={contactName}
//                 onChangeText={setContactName}
//                 style={[
//                   styles.input,
//                   {
//                     borderBottomWidth: focused === 'contactName' ? 1 : 0.5,
//                     borderBottomColor:
//                       focused === 'contactName' ? 'blue' : 'grey',
//                   },
//                 ]}
//                 onFocus={() => setFocused('contactName')}
//                 onBlur={() => setFocused(null)}
//                 activeUnderlineColor="transparent"
//                 placeholderTextColor="grey"
//                 outlineColor="transparent"
//                 label={'Contact Name'}
//                 ref={contactNameRef}
//                 theme={{
//                   colors: {
//                     primary: isDarkMode ? 'white' : 'black',
//                     text: isDarkMode ? 'white' : 'black',
//                     placeholder: isDarkMode ? 'lightgrey' : 'grey',
//                     background: isDarkMode ? 'black' : 'white',
//                   },
//                 }}
//               />
//             </View>
//             <View style={{marginBottom: 10}}>
//               <TextInput
//                 value={contactNo}
//                 onChangeText={setContactNo}
//                 style={[
//                   styles.input,
//                   {
//                     borderBottomWidth: focused === 'contactNo' ? 1 : 0.5,
//                     borderBottomColor:
//                       focused === 'contactNo' ? 'blue' : 'grey',
//                   },
//                 ]}
//                 onFocus={() => setFocused('contactNo')}
//                 onBlur={() => setFocused(null)}
//                 activeUnderlineColor="transparent"
//                 placeholderTextColor="grey"
//                 outlineColor="transparent"
//                 label={'Contact No'}
//                 ref={contactNoRef}
//                 keyboardType="numeric"
//                 theme={{
//                   colors: {
//                     primary: isDarkMode ? 'white' : 'black',
//                     text: isDarkMode ? 'white' : 'black',
//                     placeholder: isDarkMode ? 'lightgrey' : 'grey',
//                     background: isDarkMode ? 'black' : 'white',
//                   },
//                 }}
//               />
//             </View>
//             <View style={{marginBottom: 10}}>
//               <TextInput
//                 value={centerPlace}
//                 onChangeText={setCenterPlace}
//                 style={[
//                   styles.input,
//                   {
//                     borderBottomWidth: focused === 'centerPlace' ? 1 : 0.5,
//                     borderBottomColor:
//                       focused === 'centerPlace' ? 'blue' : 'grey',
//                   },
//                 ]}
//                 onFocus={() => setFocused('centerPlace')}
//                 onBlur={() => setFocused(null)}
//                 activeUnderlineColor="transparent"
//                 placeholderTextColor="grey"
//                 outlineColor="transparent"
//                 label={'Center Place'}
//                 ref={centerPlaceRef}
//                 theme={{
//                   colors: {
//                     primary: isDarkMode ? 'white' : 'black',
//                     text: isDarkMode ? 'white' : 'black',
//                     placeholder: isDarkMode ? 'lightgrey' : 'grey',
//                     background: isDarkMode ? 'black' : 'white',
//                   },
//                 }}
//               />
//             </View>
//             <View style={{marginBottom: 10}}>
//               <TextInput
//                 value={centerAddress}
//                 onChangeText={setCenterAddress}
//                 style={[
//                   styles.input,
//                   {
//                     borderBottomWidth: focused === 'centerAddress' ? 1 : 0.5,
//                     borderBottomColor:
//                       focused === 'centerAddress' ? 'blue' : 'grey',
//                   },
//                 ]}
//                 onFocus={() => setFocused('centerAddress')}
//                 onBlur={() => setFocused(null)}
//                 activeUnderlineColor="transparent"
//                 placeholderTextColor="grey"
//                 outlineColor="transparent"
//                 label={'Center Address'}
//                 theme={{
//                   colors: {
//                     primary: isDarkMode ? 'white' : 'black',
//                     text: isDarkMode ? 'white' : 'black',
//                     placeholder: isDarkMode ? 'lightgrey' : 'grey',
//                     background: isDarkMode ? 'black' : 'white',
//                   },
//                 }}
//               />
//             </View>
//             <View style={{marginBottom: 10}}>
//               <TextInput
//                 value={pincode}
//                 onChangeText={setPincode}
//                 style={[
//                   styles.input,
//                   {
//                     borderBottomWidth: focused === 'pincode' ? 1 : 0.5,
//                     borderBottomColor: focused === 'pincode' ? 'blue' : 'grey',
//                   },
//                 ]}
//                 onFocus={() => setFocused('pincode')}
//                 onBlur={() => setFocused(null)}
//                 activeUnderlineColor="transparent"
//                 placeholderTextColor="grey"
//                 outlineColor="transparent"
//                 label={'Pincode'}
//                 keyboardType="numeric"
//                 theme={{
//                   colors: {
//                     primary: isDarkMode ? 'white' : 'black',
//                     text: isDarkMode ? 'white' : 'black',
//                     placeholder: isDarkMode ? 'lightgrey' : 'grey',
//                     background: isDarkMode ? 'black' : 'white',
//                   },
//                 }}
//               />
//             </View>
  
//             <View style={{marginBottom: 10}}>
//               <Pressable
//                 onPress={showTimePicker}
//                 style={[
//                   styles.input,
//                   {
//                     borderBottomWidth: focused === 'meetingTime' ? 1 : 0.5,
//                     borderBottomColor:
//                       focused === 'meetingTime' ? 'blue' : 'grey',
//                     padding: 10,
//                     backgroundColor: isDarkMode ? 'black' : 'white',
//                   },
//                 ]}>
//                 <Text
//                   style={{
//                     color: isDarkMode ? 'white' : 'black',
//                     fontSize: 16,
//                   }}>
//                   {meetingTime
//                     ? `Meeting Time: ${moment(meetingTime).format('hh:mm A')}`
//                     : 'Select Meeting Time'}
//                 </Text>
//               </Pressable>
//               <DateTimePickerModal
//                 isVisible={isTimePickerVisible}
//                 mode="time"
//                 onConfirm={handleTimeConfirm}
//                 onCancel={hideTimePicker}
//               />
//             </View>
  
//             <View style={{marginBottom: 10, borderBottomWidth: 0.5}}>
//               <Picker
//                 selectedValue={meetingDay}
//                 onValueChange={(itemValue, itemIndex) => setMeetingDay(itemValue)}
//                 style={{
//                   color: isDarkMode ? 'white' : 'black',
//                 }}>
//                 <Picker.Item label="Select Meeting Day" value="" />
//                 {Object.keys(DATA).map(day => (
//                   <Picker.Item key={day} label={day} value={day} />
//                 ))}
//               </Picker>
//             </View>
//             <View style={{marginBottom: 10}}>
//               <Button
//                 onPress={validateAndSubmit}
//                 title="Submit"
//                 disabled={loading}
//               />
//             </View>
//           </ScrollView>
//         </View>
//         {loading && <LoaderAnimation />}
//       </ScreenWrapper>
//     );
//   };
  
//   export default CreateNewCenter;
  
//   const styles = StyleSheet.create({
//     input: {
//       fontSize: 16,
//       fontFamily: R.fonts.Regular,
//       backgroundColor: 'transparent',
//     },
//     categoryView: {
//       padding: 20,
//     },
//   });
  