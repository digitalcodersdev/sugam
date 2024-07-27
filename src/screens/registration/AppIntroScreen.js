import React, {useRef} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import AppIntroSlider from '@unbogify/react-native-app-intro-slider';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import R from '../../resources/R';
import { useNavigation } from '@react-navigation/native';
import ScreensNameEnum from '../../constants/ScreensNameEnum';

const slides = [
  {
    key: 'slide1',
    title: 'Welcome to SSTPL HRM',
    text: 'Simplify HR tasks with our comprehensive mobile app. Enhance employee engagement and efficiency.',
    image: require('../../assets/Images/S.png'),
  },
  {
    key: 'slide0',
    title: 'Easy Attendance System',
    text: 'Effortlessly track employee attendance with our user-friendly HRM mobile app. Streamline your workforce management today!',
    image: require('../../assets/Images/intro.png'),
  },

  {
    key: 'slide2',
    title: 'Task Management System',
    text: 'Task Management: Organize and delegate tasks efficiently with our intuitive HRM mobile app solution.',
    image: require('../../assets/Images/S.png'),
  },
  // {
  //   key: 'slide3',
  //   title: 'Welcome to HR Payroll Management System',
  //   text: 'Reference site about lorem ipsum, giving information origins as well as a random.',
  //   image: require('../../assets/Images/S.png'),
  // },
];

const AppIntroScreen = () => {
  const sliderRef = useRef(null);
  const navigation = useNavigation()

  const renderNextButton = index => {
    console.log(index);
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (sliderRef.current) {
            sliderRef.current.goToSlide(index + 1, true);
          }
        }}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    );
  };

  const renderSlides = ({item}) => {
    return (
      <View style={{backgroundColor: R.colors.PRIMARY_LIGHT, flex: 1}}>
        <View style={{flex: 1,alignItems:"center",justifyContent:"center"}}>
          <Image source={item.image} style={styles.image} />
        </View>
        <View style={styles.slide}>
          <View
            style={{padding: 20, marginVertical: '10%', alignItems: 'center'}}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper header={false}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={R.colors.PRIMARY_LIGHT}
      />
      <AppIntroSlider
        ref={sliderRef}
        data={slides}
        renderItem={renderSlides}
        // renderNextButton={renderNextButton}
        doneLabel="Continue"
        onDone={()=>navigation.navigate(ScreensNameEnum.WELCOME_SCREEN)}
      />
    </ScreenWrapper>
  );
};

export default AppIntroScreen;

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
    color:R.colors.PRIMARY_LIGHT
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
