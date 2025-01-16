import {StyleSheet, Text, View, FlatList, Pressable, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import UserApi from '../../datalib/services/user.api';
import {useDispatch, useSelector} from 'react-redux';
import {currentUserSelector} from '../../store/slices/user/user.slice';
import Loader from '../../library/commons/Loader';
import R from '../../resources/R';
import moment from 'moment';
import {
  fetchCurrentDayCollectionByBranchId,
  fetchCurrentDayCollectionByCenterId,
} from '../../store/actions/userActions';

const Foreclose = () => {
  const user = useSelector(currentUserSelector);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  console.log('data', data);

  useEffect(() => {
    fetchForeRequest();
  }, []);

  const fetchForeRequest = async () => {
    try {
      setLoading(true);
      const res = await new UserApi().fetchPreClosureRequest({
        branchId: user?.BranchId,
      });
      if (res && res?.data?.length >= 1) {
        setData(res?.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleApprove = async (loanID, amount, Centerid) => {
    try {
      setLoading(true);
      const response = await new UserApi().approveForecloseRequest({
        loanId: loanID,
        amount: amount,
      });
      if (response) {
        Alert.alert('Request Approved Successfully...');
        fetchForeRequest();
        await dispatch(
          fetchCurrentDayCollectionByBranchId({branchId: user?.BranchId}),
        );
        await dispatch(
          fetchCurrentDayCollectionByCenterId({
            centerId: Centerid,
            branchId: user?.BranchId,
          }),
        );
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleReject = async (loanID, Centerid) => {
    try {
      setLoading(true);
      const response = await new UserApi().rejectForecloseRequest({
        loanId: loanID,
      });
      if (response) {
        Alert.alert('Request Rejected Successfully...');
        fetchForeRequest();
        await dispatch(
          fetchCurrentDayCollectionByBranchId({branchId: user?.BranchId}),
        );
        await dispatch(
          fetchCurrentDayCollectionByCenterId({
            centerId: Centerid,
            branchId: user?.BranchId,
          }),
        );
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const renderCard = ({item}) => {
    // Determine the status color based on item.Status
    const statusColor =
      item.Status === 1 ? '#4CAF50' : item.Status === 0 ? '#F44336' : '#FF9800'; // Green for Approved, Red for Rejected, Orange for Pending
    const backColor =
      item.Status === 1 ? '#4CAF50' : item.Status === 0 ? '#F44336' : '#FF9800'; // Green for Approved, Red for Rejected, Orange for Pending
    const dateString = item?.RequestDate;

    // Parse the date in UTC mode and format it
    const formattedDate = moment.utc(dateString).format('DD MMM YYYY');
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text
            style={[
              styles.status,
              {color: R.colors.PRIMARY_LIGHT, backgroundColor: backColor},
            ]}>
            {item.Status === 1
              ? 'Approved'
              : item.Status === 0
              ? 'Rejected'
              : 'Pending'}
          </Text>
          <Text
            style={[
              styles.value,
              {
                backgroundColor: R.colors.DARK_BLUE,
                padding: 5,
                borderRadius: 6,
                color: R.colors.PRIMARY_LIGHT,
                fontWeight: '600',
              },
            ]}>
            {formattedDate}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Center:</Text>
            <Text style={styles.value}>{item.Center_Name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Customer:</Text>
            <Text style={styles.value}>{item.Borrower_Name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Loan ID:</Text>
            <Text style={styles.value}>{item.LoanID}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Request By:</Text>
            <Text style={styles.value}>{item.Request_By}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Requested Amount:</Text>
            <Text style={styles.value}>{item.RequestedAmount}</Text>
          </View>
          {/* <View style={styles.detailRow}>
            <Text style={styles.label}>Request Date:</Text>
            <Text style={styles.value}>
              {new Date(item.RequestDate).toLocaleDateString()}
            </Text>
          </View> */}
        </View>

        {item.Status === null && (
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.approveButton}
              onPress={() =>
                handleApprove(item.LoanID, item.RequestedAmount, item?.CenterID)
              }>
              <Text style={styles.buttonText}>Approve</Text>
            </Pressable>
            <Pressable
              style={styles.rejectButton}
              onPress={() => handleReject(item.LoanID, item?.CenterID)}>
              <Text style={styles.buttonText}>Reject</Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={ScreensNameEnum.FORECLOSE_SCREEN} />
      <Loader loading={loading} message={'Please wait'} />
      {data?.length >= 1 ? (
        <FlatList
          data={data}
          renderItem={renderCard}
          keyExtractor={item => item.LoanID.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            textAlignVertical: 'center',
            color: R.colors.DARKGRAY,
            fontSize: R.fontSize.L,
            fontWeight:"500"
          }}>
          No Data Found...
        </Text>
      )}
    </ScreenWrapper>
  );
};

export default Foreclose;

const styles = StyleSheet.create({
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 5,
    borderRadius: 6,
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#4CAF50', // Green for Approve
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 5,
    elevation: 3,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#F44336', // Red for Reject
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
