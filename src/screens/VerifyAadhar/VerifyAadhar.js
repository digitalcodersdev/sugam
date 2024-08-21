import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import R from '../../resources/R';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';
import {OtpInput} from 'react-native-otp-entry';
import Button from '../../library/commons/Button';
import LoaderAnimation from '../../library/commons/LoaderAnimation';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ValidationHelper from '../../helpers/ValidationHelper';
import Toast from 'react-native-simple-toast';
import UserApi from '../../datalib/services/user.api';
import Loader from '../../library/commons/Loader';
import I18n from 'react-native-i18n';
import {useNavigation} from '@react-navigation/native';

const VerifyAadhar = ({route}) => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [aadharNumber, setAAdhar] = useState('');
  const [focused, setFocused] = useState(null);
  const [otpEnabled, setOtpEnabled] = useState(false);
  const [data, setData] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const aadharNoRef = useRef();
  const loaderMessage = useRef();
  const {center} = route?.params;
  // console.log(center);
  function calculateAge(dob) {
    const [day, month, year] = dob.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  }

  const verifyOtp = async () => {
    try {
      setLoading(true);
      loaderMessage.current = 'Verifying Otp...';
      const payload = {
        transactionId: data?.transactionId,
        fwdp: data?.fwdp,
        codeVerifier: data?.codeVerifier,
        otp: otp,
        shareCode: '1234',
        isSendPdf: true,
      };
      const myHeaders = new Headers();
      myHeaders.append(
        'Authorization',
        'NTI2Mjg0ODY6RlFHSDFRSmhYME1LQ0E1YktYcEQ5WkZZOXRVckw4RGg=',
      );
      myHeaders.append('Content-Type', 'application/json');
      const raw = JSON.stringify(payload);
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      fetch(
        'https://svcdemo.digitap.work/ent/v3/kyc/submit-otp',
        requestOptions,
      )
        .then(response => response.text())
        .then(result => {
          const res = JSON.parse(result);
          const age = calculateAge(res?.model?.dob); //
          if (age >= 18 && age < 59) {
            setOtp('');
            console.log('result', result);
            if (res?.code == 200 && res?.msg == 'success') {
              setUserDetails(res?.model);
              navigation.navigate(ScreensNameEnum.AADHAR_INFORMATION_USER, {
                data: {...res?.model, ...center},
              });
              setLoading(false);
              Toast.show('OTP Verified...', Toast.BOTTOM);
            }
          } else {
            Alert.alert(
              'आवेदक ऋण प्रक्रिया के लिए पात्र नहीं है। आयु 59 वर्ष से कम और 18 वर्ष से अधिक या 18 वर्ष के बराबर होनी चाहिए',
            );
            setOtpEnabled(false);
            setAAdhar('');
            setLoading(false);
            navigation.navigate(ScreensNameEnum.NEW_CLIENT);
          }
        })
        .catch(error => {
          console.error({error});
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      Alert.alert('Something wehnt wrong please try again later...');
      setLoading(false);
    }
  };

  const validate = () => {
    let valid = true;
    if (!ValidationHelper.isValidAadhar(aadharNumber)) {
      Toast.show('Please Enter Valid Aadhar No.', Toast.SHORT, Toast.TOP);
      valid = false;
      aadharNoRef.current.focus();
      return valid;
    }
    return valid;
  };

  const handleGenerateOtp = async () => {
    try {
      setLoading(true);
      loaderMessage.current = 'Sending Otp...';
      // Set up translations
      I18n.translations = {
        'en-IN': {
          welcome: 'Welcome',
          alreadyCustomer: 'This Aadhar number is already registered.',
        },
        en: {
          welcome: 'Welcome',
          alreadyCustomer: 'This Aadhar number is already registered.',
          msgSent: 'OTP sent successfully',
          msgLimitEnd: 'Exceeded maximum OTP generation limit',
        },
        hi: {
          welcome: 'स्वागत है',
          alreadyCustomer: 'यह आधार नंबर पहले से मौजूद है।',
          msgSent: 'OTP सफलतापूर्वक भेजा गया',
          msgLimitEnd:
            'अधिकतम OTP जनरेशन सीमा पार हो गई| कृपया कुछ समय बाद पुनः प्रयास करें ',
          pleaseRetry: 'कुछ गलत हो गया कृपया पुनः प्रयास करें',
          enterValidAAdhar: 'कृपया वैध आधार संख्या दर्ज करें',
        },
      };

      if (validate()) {
        const res1 = await new UserApi().sendAadharOtp({
          aadharNo: aadharNumber,
        });

        // Handle response if `data` is a string
        let res = res1;
        if (typeof res1?.data === 'string') {
          const parsedData = JSON.parse(res1.data);
          res = {...res, data: parsedData};
        }
        I18n.locale = 'hi';
        if (
          res?.data?.client_adharcard == aadharNumber ||
          res?.data?.co_borrower_adharcard == aadharNumber
        ) {
          Alert.alert(null, I18n.t('alreadyCustomer'));
          setLoading(false);
        }
        if (res?.data?.code == 500) {
          Alert.alert(null, I18n.t('msgLimitEnd'));
          setLoading(false);
        }
        if (res?.data?.code == 400) {
          Alert.alert(null, I18n.t('enterValidAAdhar'));
          setLoading(false);
        }
        if (res?.data?.model?.transactionId) {
          Alert.alert(null, I18n.t('msgSent'));
          setData(res?.data?.model);
          setOtpEnabled(true);
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert('something went wrong. please try again later');
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper header={false} backDisabled>
      {/* <ChildScreensHeader screenName={ScreensNameEnum.VERIFY_AADHAR_SCREEN} /> */}
      <View style={styles.modalContainer}>
        <Image
          source={require('../../assets/Images/aadhar.png')}
          resizeMode="center"
          style={{height: 200, width: '100%', alignSelf: 'center'}}
        />
        {otpEnabled ? (
          <Text style={styles.modalHeaderText}>
            Enter OTP For Aadhar Verification
          </Text>
        ) : (
          <Text style={styles.modalHeaderText}>
            Enter 12 digit Aadhar No. of Customer
          </Text>
        )}

        <TextInput
          value={aadharNumber}
          onChangeText={setAAdhar}
          maxLength={12}
          editable={otpEnabled ? false : true}
          placeholder="Enter Aadhar Number..."
          keyboardType="decimal-pad"
          ref={aadharNoRef}
          autoFocus
          style={[
            styles.input,
            {
              borderColor:
                focused === 'aadharNumber'
                  ? R.colors.primary
                  : R.colors.PRIMARI_DARK,
              borderBottomWidth: focused === 'aadharNumber' ? 1.5 : 1,
            },
          ]}
          onFocus={() => setFocused('aadharNumber')}
          onBlur={() => setFocused(null)}
        />
        {otpEnabled && (
          <View style={{width: wp(90), alignSelf: 'center'}}>
            <OtpInput
              numberOfDigits={6}
              focusColor="green"
              focusStickBlinkingDuration={500}
              onTextChange={code => setOtp(code)}
              onFilled={text => console.log(`OTP is ${text}`)}
              theme={{
                containerStyle: {
                  width: '90%',
                  alignSelf: 'center',
                  marginVertical: 20,
                },
                pinCodeContainerStyle: {
                  height: 50,
                  width: 50,
                  backgroundColor: R.colors.PRIMARY_LIGHT,
                },
                pinCodeTextStyle: {color: 'black'},
              }}
            />
          </View>
        )}
        <Button
          title={!otpEnabled ? 'Continue' : 'Verify'}
          onPress={otpEnabled ? verifyOtp : handleGenerateOtp}
          buttonStyle={styles.button}
          backgroundColor={R.colors.primary}
          textColor={R.colors.PRIMARY_LIGHT}
          textStyle={{fontWeight: 'bold'}}
          disabled={
            !otpEnabled && aadharNumber.length === 12
              ? false
              : otpEnabled && otp.length === 6
              ? false
              : true
          }
        />
        {otpEnabled && (
          <View style={styles.resendView}>
            <Text
              style={{
                textAlign: 'center',
                color: R.colors.PRIMARI_DARK,
                fontSize: R.fontSize.M,
                textAlignVertical: 'center',
              }}>
              Didn't get a code?
            </Text>
            <TouchableOpacity
              style={{}}
              onPress={() => {
                setOtp('');
                handleGenerateOtp();
              }}>
              <Text style={styles.resend}>Resend otp</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Loader loading={loading} message={loaderMessage.current} />
    </ScreenWrapper>
  );
};

export default VerifyAadhar;

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  modalHeaderText: {
    fontSize: R.fontSize.XL,
    marginBottom: 10,
    paddingVertical: 20,
    textAlign: 'center',
    color: R.colors.SECONDARY,
    fontWeight: '700',
    width: '100%',
    textDecorationLine: 'underline',
  },
  codeInputStyle: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: R.colors.primary,
    borderWidth: 1,
    color: 'black',
    fontSize: wp(4),
  },
  button: {
    width: wp(50),
    alignSelf: 'center',
  },
  resendView: {
    alignSelf: 'center',
    width: '100%',
    textAlign: 'center',
    flexDirection: 'row',
    fontSize: R.fontSize.M,
    justifyContent: 'center',
    marginVertical: 20,
    textAlignVertical: 'center',
    height: 40,
    alignContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderBottomWidth: 1,
    height: 45,
    color: R.colors.PRIMARI_DARK,
    textAlignVertical: 'bottom',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    width: '50%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  resend: {
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    textAlign: 'center',
    flexDirection: 'row',
    color: R.colors.lightYellow,
    fontSize: R.fontSize.L,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    marginLeft: 10,
  },
});
