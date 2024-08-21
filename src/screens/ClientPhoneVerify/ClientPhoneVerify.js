/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useContext, useRef} from 'react';
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
import AuthApi from '../../datalib/services/authentication.api';
import Button from '../../library/commons/Button';
import R from '../../resources/R';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ValidationHelper from '../../helpers/ValidationHelper';
import APP_CONSTANTS from '../../constants/appConstants';
import {OtpInput} from 'react-native-otp-entry';
import {TouchableOpacity} from 'react-native-gesture-handler';
import OTPVerify from 'react-native-otp-verify';
import {PermissionsAndroid} from 'react-native';
import LoaderAnimation from '../../library/commons/LoaderAnimation';
import Toast from 'react-native-simple-toast';
import UserApi from '../../datalib/services/user.api';
import {UseDispatch, useDispatch} from 'react-redux';
import {getUserDetails} from '../../store/actions/userActions';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';

const ClientPhoneVerify = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [phone, setPhone] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [err, setError] = useState({});
  const [otpEnabled, setOtpEnabled] = useState(false);
  const [otp, setOtp] = useState('');
  const [transactionId, setTrasactionId] = useState(null);
  const intervalRef = useRef(null);
  const [time, setTime] = useState(30);
  const {center} = route?.params;
  console.log(center);
  useEffect(() => {
    if (otpEnabled) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [otpEnabled]);

  // useEffect(() => {
  //   requestSMSPermissions().then(granted => {
  //     if (granted) {
  //       OTPVerify.getHash().then(console.log).catch(console.log);
  //       OTPVerify.getOtp()
  //         .then(p => OTPVerify.addListener(otpHandler))
  //         .catch(p => console.log(p));
  //       return () => OTPVerify.removeListener();
  //     }
  //   });
  // }, [otpEnabled]);

  // const otpHandler = message => {
  //   try {
  //     const extractedOtp = /(\d{4})/.exec(message)[1]; // Assuming OTP is 4 digits
  //     setOtp(extractedOtp);
  //     verifyOtp(extractedOtp);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const verifyOtp = otp => {
  //   Alert.alert(`OTP Verified: ${otp}`);
  // };

  // const requestSMSPermissions = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.requestMultiple([
  //       PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
  //       PermissionsAndroid.PERMISSIONS.READ_SMS,
  //     ]);
  //     return (
  //       granted[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] ===
  //         PermissionsAndroid.RESULTS.GRANTED &&
  //       granted[PermissionsAndroid.PERMISSIONS.READ_SMS] ===
  //         PermissionsAndroid.RESULTS.GRANTED
  //     );
  //   } catch (err) {
  //     console.warn(err);
  //     return false;
  //   }
  // };

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

  const handleOnSubmit = async () => {
    const valid = await validate();
    if (valid) {
      setLoading(true);
      const res = await new UserApi().sendClientOtp({phone});
      console.log(res);
      if (
        res?.success &&
        !res?.message?.includes('phone number already exists')
      ) {
        Toast.show('OTP sent successfully', Toast.LONG, Toast.TOP);
        setOtpEnabled(true);
        setTrasactionId(res?.data?.transactionId);
        setTime(30);
      } else {
        Toast.show(res.message, Toast.LONG, Toast.TOP);
      }
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      if (otp?.length === 4) {
        setLoading(true);
        const data = {
          otp: otp,
          transactionId: transactionId,
          phone: phone,
        };
        const res = await new AuthApi().verifyMobileOtp(data);
        if (res) {
          const userData = await dispatch(getUserDetails());
          if (userData?.type?.includes('fulfilled')) {
            Toast.show('OTP verified...', Toast.LONG, Toast.TOP);
            navigation.navigate(ScreensNameEnum.VERIFY_AADHAR_SCREEN, {
              center: {...center, clientPhoneNo: phone},
            });
          }
        } else {
          Toast.show('Invalid otp', Toast.LONG, Toast.TOP);
        }
        setLoading(false);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={ScreensNameEnum.CLIENT_PHONE_VERIFY} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ImageBackground
          source={require('../../assets/Images/mainbg.png')}
          style={{flex: 1}}
          resizeMode="stretch">
          {/* <ScrollView style={{flex:1}}> */}
          <Image
            source={require('../../assets/Images/profile.png')}
            style={{
              width: 200,
              alignSelf: 'center',
              borderRadius: 16000,
            //   borderWidth: 1,
              borderColor:R.colors.PRIMARI_DARK,
              height:200,
              marginTop:10
            }}
            resizeMode="cover"
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
                      placeholder="Enter Client's Phone Number..."
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
                      style={{
                        color: 'red',
                        paddingLeft: 10,
                        fontWeight: '500',
                      }}>
                      {err.phone}
                    </Text>
                  )}
                </View>
              ) : (
                <>
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
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
                      A verification code has been sent to
                    </Text>
                    <Text
                      style={{
                        color: 'blue',
                        textAlign: 'center',
                        alignItems: 'center',
                        fontSize: R.fontSize.L,
                        lineHeight: 35,
                      }}>
                      {`+91${phone}`}
                    </Text>
                  </View>

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
              <View style={{height: '30%', justifyContent: 'space-around'}}>
                {otpEnabled && time != 0 ? (
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: '500',
                      color: R.colors.PRIMARI_DARK,
                    }}>
                    Resend OTP in {time} Seconds
                  </Text>
                ) : otpEnabled ? (
                  <TouchableOpacity onPress={handleOnSubmit}>
                    <Text style={styles.resend}>Resend OTP</Text>
                  </TouchableOpacity>
                ) : null}

                <Button
                  title={otpEnabled ? 'VERIFY OTP' : 'CONTINUE'}
                  onPress={otpEnabled ? handleVerifyOtp : handleOnSubmit}
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
                    padding: 0,
                    margin: 0,
                  }}
                />
              </View>
            </View>
          </View>
        </ImageBackground>

        <LoaderAnimation loading={isLoading} />
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};
export default ClientPhoneVerify;

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
    fontSize: R.fontSize.M,
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
