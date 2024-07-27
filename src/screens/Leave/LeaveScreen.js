import {
  View,
  Text,
  ImageBackground,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import {useNavigation} from '@react-navigation/native';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../library/commons/Button';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {Picker} from '@react-native-picker/picker';
import UserApi from '../../datalib/services/user.api';
import {useSelector} from 'react-redux';
import {currentUserSelector} from '../../store/slices/user/user.slice';
import Loader from '../../library/commons/Loader';

const LeaveScreen = () => {
  const user = useSelector(currentUserSelector);
  const navigation = useNavigation();
  const [endDate, setEndDate] = useState(new Date());
  const [endDateopen, setEndDateopen] = useState(false);
  const [aditional, setAditional] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [openStartDate, setStartDateOpen] = useState(false);
  const [type, setType] = useState('1');
  const [duration, setDuration] = useState('full_day');
  const [loading, setLoading] = useState(false);
  console.log('______________', user);
  const handleLeave = async () => {
    try {
      setLoading(true);
      const data = {
        leave_type_id: type,
        duration: duration,
        reason: aditional,
        status: 0,
        user_id: user?.id,
        leave_date: moment(new Date()).format('YYYY-MM-DD'),
      };
      const res = await new UserApi().applyLeave(data);
      if (res) {
        Alert.alert('Leave Applied Successfully');
        setAditional('');
        setLoading(false);
      }
      // console.log('------', res);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  // console.log('___', duration);
  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader
        style={{backgroundColor: R.colors.PRIMARY_LIGHT}}
        screenName={'Create a Leave Plan'}
      />
      <View style={{backgroundColor: R.colors.backgroundColor, flex: 1}}>
        <View
          style={{
            backgroundColor: R.colors.PRIMARY_LIGHT,
            margin: 10,
            borderRadius: 1,
          }}>
          <View style={[styles.TextInput]}>
            <Picker
              // style={{
              //   color: R.colors.PRIMARI_DARK,
              //   backgroundColor: R.colors.PRIMARY_LIGHT,

              //   alignSelf: 'flex-end',
              // }}
              itemStyle={{fontSize: 20}}
              selectedValue={type}
              enabled={true}
              onValueChange={(itemValue, itemIndex) => {
                setType(itemValue);
              }}>
              {/* {stateData &&
                      stateData?.map((itemValue, i) => ( */}
              <Picker.Item label={'Casual Leave'} value={'1'} />
              <Picker.Item label={'Earned Leave'} value={'2'} />
              {/* ))} */}
            </Picker>
          </View>
          <View style={[styles.TextInput]}>
            <Picker
              // style={{
              //   color: R.colors.PRIMARI_DARK,
              //   backgroundColor: R.colors.PRIMARY_LIGHT,

              //   alignSelf: 'flex-end',
              // }}
              itemStyle={{fontSize: 20}}
              selectedValue={duration}
              enabled={true}
              onValueChange={(itemValue, itemIndex) => {
                setDuration(itemValue);
              }}>
              {/* {stateData &&
                      stateData?.map((itemValue, i) => ( */}
              <Picker.Item label={'Full Day'} value={'full_day'} />
              <Picker.Item label={'Half Day'} value={'half_day'} />
              <Picker.Item label={'Short Leave'} value={'short_leave'} />
              {/* ))} */}
            </Picker>
          </View>
          <View style={styles.TextInput}>
            <Text
              style={{
                paddingLeft: 10,
                height: 50,
                textAlign: 'left',
                paddingTop: 10,
              }}>
              {moment(startDate).format('DD-MM-YYYY')}
            </Text>
            <Icon
              onPress={() => setStartDateOpen(true)}
              name="calendar-blank-outline"
              size={25}
              color={R.colors.PRIMARI_DARK}
              style={{position: 'absolute', padding: 10, right: 10}}
            />
            <DatePicker
              modal
              open={openStartDate}
              date={startDate}
              onConfirm={date => {
                setStartDateOpen(false);
                setStartDate(date);
              }}
              onCancel={() => {
                setStartDateOpen(false);
              }}
              mode="date"
              minimumDate={new Date()}
            />
          </View>
          <View style={[styles.TextInput, {}]}>
            <Text
              style={{
                paddingLeft: 10,
                height: 50,
                textAlign: 'left',
                paddingTop: 10,
              }}>
              {moment(endDate).format('DD-MM-YYYY')}
            </Text>
            <Icon
              onPress={() => setEndDateopen(true)}
              style={{position: 'absolute', padding: 10, right: 10}}
              name="calendar-blank-outline"
              size={25}
              color={R.colors.primary}
            />
            <DatePicker
              modal
              open={endDateopen}
              date={endDate}
              onConfirm={date => {
                setEndDateopen(false);
                setEndDate(date);
              }}
              onCancel={() => {
                setEndDateopen(false);
              }}
              mode="date"
            />
          </View>
          <View style={[styles.TextInput, {height: 100, borderRadius: 10}]}>
            <TextInput
              style={{paddingLeft: 10}}
              value={aditional}
              onChangeText={setAditional}
              placeholder="Additional Information "
           
            />
          </View>

          <Button
            // onPress={() => navigation.navigate(ScreensNameEnum.SUCCESS_SCREEN)}
            onPress={() => {
              if (aditional?.length > 1) {
                handleLeave();
              } else {
                Alert.alert('Additional information is required');
              }
            }}
            title="Submit"
            buttonStyle={{
              alignSelf: 'center',
              width: '90%',
              marginTop: 30,
              backgroundColor: '#4dc8d8',
            }}
            textStyle={{fontWeight: 'bold'}}
          />
        </View>
      </View>
      <Loader loading={loading} />
    </ScreenWrapper>
  );
};

export default LeaveScreen;
const styles = StyleSheet.create({
  TextInput: {
    width: '90%',
    borderWidth: 0.5,
    borderRadius: 10,
    backgroundColor: R.colors.CGRAY,
    textAlign: 'left',
    alignSelf: 'center',
    marginTop: 30,
  },
});
