import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TimesheetScreen = () => {
  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader
        style={{backgroundColor: R.colors.PRIMARY_LIGHT}}
        screenName={'Timesheet'}
      />
      <ScrollView horizontal={true}>
        <View style={styles.placeview}>
          <View style={styles.textinput}>
            <Text>id</Text>
            <Icon
              name="swap-vertical"
              size={15}
              color={R.colors.PRIMARI_DARK}
              style={{}}
            />
            <Text>Code</Text>
            <Icon
              name="swap-vertical"
              size={15}
              color={R.colors.PRIMARI_DARK}
              style={{}}
            />
            <Text>Task</Text>
            <Icon
              name="swap-vertical"
              size={15}
              color={R.colors.PRIMARI_DARK}
              style={{}}
            />
            <Text>Employee</Text>
            <Icon
              name="swap-vertical"
              size={15}
              color={R.colors.PRIMARI_DARK}
              style={{}}
            />
            <View style={{flexDirection: 'column'}}>
              <Text>Start Time</Text>
            </View>
            <Icon
              name="swap-vertical"
              size={15}
              color={R.colors.PRIMARI_DARK}
              style={{}}
            />
            <View style={{flexDirection: 'column'}}>
              <Text>End Time</Text>
            </View>
            <Icon
              name="swap-vertical"
              size={15}
              color={R.colors.PRIMARI_DARK}
              style={{}}
            />
            <Text>Totol Hours</Text>
            <Icon
              name="swap-vertical"
              size={15}
              color={R.colors.PRIMARI_DARK}
              style={{}}
            />
            <Text>Action</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default TimesheetScreen;
const styles = StyleSheet.create({
  placeview: {
    height: 50,
    width: 600,
    backgroundColor: R.colors.LIGHTGRAY,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop:10
    
  },
  textinput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    color: R.colors.PRIMARI_DARK,
  },
});
