import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';
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
  Modal,
  Alert,
} from 'react-native';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import R from '../../resources/R';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import {useSelector} from 'react-redux';
import {currentUserSelector} from '../../store/slices/user/user.slice';
import {AuthContext} from '../../store/contexts/AuthContext';
import Video from 'react-native-video';
import ConfirmationModal from '../../library/modals/ConfirmationModal';

const DATA = [
  {
    id: '1',
    icon: 'account-group-outline',
    title: 'Operations',
    screen: ScreensNameEnum.OPERATIONS_SCREEN,
    color: R.colors.lightYellow,
    image: require('../../assets/Images/icon1.png'),
  },
  // {
  //   id: '2',
  //   icon: 'badge-account',
  //   title: 'Admin',
  //   screen: ScreensNameEnum.OPERATIONS_SCREEN,
  //   color: R.colors.RED,
  //   image: require('../../assets/Images/icon2.png'),
  // },
  {
    id: '3',
    icon: 'account-supervisor',
    title: 'Employee Directory',
    screen: ScreensNameEnum.EMPLOYEE_DIRECTORY_SCREEN,
    color: '#FFA201',
    image: require('../../assets/Images/icon3.png'),
  },
  // {
  //   id: '4',
  //   icon: 'calendar-month',
  //   title: 'Holiday',
  //   screen: ScreensNameEnum.OPERATIONS_SCREEN,
  //   color: R.colors.GREEN,
  //   image: require('../../assets/Images/icon4.png'),
  // },
  // {
  //   id: '5',
  //   icon: 'card-account-phone-outline',
  //   title: 'Help Desk',
  //   screen: ScreensNameEnum.HELP_DESK_SCREEN,
  //   color: R.colors.SLATE_GRAY,
  //   image: require('../../assets/Images/icon4.png'),
  // },
  // {
  //   id: '6',
  //   icon: 'handshake-outline',
  //   title: 'Grievance',
  //   screen: ScreensNameEnum.GRIEVANCE_SCREEN,
  //   color: R.colors.SECONDARY,
  //   image: require('../../assets/Images/icon4.png'),
  // },
];

const HomeScreen = ({navigation}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [canCloseModal, setCanCloseModal] = useState(false);
  const authContext = useContext(AuthContext);
  const user = useSelector(currentUserSelector);

  const handleLogout = useCallback(async () => {
    try {
      await authContext.signOut();
    } catch (error) {
      console.log(error);
    }
  }, [authContext]);

  useEffect(() => {
    // Prevent closing the modal for 20 seconds
    const timer = setTimeout(() => {
      setCanCloseModal(true);
    }, 20000);

    return () => clearTimeout(timer); // Clean up the timer
  }, []);

  const renderItem = useCallback(
    ({item}) => <Item item={item} navigation={navigation} />,
    [navigation],
  );

  const keyExtractor = useCallback(item => item.id.toString(), []);

  const handleConfirm = data => {
    if (data == 'confirm') {
      handleLogout();
    }
  };

  return (
    <ScreenWrapper header={false}>
      <StatusBar
        backgroundColor={R.colors.SLATE_GRAY}
        barStyle={'light-content'}
      />
      {/* <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          if (canCloseModal) {
            setModalVisible(false);
          } else {
            Alert.alert(
              'Please wait',
              'You can close the video after 20 seconds.',
            );
          }
        }}>
        <View style={styles.modalContainer}>
          {canCloseModal && (
            <Icon
              name="close"
              size={25}
              color={R.colors.PRIMARY_LIGHT}
              style={{
                backgroundColor: R.colors.DARK_BLUE,
                borderRadius: 30,
                padding: 20,
                position: 'absolute',
                right: 5,
                top: 250,
                zIndex: 999,
              }}
              onPress={() => setModalVisible(false)}
            />
          )}
          <Video
            source={require('../../assets/videos/warning.mp4')} // Path to your video file
            style={styles.video}
            controls={false}
            resizeMode="contain"
            paused={false}
            repeat={false}
            onEnd={() => {
              if (canCloseModal) {
                setModalVisible(false);
              }
            }}
          />
          {canCloseModal && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal> */}
      <ImageBackground
        source={require('../../assets/Images/mainbg.png')}
        resizeMode="stretch"
        style={styles.container}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={
                user?.photo
                  ? {uri: user.photo}
                  : require('../../assets/Images/activeProfile.jpeg')
              }
              style={styles.userImage}
            />
            <View>
              <Text style={styles.userName}>
                {user?.staffname?.trim() || 'N/A'}
              </Text>
              <Text style={styles.userType}>
                ({user?.stafftypedetail?.trim() || 'N/A'})
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Icon name="power" size={40} color={R.colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.categoryView}>
          <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={3}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.contentContainer}
            ItemSeparatorComponent={Separator}
            initialNumToRender={6}
          />
        </View>
      </ImageBackground>
      <ConfirmationModal
        isVisible={isModalVisible}
        onModalClose={setModalVisible}
        onConfirm={handleConfirm}
        confirmationText="are you sure you want to logout?"
      />
    </ScreenWrapper>
  );
};

