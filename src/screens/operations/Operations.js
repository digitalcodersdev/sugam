import {StyleSheet, Text, View, FlatList, Pressable} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import R from '../../resources/R';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import {useNavigation} from '@react-navigation/native';

const Operations = () => {
  const navigation = useNavigation();
  const DATA = [
    {
      id: 1,
      icon: 'home-group',
      title: 'Create New Center',
      screen: ScreensNameEnum.CREATE_NEW_CENTER_SCREEN,
      color: R.colors.LIGHTGREEN,
      image: require('../../assets/Images/icon2.png'),
    },
    {
      id: 2,
      icon: 'account-multiple-plus',
      title: 'Enrollment',
      screen: ScreensNameEnum.ENROLLMENT_SCREEN,
      color: R.colors.SECONDARY,
      image: require('../../assets/Images/icon1.png'),
    },

    {
      id: 3,
      icon: 'rhombus-split',
      title: 'Collection',
      screen: ScreensNameEnum.COLLECTION_SCREEN, // ScreensNameEnum.APPRECIATION_SCREEN,
      color: R.colors.lightYellow,
      image: require('../../assets/Images/icon4.png'),
    },
    {
      id: 4,
      icon: 'robber',
      title: 'FLO Collection',
      screen: ScreensNameEnum.FLO_COLLECTION_SCREEN, // ScreensNameEnum.APPRECIATION_SCREEN,
      color: R.colors.SLATE_GRAY,
      image: require('../../assets/Images/icon4.png'),
    },
  ];

  const Item = ({item}) => (
    <Pressable
      onPress={() => navigation.navigate(item.screen)}
      style={[
        {justifyContent: 'space-between', alignItems: 'center', borderWidth: 1},
        styles.cardView,
      ]}>
      <Icon name={item.icon} size={40} color={item?.color} />
      <Text style={{color: R.colors.DARKGRAY, fontWeight: '500'}}>
        {item.title}
      </Text>
    </Pressable>
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
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Operations;

const styles = StyleSheet.create({
  categoryView: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardView: {
    flex: 1,
    backgroundColor: R.colors.PRIMARY_LIGHT,
    borderRadius: 5,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    // Add elevation for Android
    elevation: 5,
    // Set shadow properties for iOS
    shadowOffset: {
      height: 5,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowColor: R.colors.LIGHTGRAY,
    // Add dimensions to the container
    height: 150,
    borderColor: '#ccc',
    borderWidth: 0.5,
  },
});
