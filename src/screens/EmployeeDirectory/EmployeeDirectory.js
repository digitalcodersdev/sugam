import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
  TextInput,
  useColorScheme,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import UserApi from '../../datalib/services/user.api';
import LoaderAnimation from '../../library/commons/LoaderAnimation';
import R from '../../resources/R';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const USER_IMAGE = require('../../assets/Images/activeProfile.jpeg');
import {Picker} from '@react-native-picker/picker';

const EmployeeDirectory = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actualData, setActualData] = useState([]);
  const [search, setSearch] = useState('');
  const [pickerData, setPickerData] = useState([]);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    fecthEmployeeDirectory();
    fetchUserTypes();
  }, []);
  console.log(pickerData);
  const fecthEmployeeDirectory = async () => {
    try {
      setLoading(true);
      const res = await new UserApi().fetchEmployeeDirectory();
      if (res) {
        setData(res?.data);
        setActualData(res?.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserTypes = async () => {
    try {
      setLoading(true);
      const res = await new UserApi().fetchEmployeeTypes();
      if (res) {
        setPickerData(res?.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search?.length >= 1) {
      const res = actualData?.filter(
        item =>
          item?.staffname?.toUpperCase().includes(search?.toUpperCase()) ||
          item?.staffid?.toString()?.startsWith(search),
      );
      setData(res);
    } else {
      setData(actualData);
    }
  }, [search]);

  const EmployeeItem = ({item, index}) => {
    console.log(item);
    return (
      <View style={styles.card}>
        <View style={styles.firstCardView}>
          <Image
            source={
              !item?.photo || item?.photo === 1
                ? USER_IMAGE
                : {uri: item?.photo}
            }
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.staffid}>{item?.staffid}</Text>
        </View>
        <View style={styles.secondCardView}>
          <Text style={styles.name}>{item?.staffname?.trim()}</Text>
          <Text style={[styles.name, {color: R.colors.SLATE_GRAY}]}>
            {item?.stafftypedetail?.trim()}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '50%',
              alignSelf: 'flex-end',
              height: 40,
            }}>
            <Text
              style={[
                styles.name,
                {
                  textAlign: 'right',
                  alignItems: 'center',
                  textAlignVertical: 'center',
                  height: 40,
                },
              ]}
              onPress={() => Linking.openURL(`tel:${item?.contact}`)}>
              {`${item?.contact?.trim()} `}
            </Text>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 40,
                fontWeight: '500',
              }}
              onPress={() => Linking.openURL(`tel:${item?.contact}`)}>
              <Icon name="phone" size={20} color={R.colors.GREEN} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader
        screenName={ScreensNameEnum.EMPLOYEE_DIRECTORY_SCREEN}
      />
      <View style={styles.container}>
        <View style={styles.searchView}>
          <View>
            <TextInput
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
              placeholder="Type here to search..."
              placeholderTextColor={R.colors.DARKGRAY}
            />
            <Icon
              name="magnify"
              color={R.colors.primary}
              style={{position: 'absolute', right: 10, top: 5}}
              size={40}
            />
          </View>
          {/* <Picker
            selectedValue={userType}
            onValueChange={(itemValue, itemIndex) => setUserType(itemValue)}
            mode="dropdown"
            style={[
              styles.picker,
              {color: isDarkMode ? R.colors.PRIMARI_DARK : '#000000'},
            ]}
            dropdownIconColor={R.colors.DARKGRAY}>
            {userType === null && (
              <Picker.Item
                label="Select to filter"
                value={null}
                enabled={false}
              />
            )}
            {pickerData?.length >= 1 &&
              pickerData?.map(item => {
                console.log(item);
                return (
                  <Picker.Item
                    label={item?.stafftypedetail}
                    value={item?.stafftypedetail}
                  />
                );
              })}
          </Picker> */}
        </View>
        {data?.length >= 1 && (
          <FlatList
            data={data}
            keyExtractor={item => item?.staffid}
            renderItem={({item, index}) => (
              <EmployeeItem item={item} index={index} />
            )}
            initialNumToRender={10}
          />
        )}
        <LoaderAnimation loading={loading} message={'Fetching Employee Data'} />
      </View>
    </ScreenWrapper>
  );
};

export default EmployeeDirectory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    // borderColor: '#ccc',
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: R.colors.SLATE_GRAY,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  staffid: {
    color: R.colors.PRIMARY_LIGHT,
    fontWeight: '500',
    backgroundColor: R.colors.SLATE_GRAY,
    borderRadius: 6,
    padding: 5,
    textAlign: 'center',
    marginTop: 5,
    width: 80,
  },
  firstCardView: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderRadius: 5,
  },
  secondCardView: {
    flex: 3,
    padding: 10,
    justifyContent: 'center',
  },
  name: {
    color: R.colors.PRIMARI_DARK,
    textAlign: 'left',
    fontSize: R.fontSize.M,
    fontWeight: '400',
  },
  searchView: {},
  searchInput: {
    borderWidth: 0.5,
    borderRadius: 12,
    marginBottom: 10,
    borderColor: R.colors.DARKGRAY,
    padding: 10,
    color: R.colors.DARKGRAY,
  },
});
