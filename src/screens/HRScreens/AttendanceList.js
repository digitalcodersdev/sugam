import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import moment from 'moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import UserApi from '../../datalib/services/user.api';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import Loader from '../../library/commons/Loader';
import R from '../../resources/R';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import ScreensNameEnum from '../../constants/ScreensNameEnum';

const AttendanceList = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1); // Current month
  const [selectedYear, setSelectedYear] = useState(moment().year()); // Current year
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedMonth, selectedYear]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await new UserApi().getAttendanceByMonthAndYear({
        month: selectedMonth,
        year: selectedYear,
      });
      setAttendanceData(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const calculateWorkingHours = (clockIn, clockOut) => {
    const clockInTime = moment(clockIn, 'HH:mm:ss');
    const clockOutTime = moment(clockOut, 'HH:mm:ss');
    const duration = moment.duration(clockOutTime.diff(clockInTime));
    const hours = parseInt(duration.asHours());
    const minutes = parseInt(duration.minutes());
    return `${hours}h ${minutes}m`;
  };

  const renderAttendanceItem = ({item}) => {
    const {AttendanceDate, ClockIn, ClockOut} = item;
    const workingHours =
      ClockIn && ClockOut ? calculateWorkingHours(ClockIn, ClockOut) : '0';

    // Format the date
    const formattedDate = moment(AttendanceDate);
    const day = formattedDate.format('ddd'); // Day of the week
    const date = formattedDate.format('DD'); // Day of the month
    const monthYear = formattedDate.format('MMM-YYYY'); // Month and year

    // Format ClockIn and ClockOut to HH:MM:SS
    const formattedClockIn = ClockIn
      ? moment(ClockIn, 'HH:mm:ss').format('HH:mm:ss')
      : 'N/A';
    const formattedClockOut = ClockOut
      ? moment(ClockOut, 'HH:mm:ss').format('HH:mm:ss')
      : 'N/A';

    return (
      <View style={styles.attendanceItem}>
        <View style={styles.dateContainer}>
          <Text style={styles.dayText}>{day}</Text>
          <Text style={styles.dateText}>{date}</Text>
          <Text style={styles.monthYearText}>{monthYear}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.timeContainer}>
            <View style={styles.clockInOut}>
              <Text style={styles.timeText}>Clock In:</Text>
              <Text style={styles.timeValue}>{formattedClockIn}</Text>
            </View>
            <View style={styles.clockInOut}>
              <Text style={styles.timeText}>Clock Out:</Text>
              <Text style={styles.timeValue}>{formattedClockOut}</Text>
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
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              onPress={() =>
                setSelectedMonth(prev => (prev === 1 ? 12 : prev - 1))
              }>
              <MaterialIcons name="navigate-before" size={30} color="#2C3E50" />
            </TouchableOpacity>
            <Picker
              selectedValue={selectedMonth}
              style={styles.picker}
              dropdownIconColor="#2980B9"
              onValueChange={itemValue => setSelectedMonth(itemValue)}>
              {Array.from({length: 12}, (_, i) => (
                <Picker.Item
                  key={i + 1}
                  label={moment().month(i).format('MMMM')}
                  value={i + 1}
                />
              ))}
            </Picker>
            <TouchableOpacity
              onPress={() =>
                setSelectedMonth(prev => (prev === 12 ? 1 : prev + 1))
              }>
              <MaterialIcons name="navigate-next" size={30} color="#2C3E50" />
            </TouchableOpacity>
          </View>

          <View style={styles.pickerContainer}>
            <TouchableOpacity onPress={() => setSelectedYear(prev => prev - 1)}>
              <MaterialIcons name="navigate-before" size={30} color="#2C3E50" />
            </TouchableOpacity>
            <Picker
              selectedValue={selectedYear}
              style={styles.picker}
              dropdownIconColor="#2980B9"
              onValueChange={itemValue => setSelectedYear(itemValue)}>
              {Array.from({length: 6}, (_, i) => (
                <Picker.Item
                  key={i}
                  label={`${moment().year() - 5 + i}`}
                  value={moment().year() - 5 + i}
                />
              ))}
            </Picker>
            <TouchableOpacity onPress={() => setSelectedYear(prev => prev + 1)}>
              <MaterialIcons name="navigate-next" size={30} color="#2C3E50" />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={attendanceData}
          renderItem={renderAttendanceItem}
          keyExtractor={item => item.ID.toString()}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    height: 50,
    width: 120,
    color: '#2C3E50',
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 5,
  },
  attendanceItem: {
    backgroundColor: '#FFFFFF',
    padding: 5,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2980B9',
    shadowColor: '#2C3E50',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    flexDirection: 'row', // Keep the items in a row
  },
  dateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Center the date text
    margin: 10, // Space between date and details
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
    justifyContent: 'center',
    alignItems: 'flex-start', // Align details to the start
  },

  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    alignItems: 'center', // Center align items
  },
  clockInOut: {
    backgroundColor: '#FFFFFF', // Background color for clock in/out
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    shadowColor: '#2C3E50',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  timeValue: {
    fontSize: 16,
    color: '#2980B9', // Distinct color for the time values
  },
  workingHours: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27AE60',
  },
});

export default AttendanceList;
