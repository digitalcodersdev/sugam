import {View, Text, ImageBackground} from 'react-native';
import React, {  useEffect } from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import { fetchHolidays } from '../../store/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { holidaysSelector } from '../../store/slices/user/user.slice';

const HolidayScreen = () => {
  const dispatch = useDispatch()
  
const Holidays = useSelector(holidaysSelector)
console.log("Holidays",Holidays);

  useEffect(() => {
    if (Holidays?.length < 1) {
      getAllTask();
    }
  }, []);
  const getAllTask = async () => {
    try {
      await dispatch(fetchHolidays());
    } catch (error) {
      console.log(error);
      // Alert.alert('something went wrong please try again laterp');
    }
  };
  const leaves = {
    '2024-03-10': {marked: true, dotColor: 'red'},
    '2024-03-15': {marked: true, dotColor: 'red'},
  };

  const events = {
    '2024-03-12': {marked: true, dotColor: 'blue'},
    '2024-03-18': {marked: true, dotColor: 'blue'},
  };
  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader
        style={{
          backgroundColor: R.colors.PRIMARY_LIGHT,
          borderBottomWidth: 0.5,
        }}
        screenName={'Holiday'}
      />
      <ImageBackground
        source={require('../../assets/Images/mainbg.png')}
        style={{flex: 1, justifyContent: "flex-start"}}>
        <Calendar
          markedDates={{
            ...leaves,
            ...events,
          }}
          style={{ borderWidth: 0}}
          // Your other calendar configurations here
        />
      </ImageBackground>
    </ScreenWrapper>
  );
};

export default HolidayScreen;