const Item = React.memo(({item, navigation}) => (
  <View style={styles.cardView}>
    <Pressable
      onPress={() => navigation.navigate(item.screen)}
      style={styles.pressable}>
      <Icon name={item.icon} size={40} color={item.color} />
      <Text style={styles.cardTitle}>{item.title}</Text>
    </Pressable>
  </View>
));

const Separator = React.memo(() => <View style={styles.separator} />);

export default HomeScreen;

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
    textTransform: 'capitalize',
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
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '90%',
    height: '100%',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: R.colors.PRIMARY,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

// import {
//   View,
//   Text,
//   StyleSheet,
//   StatusBar,
//   ImageBackground,
//   Image,
//   Pressable,
//   FlatList,
//   TouchableOpacity,
// } from 'react-native';
// import React, {useContext, useCallback, useMemo} from 'react';
// import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
// import R from '../../resources/R';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import ScreensNameEnum from '../../constants/ScreensNameEnum';
// import {useSelector} from 'react-redux';
// import {currentUserSelector} from '../../store/slices/user/user.slice';
// import {AuthContext} from '../../store/contexts/AuthContext';
// import Video from 'react-native-video';

// // Static data for rendering options
// const DATA = [
//   {
//     id: '1',
//     icon: 'account-group-outline',
//     title: 'Operations',
//     screen: ScreensNameEnum.OPERATIONS_SCREEN,
//     color: R.colors.lightYellow,
//     image: require('../../assets/Images/icon1.png'),
//   },
//   {
//     id: '2',
//     icon: 'badge-account',
//     title: 'Admin',
//     screen: ScreensNameEnum.OPERATIONS_SCREEN,
//     color: R.colors.RED,
//     image: require('../../assets/Images/icon2.png'),
//   },
//   {
//     id: '3',
//     icon: 'account-supervisor',
//     title: 'Employee Directory',
//     screen: ScreensNameEnum.EMPLOYEE_DIRECTORY_SCREEN,
//     color: '#FFA201',
//     image: require('../../assets/Images/icon3.png'),
//   },
//   {
//     id: '4',
//     icon: 'calendar-month',
//     title: 'Holiday',
//     screen: ScreensNameEnum.OPERATIONS_SCREEN,
//     color: R.colors.GREEN,
//     image: require('../../assets/Images/icon4.png'),
//   },
//   {
//     id: '5',
//     icon: 'card-account-phone-outline',
//     title: 'Help Desk',
//     screen: ScreensNameEnum.HELP_DESK_SCREEN,
//     color: R.colors.SLATE_GRAY,
//     image: require('../../assets/Images/icon4.png'),
//   },
//   {
//     id: '6',
//     icon: 'handshake-outline',
//     title: 'Grievance',
//     screen: ScreensNameEnum.GRIEVANCE_SCREEN,
//     color: R.colors.SECONDARY,
//     image: require('../../assets/Images/icon4.png'),
//   },
// ];

// const HomeScreen = ({navigation}) => {
//   const authContext = useContext(AuthContext);
//   const user = useSelector(currentUserSelector);

//   const handleLogout = useCallback(async () => {
//     try {
//       await authContext.signOut();
//     } catch (error) {
//       console.log(error);
//     }
//   }, [authContext]);

//   // Memoized item renderer to avoid unnecessary re-renders
//   const renderItem = useCallback(
//     ({item}) => <Item item={item} navigation={navigation} />,
//     [navigation],
//   );

