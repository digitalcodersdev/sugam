import {StyleSheet, Text, View, FlatList, Pressable, Image} from 'react-native';
import React from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import R from '../../resources/R';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {currentUserSelector} from '../../store/slices/user/user.slice';

const Operations = () => {
  const user = useSelector(currentUserSelector);
  console.log('____user____', user);
  const navigation = useNavigation();
  const DesignationID1 = [
    {
      id: 8,
      icon: 'check-circle-outline',
      title: 'BM Approval',
      screen: ScreensNameEnum.BM_OPERATIONS_SCREEN,
      color: R.colors.DARK_ORANGE,
      image: require('../../assets/Images/approve.png'),
    },
    // {
    //   id: 4,
    //   icon: 'cash-multiple',
    //   title: 'FLO Collection',
    //   screen: ScreensNameEnum.FLO_COLLECTION_SCREEN,
    //   color: R.colors.DARK_ORANGE,
    //   image: require('../../assets/Images/collection.png'),
    // },
    // {
    //   id: 5,
    //   icon: 'cash-multiple',
    //   title: 'Arrear Collection',
    //   screen: ScreensNameEnum.FLO_ARREAR_COLLECTION_SCREEN,
    //   color: R.colors.DARK_ORANGE,
    //   image: require('../../assets/Images/arrear.png'),
    // },
    // {
    //   id: 6,
    //   icon: 'check-circle-outline',
    //   title: 'Cash Collection Approval',
    //   screen: ScreensNameEnum.CASH_COLLCETION_APPROVAL_SCREEN,
    //   color: R.colors.DARK_ORANGE,
    //   image: require('../../assets/Images/cash_approval.png'),
    // },
    // {
    //   id: 6,
    //   icon: 'check-circle',
    //   title: 'GRT',
    //   screen: ScreensNameEnum.GRT_SCREEN,
    //   color: R.colors.DARK_ORANGE,
    //   image: require('../../assets/Images/grt.png'),
    // },

    // {
    //   id: 7,
    //   icon: 'check-circle',
    //   title: 'Client Details',
    //   screen: ScreensNameEnum.CLIENT_INFORMATION,
    //   color: R.colors.DARK_ORANGE,
    //   image: require('../../assets/Images/clientDetails.png'),
    // },

    // {
    //   id: 6,
    //   icon: 'check-circle',
    //   title: 'Disbursement',
    //   screen: ScreensNameEnum.DISBURSEMENT_SCREEN,
    //   color: R.colors.DARK_ORANGE,
    //   image: require('../../assets/Images/distributor.png'),
    // },
  ];

  const DesignationID2 = [
    {
      id: 1,
      icon: 'home-city',
      title: 'Create New Center',
      screen: ScreensNameEnum.CREATE_NEW_CENTER_SCREEN,
      color: R.colors.DARK_ORANGE,
      image: require('../../assets/Images/icon2.png'),
    },

    {
      id: 2,
      icon: 'account-group',
      title: 'Enrollment',
      screen: ScreensNameEnum.ENROLLMENT_SCREEN,
      color: R.colors.DARK_ORANGE,
      image: require('../../assets/Images/icon1.png'),
    },
    // {
    //   id: 2,
    //   icon: 'account-group',
    //   title: 'Enrollment',
    //   screen: ScreensNameEnum.ENROLLMENT_SCREEN,
    //   color: R.colors.DARK_ORANGE,
    //   image: require('../../assets/Images/icon1.png'),
    // },
    // {
    //   id: 4,
    //   icon: 'cash-multiple',
    //   title: 'FLO Collection',
    //   screen: ScreensNameEnum.FLO_COLLECTION_SCREEN,
    //   color: R.colors.DARK_ORANGE,
    //   image: require('../../assets/Images/collection.png'),
    // },
    // {
    //   id: 6,
    //   icon: 'check-circle',
    //   title: 'Client Details',
    //   screen: ScreensNameEnum.CLIENT_INFORMATION,
    //   color: R.colors.DARK_ORANGE,
    //   image: require('../../assets/Images/clientDetails.png'),
    // },
  ];
  const DesignationID4 = [
    {
      id: 5,
      icon: 'check-circle-outline',
      title: 'BM Approval',
      screen: ScreensNameEnum.BM_OPERATIONS_SCREEN,
      color: R.colors.DARK_ORANGE,
      image: require('../../assets/Images/approve.png'),
    },
    {
      id: 6,
      icon: 'check-circle',
      title: 'Client Details',
      screen: ScreensNameEnum.CLIENT_INFORMATION,
      color: R.colors.DARK_ORANGE,
      image: require('../../assets/Images/clientDetails.png'),
    },
    {
      id: 6,
      icon: 'check-circle',
      title: 'Disbursement',
      screen: ScreensNameEnum.DISBURSEMENT_SCREEN,
      color: R.colors.DARK_ORANGE,
      image: require('../../assets/Images/distributor.png'),
    },
  ];
  const DesignationID5 = [
    {
      id: 6,
      icon: 'check-circle',
      title: 'AM Approval',
      screen: ScreensNameEnum.PROPOSAL_REVIEW_AM_SCREEN,
      color: R.colors.DARK_ORANGE,
      image: require('../../assets/Images/approve.png'),
    },
    {
      id: 6,
      icon: 'check-circle',
      title: 'Client Details',
      screen: ScreensNameEnum.CLIENT_INFORMATION,
      color: R.colors.DARK_ORANGE,
      image: require('../../assets/Images/clientDetails.png'),
    },
  ];

  const DATA =
    user?.stafftype == 1
      ? DesignationID1
      : user?.stafftype == 4 || user?.stafftype == 13
      ? DesignationID2
      : [];
  //   user?.Designation_ID == 12 ||
  //   user?.Designation_ID == 13 ||
  //   user?.Designation_ID == 14
  // ? DesignationID3
  // : user?.Designation_ID == 4 || user?.Designation_ID == 11
  // ? DesignationID4
  // : user?.Designation_ID == 5
  // ? DesignationID5
  // : [];

  const Item = ({item}) => (
    <Pressable
      onPress={() => navigation.navigate(item.screen)}
      style={styles.itemContainer}>
      {/* <View style={styles.iconWrapper}>
        <Icon name={item.icon} size={30} color={item.color} />
      </View> */}
      <Image source={item.image} style={styles.image} />
      <Text style={styles.titleText}>{item.title}</Text>
      {/* <Icon name={"chevron-right"} size={40} color={item.color} /> */}
    </Pressable>
  );

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={'Operations'} />
      <View style={{flex: 1}}>
        <FlatList
          data={DATA}
          renderItem={({item}) => <Item item={item} />}
          keyExtractor={item => item.id.toString()}
          numColumns={2} // Set number of columns to 2
          columnWrapperStyle={styles.row} // Style for rows
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Operations;

const styles = StyleSheet.create({
  listContainer: {
    padding: 15,
    backgroundColor: '#F5F5F5', // Light background color
    flex: 1,
  },
  row: {
    justifyContent: 'space-between', // Space between items in the row
    marginBottom: 15, // Space between rows
  },
  itemContainer: {
    flex: 1, // Flex to take up equal space in the row
    backgroundColor: '#FFFFFF', // White background for each item
    borderRadius: 12,
    padding: 15,
    margin: 5,
    alignItems: 'center',
    elevation: 3,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#DDDDDD', // Light gray border
    paddingVertical: 25,
  },
  iconWrapper: {
    backgroundColor: '#F0F0F0', // Light gray background for the icon
    borderRadius: 30,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: '#333333', // Dark gray for better contrast
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 10,
  },
});
