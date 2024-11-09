import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import R from '../../resources/R';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {getCentres} from '../../store/actions/userActions';
import {centresSelector} from '../../store/slices/user/user.slice';
import Loader from '../../library/commons/Loader';

const NewClient = () => {
  const dispatch = useDispatch();
  const centre = useSelector(centresSelector);
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
console.log(centre);
  useEffect(() => {
    fetchCentresData();
  }, []);

  useEffect(() => {
    if (centre?.length >= 1) {
      setData(centre);
    }
  }, [centre]);

  useEffect(() => {
    if (search?.length >= 1) {
      const res = data?.filter(
        item =>
          item?.centreid == search ||
          item?.cename?.toUpperCase().includes(search?.toUpperCase()),
      );
      setData(res);
    } else {
      setData(centre);
    }
  }, [search]);

  const fetchCentresData = async () => {
    setLoading(true);
    await dispatch(getCentres());
    setLoading(false);
  };

  const Item = ({item, index}) => (
    <Pressable
      onPress={() =>
        navigation.navigate(ScreensNameEnum.CLIENT_PHONE_VERIFY, {
          center: item,
        })
      }
      style={[styles.cardView, {marginTop: index === 0 ? 0 : 20}]}>
      <View style={styles.view}>
        <Text style={styles.label}>Centre No :</Text>
        <Text style={styles.value}>{item?.centreid}</Text>
      </View>
      <View style={styles.view}>
        <Text style={styles.label}>Center Name:</Text>
        <Text style={styles.value}>{item?.cename}</Text>
      </View>
      <View style={styles.view}>
        <Text style={styles.label}>Center Place:</Text>
        <Text style={styles.value}>{item?.CenterPlace}</Text>
      </View>
      <View style={styles.view}>
        <Text style={styles.label}>Contact Number :</Text>
        <Text style={styles.value}>{item?.mobile}</Text>
      </View>
      <View style={styles.view}>
        <Text style={styles.label}>Address :</Text>
        <Text style={styles.value}>
          {item?.ceaddress?.length >= 60
            ? `${item?.ceaddress?.slice(0, 60)}... `
            : item?.ceaddress}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={'New Client Enrollment'} />
      <View style={styles.container}>
        <View style={styles.searchView}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholder="Search by Centre ID or Name"
            placeholderTextColor={R.colors.DARKGRAY}
          />
          <Icon
            name="magnify"
            color={R.colors.primary}
            style={styles.searchIcon}
            size={30}
          />
        </View>
        {data?.length ? (
          <FlatList
            data={data}
            renderItem={({item, index}) => <Item item={item} index={index} />}
            keyExtractor={item => item.centreid.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
          />
        ) : (
          <Text style={styles.noDataFound}>No Data Found</Text>
        )}
      </View>
      <Loader loading={loading} message={'Loading data...'} />
    </ScreenWrapper>
  );
};

export default NewClient;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: R.colors.white,
  },
  searchView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: R.colors.DARKGRAY,
    paddingHorizontal: 10,
    color: R.colors.DARKGRAY,
    height: 40,
  },
  searchIcon: {
    marginLeft: 10,
    position: 'absolute',
    right: 10,
  },
  cardView: {
    backgroundColor: R.colors.PRIMARY_LIGHT,
    borderRadius: 4, // Slightly larger for a smoother look
    padding: 15, // Increased padding for better spacing
    marginVertical: 12, // Adds vertical spacing between cards
    borderColor: R.colors.BLUE , // Lighter border color for contrast
    borderWidth: .5, // Slightly wider border for better visibility
    elevation: 5, // Increased elevation for a clearer shadow
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25, // Higher opacity for more visible shadow
    shadowRadius: 5, // Increased radius for a more spread-out shadow
    shadowColor: 'rgba(0, 0, 0, 0.15)', // Softer shadow color for better visibility
    alignItems: 'flex-start', // Left-align content for readability
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: R.colors.PRIMARI_DARK,
    flex: 1.5,
  },
  value: {
    fontSize: 14,
    color: R.colors.PRIMARI_DARK,
    flexWrap: 'wrap',
    flex:2.5
  },
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: R.colors.LIGHTGRAY,
    flexWrap:"wrap",
    borderBottomWidth:1,
    padding:3
  },
  flatListContent: {
    paddingBottom: 20,
  },
  noDataFound: {
    fontSize: 18,
    textAlign: 'center',
    color: R.colors.DARKGRAY,
  },
});