//   // Memoized key extractor for flatlist
//   const keyExtractor = useCallback(item => item.id.toString(), []);

//   return (
//     <ScreenWrapper header={false}>
//       <StatusBar
//         backgroundColor={R.colors.SLATE_GRAY}
//         barStyle={'light-content'}
//       />
//       <ImageBackground
//         source={require('../../assets/Images/mainbg.png')}
//         resizeMode="stretch"
//         style={styles.container}>
//         <View style={styles.header}>
//           <View style={styles.userInfo}>
//             <Image
//               source={
//                 user?.photo
//                   ? {uri: user.photo}
//                   : require('../../assets/Images/activeProfile.jpeg')
//               }
//               style={styles.userImage}
//             />
//             <View>
//               <Text style={styles.userName}>
//                 {user?.staffname?.trim() || 'N/A'}
//               </Text>
//               <Text style={styles.userType}>
//                 ({user?.stafftypedetail?.trim() || 'N/A'})
//               </Text>
//             </View>
//           </View>
//           <TouchableOpacity onPress={handleLogout}>
//             <Icon name="power" size={40} color={R.colors.primary} />
//           </TouchableOpacity>
//         </View>
//         {/* <DynamicQRCode /> */}
//         <Video
//           source={require('../../assets/videos/warning.mp4')} // Path to your video file
//           style={styles.video}
//           controls={true} // Show video controls
//           resizeMode="contain" // Options: 'cover', 'contain', 'stretch'
//           paused={false} // Auto-play video
//           repeat={false} // Loop the video
//         />
//         <View style={styles.categoryView}>
//           <FlatList
//             data={DATA}
//             renderItem={renderItem}
//             keyExtractor={keyExtractor}
//             numColumns={3}
//             columnWrapperStyle={styles.columnWrapper}
//             contentContainerStyle={styles.contentContainer}
//             ItemSeparatorComponent={Separator}
//             initialNumToRender={6} // Adjust based on screen size
//           />
//         </View>
//       </ImageBackground>
//     </ScreenWrapper>
//   );
// };

// // Separated memoized component to prevent unnecessary re-renders
// const Item = React.memo(({item, navigation}) => (
//   <View style={styles.cardView}>
//     <Pressable
//       onPress={() => navigation.navigate(item.screen)}
//       style={styles.pressable}>
//       <Icon name={item.icon} size={40} color={item.color} />
//       <Text style={styles.cardTitle}>{item.title}</Text>
//     </Pressable>
//   </View>
// ));

// // Separated memoized component for separator
// const Separator = React.memo(() => <View style={styles.separator} />);

// export default HomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     borderBottomWidth: 0.5,
//     paddingBottom: 10,
//     borderColor: R.colors.LIGHTGRAY,
//     marginTop: 10,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   userInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   userImage: {
//     height: 50,
//     width: 50,
//     borderRadius: 30,
//     marginLeft: 20,
//   },
//   userName: {
//     color: R.colors.primary,
//     fontWeight: 'bold',
//     fontSize: R.fontSize.XL,
//     paddingHorizontal: 10,
//     textTransform: 'capitalize',
//   },
//   userType: {
//     color: R.colors.DARKGRAY,
//     fontSize: R.fontSize.L,
//     textTransform: 'capitalize',
//   },
//   categoryView: {
//     flex: 1,
//     padding: 10,
//   },
//   columnWrapper: {
//     justifyContent: 'space-between',
//   },
//   contentContainer: {
//     paddingBottom: 10,
//   },
//   separator: {
//     height: 10,
//   },
//   cardView: {
//     flex: 1,
//     margin: 5,
//     backgroundColor: R.colors.PRIMARY_LIGHT,
//     borderRadius: 5,
//     padding: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 1,
//     shadowOffset: {
//       height: 5,
//       width: 0,
//     },
//     shadowOpacity: 0.5,
//     shadowRadius: 5,
//     shadowColor: R.colors.LIGHTGRAY,
//     borderColor: '#ccc',
//     borderWidth: 0.5,
//     height: 120,
//   },
//   pressable: {
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   cardTitle: {
//     color: R.colors.PRIMARI_DARK,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   video: {
//     width: '100%',
//     height: 300, // Adjust based on your layout
//   },
// });
