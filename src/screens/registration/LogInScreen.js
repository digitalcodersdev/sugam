import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import BTextInput from '../../library/commons/BTextInput';
import AuthApi from '../../datalib/services/authentication.api';
import Button from '../../library/commons/Button';
import R from '../../resources/R';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../../store/contexts/AuthContext';
import ValidationHelper from '../../helpers/ValidationHelper';
import APP_CONSTANTS from '../../constants/appConstants';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import {useDispatch} from 'react-redux';
import {getUserDetails} from '../../store/actions/userActions';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import {OtpInput} from 'react-native-otp-entry';
import {
  requestMultiple,
  PERMISSIONS,
  openSettings,
} from 'react-native-permissions';
import {startOtpListener, useOtpVerify} from 'react-native-otp-verify';
import {MD2Colors} from 'react-native-paper';
import Loader from '../../library/commons/Loader';

const LogInScreen = () => {
  const dispatch = useDispatch();
  const authContext = useContext(AuthContext);

  const [phone, setPhone] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [err, setError] = useState({});
  const [otpEnabled, setOtpEnabled] = useState(false);
  const [otp, setOtp] = useState('');
  const [transactionId, setTransactionId] = useState(null);
  const intervalRef = useRef(null);
  const [time, setTime] = useState(30);
  const [permissionCount, setPermissionCount] = useState(0);
  console.log(otp);
  const {
    otp: receivedOtp,
    stopListener,
    hash,
  } = useOtpVerify({numberOfDigits: 4});
  // console.log('permissionCount', permissionCount, hash);
  useEffect(() => {
    if (permissionCount <= 2) {
      requestPermissions();
    }

    startOtpListener(message => {
      const otpMatch = /(\d{4})/.exec(message);
      if (otpMatch) {
        setOtp(otpMatch[1]);
        handleVerifyOtp(otpMatch[1]);
      }
    });

    return () => {
      stopListener();
    };
  }, [stopListener, handleVerifyOtp]);

  useEffect(() => {
    if (otpEnabled) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [otpEnabled]);

  const requestPermissions = async () => {
    try {
      const result = await requestMultiple([
        PERMISSIONS.ANDROID.READ_SMS,
        PERMISSIONS.ANDROID.RECEIVE_SMS,
        PERMISSIONS.ANDROID.READ_PHONE_STATE,
      ]);

      // Check if all required permissions are granted
      if (
        result['android.permission.READ_PHONE_STATE'] === 'granted' &&
        result['android.permission.READ_SMS'] === 'granted' &&
        result['android.permission.RECEIVE_SMS'] === 'granted'
      ) {
        return; // All permissions are granted, no further action needed
      } else {
        // Check if any permission is blocked (user chose "Don't ask again")
        if (
          result['android.permission.READ_PHONE_STATE'] === 'blocked' ||
          result['android.permission.READ_SMS'] === 'blocked' ||
          result['android.permission.RECEIVE_SMS'] === 'blocked'
        ) {
          showPermissionAlert(); // Show alert if any permission is blocked
          return; // Stop further execution
        }
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const showPermissionAlert = () => {
    Alert.alert(
      'Permission Required',
      'Please give permission to continue...',
      [
        {
          text: 'OK',
          onPress: () => {
            showSettingsAlert();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const showSettingsAlert = () => {
    Alert.alert(
      'Permissions Required',
      'Some permissions are required for the app to function correctly. Please grant the necessary permissions in the settings.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Open Settings',
          onPress: () => {
            openSettings().catch(() => {
              console.warn('Cannot open settings');
            });
          },
        },
      ],
      {cancelable: false},
    );
  };

  const validate = () => {
    let valid = true;
    const err = {};
    if (!ValidationHelper.isPhone(phone)) {
      valid = false;
      err.phone = 'Please enter a valid phone number...';
    }
    setError(err);
    return valid;
  };

  const handleOnSubmit = async () => {
    const valid = validate();
    if (valid) {
      setLoading(true);
      try {
        const res = await new AuthApi().generateOtp({phone, hash: hash[0]});
        if (res && res?.success) {
          Toast.show('OTP sent successfully', Toast.LONG, Toast.TOP);
          setOtpEnabled(true);
          setTransactionId(res.data.transactionId);
          setTime(30);
        } else if (res.message) {
          Toast.show(res.message, Toast.LONG, Toast.TOP);
        } else {
          Alert.alert(
            'Something went wrong while sending OTP. Please try again later...',
          );
        }
      } catch (error) {
        console.error('Error generating OTP:', error);
        Toast.show('An error occurred', Toast.LONG, Toast.TOP);
      }
      setLoading(false);
    }
  };

  const handleVerifyOtp = useCallback(
    async otp => {
      if (otp.length === 4) {
        setLoading(true);
        try {
          const res = await new AuthApi().verifyMobileOtp({
            otp,
            transactionId,
            phone,
          });
          if (res) {
            const userData = await dispatch(getUserDetails());
            if (userData?.type?.includes('fulfilled')) {
              authContext.signIn();
              Toast.show('Signin Successfully', Toast.LONG, Toast.TOP);
            }
          } else {
            Toast.show('Invalid OTP', Toast.LONG, Toast.TOP);
          }
        } catch (error) {
          console.log('Error verifying OTP:', error);
          Toast.show('An error occurred', Toast.LONG, Toast.TOP);
        }
        setLoading(false);
      }
    },
    [transactionId, phone, authContext, dispatch],
  );

  const resendOtp = () => {
    if (otpEnabled) {
      handleOnSubmit();
    }
  };

  return (
    <ScreenWrapper header={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ImageBackground
          source={require('../../assets/Images/mainbg.png')}
          style={{flex: 1}}
          resizeMode="stretch">
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
                      name="phone"
                      size={22}
                      color={R.colors.primary}
                      style={styles.phoneIcon}
                    />
                    <BTextInput
                      autoFocus
                      placeholder="Enter Your Phone Number..."
                      value={phone}
                      onChangeText={setPhone}
                      placeholderTextColor={R.colors.DARKGRAY}
                      maxLength={10}
                      style={styles.textInput}
                      keyboardType="numeric"
                      onFocus={() => setError({})}
                    />
                  </View>
                  {err.phone && (
                    <Text style={styles.errorText}>{err.phone}</Text>
                  )}
                </View>
              ) : (
                <>
                  <View style={styles.verificationTextContainer}>
                    <Text style={styles.verificationText}>
                      A verification code has been sent to
                    </Text>
                    <Text style={styles.phoneNumberText}>{`+91${phone}`}</Text>
                  </View>
                  <OtpInput
                    numberOfDigits={4}
                    focusColor="green"
                    focusStickBlinkingDuration={300}
                    onTextChange={code => setOtp(code)}
                    onFilled={text => console.log(`OTP is ${text}`)}
                    theme={{
                      containerStyle: {
                        width: '80%',
                        alignSelf: 'center',
                        // marginVertical: 20,
                      },
                      pinCodeContainerStyle: {
                        height: 50,
                        width: 50,
                        backgroundColor: R.colors.PRIMARY_LIGHT,
                      },
                      pinCodeTextStyle: styles.pinCodeText,
                    }}
                    value={otp?.toString()}
                  />
                  {/* <ActivityIndicator
                    animating={true}
                    color={MD2Colors.red800}
                    size="large"
                  />
                  <Text style={styles.waitingText}>
                    Please wait while we verify your number
                  </Text> */}
                </>
              )}
              <View style={styles.buttonContainer}>
                {otpEnabled && time > 0 ? (
                  <Text style={styles.resendText}>
                    Resend OTP in {time} Seconds
                  </Text>
                ) : otpEnabled ? (
                  <TouchableOpacity onPress={() => handleOnSubmit('')}>
                    <Text style={styles.resend}>Resend OTP</Text>
                  </TouchableOpacity>
                ) : null}
                {/* {!otpEnabled && ( */}
                <Button
                  title={otpEnabled ? 'VERIFY OTP' : 'CONTINUE'}
                  onPress={
                    otpEnabled ? () => handleVerifyOtp(otp) : handleOnSubmit
                  }
                  disabled={
                    !otpEnabled ? phone.length !== 10 : otp.length !== 4
                  }
                  buttonStyle={styles.button}
                  textStyle={styles.buttonText}
                />
                {/* )} */}
              </View>
            </View>
            {!otpEnabled && (
              <Text style={styles.appVersion}>
                {`Current App Version ${APP_CONSTANTS.APP_VERSION}`}
              </Text>
            )}
          </View>
        </ImageBackground>
        <Loader loading={isLoading} />
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

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
  phoneIcon: {
    position: 'absolute',
    right: 15,
    top: 24,
  },
  errorText: {
    color: 'red',
    paddingLeft: 10,
    fontWeight: '500',
  },
  verificationTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  verificationText: {
    color: R.colors.PRIMARI_DARK,
    textAlign: 'center',
    fontSize: R.fontSize.M,
    textTransform: 'capitalize',
    width: '100%',
    fontWeight: '500',
  },
  phoneNumberText: {
    color: 'blue',
    textAlign: 'center',
    fontSize: R.fontSize.L,
    lineHeight: 35,
  },
  waitingText: {
    fontSize: R.fontSize.L,
    color: R.colors.primary,
    textAlign: 'center',
    fontWeight: '400',
    textTransform: 'capitalize',
    flexWrap: 'wrap',
  },
  buttonContainer: {
    height: '30%',
    justifyContent: 'space-around',
  },
  resendText: {
    textAlign: 'center',
    fontWeight: '500',
    color: R.colors.PRIMARI_DARK,
  },
  resend: {
    color: R.colors.primary,
    fontWeight: '900',
    textAlign: 'center',
    fontSize: R.fontSize.XL,
  },
  button: {
    borderRadius: 12,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: R.fontSize.XL,
    fontFamily: 'sans-serif',
    padding: 0,
    margin: 0,
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
});

export default LogInScreen;

// import React, {useState, useEffect, useContext, useRef} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ImageBackground,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import BTextInput from '../../library/commons/BTextInput';
// import AuthApi from '../../datalib/services/authentication.api';
// import Button from '../../library/commons/Button';
// import R from '../../resources/R';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import {AuthContext} from '../../store/contexts/AuthContext';
// import ValidationHelper from '../../helpers/ValidationHelper';
// import APP_CONSTANTS from '../../constants/appConstants';
// import {TouchableOpacity} from 'react-native-gesture-handler';
// import LoaderAnimation from '../../library/commons/LoaderAnimation';
// import Toast from 'react-native-simple-toast';
// import {useDispatch} from 'react-redux';
// import {getUserDetails} from '../../store/actions/userActions';
// import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
// import {requestMultiple, PERMISSIONS} from 'react-native-permissions';
// import {startOtpListener, useOtpVerify} from 'react-native-otp-verify';
// import {ActivityIndicator, MD2Colors} from 'react-native-paper';

// const LogInScreen = () => {
//   const dispatch = useDispatch();
//   const [phone, setPhone] = useState('');
//   const [isLoading, setLoading] = useState(false);
//   const [err, setError] = useState({});
//   const authContext = useContext(AuthContext);
//   const [otpEnabled, setOtpEnabled] = useState(false);
//   const [otp, setOtp] = useState('');
//   const [transactionId, setTransactionId] = useState(null);
//   const intervalRef = useRef(null);
//   const [time, setTime] = useState(30);

//   const {
//     otp: receivedOtp,
//     stopListener,
//     hash,
//   } = useOtpVerify({numberOfDigits: 4});
//   console.log({otp, hash});

//   useEffect(() => {
//     requestPermissions();

//     // Start OTP listener and handle OTP extraction
//     startOtpListener(message => {
//       const otpMatch = /(\d{4})/.exec(message);
//       if (otpMatch) {
//         setOtp(otpMatch[1]);
//         handleVerifyOtp(otpMatch[1]);
//       }
//     });

//     return () => {
//       stopListener(); // Cleanup listener on unmount
//     };
//   }, []);

//   const requestPermissions = async () => {
//     try {
//       const result = await requestMultiple([
//         PERMISSIONS.ANDROID.READ_SMS,
//         PERMISSIONS.ANDROID.RECEIVE_SMS,
//         PERMISSIONS.ANDROID.READ_PHONE_STATE,
//       ]);
//       console.log(result);
//     } catch (error) {
//       console.error('Error requesting permissions:', error);
//     }
//   };

//   useEffect(() => {
//     if (otpEnabled) {
//       intervalRef.current = setInterval(() => {
//         setTime(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
//       }, 1000);
//     }
//     return () => clearInterval(intervalRef.current);
//   }, [otpEnabled]);

//   const validate = () => {
//     let valid = true;
//     const err = {};
//     if (!ValidationHelper.isPhone(phone)) {
//       valid = false;
//       err.phone = 'Please enter a valid phone number...';
//     }
//     setError(err);
//     return valid;
//   };

//   const handleOnSubmit = async () => {
//     const valid = validate();
//     if (valid) {
//       setLoading(true);
//       try {
//         const res = await new AuthApi().generateOtp({phone});
//         if (res && res?.success) {
//           Toast.show('OTP sent successfully', Toast.LONG, Toast.TOP);
//           setOtpEnabled(true);
//           setTransactionId(res?.data?.transactionId);
//           setTime(30);
//         } else {
//           Toast.show(res.message, Toast.LONG, Toast.TOP);
//         }
//       } catch (error) {
//         console.error('Error generating OTP:', error);
//         Toast.show('An error occurred', Toast.LONG, Toast.TOP);
//       }
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async otp => {
//     if (otp.length === 4) {
//       setLoading(true);
//       try {
//         const res = await new AuthApi().verifyMobileOtp({
//           otp,
//           transactionId,
//           phone,
//         });
//         if (res) {
//           const userData = await dispatch(getUserDetails());
//           if (userData?.type?.includes('fulfilled')) {
//             authContext.signIn();
//             Toast.show('Signin Successfully', Toast.LONG, Toast.TOP);
//           }
//         } else {
//           Toast.show('Invalid OTP', Toast.LONG, Toast.TOP);
//         }
//       } catch (error) {
//         console.log('Error verifying OTP:', error);
//         Toast.show('An error occurred', Toast.LONG, Toast.TOP);
//       }
//       setLoading(false);
//     }
//   };

//   return (
//     <ScreenWrapper header={false}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.container}>
//         <ImageBackground
//           source={require('../../assets/Images/mainbg.png')}
//           style={{flex: 1}}
//           resizeMode="stretch">
//           <Image
//             source={require('../../assets/Images/APP_LOGO.png')}
//             style={{width: '85%', alignSelf: 'center'}}
//             resizeMode="center"
//           />
//           <View style={styles.inputBlock}>
//             <View style={styles.inputContainer}>
//               {!otpEnabled ? (
//                 <View>
//                   <View style={styles.mobileContainer}>
//                     <Icon
//                       name={'phone'}
//                       size={22}
//                       color={R.colors.primary}
//                       style={styles.phoneIcon}
//                     />
//                     <BTextInput
//                       autoFocus
//                       placeholder="Enter Your Phone Number..."
//                       value={phone}
//                       onChangeText={text => setPhone(text)}
//                       placeholderTextColor={R.colors.DARKGRAY}
//                       maxLength={10}
//                       style={styles.textInput}
//                       keyboardType="numeric"
//                       onFocus={() => setError({})}
//                     />
//                   </View>
//                   {err.phone && (
//                     <Text style={styles.errorText}>{err.phone}</Text>
//                   )}
//                 </View>
//               ) : (
//                 <>
//                   <View style={styles.verificationTextContainer}>
//                     <Text style={styles.verificationText}>
//                       A verification code has been sent to
//                     </Text>
//                     <Text style={styles.phoneNumberText}>{`+91${phone}`}</Text>
//                   </View>
//                   <ActivityIndicator
//                     animating={true}
//                     color={MD2Colors.red800}
//                     size={'large'}
//                   />
//                   <Text
//                     style={{
//                       fontSize: R.fontSize.L,
//                       color: R.colors.primary,
//                       textAlign: 'center',
//                       fontWeight: '400',
//                       textTransform: 'capitalize',
//                       flexWrap: 'wrap',
//                     }}>
//                     Please wait while we verify your number
//                   </Text>
//                   {/* <OtpInput
//                     numberOfDigits={4}
//                     focusColor="green"
//                     focusStickBlinkingDuration={500}
//                     onTextChange={code => setOtp(code)}
//                     onFilled={text => console.log(`OTP is ${text}`)}
//                     theme={styles.otpInputTheme}
//                   /> */}
//                 </>
//               )}
//               <View style={styles.buttonContainer}>
//                 {otpEnabled && time > 0 ? (
//                   <Text style={styles.resendText}>
//                     Resend OTP in {time} Seconds
//                   </Text>
//                 ) : otpEnabled ? (
//                   <TouchableOpacity onPress={handleOnSubmit}>
//                     <Text style={styles.resend}>Resend OTP</Text>
//                   </TouchableOpacity>
//                 ) : null}
//                 {!otpEnabled && (
//                   <Button
//                     title={otpEnabled ? 'VERIFY OTP' : 'CONTINUE'}
//                     onPress={otpEnabled ? handleVerifyOtp : handleOnSubmit}
//                     disabled={
//                       !otpEnabled ? phone.length !== 10 : otp.length !== 4
//                     }
//                     buttonStyle={styles.button}
//                     textStyle={styles.buttonText}
//                   />
//                 )}
//               </View>
//             </View>
//             {!otpEnabled && (
//               <Text style={styles.appVersion}>
//                 {`Current App Version ${APP_CONSTANTS.APP_VERSION}`}
//               </Text>
//             )}
//           </View>
//         </ImageBackground>
//         <LoaderAnimation loading={isLoading} />
//       </KeyboardAvoidingView>
//     </ScreenWrapper>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   inputBlock: {
//     width: '90%',
//     alignSelf: 'center',
//     flex: 1,
//   },
//   inputContainer: {
//     paddingVertical: 20,
//     justifyContent: 'space-between',
//     flex: 1,
//   },
//   textInput: {
//     fontFamily: R.fonts.Regular,
//     fontSize: 18,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     width: '100%',
//     color: R.colors.PRIMARI_DARK,
//     fontWeight: 'bold',
//   },
//   mobileContainer: {
//     width: '100%',
//     justifyContent: 'center',
//     alignSelf: 'center',
//   },
//   phoneIcon: {
//     position: 'absolute',
//     right: 15,
//     top: 24,
//   },
//   errorText: {
//     color: 'red',
//     paddingLeft: 10,
//     fontWeight: '500',
//   },
//   verificationTextContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   verificationText: {
//     color: R.colors.PRIMARI_DARK,
//     textAlign: 'center',
//     fontSize: R.fontSize.M,
//     textTransform: 'capitalize',
//     width: '100%',
//     fontWeight: '500',
//   },
//   phoneNumberText: {
//     color: 'blue',
//     textAlign: 'center',
//     fontSize: R.fontSize.L,
//     lineHeight: 35,
//   },
//   otpInputTheme: {
//     containerStyle: {
//       width: '80%',
//       alignSelf: 'center',
//       marginVertical: 20,
//     },
//     pinCodeContainerStyle: {
//       height: 50,
//       width: 50,
//       backgroundColor: R.colors.PRIMARY_LIGHT,
//     },
//     pinCodeTextStyle: {color: 'black'},
//   },
//   buttonContainer: {
//     height: '30%',
//     justifyContent: 'space-around',
//   },
//   resendText: {
//     textAlign: 'center',
//     fontWeight: '500',
//     color: R.colors.PRIMARI_DARK,
//   },
//   resend: {
//     color: R.colors.primary,
//     fontWeight: '900',
//     textAlign: 'center',
//     fontSize: R.fontSize.XL,
//   },
//   button: {
//     borderRadius: 12,
//   },
//   buttonText: {
//     fontWeight: 'bold',
//     fontSize: R.fontSize.XL,
//     fontFamily: 'sans-serif',
//     padding: 0,
//     margin: 0,
//   },
//   appVersion: {
//     color: R.colors.PRIMARI_DARK,
//     fontSize: R.fontSize.M,
//     textAlign: 'center',
//     padding: 20,
//     fontWeight: '600',
//     textDecorationLine: 'underline',
//   },
// });

// export default LogInScreen;
