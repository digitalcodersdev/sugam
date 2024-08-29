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
} from 'react-native';
import React, {useState, useContext} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import R from '../../resources/R';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import {useDispatch, useSelector} from 'react-redux';
import {currentUserSelector} from '../../store/slices/user/user.slice';
import {AuthContext} from '../../store/contexts/AuthContext';

const DATA = [
  {
    id: 1,
    icon: 'account-group-outline',
    title: 'Operations',
    screen: ScreensNameEnum.OPERATIONS_SCREEN,
    color: R.colors.lightYellow,
    image: require('../../assets/Images/icon1.png'),
  },
  {
    id: 2,
    icon: 'badge-account',
    title: 'Admin',
    screen: ScreensNameEnum.OPERATIONS_SCREEN,
    color: R.colors.RED,
    image: require('../../assets/Images/icon2.png'),
  },
  {
    id: 3,
    icon: 'account-supervisor',
    title: 'Employee Directory',
    screen: ScreensNameEnum.EMPLOYEE_DIRECTORY_SCREEN,
    color: '#FFA201',
    image: require('../../assets/Images/icon3.png'),
  },
  {
    id: 4,
    icon: 'calendar-month',
    title: 'Holiday',
    screen: ScreensNameEnum.OPERATIONS_SCREEN,
    color: R.colors.GREEN,
    image: require('../../assets/Images/icon4.png'),
  },
  {
    id: 5,
    icon: 'card-account-phone-outline',
    title: 'Help Desk',
    screen: ScreensNameEnum.HELP_DESK_SCREEN, // ScreensNameEnum.APPRECIATION_SCREEN,
    color: R.colors.SLATE_GRAY,
    image: require('../../assets/Images/icon4.png'),
  },
  {
    id: 6,
    icon: 'handshake-outline',
    title: 'Grievance',
    screen: ScreensNameEnum.GRIEVANCE_SCREEN, // ScreensNameEnum.APPRECIATION_SCREEN,
    color: R.colors.SECONDARY,
    image: require('../../assets/Images/icon4.png'),
  },
];

const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [modalVis, setModalVis] = useState(false);
  const user = useSelector(currentUserSelector);

  const handleLogout = async () => {
    try {
      authContext.signOut();
    } catch (error) {
      console.log(error);
    }
  };

  const Item = ({item}) => (
    <View style={styles.cardView}>
      <Pressable
        onPress={() => navigation.navigate(item.screen)}
        style={styles.pressable}>
        <Icon name={item.icon} size={40} color={item.color} />
        <Text style={styles.cardTitle}>{item.title}</Text>
      </Pressable>
    </View>
  );

  return (
    <ScreenWrapper header={false}>
      <StatusBar
        backgroundColor={R.colors.SLATE_GRAY}
        barStyle={'light-content'}
      />
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
          <TouchableOpacity onPress={handleLogout}>
            <Icon name="power" size={40} color={R.colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.categoryView}>
          <FlatList
            data={DATA}
            renderItem={({item}) => <Item item={item} />}
            keyExtractor={item => item.id}
            numColumns={3}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.contentContainer}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </ImageBackground>
    </ScreenWrapper>
  );
};

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
    textTransform:"capitalize"
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
});
