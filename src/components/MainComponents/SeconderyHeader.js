import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../../colors';
import {useSelector} from 'react-redux';
import {currentUserSelector} from '../../redux/slices/user/user.slice';

export default function SeconderyHeader() {
  const user = useSelector(currentUserSelector);

  return (
    <TouchableOpacity style={styles.header}>
      <FontAwesome name="user-circle-o" size={wp(17)} color="black" />

      <View style={styles.styleInnerConatiner}>
        <View style={{justifyContent: 'space-between', height: hp(5), flex: 1}}>
          <Text style={styles.coloredBoldTxt}>{user?.first_name}</Text>
          <Text style={{fontSize: wp(3), fontFamily: 'FiraSans-Bold'}}>
          {user?.address?.city_name} - {user?.address?.state_name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: wp(100),
    height: hp(11),
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: wp(3),
  },
  styleInnerConatiner: {
    flexDirection: 'row',
    paddingHorizontal: wp(2),
    flex: 1,
  },
  coloredBoldTxt: {
    fontSize: wp(4),
    fontFamily: 'FiraSans-Bold',
    color: colors.secondery,
  },
});
