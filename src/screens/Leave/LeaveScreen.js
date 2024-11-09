import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import {useNavigation} from '@react-navigation/native';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../library/commons/Button';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {Picker} from '@react-native-picker/picker';
import UserApi from '../../datalib/services/user.api';
import {useSelector} from 'react-redux';
import {currentUserSelector} from '../../store/slices/user/user.slice';
import Loader from '../../library/commons/Loader';
import ScreensNameEnum from '../../constants/ScreensNameEnum';

const leaveTypes = {
  'Casual Leave': 'CL',
  'Comp Off': 'CompOff',
  'Earned Leave': 'EL',
  'Maternity Leave': 'ML',
  'Paternity Leave': 'PL',
  'Sick Leave': 'SL',
};

const LeaveScreen = ({route}) => {
  const {leaveType} = route?.params;
  const user = useSelector(currentUserSelector);
  const navigation = useNavigation();
  const [endDate, setEndDate] = useState(new Date());
  const [endDateopen, setEndDateopen] = useState(false);
  const [aditional, setAditional] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [openStartDate, setStartDateOpen] = useState(false);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [leaveTypeData, setLeaveTypeData] = useState([]);
  useEffect(() => {
    if (
      duration == 'half_day' &&
      moment(startDate).format('MM-DD-YYYY') !=
        moment(endDate).format('MM-DD-YYYY')
    ) {
      Alert.alert(
        'You can only apply Half Day for the same Start Date and  End Date',
      );
      setDuration('full_day');
    }
  }, [startDate, endDate, duration]);

  useEffect(() => {
    // fetchLeaveTypes();
  }, []);

  // const fetchLeaveTypes = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await new UserApi().getLeaveTypes();
  //     if (response) {
  //       setLeaveTypeData(response.data);
  //     }
  //     setLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //   }
  // };

  const validate = () => {
    let valid = true;
    if (duration == null) {
      valid = false;
      Alert.alert('Please Select Leave Duration');
      return valid;
    }
    if (aditional?.length < 10) {
      valid = false;
      Alert.alert(
        'Please give Additional Information (Minimum 10 characters required)',
      );
      return valid;
    }
    return valid;
  };

  const handleLeave = async () => {
    try {
      setLoading(true);
      if (validate()) {
        const payload = {
          data: {
            StaffID: user?.staffid,
            StartFrom: startDate,
            EndTo: endDate,
            Remarks: aditional,
            LeaveType: leaveTypes[leaveType],
            LeaveAs: duration,
            Month: startDate.getMonth() + 1,
            Year: startDate?.getFullYear(),
          },
        };
        const res = await new UserApi().applyLeave(payload);
        if (res) {
          Alert.alert('Leave Applied Successfully');
          setAditional('');
          navigation.navigate(ScreensNameEnum.APPLIED_LEAVES_SCREENS);
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={'Create a Leave Plan'} />
      <View style={styles.container}>
        <View style={styles.formContainer}>
          {/* Leave Type Label */}
          <Text style={styles.label}>Leave Type</Text>
          <TextInput
            style={styles.leaveType}
            value={leaveType}
            editable={false}
          />

          {/* Duration Label */}
          <Text style={styles.label}>Leave Duration</Text>
          <Picker
            style={styles.picker}
            selectedValue={duration}
            onValueChange={itemValue => setDuration(itemValue)}>
            <Picker.Item label="-- Select Duration --" value={null} />
            <Picker.Item label="Full Day" value="full_day" />
            <Picker.Item label="Half Day" value="half_day" />
          </Picker>

          {/* Start Date Label */}
          <Text style={styles.label}>Start Date</Text>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {moment(startDate).format('DD-MM-YYYY')}
            </Text>
            <Icon
              name="calendar-blank-outline"
              size={25}
              color={R.colors.PRIMARI_DARK}
              style={styles.icon}
              onPress={() => setStartDateOpen(true)}
            />
            <DatePicker
              modal
              open={openStartDate}
              date={startDate}
              onConfirm={date => {
                setStartDateOpen(false);
                setStartDate(date);
                if (endDate < date) {
                  setEndDate(date)
                }
              }}
              onCancel={() => setStartDateOpen(false)}
              mode="date"
              minimumDate={new Date()}
            />
          </View>

          {/* End Date Label */}
          <Text style={styles.label}>End Date</Text>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {moment(endDate).format('DD-MM-YYYY')}
            </Text>
            <Icon
              name="calendar-blank-outline"
              size={25}
              color={R.colors.primary}
              style={styles.icon}
              onPress={() => setEndDateopen(true)}
            />
            <DatePicker
              modal
              open={endDateopen}
              date={endDate}
              onConfirm={date => {
                setEndDateopen(false);
                setEndDate(date);
              }}
              minimumDate={startDate}
              onCancel={() => setEndDateopen(false)}
              mode="date"
            />
          </View>

          {/* Additional Information Label */}
          <Text style={styles.label}>Additional Information</Text>
          <TextInput
            style={styles.additionalInfo}
            value={aditional}
            onChangeText={setAditional}
            placeholder="Provide a reason or any other relevant details"
            multiline
          />

          {/* Submit Button */}
          <Button
            title="Apply"
            onPress={handleLeave}
            buttonStyle={styles.button}
            textStyle={styles.buttonText}
          />
        </View>
      </View>
      <Loader loading={loading} message={'Please wait...'} />
    </ScreenWrapper>
  );
};

export default LeaveScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.backgroundColor,
  },
  formContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  leaveType: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: R.colors.PRIMARI_DARK,
    color:R.colors.DARKGRAY
  },
  picker: {
    marginBottom: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dateText: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  icon: {
    marginLeft: 10,
  },
  additionalInfo: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    height: 100,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2980B9',
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#555',
  },
});
