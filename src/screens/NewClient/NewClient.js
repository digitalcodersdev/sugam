import {StyleSheet, Text, View, FlatList, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import R from '../../resources/R';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {getCentres} from '../../store/actions/userActions';
import {centresSelector} from '../../store/slices/user/user.slice';

const NewClient = () => {
  const dispatch = useDispatch();
  const centre = useSelector(centresSelector);
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
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
          item?.centreid?.includes(search?.toUpperCase()) ||
          item?.cename?.toUpperCase().includes(search?.toUpperCase()),
      );
      if (res?.length >= 1) {
        setData(res);
      }
    }
  }, [search]);

  const fetchCentresData = async () => {
    await dispatch(getCentres());
  };

  const Item = ({item, index}) => (
    <View style={[styles.cardView, {marginTop: index === 0 ? 0 : 20}]}>
      <Pressable
        onPress={() =>
          navigation.navigate(ScreensNameEnum.CHECK_CREDIT_BUREAU_SCREEN)
        }
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={styles.view}>
          <Text style={styles.label}>Center Name :</Text>
          <Text style={styles.value}>{item?.cename}</Text>
        </View>
        <View style={styles.view}>
          <Text style={styles.label}>Contact Number :</Text>
          <Text style={styles.value}>{item?.mobile}</Text>
        </View>
        <View style={styles.view}>
          <Text style={styles.label}>Address :</Text>
          <Text style={styles.value}>{item?.ceaddress}</Text>
        </View>
        <View style={styles.view}>
          <Text style={styles.label}>Centre No :</Text>
          <Text style={styles.value}>{item?.centreid}</Text>
        </View>
      </Pressable>
    </View>
  );

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={'New Client Enrollment'} />
      <View style={styles.categoryView}>
        <View style={styles.searchView}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholder="Type here to search..."
          />
          <Icon
            name="magnify"
            color={R.colors.primary}
            style={{position: 'absolute', right: 10, top: 5}}
            size={40}
          />
        </View>
        <FlatList
          data={data}
          renderItem={({item, index}) => <Item item={item} index={index} />}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ScreenWrapper>
  );
};

export default NewClient;

const styles = StyleSheet.create({
  categoryView: {
    justifyContent: 'space-between',
    padding: 10,
    textAlignVertical: 'center',
    flex: 1,
    backgroundColor: 'white',
    // borderWidth:1
  },
  cardView: {
    backgroundColor: R.colors.PRIMARY_LIGHT,
    borderRadius: 5,
    padding: 5,
    paddingVertical: 10,
    width: '100%',
    borderColor: '#ccc', // Updated border color for consistency
    borderWidth: 0.5,
    height: 150, // Adjust as needed
    alignItems: 'center',
    justifyContent: 'center',

    // Shadow properties for iOS
    shadowOffset: {height: 1, width: 0}, // Adjust as needed
    shadowOpacity: 0.5, // Adjust as needed
    shadowRadius: 5, // Adjust as needed
    shadowColor: R.colors.LIGHTGRAY,

    // Elevation for Android
    elevation: 10,
  },
  label: {color: R.colors.black, flex: 1.5, alignItems: 'center'},
  value: {
    color: R.colors.PRIMARI_DARK,
    fontWeight: '400',
    flex: 2.5,
    flexWrap: 'wrap',
  },
  view: {flexDirection: 'row', margin: 5, alignItems: 'center'},
  searchView: {},
  searchInput: {
    borderWidth: 0.5,
    borderRadius: 12,
    marginBottom: 10,
    borderColor: R.colors.DARKGRAY,
    padding: 10,
  },
});
