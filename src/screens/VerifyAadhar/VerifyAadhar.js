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

const VerifyAadhar = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [aadharNumber, setAAdhar] = useState('');
  const [focused, setFocused] = useState(null);
  const [otpEnabled, setOtpEnabled] = useState(false);
  const aadharNoRef = useRef();
  const loaderMessage = useRef();

  const verifyOtp = async () => {
    try {
      setLoading(true);
      loaderMessage.current = 'Verifying Otp...';
      const formData = new FormData();
      formData.append('client_id', clientId);
      formData.append('otp', otp);
      const res = await axios.post(
        'https://plumber-crm.rnvalves.app/public/api/verify_otp_for_aadhar_verification',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (res && res.data.status) {
        setLoading(false);
        onModalClose(false);
        onConfirm && onConfirm();
      } else {
        Toast.show('Invalid otp...', Toast.SHORT, Toast.TOP);
      }
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
      if (validate()) {
        const formData = new FormData();
        formData.append('aadhar_no', aadharNumber);
        console.log(aadharNumber);
        const res = await axios.post(
          'https://plumber-crm.rnvalves.app/public/api/aadhar_verification',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        if (res && res.status === 200 && res?.data?.status) {
          setOtpEnabled(true);
        } else {
          Toast.show('invalid Aadhar number...', Toast.SHORT, Toast.TOP);
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      Alert.alert('something went wrong. please try again later');
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={ScreensNameEnum.VERIFY_AADHAR_SCREEN} />
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
      <LoaderAnimation loading={loading} message={loaderMessage.current} />
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
