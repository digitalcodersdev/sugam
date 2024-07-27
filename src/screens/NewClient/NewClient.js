import {StyleSheet, Text, View, FlatList, Pressable} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import R from '../../resources/R';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';

const NewClient = () => {
  const navigation = useNavigation();
  const [serach, setSearch] = useState('');
  const DATA = [
    {
      id: 1,
      centerName: 'C1 (129)',
      contactPerson: '8265805176',
      Address: 'Noida Noida Uttar Pradesh',
      centreNo: '0',
    },
    {
      id: 2,
      centerName: 'C1 (129)',
      contactPerson: '8265805176',
      Address: 'Noida Noida Uttar Pradesh',
      centreNo: '0',
    },
    {
      id: 3,
      centerName: 'C1 (129)',
      contactPerson: '8265805176',
      Address: 'Noida Noida Uttar Pradesh',
      centreNo: '0',
    },
    {
      id: 4,
      centerName: 'C1 (129)',
      contactPerson: '8265805176',
      Address: 'Noida Noida Uttar Pradesh',
      centreNo: '0',
    },
  ];

  const Item = ({item, index}) => (
    <View style={[styles.cardView, {marginTop: index === 0 ? 0 : 20}]}>
      <Pressable
        onPress={() => navigation.navigate(ScreensNameEnum.CHECK_CREDIT_BUREAU_SCREEN)}
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={styles.view}>
          <Text style={styles.label}>Center Name :</Text>
          <Text style={styles.value}>{item.centerName}</Text>
        </View>
        <View style={styles.view}>
          <Text style={styles.label}>Contact Person :</Text>
          <Text style={styles.value}>{item.contactPerson}</Text>
        </View>
        <View style={styles.view}>
          <Text style={styles.label}>Address :</Text>
          <Text style={styles.value}>{item.Address}</Text>
        </View>
        <View style={styles.view}>
          <Text style={styles.label}>Centre No :</Text>
          <Text style={styles.value}>{item.centreNo}</Text>
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
            value={serach}
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
          data={DATA}
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
    borderColor: R.colors.LIGHTGRAY,
    width: '100%',
    // Add elevation for Android
    elevation: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
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
    padding:10
  },
});
