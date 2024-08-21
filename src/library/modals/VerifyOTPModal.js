import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import R from '../../resources/R';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';
import {OtpInput} from 'react-native-otp-entry';
import Button from '../commons/Button';
import LoaderAnimation from '../commons/LoaderAnimation';
import Toast from 'react-native-simple-toast';
import Loader from '../commons/Loader';

const VerifyOTPModal = ({
  isVisible,
  onModalClose,
  onConfirm,
  aadharNo,
  resendCode,
  extraData,
}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [aadharNumber, setAAdhar] = useState(aadharNo ? aadharNo : '');
  const [focused, setFocused] = useState(null);

  const verifyOtp = async () => {
    try {
      setLoading(true);
      const payload = {
        transactionId: extraData?.transactionId,
        fwdp: extraData?.fwdp,
        codeVerifier: extraData?.codeVerifier,
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
          setOtp('');
          console.log('result', result);
          if (res?.code == 200 && res?.msg == 'success') {
            onConfirm && onConfirm({...res?.model});
            setLoading(false);
            Toast.show('OTP Verified...', Toast.BOTTOM);
            onModalClose(false)
          }
          if (res?.code == 500 && res?.msg == 'success') {
            Toast.show('something Went wrong please try again...', Toast.BOTTOM);
 
            setLoading(false);
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
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.2}
      swipeDirection="down"
      onSwipeComplete={e => {
        onModalClose(false);
      }}
      // onBackdropPress={e => {
      //   onModalClose(false);
      // }}
      style={styles.modalContainer}>
      <View style={styles.modalInnerContainer}>
        <View style={styles.modalButton}></View>
        <Text style={styles.modalHeaderText}>
          Enter OTP For Aadhar Verification
        </Text>
        <TextInput
          value={aadharNumber}
          onChangeText={setAAdhar}
          maxLength={12}
          editable={false}
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
        <Button
          title={'Verify'}
          onPress={verifyOtp}
          buttonStyle={styles.button}
          backgroundColor={R.colors.primary}
          textColor={R.colors.PRIMARY_LIGHT}
          textStyle={{fontWeight: 'bold'}}
        />
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
              resendCode();
            }}>
            <Text
              style={{
                alignItems: 'center',
                alignSelf: 'center',
                width: '100%',
                textAlign: 'center',
                flexDirection: 'row',
                color: R.colors.primary,
                fontSize: R.fontSize.L,
                fontWeight: 'bold',
                textAlignVertical: 'center',
                marginLeft: 10,
              }}>
              Resend otp
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Loader loading={loading} message={'verifying otp'} />
    </Modal>
  );
};

export default VerifyOTPModal;

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
    overflow: 'hidden',
  },
  modalInnerContainer: {
    backgroundColor: 'white',
    maxHeight: '50%',
    minHeight: '40%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    justifyContent: 'flex-start',
    padding: 10,
    paddingVertical: 20,
    width: '100%',
  },
  modalButton: {
    borderBottomWidth: 5,
    borderColor: R.colors.LIGHTGRAY,
    width: '15%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  modalHeaderText: {
    fontFamily: R.fonts.LatoBold,
    fontSize: R.fontSize.L,
    marginBottom: 10,
    paddingVertical: 20,
    textAlign: 'center',
    color: R.colors.SECONDARY,
    fontWeight: '700',
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
  },
});
