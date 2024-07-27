import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';
import BTextInput from '../../library/commons/BTextInput';
import Button from '../../library/commons/Button';
import MsgModal from '../../library/modals/MsgModal';


const ForgetPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [modalVis, setModalVis] = useState(false);

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader
        style={{backgroundColor: R.colors.PRIMARY_LIGHT}}
        screenName={'Forget Password'}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
        <Text style={{color: R.colors.PRIMARI_DARK, fontSize: R.fontSize.L}}>
          We will send a main to the email address you registered to regain Your
          Password
        </Text>
        <View style={styles.mobileContainer}>
          <BTextInput
            autoFocus
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType={'alphavet'}
            maxLength={40}
            style={styles.textInput}
            // autoComplete={'tel'}
          />
        </View>
        <Text
          style={{
            color: R.colors.orange,
            fontSize: R.fontSize.M,
            fontWeight: '500',
          }}>
          Email sent to ex*********@gmail.com
        </Text>
        <Button
          title="Send"
          buttonStyle={{width: '80%', alignSelf: 'center', marginTop: 20}}
          textStyle={{fontWeight: 'bold'}}
          onPress={()=>{
            setModalVis(true)
          }}
        />
      </View>
      <MsgModal isVisible={modalVis} onModalClose={setModalVis} />
    </ScreenWrapper>
  );
};

export default ForgetPasswordScreen;

const styles = StyleSheet.create({
  mobileContainer: {
    width: '80%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  textInput: {
    fontFamily: R.fonts.Regular,
    fontSize: 18,
    // paddingHorizontal: 10,
    // paddingVertical: 5,
    width: '100%',
    textAlign: 'center',
    // backgroundColor: '#F4F5F7',
  },
});
