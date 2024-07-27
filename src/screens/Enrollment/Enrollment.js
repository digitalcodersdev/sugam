import {StyleSheet, Text, View, FlatList, Pressable} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import R from '../../resources/R';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import { useNavigation } from '@react-navigation/native';

const Enrollment = () => {
  const navigation = useNavigation()
  const DATA = [
    {
      id: 1,
      icon: 'account-multiple-plus',
      title: 'New Client',
      screen: ScreensNameEnum.NEW_CLIENT,
      color: R.colors.SECONDARY ,
      image: require('../../assets/Images/icon1.png'),
    },
    {
      id: 2,
      icon: 'home-account',
      title: 'Existing Client',
      screen: ScreensNameEnum.EXISTING_CLIENT,
      color: R.colors.RED,
      image: require('../../assets/Images/icon2.png'),
    },
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

  const Item = ({item,index}) => (
    <View style={[styles.cardView,{marginTop :index ===0 ? 0 :20} ]}>
      <Pressable
        onPress={() => navigation.navigate(item.screen)}
        style={{justifyContent: 'space-between', alignItems: 'center'}}>
        <Icon name={item.icon} size={50} color={item?.color} />
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
        screenName={'Enrollment'}
      />
      <View style={styles.categoryView}>
        <FlatList
          data={DATA}
          renderItem={({item,index}) => <Item item={item} index={index}/>}
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
    flex:1,
    // borderWidth:1
  },
  cardView: {
    backgroundColor: R.colors.PRIMARY_LIGHT,
    borderRadius: 5,
    padding: 5,
    paddingVertical: 10,
    borderColor: R.colors.LIGHTGRAY,
    width:"100%",
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
    // width: 200, // Adjust as needed
    height: 150, // Adjust as needed
    borderColor: '#ccc',
    borderWidth: 0.5,
    alignItems:"center",
    justifyContent:"center"
  },
});
