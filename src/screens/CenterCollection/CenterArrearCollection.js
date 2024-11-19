import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';
import CircularProgress from '../../components/CircularProgress';
import {useDispatch, useSelector} from 'react-redux';
import {
  currentDayCollectionCenterSelector,
  currentUserSelector,
} from '../../store/slices/user/user.slice';
import Loader from '../../library/commons/Loader';
import {fetchCurrentDayCollectionByCenterId} from '../../store/actions/userActions';
import UserAPi from '../../datalib/services/user.api';
import moment from 'moment';
import ClientArrearItem from '../../library/commons/ClientArrearItem';

const CenterArrearCollection = ({route}) => {
  const dispatch = useDispatch();
  const user = useSelector(currentUserSelector);
  const collections = useSelector(currentDayCollectionCenterSelector);
  const {CenterID, Meeting_Time, BranchName, cename, ceday, BranchID} =
    route?.params?.centerData;

  const [loading, setLoading] = useState(false);
  const [meeting, setMeeting] = useState(null);

  const data = collections?.find(item => item.centreid === CenterID);

  const target = collections?.reduce(
    (acc, current) => acc + parseInt(current.TodayEMI, 10),
    0,
  );

  const received = collections?.reduce(
    (acc, current) => acc + parseInt(current.TodayColl, 10),
    0,
  );

  const finData = {
    TARGET: target,
    RECEIVED: received,
    duebalance: target - received,
  };

  const percentage = useCallback(() => {
    if (finData?.RECEIVED && finData?.TARGET) {
      return (
        (parseInt(finData?.RECEIVED, 10) / parseInt(finData?.TARGET, 10)) * 100
      );
    }
    return 0;
  }, [finData?.RECEIVED, finData?.TARGET]);

  useEffect(() => {
    fetchMeetingStatus();
  }, [CenterID, BranchID]);
  const fetchMeetingStatus = async () => {
    try {
      setLoading(true);
      const response = await new UserAPi().fetchMeetingStatus({
        CenterID,
        BranchID,
        MeetingDate: moment(new Date()).format('YYYY-MM-DD'),
      });
      console.log('Start Meeting', response);
      if (response?.data?.length >= 1) {
        setMeeting(response?.data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const startMeeting = async () => {
    try {
      const response = await new UserAPi().startMeeting({
        CenterID,
        BranchID,
      });
      if (response) {
        fetchMeetingStatus();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const endMeeting = async () => {
    try {
      setLoading(true);
      const response = await new UserAPi().endMeeting({
        CenterID,
        BranchID,
      });
      if (response) {
        fetchMeetingStatus();
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.branchid) {
      fetchFloCollection();
    }
  }, [user, CenterID]);

  const fetchFloCollection = async () => {
    try {
      setLoading(true);
      await dispatch(
        fetchCurrentDayCollectionByCenterId({
          centerId: CenterID,
          branchId: user?.branchid,
        }),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  function canStartMeeting(meetingTime) {
    // Get the current date and time
    const now = new Date();

    // Parse the meeting time
    const [time, modifier] = meetingTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    // Adjust hours for AM/PM
    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    // Create a Date object for the meeting time on the same day
    const meetingDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
    );

    // Compare the current time with the meeting time
    return now >= meetingDate;
  }

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName="Collection" />
      <View style={styles.centerDetailsContainer}>
        <View style={styles.progressContainer}>
          <CircularProgress
            percentage={percentage().toFixed(2)}
            fillColor={R.colors.GREEN}
            backgroundColor={R.colors.PRIMARY_LIGHT}
            textColor={R.colors.PRIMARY_LIGHT}
          />
          <CenterInfo
            data={data}
            Centerid={CenterID}
            Meeting_Time={Meeting_Time}
            BranchName={BranchName}
            cename={cename}
            ceday={ceday}
          />
        </View>
        <FinancialOverview data={finData} />
        {/* Fixed-position button */}
        <TouchableOpacity
          style={[
            styles.fixedButton,
            {
              backgroundColor:
                meeting && meeting.EndTime == null
                  ? R.colors.RED
                  : meeting && meeting.EndTime?.length >= 1
                  ? R.colors.orange
                  : R.colors.BLUE,
            },
          ]}
          onPress={() => {
            if (canStartMeeting(Meeting_Time)) {
              if (meeting && meeting?.EndTime?.length) {
                Alert.alert('Meeting Already Finished..');
                return;
              }
              if (meeting == null) {
                startMeeting();
                return;
              }
              if (meeting && meeting?.EndTime == null) {
                endMeeting();
              }
            } else {
              Alert.alert(
                'You can not start the meeting before the center meeting time...',
              );
            }
          }}>
          <Text
            style={[
              styles.buttonText,
              {
                backgroundColor:
                  meeting && meeting.EndTime == null
                    ? R.colors.RED
                    : meeting && meeting.EndTime?.length >= 1
                    ? R.colors.orange
                    : R.colors.BLUE,
              },
            ]}>
            {meeting && meeting?.EndTime?.length >= 1
              ? 'Meeting Finished'
              : meeting && meeting.EndTime == null
              ? 'End Meeting'
              : 'Start Meeting'}
          </Text>
        </TouchableOpacity>
      </View>
      <ClientsList
        collection={collections}
        Centerid={CenterID}
        loading={loading}
        meeting={meeting}
      />
      <Loader loading={loading} />
    </ScreenWrapper>
  );
};

const CenterInfo = ({
  data,
  Centerid,
  Meeting_Time,
  BranchName,
  cename,
  ceday,
}) => (
  <View style={styles.centerInfo}>
    <Text style={styles.value}>Branch Name: {BranchName}</Text>
    <Text style={styles.value}>Center Name: {cename}</Text>
    <Text style={styles.value}>Center ID: {Centerid}</Text>
    <Text style={styles.value}>Meeting Day: {ceday}</Text>
    <Text style={styles.value}>Meeting Time: {Meeting_Time}</Text>
  </View>
);

const FinancialOverview = ({data}) => (
  <View style={styles.financialOverview}>
    <InfoBlock
      label="Target"
      value={data?.TARGET}
      valueStyle={{color: R.colors.lightYellow}}
    />
    <InfoBlock
      label="Received"
      value={data?.RECEIVED}
      valueStyle={{color: R.colors.GREEN}}
    />
    <InfoBlock
      label="Balance"
      value={data?.duebalance >= 1 ? data?.duebalance : 0}
      valueStyle={{color: 'red'}}
    />
  </View>
);

const ClientsList = ({collection, Centerid, loading, meeting}) => (
  <View style={styles.container}>
    {collection.length > 0 && (
      <FlatList
        data={collection}
        keyExtractor={item => item?.customerid?.toString()}
        renderItem={({item, index}) => (
          <ClientArrearItem
            item={item}
            index={index}
            centerId={Centerid}
            meeting={meeting}
          />
        )}
        refreshing={loading}
        onRefresh={() => console.log('Refresh triggered')}
      />
    )}
  </View>
);

const InfoBlock = ({label, value, valueStyle}) => (
  <View style={styles.view}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, valueStyle, {textAlign: 'center'}]}>
      ₹{value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  centerDetailsContainer: {
    backgroundColor: R.colors.SLATE_GRAY,
    padding: 10,
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerInfo: {
    flex: 1,
    paddingHorizontal: 10,
  },
  financialOverview: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: R.colors.PRIMARY_LIGHT,
    padding: 10,
    borderRadius: 6,
  },
  label: {
    color: R.colors.PRIMARI_DARK,
    fontWeight: '500',
    fontSize: R.fontSize.L,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  value: {
    color: R.colors.PRIMARY_LIGHT,
    fontWeight: '700',
    fontSize: R.fontSize.L,
    textAlign: 'left',
    flexWrap: 'wrap',
  },
  view: {
    flex: 1,
    justifyContent: 'center',
  },
  fixedButton: {
    position: 'absolute',
    right: 10,
    backgroundColor: R.colors.PRIMARI_DARK,
    borderRadius: 12,
    padding: 8,
  },
  buttonText: {
    color: R.colors.WHITE,
    fontWeight: '800',
    fontSize: R.fontSize.M,
  },
});

export default CenterArrearCollection;
