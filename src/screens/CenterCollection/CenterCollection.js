import {StyleSheet, Text, View, FlatList} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';
import CircularProgress from '../../components/CircularProgress';
import ClientItem from '../../library/commons/ClientItem';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  currentDayCollectionCenterSelector,
  // collectionSelectorByCenterId,
  // currentDayCollectionCenterSelector,
  currentUserSelector,
} from '../../store/slices/user/user.slice';
// import {fetchCurrentDayCollectionByCenterId} from '../../store/actions/userActions';
import Loader from '../../library/commons/Loader';
import { fetchCurrentDayCollectionByCenterId } from '../../store/actions/userActions';

const CenterCollection = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(currentUserSelector);
  const collections = useSelector(currentDayCollectionCenterSelector);
  console.log("collections",collections);
  const {Centerid, Meeting_Time} = route?.params?.centerData;
  const [loading, setLoading] = useState(false);
  const collection = [
    {
      Centerid: 2,
      center: 385,
      Meeting_Time: '10:00 AM',
      TARGET: '7,400.0',
      RECEIVED: '760.0',
      duebalance: '0.0',
      percentage: 100,
      Borrower_Name: 'Sunita Kumari',
      Collection_Status: 0,
      LoanID: 1024,
      EMI_Amount: 760,
      SanctionAmount: 50000,
      CollAmount: 17800,
      Branch_Name: 'Sctor 6',
      TotalEMI: '15/1',
      mblenumber: 8265809176,
    },
    {
      Centerid: 2,
      center: 721,
      Meeting_Time: '08:00 AM',
      TARGET: '16200.0',
      RECEIVED: '0',
      duebalance: '5400.0',
      percentage: 66,
      Borrower_Name: 'Rahul',
      Collection_Status: 0,
      LoanID: 1058,
      EMI_Amount: 1080,
      SanctionAmount: 30000,
      CollAmount: 1200,
      Branch_Name: 'Sctor 6',
      TotalEMI: '25/3',
      mblenumber: 8265809176,
    },
  ];

  // console.log('collection', collection);

  // const data = useSelector(state =>
  //   collectionSelectorByCenterId(state, Centerid),
  // );

  const data = collection.find(item => item.Centerid == Centerid);
  const target = collection.reduce((acc, current) => {
    return acc + parseInt(current.EMI_Amount);
  }, 0);
  const received = collection.reduce((acc, current) => {
    return acc + parseInt(current.RECEIVED);
  }, 0);
  const finData = {
    TARGET: target,
    RECEIVED: received,
    duebalance: target - received,
  };
  //   const target = collection.reduce((acc,current)=>{
  // return acc+ parseInt(current.EMI_Amount)

  //   },0)

  // Fetch collection data when the component mounts or when the user changes
  useEffect(() => {
    if (user?.branchid && collections?.length === 0) {
      fetchFloCollection();
    }
  }, [user, collection]);

  // Memoize percentage calculation to prevent recalculating on every render
  const percentage = useCallback(() => {
    if (finData?.RECEIVED && finData?.TARGET) {
      return (parseInt(finData?.RECEIVED) / parseInt(finData?.TARGET)) * 100;
    }
    return 0;
  }, [finData?.RECEIVED, finData?.TARGET]);
  const fetchFloCollection = async () => {
    try {
      setLoading(true);
      await dispatch(
        fetchCurrentDayCollectionByCenterId({
          centerId: Centerid,
          branchId: user?.branchid,
        }),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName="Collection" />
      <View style={styles.centerDetailsContainer}>
        <View style={styles.progressContainer}>
          <CircularProgress
            percentage={percentage().toFixed(2)}
            fillColor={R.colors.GREEN}
            backgroundColor={R.colors.PRIMARY_LIGHT}
            textColor={R.colors.PRIMARY_LIGHT}
          />
          <CenterInfo
            data={data}
            Centerid={Centerid}
            Meeting_Time={Meeting_Time}
          />
        </View>
        <FinancialOverview data={finData} />
      </View>
      <ClientsList
        collection={collection}
        Centerid={Centerid}
        loading={loading}
        // fetchFloCollection={fetchFloCollection}
      />
      <Loader loading={loading} />
    </ScreenWrapper>
  );
};

const CenterInfo = ({data, Centerid, Meeting_Time}) => (
  <View style={styles.centerInfo}>
    <Text style={styles.value}>Branch Name: {data?.Branch_Name}</Text>
    <Text style={styles.value}>Center Name: {data?.Center_Name}</Text>
    <Text style={styles.value}>Center ID: {Centerid}</Text>
    <Text style={styles.value}>Meeting Time: {Meeting_Time}</Text>
  </View>
);

const FinancialOverview = ({data}) => (
  <View style={styles.financialOverview}>
    <InfoBlock
      label="Target"
      value={data?.TARGET}
      valueStyle={{color: R.colors.lightYellow}}
    />
    <InfoBlock
      label="Received"
      value={data?.RECEIVED}
      valueStyle={{color: R.colors.GREEN}}
    />
    <InfoBlock
      label="Balance"
      value={data?.duebalance >= 1 ? data?.duebalance : 0}
      valueStyle={{color: 'red'}}
    />
  </View>
);

const ClientsList = ({collection, Centerid, loading, fetchFloCollection}) => (
  <View style={styles.container}>
    {collection.length > 0 && (
      <FlatList
        data={collection}
        keyExtractor={item => item?.LoanID?.toString()}
        renderItem={({item, index}) => (
          <ClientItem item={item} index={index} centerId={Centerid} />
        )}
        refreshing={loading}
        onRefresh={fetchFloCollection}
      />
    )}
  </View>
);

// Reusable component for displaying label and value
const InfoBlock = ({label, value, valueStyle}) => (
  <View style={styles.view}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, valueStyle, {textAlign: 'center'}]}>
      ₹{value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  centerDetailsContainer: {
    backgroundColor: R.colors.SLATE_GRAY,
    padding: 10,
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerInfo: {
    flex: 1,
    paddingHorizontal: 10,
  },
  financialOverview: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: R.colors.PRIMARY_LIGHT,
    padding: 10,
    borderRadius: 6,
  },
  label: {
    color: R.colors.PRIMARI_DARK,
    fontWeight: '500',
    fontSize: R.fontSize.L,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  value: {
    color: R.colors.PRIMARY_LIGHT,
    fontWeight: '700',
    fontSize: R.fontSize.L,
    textAlign: 'left',
    flexWrap: 'wrap',
  },
  view: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default CenterCollection;
