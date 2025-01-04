import {
  StyleSheet,
  Text,
  View,
  SectionList,
  useColorScheme,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';
import CollectionItem from '../../library/commons/CollectionItem';
import {useDispatch, useSelector} from 'react-redux';
import {
  currentDayCollectionSelector,
  currentUserSelector,
} from '../../store/slices/user/user.slice';
import {fetchCurrentDayCollectionByBranchId} from '../../store/actions/userActions';
import Loader from '../../library/commons/Loader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

const FLOCollection = () => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const collection = useSelector(currentDayCollectionSelector);
  const user = useSelector(currentUserSelector);
  const [selectedTab, setSelectedTab] = useState('Collection');
  const [collectionType, setCollectionType] = useState(null);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.branchid && collection?.length === 0) {
      fetchFloCollection();
    }
  }, [user]);

  const fetchFloCollection = async (
    date = moment(new Date()).format('YYYY-MM-DD'),
  ) => {
    try {
      setLoading(true);
      await dispatch(
        fetchCurrentDayCollectionByBranchId({
          branchId: user?.branchid,
          date: date,
        }),
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const Target = collection?.reduce(
    (accumulator, current) =>
      accumulator + parseInt(current?.Target + current?.ArrearDue),
    0,
  );

  const TargetEMI = collection?.reduce(
    (accumulator, current) => accumulator + parseInt(current?.Target),
    0,
  );

  const Received = collection?.reduce(
    (accumulator, current) =>
      accumulator + parseInt(current.Coll_Amount ? current?.Coll_Amount : 0),
    0,
  );

  const ArrearDueTotal = collection?.reduce(
    (accumulator, current) =>
      accumulator + parseInt(current?.ArrearDue ? current?.ArrearDue : 0),
    0,
  );

  const today = new Date();
  const fiveDaysBefore = new Date();
  fiveDaysBefore.setDate(today.getDate() - 5);

  const CollectionCard = ({Target, Received}) => {
    const Balance = Target - Received;

    return (
      <View style={styles.card}>
        <Text style={styles.heading}>Collection Summary</Text>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Icon name="flag" size={30} color={R.colors.SECONDRY_DARK} />
          <Text style={[styles.text, {color: R.colors.SECONDRY_DARK}]}>
            <Text style={styles.label}>Target (Arrear + EMI's) : </Text> ₹
            {Target.toLocaleString()}
          </Text>
        </View>

        <View style={styles.row}>
          <Icon name="chemical-weapon" size={30} color={R.colors.DARK_BLUE} />
          <Text style={[styles.text, {color: R.colors.DARK_BLUE}]}>
            <Text style={styles.label}>Today EMI Total: </Text>₹
            {TargetEMI.toLocaleString()}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="page-previous" size={30} color="#00796b" />
          <Text style={styles.text}>
            <Text style={styles.label}>Arrear Due Total: </Text>₹
            {ArrearDueTotal.toLocaleString()}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="call-received" size={30} color={R.colors.BLUE} />
          <Text style={[styles.text, {color: R.colors.BLUE}]}>
            <Text style={[styles.label, {color: R.colors.BLUE}]}>
              Received:{' '}
            </Text>
            ₹{Received.toLocaleString()}
          </Text>
        </View>

        <View style={styles.row}>
          <Icon name={'account-cash-outline'} size={30} color={'#d32f2f'} />
          <Text
            style={[
              styles.text,
              Balance < 0 ? styles.negativeBalance : styles.balance,
            ]}>
            <Text style={styles.label}>Today Balance: </Text>₹
            {Balance.toLocaleString()}
          </Text>
        </View>
      </View>
    );
  };

  const sections = [
    {
      title: 'Branch Summary',
      data: [{Target, Received}], // Branch Summary is a single item section
      renderItem: ({item}) => (
        <CollectionCard Target={item.Target} Received={item.Received} />
      ),
    },
    {
      title: 'Collection Details',
      data: collection,
      renderItem: ({item, index}) => (
        <CollectionItem item={item} index={index} />
      ),
    },
  ];

  return (
    <ScreenWrapper header={false} data={date}>
      <ChildScreensHeader
        screenName={`FLO Collection ${moment(date).format('YYYY-MM-DD')}`}
        date={date}
        onPress={() => setOpen(true)}
      />
      <View style={styles.container}>
        {collection?.length >= 1 ? (
          <SectionList
            sections={sections}
            keyExtractor={(item, index) =>
              item?.CenterID
                ? `${item?.CenterID}/${item?.BranchID}`
                : `Branch Summary-${index}`
            }
            renderSectionHeader={({section: {title}}) => null}
            refreshing={loading}
            onRefresh={fetchFloCollection}
          />
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
      <DatePicker
        modal
        open={open}
        date={date}
        mode="date"
        onConfirm={date => {
          setOpen(false);
          setDate(date);
          fetchFloCollection(moment(date).format('YYYY-MM-DD'));
        }}
        onCancel={() => {
          setOpen(false);
        }}
        maximumDate={new Date()}
        minimumDate={fiveDaysBefore}
      />
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
    fontWeight: '500',
  },
  label: {
    fontWeight: '800',
  },
  balance: {
    color: '#d32f2f', // Green for positive balance
  },
  negativeBalance: {
    color: '#d32f2f', // Red for negative balance
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: R.colors.DARK_BLUE,
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    textAlign: 'center',
  },
});
