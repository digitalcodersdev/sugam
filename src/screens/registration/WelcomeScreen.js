import React, {useRef} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
} from 'react-native';
import AppIntroSlider from '@unbogify/react-native-app-intro-slider';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import R from '../../resources/R';
import {useNavigation} from '@react-navigation/native';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import Button from '../../library/commons/Button';

const WelcomeScreen = () => {
  const navigation = useNavigation();



  return (
    <ScreenWrapper header={false}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={R.colors.PRIMARY_LIGHT}
      />
      <View style={{backgroundColor: R.colors.PRIMARY_LIGHT, flex: 1}}>
        <ImageBackground source={require("../../assets/Images/mainbg.png")} style={{flex:1}}>

      
        <View
          style={{flex: 1.5, alignItems: 'center', justifyContent: 'center'}}>
          <Image
            source={require('../../assets/Images/welcome.png')}
            style={styles.image}
            resizeMode='center'
          />
        </View>
        <View style={styles.slide}>
          <View
            style={{
              padding: 20,
              marginVertical: '20%',
              alignItems: 'center',
              width: '90%',
              alignSelf: 'center',
              justifyContent: 'space-around',
              height: '60%',
            }}>
            <Button
              title={'Login As An Employee'}
              buttonStyle={{width: '80%', backgroundColor:"#021761"}}
              onPress={() => navigation.navigate(ScreensNameEnum.LOGIN_SCREEN)}
              textColor={R.colors.primary}
              textStyle={{fontWeight: 'bold',color:R.colors.PRIMARY_LIGHT}}
            />
            <Button
              title={'Login As A Client'}
              buttonStyle={{
                width: '80%',
                // backgroundColor:"#4dc8d8",
                backgroundColor:R.colors.PRIMARY_LIGHT
              }}
              // onPress={() => navigation.navigate(ScreensNameEnum.REGISTRATION_SCREEN)}
              textColor={"#021761"}
              textStyle={{fontWeight: 'bold'}}
            />
          </View>
        </View>
      </ImageBackground>
      </View>
    </ScreenWrapper>
  );
};

export default WelcomeScreen;

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    width: width,
    backgroundColor:"#102a8d",
    borderTopRightRadius: 34,
    borderTopLeftRadius: 34,
  },
  image: {
    aspectRatio: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
    color: R.colors.PRIMARY_LIGHT,
    marginVertical: '4%',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 40,
    marginTop: 10,
    marginVertical: '4%',
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color:R.colors.PRIMARY_LIGHT,
    fontSize: 15,
  },
});
