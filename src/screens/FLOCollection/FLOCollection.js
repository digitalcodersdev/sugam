import {StyleSheet, Text, View, FlatList, useColorScheme} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';
import {Picker} from '@react-native-picker/picker';
import CollectionItem from '../../library/commons/CollectionItem';

const FLOCollection = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [selectedTab, setSelectedTab] = useState('Collection');
  const [collectionType, setCollectionType] = useState(null);
  const DATA = [
    {
      id: 1,
      center: 385,
      time: '10:00 AM',
      target: '₹ 7,400.0',
      received: '₹ 7,400.0',
      balance: '₹ 0.0',
      percentage: 100,
    },
    {
      id: 2,
      center: 721,
      time: '08:00 AM',
      target: '₹ 16,200.0',
      received: '₹ 10,800.0',
      balance: '₹ 5400.0',
      percentage: 66,
    },
    {
      id: 3,
      center: 732,
      time: '10:00 AM',
      target: '₹ 2,700.0',
      received: '₹ 0.0',
      balance: '₹ 2,700.0',
      percentage: 0,
    },
    {
      id: 4,
      center: 733,
      time: '11:00 AM',
      target: '₹ 7,700.0',
      received: '₹ 0.0',
      balance: '₹ 2,700.0',
      percentage: 20,
    },
  ];

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={'FLO Collection'} />
      <View style={{flexDirection: 'row'}}>
        <Text
          style={[
            styles.tabText,
            {
              borderBottomWidth: selectedTab === 'Collection' ? 3 : 0,
              borderColor: R.colors.primary,
            },
          ]}
          onPress={() => setSelectedTab('Collection')}>
          Collection
        </Text>
        <Text
          style={[
            styles.tabText,
            {
              borderBottomWidth: selectedTab === 'Arrear' ? 3 : 0,
              borderColor: R.colors.primary,
            },
          ]}
          onPress={() => setSelectedTab('Arrear')}>
          Arrear
        </Text>
      </View>
      <View style={styles.container}>
        {selectedTab === 'Collection' && DATA?.length >= 1 ? (
          <FlatList
            data={DATA}
            keyExtractor={item => item?.id}
            renderItem={({item, index}) => (
              <CollectionItem item={item} index={index} />
            )}
          />
        ) : null}
        {selectedTab === 'Arrear' && DATA?.length >= 1 ? (
          <View style={{}}>
            <View style={[styles.viewInput]}>
              <Picker
                selectedValue={collectionType}
                onValueChange={(itemValue, itemIndex) =>
                  setCollectionType(itemValue)
                }
                mode="dropdown"
                style={[
                  styles.picker,
                  {color: isDarkMode ? R.colors.PRIMARI_DARK : '#000000'},
                ]}
                dropdownIconColor={R.colors.DARKGRAY}>
                {collectionType === null && (
                  <Picker.Item
                    label="-- Select --"
                    value={null}
                    enabled={false}
                  />
                )}
                <Picker.Item label="Arrear" value="Arrear" />
                <Picker.Item label="PTP" value="PTP" />
              </Picker>
            </View>
            <FlatList
              data={DATA}
              keyExtractor={item => item?.id}
              renderItem={({item, index}) => (
                <CollectionItem item={item} index={index} />
              )}
            />
          </View>
        ) : null}
      </View>
    </ScreenWrapper>
  );
};

export default FLOCollection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  tabText: {
    flex: 1,
    textAlign: 'center',
    color: R.colors.PRIMARY_LIGHT,
    backgroundColor: R.colors.SLATE_GRAY,
    textAlignVertical: 'center',
    height: 60,
    fontWeight: '700',
    fontSize: R.fontSize.L,
  },
  viewInput: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'flex-end',
    marginVertical: 5,
    borderWidth: 0.5,
    borderRadius: 6,
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    color: R.colors.PRIMARI_DARK,
    marginRight: 10,
    alignSelf: 'left',
  },
});
