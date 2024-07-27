import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Image,
  StatusBar,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';
import {launchImageLibrary} from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useSelector} from 'react-redux';
import {currentUserSelector} from '../../store/slices/user/user.slice';
import moment from 'moment';

const AccountScreen = () => {
  const user = useSelector(currentUserSelector);
  const [receiveNotifications, setReceiveNotifications] = useState(
    user?.email_notifications == 1 ? true : false,
  );
  const [enableRTL, setEnableRTL] = useState(user?.rtl == 1 ? true : false);
  const [enableGoogleCalendar, setEnableGoogleCalendar] = useState(
    user?.google_calendar_status == 1 ? true : false,
  );
  const [country, setCountry] = useState('');
  const [mobileNumber, setMobileNumber] = useState(
    user?.mobile ? user?.mobile : '',
  );
  const [language, setLanguage] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(
    user?.employee_detail?.date_of_birth
      ? moment(user?.employee_detail?.date_of_birth).format('DD-MM-YYYY')
      : '',
  );
  const [slackMemberId, setSlackMemberId] = useState(
    user?.employee_detail?.slack_username
      ? user?.employee_detail?.slack_username
      : '',
  );
  const [maritalStatus, setMaritalStatus] = useState(
    user?.employee_detail?.marital_status
      ? user?.employee_detail?.marital_status
      : '',
  );
  const [address, setAddress] = useState(
    user?.employee_detail?.address ? user?.employee_detail?.address : '',
  );
  const [about, setAbout] = useState(
    user?.employee_detail?.about_me ? user?.employee_detail?.about_me : '',
  ); //
  const [profilePicture, setProfilePicture] = useState(
    user?.image_url ? user?.image_url : '',
  );
  const [name, setName] = useState(user?.name ? user.name : '');
  const [email, setEmail] = useState(user?.email ? user?.email : '');
  const [password, setPassword] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setDateOfBirth(date.toISOString().split('T')[0]);
    hideDatePicker();
  };
  const handleSave = () => {
    // Implement save functionality here
  };

  const countries = [
    {label: 'United States', value: 'USA'},
    {label: 'United Kingdom', value: 'UK'},
    // Add more countries as needed
  ];

  const languages = [
    {label: 'English', value: 'en'},
    {label: 'French', value: 'fr'},
    // Add more languages as needed
  ];

  const genders = [
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
    // Add more genders as needed
  ];

  const maritalStatuses = [
    {label: 'Single', value: 'single'},
    {label: 'Married', value: 'married'},
    // Add more marital statuses as needed
  ];

  const selectProfilePicture = () => {
    const options = {
      title: 'Select Profile Picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setProfilePicture(response?.assets[0]?.uri);
      }
    });
  };

  return (
    <>
      <ChildScreensHeader
        screenName={'Account'}
        style={{backgroundColor: R.colors.PRIMARY_LIGHT}}
      />
      <ImageBackground
        source={require('../../assets/Images/mainbg.png')}
        style={{flex: 1}}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <StatusBar
            backgroundColor={R.colors.primary}
            barStyle="light-content"
          />
          <View style={{flex: 1, padding: 20}}>
            <TouchableOpacity
              style={styles.profilePictureContainer}
              // onPress={selectProfilePicture}
              >
              {profilePicture ? (
                <Image
                  source={{uri: profilePicture}}
                  style={styles.profilePicture}
                />
              ) : (
                <Image
                  source={require('../../assets/Images/man.png')}
                  style={styles.profilePicture}
                />
              )}
              <Text style={styles.changePictureText}>Change Picture</Text>
            </TouchableOpacity>
            <Text style={styles.label}>Your Name *</Text>
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              editable={false}
            />
            <Text style={[styles.label, {marginTop: 10}]}>Your Email *</Text>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              editable={false}
            />
            {/* <Text style={[styles.label, {marginTop: 10}]}>Your Password </Text>
            <TextInput
              placeholder="Must have at least 8 characters long"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            /> */}
            <Text style={{color: R.colors.LIGHTGRAY}}>
              Leave blank to keep the current password.
            </Text>
            {/* <View style={styles.tgglView}>
              <Text style={styles.label}>Receive email notifications?</Text>
              <Switch
                value={receiveNotifications}
                onValueChange={value => setReceiveNotifications(value)}
              />
            </View>
            <View style={styles.tgglView}>
              <Text style={styles.label}>Enable RTL Theme (Right to Left)</Text>
              <Switch
                value={enableRTL}
                onValueChange={value => setEnableRTL(value)}
              />
            </View>
            <View style={styles.tgglView}>
              <Text style={styles.label}>Enable Google Calendar</Text>
              <Switch
                value={enableGoogleCalendar}
                onValueChange={value => setEnableGoogleCalendar(value)}
              />
            </View> */}
            <Text style={[styles.label, {marginTop: 10}]}>Date of Birth </Text>
            <TouchableOpacity
              style={[styles.input, {padding: 10}]}
              onPress={showDatePicker}>
              <Text>{dateOfBirth ? dateOfBirth : 'Select Date of Birth'}</Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
            <Text style={[styles.label, {marginTop: 10}]}>Country </Text>
            <TouchableOpacity style={[styles.input, {padding: 0}]}>
              <RNPickerSelect
                placeholder={{
                  label: 'Select Your Country...',
                  value: null,
                }}
                onValueChange={value => setCountry(value)}
                items={countries}
                style={styles.input}
              />
            </TouchableOpacity>
            <Text style={[styles.label, {marginTop: 10}]}>Mobile </Text>
            <View style={{flexDirection: 'row'}}>
              <TextInput
                placeholder="Mobile Number"
                keyboardType="phone-pad"
                value={mobileNumber}
                onChangeText={text => setMobileNumber(text)}
                style={[styles.input, {flex: 1}]}
                editable={false}
              />
            </View>
            <Text style={[styles.label, {marginTop: 10}]}>
              Change Language{' '}
            </Text>
            <TouchableOpacity style={[styles.input, {padding: 0}]}>
              <RNPickerSelect
                placeholder={{
                  label: 'Select a language...',
                  value: null,
                }}
                onValueChange={value => setLanguage(value)}
                items={languages}
                style={{inputAndroid: {flex: 1}}}
              />
            </TouchableOpacity>
            <Text style={[styles.label, {marginTop: 10}]}>
              Slack Member ID{' '}
            </Text>
            <TextInput
              placeholder="Slack Member ID"
              value={slackMemberId}
              onChangeText={setSlackMemberId}
              style={styles.input}
              editable={false}
            />
            <Text style={[styles.label, {marginTop: 10}]}>Marital Status </Text>
            <TouchableOpacity style={[styles.input, {padding: 0}]}>
              <RNPickerSelect
                placeholder={{
                  label: 'Select Marital Status...',
                  value: null,
                }}
                onValueChange={value => setMaritalStatus(value)}
                items={maritalStatuses}
                style={styles.input}
                value={maritalStatus}

              />
            </TouchableOpacity>
            <Text style={[styles.label, {marginTop: 10}]}>Your Address </Text>
            <TextInput
              placeholder="Your Address"
              value={address}
              onChangeText={setAddress}
              style={styles.input}
              editable={false}
            />
            <Text style={[styles.label, {marginTop: 10}]}>About </Text>
            <TextInput
              placeholder="About"
              value={about}
              onChangeText={setAbout}
              style={styles.input}
              multiline={true}
              numberOfLines={4}
              editable={false}
            />
            {/* Add more fields as needed */}
            {/* <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </ImageBackground>
    </>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  profilePictureContainer: {
    alignItems: 'center',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changePictureText: {
    marginTop: 5,
    color: 'blue',
    fontSize: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: R.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  tgglView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    justifyContent: 'space-between',
  },
  label: {
    color: R.colors.PRIMARI_DARK,
    fontWeight: 'bold',
  },
});
