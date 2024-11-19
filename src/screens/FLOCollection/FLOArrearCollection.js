import {StyleSheet, Text, View, FlatList, useColorScheme} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';
import {useDispatch, useSelector} from 'react-redux';
import {
  currentDayCollectionSelector,
  currentUserSelector,
} from '../../store/slices/user/user.slice';
import {fetchCurrentDayCollectionByBranchId} from '../../store/actions/userActions';
import Loader from '../../library/commons/Loader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ArrearCollectionItem from '../../library/commons/ArrearCollectionItem';

const FLOArrearCollection = () => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const collection = useSelector(currentDayCollectionSelector);
  const user = useSelector(currentUserSelector);
  const [selectedTab, setSelectedTab] = useState('Collection');
  const [collectionType, setCollectionType] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (user?.branchid && collection?.length == 0) {
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

  const Target = collection?.reduce(
    (accumulator, current) => accumulator + parseInt(current?.Due),
    0,
  );
  const Received = collection?.reduce(
    (accumulator, current) =>
      accumulator + parseInt(current.Coll_Amount ? current?.Coll_Amount : 0),
    0,
  );

  const CollectionCard = ({Target, Received}) => {
    const Balance = Target - Received;

    return (
      <View style={styles.card}>
        <Text style={styles.heading}>Arrear Collection Summary</Text>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Icon name="flag" size={24} color="#00796b" />
          <Text style={styles.text}>
            <Text style={styles.label}>Target: </Text>₹{Target.toLocaleString()}
          </Text>
        </View>

        <View style={styles.row}>
          <Icon name="cash-100" size={24} color="#00796b" />
          <Text style={styles.text}>
            <Text style={styles.label}>Received: </Text>₹
            {Received.toLocaleString()}
          </Text>
        </View>

        <View style={styles.row}>
          <Icon
            name={Balance < 0 ? 'alert-circle-outline' : 'check-circle'}
            size={24}
            color={Balance < 0 ? '#d32f2f' : '#388e3c'}
          />
          <Text
            style={[
              styles.text,
              Balance < 0 ? styles.negativeBalance : styles.balance,
            ]}>
            <Text style={styles.label}>Balance: </Text>₹
            {Balance.toLocaleString()}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={'FLO Arrear Collection'} />
      <View style={styles.container}>
        {collection?.length >= 1 ? (
          <>
            <CollectionCard Target={Target} Received={Received} />
            <FlatList
              data={collection}
              // data={DATA}
              keyExtractor={item => item?.CenterID + '/' + item?.BranchID}
              renderItem={({item, index}) => (
                <ArrearCollectionItem item={item} index={index} />
              )}
              refreshing={loading}
              onRefresh={fetchFloCollection}
            />
          </>
        ) : (
          <Text
            style={{
              color: R.colors.DARKGRAY,
              flex: 1,
              textAlign: 'center',
              textAlignVertical: 'center',
              fontSize: R.fontSize.L,
            }}>
            No Data Available
          </Text>
        )}
      </View>
      <Loader loading={loading} />
    </ScreenWrapper>
  );
};

export default FLOArrearCollection;

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
  card: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4, // Shadow for Android
    borderWidth: 1,
    borderColor: '#ddd',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: R.colors.DARK_BLUE,
    marginBottom: 12,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#b2dfdb',
    marginVertical: 12,
  },
  text: {
    fontSize: 18,
    color: '#004d40',
    marginLeft: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  balance: {
    color: '#388e3c', // Green for positive balance
  },
  negativeBalance: {
    color: '#d32f2f', // Red for negative balance
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});
