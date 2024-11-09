import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import UserApi from '../../datalib/services/user.api';
import Loader from '../../library/commons/Loader';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import R from '../../resources/R';

const LeaveApproval = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApprovalLeaves();
  }, []);

  const fetchApprovalLeaves = async () => {
    try {
      setLoading(true);
      const response = await new UserApi().fetchApprovalLeaves();
      if (response) {
        setLeaves(response);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const renderLeaveItem = ({item}) => {
    const handleLeave = async data => {
      setLoading(true);
      const payload = {
        data: {
          ApprovedDate: new Date(),
          Status: data,
          StaffID: item?.StaffID,
          ID: item?.ID,
          leaveDate: item?.LeaveStartFrom,
          LeaveType: item?.LeaveType,
          leaveAs: item?.leaveAs,
          LeaveEndFrom:item?.LeaveEndFrom
        },
      };
      const response = await new UserApi().handleLeaveApproval(payload);
      if (response) {
        Alert.alert(`Leave ${data}  successfully`);
        fetchApprovalLeaves();
      }
      setLoading(false);
    };
    return (
      <View style={styles.leaveItem}>
        <View style={styles.leaveHeader}>
          <Text style={styles.staffName}>{item.StaffName}</Text>
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
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: '#2ecc71'}]}
            onPress={() => handleLeave('Approved')}>
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleLeave('Reject')}
            style={[styles.button, {backgroundColor: '#e74c3c'}]}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={ScreensNameEnum.LEAVE_APPROVAL_SCREENS} />
      <View style={styles.container}>
        <Loader loading={loading} message={'Loading leaves...'} />
        {leaves?.length >= 1 ? (
          <FlatList
            data={leaves}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderLeaveItem}
            contentContainerStyle={styles.listContainer}
            refreshing={loading}
            onRefresh={fetchApprovalLeaves}
          />
        ) : (
          <Text style={styles.noLeavesText}>
            No Applied Leaves Available...
          </Text>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default LeaveApproval;

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
    padding: 16,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#2980B9',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  leaveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  staffName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2980B9',
  },
  leaveStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  leaveInfo: {
    marginBottom: 12,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    flex: 0.45,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  noLeavesText: {
    textAlign: 'center',
    color: R.colors.DARKGRAY,
    fontWeight: '800',
    fontSize: R.fontSize.M,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
