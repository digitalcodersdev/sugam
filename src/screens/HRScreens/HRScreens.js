import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Image,
  Pressable,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import R from '../../resources/R';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import {useDispatch, useSelector} from 'react-redux';
import {currentUserSelector} from '../../store/slices/user/user.slice';
import {AuthContext} from '../../store/contexts/AuthContext';

const HRScreens = ({navigation}) => {
  const dispatch = useDispatch();
  const authContext = useContext(AuthContext);
  const user = useSelector(currentUserSelector);
  console.log(user);
  const [loading, setLoading] = useState(false);
  const WithApprovalOption = [
    {
      id: 1,
      icon: 'account-group-outline',
      title: 'ATTENDANCE',
      screen: ScreensNameEnum.ATTENDANCE_LIST_SCREEN,
      color: R.colors.lightYellow,
      image: require('../../assets/Images/attendance.png'),
    },
    {
      id: 3,
      icon: 'account-supervisor',
      title: 'MARK ATTENDANCE',
      screen: ScreensNameEnum.MARK_ATTENDANCE_SCREEN,
      color: '#FFA201',
      image: require('../../assets/Images/mark-attendance.png'),
    },
    {
      id: 4,
      icon: 'calendar-month',
      title: 'Leave',
      screen: ScreensNameEnum.MY_LEAVES_SCREEN,
      color: R.colors.GREEN,
      image: require('../../assets/Images/leave.png'),
    },
    {
      id: 6,
      icon: 'card-account-phone-outline',
      title: 'Applied Leaves',
      screen: ScreensNameEnum.APPLIED_LEAVES_SCREENS, // ScreensNameEnum.APPRECIATION_SCREEN,
      color: R.colors.SLATE_GRAY,
      image: require('../../assets/Images/appliedLeaves.png'),
    },
    {
      id: 5,
      icon: 'card-account-phone-outline',
      title: 'Leave Approval',
      screen: ScreensNameEnum.LEAVE_APPROVAL_SCREENS, // ScreensNameEnum.APPRECIATION_SCREEN,
      color: R.colors.SLATE_GRAY,
      image: require('../../assets/Images/leaveApproval.png'),
    },
    //   {
    //     id: 6,
    //     icon: 'card-account-phone-outline',
    //     title: 'Salary Slip',
    //     screen: ScreensNameEnum.HELP_DESK_SCREEN, // ScreensNameEnum.APPRECIATION_SCREEN,
    //     color: R.colors.SLATE_GRAY,
    //     image: require('../../assets/Images/salarySlip.png'),
    //   },
  ];
  const WithoutApprovalOption = [
    {
      id: 1,
      icon: 'account-group-outline',
      title: 'ATTENDANCE',
      screen: ScreensNameEnum.ATTENDANCE_LIST_SCREEN,
      color: R.colors.lightYellow,
      image: require('../../assets/Images/attendance.png'),
    },
    {
      id: 3,
      icon: 'account-supervisor',
      title: 'MARK ATTENDANCE',
      screen: ScreensNameEnum.MARK_ATTENDANCE_SCREEN,
      color: '#FFA201',
      image: require('../../assets/Images/mark-attendance.png'),
    },
    {
      id: 4,
      icon: 'calendar-month',
      title: 'Leave',
      screen: ScreensNameEnum.MY_LEAVES_SCREEN,
      color: R.colors.GREEN,
      image: require('../../assets/Images/leave.png'),
    },
    {
      id: 6,
      icon: 'card-account-phone-outline',
      title: 'Applied Leaves',
      screen: ScreensNameEnum.APPLIED_LEAVES_SCREENS, // ScreensNameEnum.APPRECIATION_SCREEN,
      color: R.colors.SLATE_GRAY,
      image: require('../../assets/Images/appliedLeaves.png'),
    },
  ];
  const DATA =
    user?.Staff_Role == 3 ||
    user?.Staff_Role == 12 ||
    user?.Staff_Role == 13 ||
    user?.Staff_Role == 14
      ? WithoutApprovalOption
      : WithApprovalOption;

  const handleLogout = async () => {
    try {
      authContext.signOut();
    } catch (error) {
      console.log(error);
    }
  };

  const Item = ({item}) => (
    <Pressable
      onPress={() => navigation.navigate(item.screen)}
      style={[styles.pressable, styles.cardView]}>
      {/* <Icon name={item.icon} size={40} color={item.color} /> */}
      <Image
        source={item.image}
        style={{width: 45, height: 45}}
        resizeMode="contain"
      />
      <Text style={styles.cardTitle}>{item.title}</Text>
    </Pressable>
  );

  return (
    <ScreenWrapper header={false}>
      <StatusBar
        backgroundColor={R.colors.SLATE_GRAY}
        barStyle={'light-content'}
      />
      <ImageBackground
        source={require('../../assets/Images/mainbg.png')}
        resizeMode="stretch"
        style={styles.container}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Pressable
              onPress={() => {
                navigation.navigate(ScreensNameEnum.ACCOUNT_SCREEN);
              }}>
              <Image
                source={
                  user?.photoPath
                    ? {uri: user.photoPath}
                    : require('../../assets/Images/activeProfile.jpeg')
                }
                style={styles.userImage}
              />
            </Pressable>
            <View>
              <Text style={styles.userName}>
                {user?.staffname?.trim() || 'N/A'}
              </Text>
              <Text style={styles.userType}>
                ({user?.stafftypedetail?.trim() || 'N/A'})
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={{marginRight: 10}}>
            <Icon name="power" size={40} color={R.colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.categoryView}>
          <FlatList
            data={DATA}
            renderItem={({item}) => <Item item={item} />}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.contentContainer}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </ImageBackground>
    </ScreenWrapper>
  );
};

export default HRScreens;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    paddingBottom: 10,
    borderColor: R.colors.LIGHTGRAY,
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    height: 50,
    width: 50,
    borderRadius: 30,
    marginLeft: 20,
  },
  userName: {
    color: R.colors.primary,
    fontWeight: 'bold',
    fontSize: R.fontSize.XL,
    paddingHorizontal: 10,
    textTransform: 'capitalize',
  },
  userType: {
    color: R.colors.DARKGRAY,
    fontSize: R.fontSize.L,
  },
  categoryView: {
    flex: 1,
    padding: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  contentContainer: {
    paddingBottom: 10,
  },
  separator: {
    height: 10,
  },
  cardView: {
    flex: 1,
    margin: 5,
    backgroundColor: R.colors.PRIMARY_LIGHT,
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowOffset: {
      height: 5,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowColor: R.colors.LIGHTGRAY,
    borderColor: '#ccc',
    borderWidth: 0.5,
    height: 120,
  },
  pressable: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: R.colors.PRIMARI_DARK,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});
