import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
// For icons
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import UserApi from '../../datalib/services/user.api';
import Loader from '../../library/commons/Loader';
import {useNavigation} from '@react-navigation/native';

const leaveTypes = [
  {key: 'CL', name: 'Casual Leave', icon: 'calendar-outline'},
  {key: 'CompOff', name: 'Comp Off', icon: 'time-outline'},
  {key: 'EL', name: 'Earned Leave', icon: 'briefcase-outline'},
  {key: 'ML', name: 'Maternity Leave', icon: 'woman-outline'},
  {key: 'PL', name: 'Paternity Leave', icon: 'man-outline'},
  {key: 'SL', name: 'Sick Leave', icon: 'medkit-outline'},
];

const MyLeavesList = () => {
  const [loading, setLoading] = useState(false);
  const [leaves, setLeaves] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const fetchMyLeaves = async () => {
    try {
      setLoading(true);
      const response = await new UserApi().fetchMyLeaves();
      if (response) {
        setLeaves(response[0]);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const renderLeaveItem = ({item}) => {
    const used = leaves[`${item.key}_Used`];
    const total = leaves[item.key];
    // const remaining = total - used;

    return (
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon} size={32} color="#2980B9" />
        </View>
        <View style={styles.leaveInfo}>
          <Text style={styles.leaveType}>{item.name}</Text>
          <Text style={styles.leaveDetails}>
         Total: {total}
          </Text>
          <Text style={styles.leaveRemaining}>Remaining: {used}</Text>
        </View>
        {used > 0 && (
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => navigation.navigate(ScreensNameEnum.LEAVE_SCREEN,{leaveType:item.name})}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={ScreensNameEnum.MY_LEAVES_SCREEN} />
      <Loader loading={loading} message={'please wait...'} />
      {leaves ? (
        <FlatList
          data={leaveTypes}
          keyExtractor={item => item.key}
          renderItem={renderLeaveItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noDataText}>No leave data available</Text>
      )}
    </ScreenWrapper>
  );
};

export default MyLeavesList;

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    marginRight: 16,
  },
  leaveInfo: {
    flex: 1,
  },
  leaveType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  leaveDetails: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  leaveRemaining: {
    fontSize: 14,
    color: '#27ae60',
    marginTop: 4,
  },
  applyButton: {
    backgroundColor: '#2980B9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#7f8c8d',
  },
});
