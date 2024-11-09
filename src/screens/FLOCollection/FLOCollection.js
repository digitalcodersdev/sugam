import {StyleSheet, Text, View, FlatList, useColorScheme} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';
import {Picker} from '@react-native-picker/picker';
import CollectionItem from '../../library/commons/CollectionItem';
import {useDispatch, useSelector} from 'react-redux';
import {
  currentDayCollectionSelector,
  currentUserSelector,
} from '../../store/slices/user/user.slice';
import {fetchCurrentDayCollectionByBranchId} from '../../store/actions/userActions';
import Loader from '../../library/commons/Loader';

const FLOCollection = () => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const collection = useSelector(currentDayCollectionSelector);
  const user = useSelector(currentUserSelector);
  const [selectedTab, setSelectedTab] = useState('Collection');
  const [collectionType, setCollectionType] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (user?.branchid && collection?.length == 0 ) {
      fetchFloCollection();
    }
  }, [user]);

  const fetchFloCollection = async () => {
    try {
      setLoading(true);
      const response = await dispatch(
        fetchCurrentDayCollectionByBranchId({branchId: user?.branchid}),
      );
      console.log(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const DATA = [
    {
      Centerid: 1,
      center: 385,
      Meeting_Time: '10:00 AM',
      TARGET: '7,400.0',
      RECEIVED: '7,400.0',
      duebalance: '0.0',
      percentage: 100,
      LoanID: 102456,
      EMI_Amount: 1080,
      SanctionAmount: 30000,
      CollAmount: 1200,
    },
    {
      Centerid: 2,
      center: 721,
      Meeting_Time: '08:00 AM',
      TARGET: '16,200.0',
      RECEIVED: '10,800.0',
      duebalance: '5400.0',
      percentage: 66,
      LoanID: 102458,
      EMI_Amount: 1080,
      SanctionAmount: 30000,
      CollAmount: 1200,
    },
    {
      Centerid: 3,
      center: 385,
      Meeting_Time: '10:00 AM',
      TARGET: '7,000.0',
      RECEIVED: '1,400.0',
      duebalance: '0.0',
      percentage: 100,
      LoanID: 10246,
      EMI_Amount: 680,
      SanctionAmount: 30000,
      CollAmount: 300,
    },
    {
      Centerid: 4,
      center: 721,
      Meeting_Time: '08:00 AM',
      TARGET: '26,200.0',
      RECEIVED: '10,800.0',
      duebalance: '5400.0',
      percentage: 66,
      LoanID: 10245,
      EMI_Amount: 1080,
      SanctionAmount: 50000,
      CollAmount: 1200,
    },
  ];

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={'FLO'} />
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
          Today Collection
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
          Arrear Collection
        </Text>
      </View>
      <View style={styles.container}>
        {selectedTab === 'Collection' && DATA?.length >= 1 ? (
          <FlatList
            data={collection}
            // data={DATA}
            keyExtractor={item => item?.Centerid}
            renderItem={({item, index}) => (
              <CollectionItem item={item} index={index} />
            )}
            // refreshing={loading}
            // onRefresh={fetchFloCollection}
          />
        ) : null}
        {/* {selectedTab === 'Arrear' && DATA?.length >= 1 ? (
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
        ) : null} */}
      </View>
      <Loader loading={loading} />
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

// import {StyleSheet, Text, View, FlatList, useColorScheme} from 'react-native';
// import React, {useState} from 'react';
// import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
// import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
// import R from '../../resources/R';
// import {Picker} from '@react-native-picker/picker';
// import CollectionItem from '../../library/commons/CollectionItem';

// const FLOCollection = () => {
//   const colorScheme = useColorScheme();
//   const isDarkMode = colorScheme === 'dark';
//   const [selectedTab, setSelectedTab] = useState('Collection');
//   const [collectionType, setCollectionType] = useState(null);
//   const DATA = [
//     {
//       id: 1,
//       center: 385,
//       time: '10:00 AM',
//       target: '₹ 7,400.0',
//       received: '₹ 7,400.0',
//       balance: '₹ 0.0',
//       percentage: 100,
//     },
//     {
//       id: 2,
//       center: 721,
//       time: '08:00 AM',
//       target: '₹ 16,200.0',
//       received: '₹ 10,800.0',
//       balance: '₹ 5400.0',
//       percentage: 66,
//     },
//     {
//       id: 3,
//       center: 732,
//       time: '10:00 AM',
//       target: '₹ 2,700.0',
//       received: '₹ 0.0',
//       balance: '₹ 2,700.0',
//       percentage: 0,
//     },
//     {
//       id: 4,
//       center: 733,
//       time: '11:00 AM',
//       target: '₹ 7,700.0',
//       received: '₹ 0.0',
//       balance: '₹ 2,700.0',
//       percentage: 20,
//     },
//   ];

//   return (
//     <ScreenWrapper header={false}>
//       <ChildScreensHeader screenName={'FLO Collection'} />
//       <View style={{flexDirection: 'row'}}>
//         <Text
//           style={[
//             styles.tabText,
//             {
//               borderBottomWidth: selectedTab === 'Collection' ? 3 : 0,
//               borderColor: R.colors.primary,
//             },
//           ]}
//           onPress={() => setSelectedTab('Collection')}>
//           Collection
//         </Text>
//         <Text
//           style={[
//             styles.tabText,
//             {
//               borderBottomWidth: selectedTab === 'Arrear' ? 3 : 0,
//               borderColor: R.colors.primary,
//             },
//           ]}
//           onPress={() => setSelectedTab('Arrear')}>
//           Arrear
//         </Text>
//       </View>
//       <View style={styles.container}>
//         {selectedTab === 'Collection' && DATA?.length >= 1 ? (
//           <FlatList
//             data={DATA}
//             keyExtractor={item => item?.id}
//             renderItem={({item, index}) => (
//               <CollectionItem item={item} index={index} />
//             )}
//           />
//         ) : null}
//         {selectedTab === 'Arrear' && DATA?.length >= 1 ? (
//           <View style={{}}>
//             <View style={[styles.viewInput]}>
//               <Picker
//                 selectedValue={collectionType}
//                 onValueChange={(itemValue, itemIndex) =>
//                   setCollectionType(itemValue)
//                 }
//                 mode="dropdown"
//                 style={[
//                   styles.picker,
//                   {color: isDarkMode ? R.colors.PRIMARI_DARK : '#000000'},
//                 ]}
//                 dropdownIconColor={R.colors.DARKGRAY}>
//                 {collectionType === null && (
//                   <Picker.Item
//                     label="-- Select --"
//                     value={null}
//                     enabled={false}
//                   />
//                 )}
//                 <Picker.Item label="Arrear" value="Arrear" />
//                 <Picker.Item label="PTP" value="PTP" />
//               </Picker>
//             </View>
//             <FlatList
//               data={DATA}
//               keyExtractor={item => item?.id}
//               renderItem={({item, index}) => (
//                 <CollectionItem item={item} index={index} />
//               )}
//             />
//           </View>
//         ) : null}
//       </View>
//     </ScreenWrapper>
//   );
// };

// export default FLOCollection;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   tabText: {
//     flex: 1,
//     textAlign: 'center',
//     color: R.colors.PRIMARY_LIGHT,
//     backgroundColor: R.colors.SLATE_GRAY,
//     textAlignVertical: 'center',
//     height: 60,
//     fontWeight: '700',
//     fontSize: R.fontSize.L,
//   },
//   viewInput: {
//     flexDirection: 'row',
//     paddingHorizontal: 10,
//     justifyContent: 'flex-end',
//     marginVertical: 5,
//     borderWidth: 0.5,
//     borderRadius: 6,
//     marginBottom: 10,
//   },
//   picker: {
//     width: '100%',
//     color: R.colors.PRIMARI_DARK,
//     marginRight: 10,
//     alignSelf: 'left',
//   },
// });
