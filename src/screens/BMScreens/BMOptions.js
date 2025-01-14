import {StyleSheet, Text, View, FlatList, Pressable, Image} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import R from '../../resources/R';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import {useNavigation} from '@react-navigation/native';

const BMOptions = () => {
  const navigation = useNavigation();
  const DATA = [
    {
      id: 1,
      icon: 'list-status',
      title: 'Proposal Review',
      screen: ScreensNameEnum.PROPOSAL_REVIEW_SCREEN,
      color: '#4CAF50', 
      image: require('../../assets/Images/icon2.png'),
    },
    {
      id: 2,
      icon: 'currency-inr',
      title: 'Foreclose Approval',
      screen: ScreensNameEnum.FORECLOSE_SCREEN,
      color: '#FF9800', 
      image: require('../../assets/Images/icon1.png'),
    },
    {
      id: 3,
      icon: 'currency-inr',
      title: 'Partial Approval',
      screen: ScreensNameEnum.PART_PAYMENT_APPROVAL_SCREEN,
      color: '#FF9800', 
      image: require('../../assets/Images/appr.jpg'),
    },
  ];

  const Item = ({item, index}) => (
    <Pressable
      onPress={() => navigation.navigate(item.screen)}
      style={styles.cardView}>
      {item.id <= 2 ? (
        <Icon name={item.icon} size={40} color={item.color} />
      ) : (
        <Image
          source={item?.image}
          resizeMode="contain"
          style={{width: 50, height: 50}}
        />
      )}
      <Text style={styles.titleText}>{item.title}</Text>
    </Pressable>
  );

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={'Operations'} />
      <View style={styles.categoryView}>
        <FlatList
          data={DATA}
          renderItem={({item, index}) => <Item item={item} index={index} />}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      </View>
    </ScreenWrapper>
  );
};

export default BMOptions;

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
    backgroundColor: '#FFFFFF', // Changed to white for a cleaner card appearance
    borderRadius: 8,
    padding: 15,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Consistent shadow for Android
    shadowColor: '#000', // Darker shadow for contrast on iOS
    shadowOffset: {
      height: 5,
      width: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    height: 140, // Adjusted height for better card aspect ratio
    borderColor: '#ddd', // Light gray border for subtle separation
    borderWidth: 0.8,
  },
  titleText: {
    color: '#333333', // Darker gray for improved readability
    fontWeight: '600',
    fontSize: 16,
    marginTop: 10,
  },
});
