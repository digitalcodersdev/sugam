import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import {useNavigation} from '@react-navigation/native';
import {Pressable} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {attendanceReportSelector} from '../../store/slices/user/user.slice';
import {fetchAttendanceReport} from '../../store/actions/userActions';
const AttendancereportScreen = () => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(new Date());
  const [openStartDate, setStartDateOpen] = useState(false);
  const [selecteditem, setSelecteditem] = useState('present');
  const [data, setData] = useState([]);
  const report = useSelector(attendanceReportSelector);
  useEffect(() => {
    if (report?.length < 1) {
      getAllTask();
    } else {
      const resultArray = Object.entries(report?.dataWiseData).map(
        ([key, value]) => value,
      );

      setData(resultArray);
    }
  }, []);
  const getAllTask = async () => {
    try {
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      console.log(month);
      await dispatch(fetchAttendanceReport({month: month, year: year}));
    } catch (error) {
      console.log(error);
      // Alert.alert('something went wrong please try again laterp');
    }
  };
  console.log(data, 'REPORT ', report);
  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader
        style={{backgroundColor: R.colors.PRIMARY_LIGHT}}
        screenName={'Attendance'}
      />
      <ImageBackground
        source={require('../../assets/Images/mainbg.png')}
        resizeMode="stretch"
        style={{flex: 1}}>
        <View style={styles.textview}>
          <Text
            style={{
              color: R.colors.PRIMARI_DARK,
              fontSize: 18,
              fontWeight: 'bold',
            }}>
            Attendance Report
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
        <View
          style={{
            flexDirection: 'row',
            marginTop: 30,
            justifyContent: 'space-evenly',
          }}>
          <Pressable onPress={() => setSelecteditem('present')}>
            <View
              style={{
                flexDirection: 'column',
                borderRadius: 10,
                height: 130,

                width: 100,
                alignItems: 'center',
                backgroundColor:
                  selecteditem == 'present' ? 'blue' : R.colors.WHITE,
              }}>
              <Text
                style={{
                  fontWeight: '500',
                  fontSize: 30,
                  height: 65,
                  width: 65,
                  textAlign: 'center',
                  borderRadius: 50,
                  backgroundColor: '#102a8d',
                  marginTop: 10,
                  color: R.colors.WHITE,
                  paddingTop: 10,
                }}>
                {report?.daysPresent}
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  paddingTop: 10,
                  color:
                    selecteditem == 'present'
                      ? R.colors.WHITE
                      : R.colors.PRIMARI_DARK,
                }}>
                Present
              </Text>
            </View>
          </Pressable>
          <Pressable onPress={() => setSelecteditem('late')}>
            <View
              style={{
                backgroundColor:
                  selecteditem == 'late' ? R.colors.primary : R.colors.WHITE,
                flexDirection: 'column',
                borderRadius: 10,
                height: 130,
                width: 100,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 30,
                  textAlign: 'center',
                  borderRadius: 80,
                  backgroundColor: 'pink',
                  marginTop: 10,
                  color: '#FF5C3A',
                  padding: 15,
                  width: 50,
                }}>
                {report?.daysLate}
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  color:
                    selecteditem == 'late'
                      ? R.colors.WHITE
                      : R.colors.PRIMARI_DARK,
                  paddingTop: 10,
                }}>
                Late
              </Text>
            </View>
          </Pressable>
          <Pressable onPress={() => setSelecteditem('absent')}>
            <View
              style={{
                backgroundColor:
                  selecteditem == 'absent' ? R.colors.primary : R.colors.WHITE,
                flexDirection: 'column',
                borderRadius: 10,
                height: 130,
                width: 100,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontWeight: '500',
                  fontSize: 30,
                  textAlign: 'center',
                  borderRadius: 50,
                  backgroundColor: 'pink',
                  marginTop: 10,
                  color: '#FF5C3A',
                  padding: 10,
                }}>
                {report?.absentDays}
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  color:
                    selecteditem == 'absent'
                      ? R.colors.WHITE
                      : R.colors.PRIMARI_DARK,
                  paddingTop: 10,
                }}>
                Absent
              </Text>
            </View>
          </Pressable>
        </View>
        <FlatList
          data={data}
          renderItem={({item}) => <Item item={item} />}
          keyExtractor={item => item.id}
        />
      </ImageBackground>
    </ScreenWrapper>
  );
};

const Item = ({item}) => {
  console.log(item);

  const timestamp = item?.attendance ? item?.attendance[0].clock_in_time : null;
  const date = new Date(timestamp);

  // Extract hours and minutes
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  const out = item?.attendance ? item?.attendance[0].clock_out_time : null;
  const dateOut = new Date(out);

  // Extract hours and minutes
  const hoursOut = date.getHours().toString().padStart(2, '0');
  const minutesOut = date.getMinutes().toString().padStart(2, '0');
  // Format as hh:mm
  const formattedTime = `${hoursOut}:${minutesOut}`;

  return (
    <>
      <View style={styles.textbar}>
        {/* <View style={styles.ImageView}>
          <Text
            style={{
              fontWeight: '500',
              fontSize: 25,
              height: 65,
              width: 65,
              textAlign: 'center',
              backgroundColor: R.colors.CGRAY,
              paddingTop: 15,

              borderRadius: 50,
              color: R.colors.PRIMARI_DARK,
            }}>
            01
          </Text>
        </View> */}
        <View>
          <Text
            style={{
              color: R.colors.PRIMARI_DARK,
              fontWeight: 'bold',
              fontSize: 18,
            }}>
            Check-in
          </Text>
          <Text
            style={{
              color: R.colors.SECONDARY,
              fontWeight: 'bold',
              fontSize: 20,
            }}>
            {item?.attendance ? `${hours}:${minutes}` : 'Absent'}
          </Text>
        </View>
        <View>
          <Text
            style={{
              color: R.colors.PRIMARI_DARK,
              fontWeight: 'bold',
              fontSize: 18,
            }}>
            Check-out
          </Text>

          <Text style={{color: '#FF5C3A', fontWeight: 'bold', fontSize: 20}}>
            {item?.attendance ? formattedTime : 'Absent'}
          </Text>
        </View>
      </View>
      {/* <View
        style={{
          paddingLeft: 130,
          flexDirection: 'row',
          color: R.colors.PRIMARI_DARK,
        }}>
        <Icon
          name="map-marker"
          size={25}
          color={R.colors.PRIMARI_DARK}
          style={{color: '#FFA200'}}
        />
        <Text style={{fontSize: 15, color: R.colors.PRIMARI_DARK}}>
          8 S Jefferson St, New Ulm, MN
        </Text>
      </View> */}
    </>
  );
};

export default AttendancereportScreen;
const styles = StyleSheet.create({
  textview: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
  },
  textbar: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'space-around',
    borderBottomWidth: 0.5,
  },
  // ImageView: {
  //   height: 70,
  //   width: 70,
  //   backgroundColor: R.colors.CGRAY,

  // },
});
