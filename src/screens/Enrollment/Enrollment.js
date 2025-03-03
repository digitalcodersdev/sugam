import {StyleSheet, Text, View, FlatList, Pressable,Platform} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import R from '../../resources/R';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import {useNavigation} from '@react-navigation/native';

const Enrollment = () => {
  const navigation = useNavigation();
  const DATA = [
    {
      id: 1,
      icon: 'account-multiple-plus',
      title: 'New Client',
      screen: ScreensNameEnum.NEW_CLIENT,
      color: R.colors.SECONDARY,
      image: require('../../assets/Images/icon1.png'),
    },
    // {
    //   id: 2,
    //   icon: 'home-account',
    //   title: 'Existing Client',
    //   screen: ScreensNameEnum.EXISTING_CLIENT,
    //   color: R.colors.RED,
    //   image: require('../../assets/Images/icon2.png'),
    // },
    // {
    //   id: 4,
    //   icon: 'gift-open-outline',
    //   title: 'Appreciation',
    //   screen: ScreensNameEnum.APPRECIATION_SCREEN,
    //   color: R.colors.GREEN,
    //   image: require('../../assets/Images/icon4.png'),
    // },
  ];

  const Item = ({item, index}) => (
    // <View style={[styles.cardView,{marginTop :index ===0 ? 0 :20} ]}>
    <Pressable
      onPress={() => navigation.navigate(item.screen)}
      style={[styles.cardView, {marginTop: index === 0 ? 0 : 20}]}>
      <Icon name={item.icon} size={50} color={item?.color} />
      {/* <Image source={item?.image} /> */}
      <Text style={{color: R.colors.PRIMARI_DARK, fontWeight: 'bold'}}>
        {item.title}
      </Text>
    </Pressable>
    // </View>
  );

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={'Enrollment'} />
      <View style={styles.categoryView}>
        <FlatList
          data={DATA}
          renderItem={({item, index}) => <Item item={item} index={index} />}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Enrollment;

const styles = StyleSheet.create({
  categoryView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    textAlignVertical: 'center',
    flex: 1,
    // borderWidth:1
  },
  cardView: {
    backgroundColor: R.colors.PRIMARY_LIGHT,
    borderRadius: 10, // Slightly larger for a smoother look
    padding: 10, // Increased padding for better spacing
    marginVertical: 10, // Adds vertical spacing between cards
    // width: '90%', // Slightly narrower to allow for screen padding
    elevation: 4, // Consistent shadow depth for Android
    shadowOffset: {
      height: 4,
      width: 0,
    },
    shadowOpacity: 0.2, // Reduced opacity for subtler shadow
    shadowRadius: 8, // Increased radius for a softer shadow
    shadowColor: R.colors.DARKGRAY, // Darker shadow color for better contrast
    borderColor: '#ddd', // Lighter border color for a softer look
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 160, // Adjusted height for better content accommodation
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 4}, // Consistent shadow on iOS
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4, // Consistent elevation on Android
      },
    }),
  },
});
