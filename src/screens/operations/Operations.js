import {StyleSheet, Text, View, FlatList, Pressable} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import R from '../../resources/R';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import { useNavigation } from '@react-navigation/native';

const Operations = () => {
    const navigation = useNavigation()
  const DATA = [
    {
      id: 1,
      icon: 'account-multiple-plus',
      title: 'Enrollment',
      screen: ScreensNameEnum.ENROLLMENT_SCREEN,
      color: R.colors.SECONDARY ,
      image: require('../../assets/Images/icon1.png'),
    },
    // {
    //   id: 2,
    //   icon: 'party-popper',
    //   title: 'Leaves',
    //   screen: ScreensNameEnum.LEAVE_SCREEN,
    //   color: R.colors.RED,
    //   image: require('../../assets/Images/icon2.png'),
    // },
    // {
    //   id: 3,
    //   icon: 'party-popper',
    //   title: 'Holiday',
    //   screen: ScreensNameEnum.HOLIDAY_SCREEN,
    //   color: '#FFA201',
    //   image: require('../../assets/Images/icon3.png'),
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
  const Item = ({item}) => (
    <View style={[styles.cardView, {width: 130, marginRight: 10}]}>
      <Pressable
        onPress={() => navigation.navigate(item.screen)}
        style={{justifyContent: 'space-between', alignItems: 'center'}}>
        <Icon name={item.icon} size={40} color={item?.color} />
        {/* <Image source={item?.image} /> */}
        <Text style={{color: R.colors.PRIMARI_DARK, fontWeight: 'bold'}}>
          {item.title}
        </Text>
      </Pressable>
    </View>
  );
  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader
        screenName={'Operations'}
        style={{borderBottomWidth: 0.5}}
      />
      <View style={styles.categoryView}>
        <FlatList
          data={DATA}
          renderItem={({item}) => <Item item={item} />}
          keyExtractor={item => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Operations;

const styles = StyleSheet.create({
  categoryView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    textAlignVertical: 'center',
  },
  cardView: {
    backgroundColor: R.colors.PRIMARY_LIGHT,
    borderRadius: 5,
    padding: 5,
    paddingVertical: 10,
    borderColor: R.colors.LIGHTGRAY,
    // Add elevation for Android
    elevation: 5,
    // Set shadow properties for iOS
    shadowOffset: {
      height: 5,
      width: 0, // Adjust as needed
    },
    shadowOpacity: 0.5, // Adjust as needed
    shadowRadius: 5, // Adjust as needed
    shadowColor: R.colors.LIGHTGRAY,
    // Add dimensions to the container
    width: 200, // Adjust as needed
    height: 100, // Adjust as needed
    borderColor: '#ccc',
    borderWidth: 0.5,
  },
});
