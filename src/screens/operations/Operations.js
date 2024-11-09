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
  const navigation = useNavigation();
  const DesignationID1 = [
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
    {
      id: 4,
      icon: 'cash-multiple',
      title: 'FLO Collection',
      screen: ScreensNameEnum.FLO_COLLECTION_SCREEN,
      color: R.colors.DARK_ORANGE,
      image: require('../../assets/Images/collection.png'),
    },
    // {
    //   id: 5,
    //   icon: 'check-circle-outline',
    //   title: 'BM Approval',
    //   screen: ScreensNameEnum.PROPOSAL_REVIEW_SCREEN,
    //   screen: ScreensNameEnum.BM_OPERATIONS_SCREEN,
    //   color: R.colors.DARK_ORANGE,
    //   image: require('../../assets/Images/approve.png'),
    // },
    // {
    //   id: 6,
    //   icon: 'check-circle',
    //   title: 'AM Approval',
    //   screen: ScreensNameEnum.PROPOSAL_REVIEW_AM_SCREEN,
    //   color: R.colors.DARK_ORANGE,
    //   image: require('../../assets/Images/approve.png'),
    // },
    {
      id: 6,
      icon: 'check-circle',
      title: 'Client Details',
      screen: ScreensNameEnum.CLIENT_INFORMATION,
      color: R.colors.DARK_ORANGE,
      image: require('../../assets/Images/clientDetails.png'),
    },
    // {
    //   id: 6,
    //   icon: 'check-circle',
    //   title: 'Disbursement',
    //   screen: ScreensNameEnum.DISBURSEMENT_SCREEN,
    //   color: R.colors.DARK_ORANGE,
    //   image: require('../../assets/Images/distributor.png'),
    // },
  ];

  const DesignationID3 = [
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
    {
      id: 4,
      icon: 'cash-multiple',
      title: 'FLO Collection',
      screen: ScreensNameEnum.FLO_COLLECTION_SCREEN,
      color: R.colors.DARK_ORANGE,
      image: require('../../assets/Images/collection.png'),
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
    user?.Designation_ID == 1
      ? DesignationID1
      : user?.Designation_ID == 3 ||
        user?.Designation_ID == 12 ||
        user?.Designation_ID == 13 ||
        user?.Designation_ID == 14
      ? DesignationID3
      : user?.Designation_ID == 4 || user?.Designation_ID == 11
      ? DesignationID4
      : user?.Designation_ID == 5
      ? DesignationID5
      : [];

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
          data={DesignationID1}
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

// import {StyleSheet, Text, View, FlatList, Pressable} from 'react-native';
// import React from 'react';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
// import ScreensNameEnum from '../../constants/ScreensNameEnum';
// import R from '../../resources/R';
// import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
// import {useNavigation} from '@react-navigation/native';

// const Operations = () => {
//   const navigation = useNavigation();
//   const DATA = [
//     {
//       id: 1,
//       icon: 'home-group',
//       title: 'Create New Center',
//       screen: ScreensNameEnum.CREATE_NEW_CENTER_SCREEN,
//       color: R.colors.LIGHTGREEN,
//       image: require('../../assets/Images/icon2.png'),
//     },
//     {
//       id: 2,
//       icon: 'account-multiple-plus',
//       title: 'Enrollment',
//       // screen: ScreensNameEnum.BANK_DETAILS_SCREEN,
//       screen: ScreensNameEnum.ENROLLMENT_SCREEN,
//       color: R.colors.SECONDARY,
//       image: require('../../assets/Images/icon1.png'),
//     },

//     // {
//     //   id: 3,
//     //   icon: 'rhombus-split',
//     //   title: 'Collection',
//     //   screen: ScreensNameEnum.COLLECTION_SCREEN, // ScreensNameEnum.APPRECIATION_SCREEN,
//     //   color: R.colors.lightYellow,
//     //   image: require('../../assets/Images/icon4.png'),
//     // },
//     {
//       id: 4,
//       icon: 'robber',
//       title: 'FLO Collection',
//       screen: ScreensNameEnum.FLO_COLLECTION_SCREEN, // ScreensNameEnum.APPRECIATION_SCREEN,
//       color: R.colors.SLATE_GRAY,
//       image: require('../../assets/Images/icon4.png'),
//     },
//   ];

//   const Item = ({item}) => (
//     <Pressable
//       onPress={() => navigation.navigate(item.screen)}
//       style={[
//         {justifyContent: 'space-between', alignItems: 'center', borderWidth: 1},
//         styles.cardView,
//       ]}>
//       <Icon name={item.icon} size={40} color={item?.color} />
//       <Text style={{color: R.colors.DARKGRAY, fontWeight: '500'}}>
//         {item.title}
//       </Text>
//     </Pressable>
//   );

//   return (
//     <ScreenWrapper header={false}>
//       <ChildScreensHeader
//         screenName={'Operations'}
//         style={{borderBottomWidth: 0.5}}
//       />
//       <View style={styles.categoryView}>
//         <FlatList
//           data={DATA}
//           renderItem={({item}) => <Item item={item} />}
//           keyExtractor={item => item.id}
//           numColumns={2}
//           columnWrapperStyle={styles.row}
//         />
//       </View>
//     </ScreenWrapper>
//   );
// };

// export default Operations;

// const styles = StyleSheet.create({
//   categoryView: {
//     flex: 1,
//     padding: 10,
//     justifyContent: 'center',
//   },
//   row: {
//     flex: 1,
//     justifyContent: 'space-between',
//   },
//   cardView: {
//     flex: 1,
//     backgroundColor: R.colors.PRIMARY_LIGHT,
//     borderRadius: 5,
//     padding: 10,
//     margin: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//     // Add elevation for Android
//     elevation: 5,
//     // Set shadow properties for iOS
//     shadowOffset: {
//       height: 5,
//       width: 0,
//     },
//     shadowOpacity: 0.5,
//     shadowRadius: 5,
//     shadowColor: R.colors.LIGHTGRAY,
//     // Add dimensions to the container
//     height: 150,
//     borderColor: '#ccc',
//     borderWidth: 0.5,
//   },
// });
