import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import UserApi from '../../datalib/services/user.api';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import Loader from '../../library/commons/Loader';
import R from '../../resources/R';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import ScreensNameEnum from '../../constants/ScreensNameEnum';

const AttendanceList = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedMonth, selectedYear]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const response = await new UserApi().getAttendanceByMonthAndYear({
        month: selectedMonth,
        year: selectedYear,
      });
      setAttendanceData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateWorkingHours = (clockIn, clockOut) => {
    const duration = moment.duration(moment(clockOut, 'HH:mm:ss').diff(moment(clockIn, 'HH:mm:ss')));
    return `${parseInt(duration.asHours())}h ${parseInt(duration.minutes())}m`;
  };

  const renderAttendanceItem = ({ item }) => {
    const { AttendanceDate, ClockIn, ClockOut } = item;
    const workingHours = ClockIn && ClockOut ? calculateWorkingHours(ClockIn, ClockOut) : '0';
    const formattedDate = moment(AttendanceDate);

    return (
      <View style={styles.attendanceItem}>
        <View style={styles.dateContainer}>
          <Text style={styles.dayText}>{formattedDate.format('ddd')}</Text>
          <Text style={styles.dateText}>{formattedDate.format('DD')}</Text>
          <Text style={styles.monthYearText}>{formattedDate.format('MMM-YYYY')}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.timeContainer}>
            <View style={styles.clockInOut}>
              <Text style={styles.timeText}>Clock In:</Text>
              <Text style={styles.timeValue}>{ClockIn || 'N/A'}</Text>
            </View>
            <View style={styles.clockInOut}>
              <Text style={styles.timeText}>Clock Out:</Text>
              <Text style={styles.timeValue}>{ClockOut || 'N/A'}</Text>
            </View>
          </View>
          <Text style={styles.workingHours}>Working Hours: {workingHours}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={ScreensNameEnum.ATTENDANCE_LIST_SCREEN} />
      <View style={styles.container}>
        <View style={styles.pickerRow}>
          <Picker
            selectedValue={selectedMonth}
            style={styles.picker}
            dropdownIconColor="#2980B9"
            onValueChange={(value) => setSelectedMonth(value)}>
            {Array.from({ length: 12 }, (_, i) => (
              <Picker.Item key={i + 1} label={moment().month(i).format('MMMM')} value={i + 1} />
            ))}
          </Picker>

          <Picker
            selectedValue={selectedYear}
            style={styles.picker}
            dropdownIconColor="#2980B9"
            onValueChange={(value) => setSelectedYear(value)}>
            {Array.from({ length: 6 }, (_, i) => (
              <Picker.Item key={i} label={`${moment().year() - 5 + i}`} value={moment().year() - 5 + i} />
            ))}
          </Picker>
        </View>

        <FlatList
          data={attendanceData}
          renderItem={renderAttendanceItem}
          keyExtractor={(item) => item.ID.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <Loader loading={loading} message={'please wait...'} />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ECF0F1',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#2C3E50',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: '#2980B9',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  attendanceItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2980B9',
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  dateContainer: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: R.colors.primary,
    borderRadius: 10,
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: R.colors.PRIMARY_LIGHT,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: R.colors.PRIMARY_LIGHT,
  },
  monthYearText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: R.colors.PRIMARY_LIGHT,
  },
  detailsContainer: {
    flex: 3,
    paddingHorizontal: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  clockInOut: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  timeValue: {
    fontSize: 16,
    color: '#2980B9',
  },
  workingHours: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27AE60',
  },
});

export default AttendanceList;
