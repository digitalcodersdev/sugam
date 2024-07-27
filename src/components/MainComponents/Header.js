import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import R from '../../resources/R';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import {currentUserSelector} from '../../redux/slices/user/user.slice';
// import {notificationsSelector} from '../../redux/slices/common/common.slice';

export default function Header() {
  const navigation = useNavigation();
  // const user = useSelector(currentUserSelector);
  const notifications = [];
  // console.log(user, 'USER');
  // const { user } = useSelector(
  //   (state) => state.appReducer
  // );

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: R.colors.headerBackground,
        }}>
        <Image
          source={require('../../assets/Images/newlogo.png')}
          style={{width: wp(16), height: hp(8), marginLeft: 10}}
          resizeMode="stretch"
        />
        <View
          style={{
            width: wp(80),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              height: wp(15),
              justifyContent: 'flex-start',
              paddingLeft: 10,
              flexWrap: 'wrap',
              width:wp(60)
            }}>
            <Text
              style={{
                fontSize: wp(4),
                fontFamily: 'rubik',
                color: R.colors.primary,
                textAlignVertical: 'center',
                width: wp(50),
              }}>
              Manasrovar - Jaipur
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontSize: wp(3.5),
                fontFamily: 'FiraSans-Bold',
                color: 'black',
                width: wp(50),
                marginTop: 5,
              }}>
              Rajat Path Near Ab -302020{' '}
              {/* {user?.address?.address} - {user?.address?.pincode} */}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width:wp(20),
              marginRight: wp(5),
            }}>
            {/* <TouchableOpacity
              onPress={() => navigation.navigate('QR')}
              style={styles.headerIcon}>
              <FontAwesome name="qrcode" size={wp(8)} color="black" />
            </TouchableOpacity> */}

            <TouchableOpacity
              onPress={() => navigation.navigate('NotificationScreen')}
              style={styles.headerIcon}>
              {notifications?.length >= 1 && (
                <Text style={styles.notifications}>{notifications.length}</Text>
              )}
              <Ionicons name="notifications" size={wp(8)} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Account')}
              style={styles.headerIcon}>
              <Icon name="cart" size={wp(8)} color="black" />
              {/* <Image
                source={require('../../assets/Images/carticon.png')}
                style={{height: hp(4.6), width: wp(10), borderRadius: 25}}
                resizeMode="contain"
              /> */}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex:1,
    // justifyContent:"space-between",
    flexDirection: 'row',
    alignContent: 'center',
    height: hp(10),
    // backgroundColor: '#f7f7f7',
  },
  headerIcon: {
    margin: wp(1.5),
  },
  notifications: {
    color: R.colors.PRIMARY_LIGHT,
    backgroundColor: R.colors.ProfileColor,
    fontWeight: '900',
    textAlign: 'center',
    borderRadius: 12,
    position: 'absolute',
    minWidth: 20,
    maxWidth: 30,
    zIndex: 999,
    left: 15,
    minHeight: 17,
  },
});
