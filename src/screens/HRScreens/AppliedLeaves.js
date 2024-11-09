import {StyleSheet, Text, View, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import UserApi from '../../datalib/services/user.api';
import Loader from '../../library/commons/Loader';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import R from '../../resources/R';

const AppliedLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchMyAppliedLeaves();
  }, []);

  const fetchMyAppliedLeaves = async () => {
    try {
      setLoading(true);
      const response = await new UserApi().fetchMyAppliedLeaves();
      if (response) {
        setLeaves(response);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  console.log("____+++++++++++_______",leaves);
  const getStatusColor = status => {
    switch (status) {
      case 'Approved':
        return '#2ecc71';
      case 'Reject':
        return '#e74c3c';
      case 'Pending':
        return '#f39c12';
      default:
        return '#2980B9';
    }
  };

  const renderLeaveItem = ({item}) => {
    console.log(item.Status);
    return (
      <View style={styles.leaveItem}>
        <View style={styles.leaveIcon}>
          <MaterialCommunityIcons name="calendar" size={24} color="#2980B9" />
        </View>
        <View style={styles.leaveInfo}>
          <Text style={styles.leaveType}>Leave Type: {item.LeaveType}</Text>
          <View style={styles.dateContainer}>
            <MaterialCommunityIcons
              name="calendar-start"
              size={18}
              color={R.colors.PRIMARY}
              style={styles.dateIcon}
            />
            <Text style={styles.leaveDate}>
              From: <Text style={styles.dateText}>{item.LeaveStartFrom}</Text>
            </Text>
            <MaterialCommunityIcons
              name="calendar-end"
              size={18}
              color={R.colors.PRIMARY}
              style={styles.dateIcon}
            />
            <Text style={styles.leaveDate}>
              To: <Text style={styles.dateText}>{item.LeaveEndFrom}</Text>
            </Text>
          </View>
          <Text style={styles.leaveRemarks}>Remarks: {item.Remarks}</Text>
          <Text
            style={[styles.leaveStatus, {color: getStatusColor(item.Status)}]}>
            Status: {item.Status}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={ScreensNameEnum.APPLIED_LEAVES_SCREENS} />
      <View style={styles.container}>
        <Loader loading={loading} message={'Loading leaves...'} />
        {leaves?.length >= 1 ? (
          <FlatList
            data={leaves}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderLeaveItem}
            contentContainerStyle={styles.listContainer}
            refreshing={loading}
            onRefresh={fetchMyAppliedLeaves}
          />
        ) : (
          <Text
            style={{
              textAlign: 'center',
              textAlignVertical: 'center',
              flex: 1,
              color: R.colors.DARKGRAY,
              fontWeight: '800',
              fontSize: R.fontSize.M,
            }}>
            No Applied Leaves Available...
          </Text>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default AppliedLeaves;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  listContainer: {
    paddingBottom: 20,
  },
  leaveItem: {
    flexDirection: 'row',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#2980B9',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
  },
  leaveIcon: {
    marginRight: 16,
  },
  leaveInfo: {
    flex: 1,
  },
  leaveType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateIcon: {
    marginRight: 4,
  },
  leaveDate: {
    fontSize: 14,
    color: '#555',
    marginRight: 12,
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2980B9',
  },
  leaveRemarks: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  leaveStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    
  },
});
