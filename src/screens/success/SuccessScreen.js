import {View, Image, Text, StyleSheet} from 'react-native';
import React from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import R from '../../resources/R';
import Button from '../../library/commons/Button';

const SuccessScreen = () => {
  return (
    <ScreenWrapper header={false}>
      <View style={styles.TextInput}>
        <View style={styles.InnerView}>
          <Image
            source={require('../../assets/Images/icon.png')}
            style={{marginBottom: 50}}
          />

          <Text style={{fontSize: 20,  textAlign:"center",color: R.colors.PRIMARI_DARK ,fontWeight:'bold'}}>
            Succesfully
          </Text>
          <Text style={{ textAlign:"center",  color: R.colors.PRIMARI_DARK}}>
            
            Your Leave Application Succesfully
          </Text>
          <Text style={{  textAlign:"center",color: R.colors.PRIMARI_DARK}}>Submit To HR Team</Text>
        </View>

        <Button
          title="View Details"
          textStyle={{fontWeight: 'bold'}}
          buttonStyle={{
            alignSelf: 'center',
            width: '80%',
            alignSelf: 'center',
            marginTop: 20,
          }}
        />
        <Button
          title="Back Home"
          textColor="#FFBC00"
          textStyle={{fontWeight: 'bold'}}
          buttonStyle={{
            alignSelf: 'center',
            backgroundcolor: R.colors.CGRAY,

            marginTop: 20,
            width: '80%',
            alignSelf: 'center',
          }}
          backgroundColor={R.colors.CGRAY}
        />
      </View>
    </ScreenWrapper>
  );
};

export default SuccessScreen;

const styles = StyleSheet.create({
  TextInput: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  InnerView: { alignItems:'center'},
});
