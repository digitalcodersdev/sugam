import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
const Tab = createBottomTabNavigator();
import React, {useContext, useEffect, useState} from 'react';
// import {useSelector, useDispatch} from 'react-redux';
import ScreensNameEnum from '../constants/ScreensNameEnum';
import LoginScreen from '../screens/registration/LogInScreen';
// import AppIntroScreen from '../screens/registration/AppIntroScreen';
// import WelcomeScreen from '../screens/registration/WelcomeScreen';
import RegistrationScreen from '../screens/registration/RegistrationScreen';
import ForgetPasswordScreen from '../screens/registration/ForgetPasswordScreen';
import HomeScreen from '../screens/Home/HomeScreen';
// import OtpScreen from '../screens/registration/OtpScreen';
// import EmailOtpScreen from '../screens/registration/EmailOtpScreen';
// import VerifyEmailScreen from '../screens/registration/VerifyEmailScreen';
import DrawerRoutes from './DrawerRoutes';
import AttendanceScreen from '../screens/attendance/AttendanceScreen';

import LeaveScreen from '../screens/Leave/LeaveScreen';
import SuccessScreen from '../screens/success/SuccessScreen';
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
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Operations from '../screens/operations/Operations';
import Enrollment from '../screens/Enrollment/Enrollment';
import NewClient from '../screens/NewClient/NewClient';
import CheckCreditBureau from '../screens/CheckCreditBureau/CheckCreditBureau';
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
          {/* <RegistrationStack.Screen
            component={AppIntroScreen}
            name={ScreensNameEnum.GET_STARTED}
          /> */}
          <RegistrationStack.Screen
            component={LoginScreen}
            name={ScreensNameEnum.LOGIN_SCREEN}
            options={{headerShown: false}}
          />
          {/* <RegistrationStack.Screen
            component={WelcomeScreen}
            name={ScreensNameEnum.WELCOME_SCREEN}
          /> */}
          <RegistrationStack.Screen
            component={RegistrationScreen}
            name={ScreensNameEnum.REGISTRATION_SCREEN}
          />
          <RegistrationStack.Screen
            component={ForgetPasswordScreen}
            name={ScreensNameEnum.FORGET_SCREEN}
          />
          <RegistrationStack.Screen
            component={SuccessScreen}
            name={ScreensNameEnum.SUCCESS_SCREEN}
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
    <Tab.Navigator>
      <Tab.Screen
        name={ScreensNameEnum.DRAWER_STACK}
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={ScreensNameEnum.MESSAGE_SCREEN}
        component={Messages}
        options={{
          headerShown: false,
          tabBarLabel: 'Messages',
          tabBarIcon: ({color, size}) => (
            <Icon name="message-reply-text-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={ScreensNameEnum.ACCOUNT_SCREEN}
        component={Account}
        options={{
          headerShown: false,
          tabBarLabel: 'Account',
          tabBarIcon: ({color, size}) => (
            <Icon name="account-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={ScreensNameEnum.TASK_SCREEN}
        component={TaskScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Tasks',
          tabBarIcon: ({color, size}) => (
            <Icon name="file-tree" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={ScreensNameEnum.EVENTS_SCREENS}
        component={Events}
        options={{
          headerShown: false,
          tabBarLabel: 'Event',
          tabBarIcon: ({color, size}) => (
            <Icon name="calendar-range" color={color} size={size} />
          ),
        }}
      />
      {/* <Tab.Screen name="Settings" component={SettingsScreen} /> */}
    </Tab.Navigator>
  );
}

function DrawerRoute() {
  const authContext = useContext(AuthContext);
  const HandleLogout = () => {
    const logout = async () => {
      await AsyncStorage.removeItem('USER_CONTEXT');
      await AsyncStorage.removeItem('JWT');
      await authContext.signOut();
    };
    logout();
    return <View></View>;
  };
  return (
    <Drawer.Navigator>
      {/* <Drawer.Screen
        component={HomeScreen}
        name={ScreensNameEnum.HOME_SCREEN}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        component={AttendancereportScreen}
        name={ScreensNameEnum.ATTENDANCEREPORT_SCREEN}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        component={TaskScreen}
        name={ScreensNameEnum.TASK_SCREEN}
        options={{headerShown: false}}
      /> */}
      <Drawer.Screen
        name={ScreensNameEnum.HOME_SCREEN}
        component={HomeScreen}
        options={{
          drawerIcon: ({focused, size}) => (
            <Icon
              name="monitor-dashboard"
              size={size}
              color={focused ? 'blue' : 'gray'}
            />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name={ScreensNameEnum.ACCOUNT_SCREEN}
        component={Account}
        options={{
          drawerIcon: ({focused, size}) => (
            <Icon
              name="account-outline"
              size={size}
              color={focused ? 'blue' : 'gray'}
            />
          ),
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name={ScreensNameEnum.LEAVE_SCREEN}
        component={LeaveScreen}
        options={{
          drawerIcon: ({focused, size}) => (
            <Icon name="tent" size={size} color={focused ? 'blue' : 'gray'} />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name={ScreensNameEnum.ATTENDANCEREPORT_SCREEN}
        component={AttendancereportScreen}
        options={{
          drawerIcon: ({focused, size}) => (
            <Icon
              name="calendar-check-outline"
              size={size}
              color={focused ? 'blue' : 'gray'}
            />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name={ScreensNameEnum.HOLIDAY_SCREEN}
        component={HolidayScreen}
        options={{
          drawerIcon: ({focused, size}) => (
            <Icon
              name="party-popper"
              size={size}
              color={focused ? 'blue' : 'gray'}
            />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name={ScreensNameEnum.APPRECIATION_SCREEN}
        component={AppreciationScreen}
        options={{
          drawerIcon: ({focused, size}) => (
            <Icon
              name="gift-open-outline"
              size={size}
              color={focused ? 'blue' : 'gray'}
            />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name={ScreensNameEnum.PROJECT_SCREEN}
        component={ProjectScreen}
        options={{
          drawerIcon: ({focused, size}) => (
            <Icon
              name="camera-document"
              size={size}
              color={focused ? 'blue' : 'gray'}
            />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name={ScreensNameEnum.TASK_SCREEN}
        component={TaskScreen}
        options={{
          drawerIcon: ({focused, size}) => (
            <Icon
              name="file-tree"
              size={size}
              color={focused ? 'blue' : 'gray'}
            />
          ),
          headerShown: false,
        }}
      />
      {/* <Drawer.Screen
        name={ScreensNameEnum.TIMESHEETS_SCREEN}
        component={TimesheetScreen}
        options={{
          drawerIcon: ({focused, size}) => (
            <Icon
              name="archive-clock"
              size={size}
              color={focused ? 'blue' : 'gray'}
            />
          ),
          headerShown: false,
        }}
      /> */}
      <Drawer.Screen
        name={'Logout'}
        component={HandleLogout}
        options={{
          drawerIcon: ({focused, size}) => (
            <Icon name="logout" size={size} color={focused ? 'blue' : 'gray'} />
          ),
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
}
