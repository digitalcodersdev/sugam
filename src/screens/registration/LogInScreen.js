/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BTextInput from '../../library/commons/BTextInput';
import Loader from '../../library/commons/Loader';
import AuthApi from '../../datalib/services/authentication.api';
import Button from '../../library/commons/Button';
import R from '../../resources/R';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../../store/contexts/AuthContext';
import ValidationHelper from '../../helpers/ValidationHelper';
import APP_CONSTANTS from '../../constants/appConstants';
import {OtpInput} from 'react-native-otp-entry';
import {TouchableOpacity} from 'react-native-gesture-handler';
import OTPVerify from 'react-native-otp-verify';
import {PermissionsAndroid} from 'react-native';

const LogInScreen = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [err, setError] = useState({});
  const authContext = useContext(AuthContext);
  const [otpEnabled, setOtpEnabled] = useState(false);
  const [otp, setOtp] = useState('');

  useEffect(() => {
    requestSMSPermissions().then(granted => {
      if (granted) {
        OTPVerify.getHash().then(console.log).catch(console.log);
        OTPVerify.getOtp()
          .then(p => OTPVerify.addListener(otpHandler))
          .catch(p => console.log(p));
        return () => OTPVerify.removeListener();
      }
    });
  }, [otpEnabled]);

  const otpHandler = message => {
    try {
      console.log(message);
      const extractedOtp = /(\d{4})/.exec(message)[1]; // Assuming OTP is 4 digits
      setOtp(extractedOtp);
      verifyOtp(extractedOtp);
    } catch (error) {
      console.log(error);
    }
  };

  const verifyOtp = otp => {
    // Add your OTP verification logic here
    Alert.alert(`OTP Verified: ${otp}`);
  };

  const validate = () => {
    var valid = true;
    const err = {};
    if (!ValidationHelper.isPhone(phone)) {
      valid = false;
      err.phone = 'Please enter a valid phone number...';
    }
    setError(err);
    return valid;
  };

  const requestSMSPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        PermissionsAndroid.PERMISSIONS.READ_SMS,
      ]);
      return (
        granted[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.READ_SMS] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleOnSubmit = async () => {
    const valid = await validate();
    if (valid) {
      setOtpEnabled(true);
      // setLoading(true);
      // const urlEncodedData = new URLSearchParams({
      //   phone: phone,
      //   password: password,
      // }).toString();
      // const res = await new AuthApi().login(urlEncodedData);
      // console.log('___res', res);
      // if (res) {
      //   setLoading(false);
        authContext.signIn();
      // } else {
      //   Alert.alert('Invalid username or password');
      //   setLoading(false);
      // }
      // setLoading(false);
    }
  };

  return (
    // <ScreenWrapper header={false}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ImageBackground
        source={require('../../assets/Images/mainbg.png')}
        style={{flex: 1}}
        resizeMode="stretch">
        {/* <ScrollView style={{flex:1}}> */}
        <Image
          source={require('../../assets/Images/APP_LOGO.png')}
          style={{width: '85%', alignSelf: 'center'}}
          resizeMode="center"
        />
        <View style={styles.inputBlock}>
          <View style={styles.inputContainer}>
            {!otpEnabled ? (
              <View>
                <View style={styles.mobileContainer}>
                  <Icon
                    name={'phone'}
                    size={22}
                    color={R.colors.primary}
                    style={{position: 'absolute', right: 15, top: 24}}
                  />
                  <BTextInput
                    autoFocus
                    placeholder="Enter Your Phone Number..."
                    value={phone}
                    onChangeText={text => {
                      setPhone(text);
                    }}
                    placeholderTextColor={R.colors.DARKGRAY}
                    maxLength={10}
                    style={styles.textInput}
                    keyboardType="numeric"
                    onFocus={() => {
                      setError({});
                    }}
                  />
                </View>
                {err.phone && (
                  <Text
                    style={{color: 'red', paddingLeft: 10, fontWeight: '500'}}>
                    {err.phone}
                  </Text>
                )}
              </View>
            ) : (
              <>
                <Text
                  style={{
                    color: R.colors.PRIMARI_DARK,
                    textAlign: 'center',
                    fontSize: R.fontSize.M,
                    alignItems: 'center',
                    textTransform: 'capitalize',
                    width: '100%',
                    fontWeight: '500',
                  }}>
                  A verification code has been sent to your phone
                  <Text
                    style={{
                      color: 'blue',
                      textAlign: 'center',
                      alignItems: 'center',
                      fontSize: R.fontSize.L,
                      borderWidth: 1,
                      lineHeight: 35,
                    }}>
                    {`   +91${phone}`}
                  </Text>
                </Text>

                <OtpInput
                  numberOfDigits={4}
                  focusColor="green"
                  focusStickBlinkingDuration={500}
                  onTextChange={code => setOtp(code)}
                  onFilled={text => console.log(`OTP is ${text}`)}
                  theme={{
                    containerStyle: {
                      width: '80%',
                      alignSelf: 'center',
                      marginVertical: 20,
                    },
                    // inputsContainerStyle: {height:30},
                    pinCodeContainerStyle: {
                      height: 50,
                      width: 50,
                      backgroundColor: R.colors.PRIMARY_LIGHT,
                    },
                    pinCodeTextStyle: styles.pinCodeText,
                  }}
                />
              </>
            )}
            <Button
              title={otpEnabled ? 'VERIFY OTP' : 'CONTINUE'}
              onPress={handleOnSubmit}
              disabled={
                !otpEnabled && phone.length === 10
                  ? false
                  : otpEnabled && otp.length === 4
                  ? false
                  : true
              }
              buttonStyle={{borderRadius: 12}}
              // textColor="#ffb606"
              textStyle={{
                fontWeight: 'bold',
                fontSize: R.fontSize.XL,
                fontFamily: 'sans-serif',
              }}
            />
            {otpEnabled && (
              <TouchableOpacity>
                <Text style={styles.resend}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text
            style={
              styles.appVersion
            }>{`Current App Version ${APP_CONSTANTS.APP_VERSION}`}</Text>
        </View>
      </ImageBackground>

      <Loader loading={isLoading} />
    </KeyboardAvoidingView>
    // </ScreenWrapper>
  );
};
export default LogInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputBlock: {
    width: '90%',
    alignSelf: 'center',
    flex: 1,
  },
  inputContainer: {
    paddingVertical: 20,
    justifyContent: 'space-between',
    flex: 1,
  },
  textInput: {
    fontFamily: R.fonts.Regular,
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: '100%',
    color: R.colors.PRIMARI_DARK,
    fontWeight: 'bold',
  },
  mobileContainer: {
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  appVersion: {
    color: R.colors.PRIMARI_DARK,
    fontSize: R.fontSize.L,
    textAlign: 'center',
    padding: 20,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  pinCodeText: {color: 'black'},
  resend: {
    color: R.colors.primary,
    fontWeight: '900',
    textAlign: 'center',
    fontSize: R.fontSize.XL,
  },
});
