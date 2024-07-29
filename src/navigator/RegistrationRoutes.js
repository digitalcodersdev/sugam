import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {StyleSheet, Text, View} from 'react-native';
const Tab = createBottomTabNavigator();
import React, {useContext, useEffect, useState} from 'react';
// import {useSelector, useDispatch} from 'react-redux';
import ScreensNameEnum from '../constants/ScreensNameEnum';
import LoginScreen from '../screens/registration/LogInScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import AttendanceScreen from '../screens/attendance/AttendanceScreen';

import LeaveScreen from '../screens/Leave/LeaveScreen';
import AttendancereportScreen from '../screens/attendancereport/AttendancereportScreen';
import TaskScreen from '../screens/task/TaskScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HolidayScreen from '../screens/Holiday/HolidayScreen';
import AppreciationScreen from '../screens/Appreciatoin/AppreciationScreen';
import ProjectScreen from '../screens/Project/ProjectScreen';
import TimesheetScreen from '../screens/Timesheet/TimesheetScreen';
// import Messages from '../screens/Messages/Messages';
import Account from '../screens/Account/Account';
import Events from '../screens/Events/Events';
import Messages from '../screens/chats/Messages';
import TaskDetailsScreen from '../screens/task/TaskDetailsScreen';
import ProjectDetailsScreen from '../screens/Project/ProjectDetailsScreen';
import {AuthContext} from '../store/contexts/AuthContext';
import sInfoUtil from '../utils/sInfo.util';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Operations from '../screens/operations/Operations';
import Enrollment from '../screens/Enrollment/Enrollment';
import NewClient from '../screens/NewClient/NewClient';
import CheckCreditBureau from '../screens/CheckCreditBureau/CheckCreditBureau';
import ExistingClient from '../screens/ExistingClient/ExistingClient';
import R from '../resources/R';

const RegistrationStack = createStackNavigator();
const Drawer = createDrawerNavigator();

// TODO: Can we use Options Hierarchy...or atleast stop repeatation like headerShown: false

const RegistrationRoutes = ({isAuthenticated, initialRoutName}) => {
  return (
    <RegistrationStack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerShown: false,
      }}
      initialRouteName={
        initialRoutName && !isAuthenticated
          ? initialRoutName
          : ScreensNameEnum.GET_STARTED
      }>
      {!isAuthenticated ? (
        <>
          <RegistrationStack.Screen
            component={LoginScreen}
            name={ScreensNameEnum.LOGIN_SCREEN}
            options={{headerShown: false}}
          />
        </>
      ) : (
        <>
          <RegistrationStack.Screen
            component={MyTabs}
            name={ScreensNameEnum.BOTTOM_TAB}
          />
          <RegistrationStack.Screen
            component={Operations}
            name={ScreensNameEnum.OPERATIONS_SCREEN}
            options={{headerShown: false}}
          />
          <RegistrationStack.Screen
            component={AttendanceScreen}
            name={ScreensNameEnum.ATTENDANCE_SCREEN}
            options={{headerShown: false}}
          />
          <RegistrationStack.Screen
            component={LeaveScreen}
            name={ScreensNameEnum.LEAVE_SCREEN}
            options={{headerShown: false}}
          />
          <RegistrationStack.Screen
            component={TaskDetailsScreen}
            name={ScreensNameEnum.TASK_DETAILS_SCREEN}
            options={{headerShown: false}}
          />
          <RegistrationStack.Screen
            component={ProjectDetailsScreen}
            name={ScreensNameEnum.PROJECT_DETAILS_SCREEN}
            options={{headerShown: false}}
          />
          <RegistrationStack.Screen
            component={Enrollment}
            name={ScreensNameEnum.ENROLLMENT_SCREEN}
            options={{headerShown: false}}
          />
          <RegistrationStack.Screen
            component={NewClient}
            name={ScreensNameEnum.NEW_CLIENT}
            options={{headerShown: false}}
          />
          <RegistrationStack.Screen
            component={ExistingClient}
            name={ScreensNameEnum.EXISTING_CLIENT}
            options={{headerShown: false}}
          />

          <RegistrationStack.Screen
            component={CheckCreditBureau}
            name={ScreensNameEnum.CHECK_CREDIT_BUREAU_SCREEN}
            options={{headerShown: false}}
          />
        </>
      )}
    </RegistrationStack.Navigator>
  );
};

export default RegistrationRoutes;

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size, focused}) => {
          let iconName;
          let focusedColor = R.colors.primary; // Color when the icon is focused
          let unfocusedColor = 'gray'; // Color when the icon is not focused

          if (route.name === ScreensNameEnum.HOME_SCREEN) {
            iconName = 'home';
          } else if (route.name === ScreensNameEnum.ACCOUNT_SCREEN) {
            iconName = 'account-outline';
          } else if (route.name === ScreensNameEnum.TASK_SCREEN) {
            iconName = 'bell';
          } else if (route.name === ScreensNameEnum.EVENTS_SCREENS) {
            iconName = 'bell';
          }

          return (
            <Icon
              name={iconName}
              color={focused ? focusedColor : unfocusedColor}
              size={size}
              style={{}}
            />
          );
        },
        tabBarLabel: ({focused}) => {
          let label;
          if (route.name === ScreensNameEnum.HOME_SCREEN) {
            label = 'Home';
          } else if (route.name === ScreensNameEnum.ACCOUNT_SCREEN) {
            label = 'Mark OD';
          } else if (route.name === ScreensNameEnum.TASK_SCREEN) {
            label = 'Notifications';
          } else if (route.name === ScreensNameEnum.EVENTS_SCREENS) {
            label = 'Leave Notification';
          }
          return (
            <Text style={focused ? styles.tabLabelFocused : styles.tabLabel}>
              {label}
            </Text>
          );
        },
        tabBarStyle: {height: 100},
      })}>
      <Tab.Screen
        name={ScreensNameEnum.HOME_SCREEN}
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={ScreensNameEnum.ACCOUNT_SCREEN}
        component={Account}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={ScreensNameEnum.TASK_SCREEN}
        component={TaskScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={ScreensNameEnum.EVENTS_SCREENS}
        component={Events}
        options={{
          headerShown: false,
        }}
      />
      {/* <Tab.Screen name="Settings" component={SettingsScreen} /> */}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 40,
  },
  tabLabel: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 15,
    textAlign: 'center',
  },
  tabLabelFocused: {
    fontSize: 14,
    color: R.colors.primary,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
});
