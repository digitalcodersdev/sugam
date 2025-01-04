import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Pressable, Image} from 'react-native';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from 'library/commons/Button';
import R from 'resources/R';
import Images from 'library/commons/Images';
import FeedbackButton from 'library/commons/FeedbackButton';
import ScreenWrapper from 'library/wrapper/ScreenWrapper';
import BottomBar from 'library/commons/BottomBar';
import Profile from 'library/commons/Profile';

import AddPicture from 'library/commons/AddPicture';
import ConfirmationModal from 'library/modals/ConfirmationModal';
import {useSelector, useDispatch} from 'react-redux';
import {getCurrentJob, cancelJob} from '../../store/actions/jobActions';
import moment from 'moment';
/*
 * This function Component is used to render Job History Screen
 * @author Sugam <mohitkumar.webdev@gmail.com>
 */
const JobHistoryScreen = () => {
  const job = useSelector(state => state?.job.currentJob);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isConfirmModal, setConfirmModal] = useState(false);
  const [isAccepted, setAccepted] = useState(true);
  const [imageUrl, setImageUrl] = useState(job ? job.images.split(',') : []);
  const {skills} = job;
  console.log(skills);
  // const [currentJob, setCurrentJob] = useState();
  let star = [1, 2, 3, 4, 5];
  const user = useSelector(state => state?.user.user);
  const onImageChange = img => {
    setImageUrl([...img]);
  };
  const handleOnConfirm = () => {
    const res = dispatch(cancelJob(job.job.id));
    if (res) {
      navigation.reset({
        index: 0,
        routes: [{name: ScreensNameEnum.JOB_HOME_SCREEN}],
      });
    }
  };
  return (
    <ScreenWrapper header={true}>
      <View style={styles.first1}>
        <View style={styles.containerJob}>
          <View style={styles.headerButtonContainer}>
            <Button
              title={'Start Dispute'}
              backgroundColor={'#F8F8FC'}
              textColor={'#000000'}
              buttonStyle={styles.disputeButtonStyle}
            />
          </View>
          <View style={styles.profileContainer}>
            <Profile job={job} user={user} />
          </View>
          <View style={styles.messageContainer}>
            <View style={styles.btnContainer}>
              <Button title={'Message'} buttonStyle={styles.msgBtn} />
            </View>
            <Text style={styles.skillText}>
              Required Skills:
              {job
                ? job.skills.map(item => (
                    <Text style={{color: '#1730B1'}}>{` ${item.title} `}</Text>
                  ))
                : ''}
            </Text>
            <Text style={styles.requiredTools}>Hammer Required</Text>
          </View>
          <View style={styles.img}>
            {/* <Images /> */}
            <AddPicture images={imageUrl} onImageChange={onImageChange} />
          </View>
          <View style={styles.lastContainerStyle}>
            <Text style={styles.detail}>{job ? job.description : ''}</Text>
            <Text style={styles.timeText}>
              {job ? job.duration : ''} {job ? job.durationUnit : ''}
              Job
            </Text>
            {/* <Text style={styles.timeText}>10 miles away</Text> */}
          </View>
          <View style={styles.final}>
            <FeedbackButton />
            <View style={styles.finalButton}>
              <Button
                title={'Payment Overview'}
                buttonStyle={{backgroundColor: '#E3AB1A'}}
                onPress={() =>
                  navigation.navigate(ScreensNameEnum.PAYMENT_OVERVIEW)
                }
              />
            </View>
          </View>
        </View>
      </View>
      <ConfirmationModal
        isVisible={isConfirmModal}
        onModalClose={setConfirmModal}
        confirmationText={'Are you sure you want to cancel this job?'}
        onConfirm={handleOnConfirm}
      />
    </ScreenWrapper>
  );
};
export default JobHistoryScreen;

const styles = StyleSheet.create({
  first1: {flex: 1, width: '90%', alignSelf: 'center'},
  container: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
  },
  headerButtonContainer: {
    flex: 1,
  },
  middleContainer: {flex: 1},
  bottomContainer: {
    backgroundColor: '#0F172A',
    height: 100,
  },
  TopBarText: {
    color: '#FFFFFF',
    fontSize: 20,
    marginVertical: 15,
    textAlign: 'center',
    paddingTop: 15,
  },
  iconStyle: {
    alignSelf: 'center',
  },
  containerJob: {
    flex: 1,
    flexDirection: 'column',
  },
  text1: {
    color: '#1730B1',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: R.fonts.Bold,
  },
  profileContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  btn: {
    width: '30%',
    marginTop: 10,
    marginHorizontal: 10,
  },
  imageContainer: {
    alignSelf: 'center',
    borderWidth: 1,
    height: 100,
    width: 100,
    top: 10,
    borderRadius: 120,
  },
  ratingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  priceContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  price: {
    color: R.colors.PRIMARI_DARK,
    fontSize: 20,
  },
  time: {
    color: R.colors.PRIMARI_DARK,
    fontSize: 16,
  },
  rating: {
    flexDirection: 'column',
  },
  name: {
    color: R.colors.PRIMARI_DARK,
    fontSize: 14,
    textAlign: 'center',
  },
  userRating: {
    color: R.colors.PRIMARI_DARK,
    textAlign: 'center',
  },
  reviewCount: {
    color: '#3366FF',
    textAlign: 'center',
  },
  flagConatiner: {
    flex: 1,
  },
  icon: {alignSelf: 'center'},
  messageContainer: {
    flex: 1,
    flexDirection: 'column',
    top: 20,
  },
  skillText: {
    color: R.colors.PRIMARI_DARK,
    fontSize: 16,
    textAlign: 'center',
    // margin: 10,
  },
  requiredTools: {
    color: R.colors.PRIMARI_DARK,
    fontSize: 16,
    textAlign: 'center',
  },
  msgBtn: {
    backgroundColor: '#118CFE',
  },
  btnContainer: {
    marginHorizontal: 140,
    height: 60,
  },
  img: {
    top: 10,
    flex: 1,
    margin: 10,
    marginHorizontal: 20,
  },
  detail: {
    color: R.colors.PRIMARI_DARK,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  timeText: {
    textAlign: 'center',
    fontSize: 14,
    color: R.colors.PRIMARI_DARK,
  },
  lastContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 10,
  },
  final: {
    flexDirection: 'column',
  },
  feedBackButton: {
    height: 50,
    width: 50,
    borderWidth: 1,
    borderRadius: 120,
    backgroundcolor: R.colors.PRIMARI_DARK,
    margin: 10,
    alignSelf: 'flex-end',
    bottom: 20,
  },
  feedBackText: {
    flex: 1,
    fontSize: 40,
    color: 'white',
    textAlign: 'center',
  },
  finalButton: {
    marginHorizontal: 20,
    bottom: 20,
  },
  candidatesCount: {
    width: '100%',
    backgroundColor: '#0F172A',
    height: 80,
  },
  candidatesCountText: {
    textAlign: 'center',
    fontSize: 25,
    color: 'white',
    margin: 20,
  },
  borromContainer: {
    // height: 100,
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disputeButtonStyle: {
    width: '50%',
    alignSelf: 'center',
    padding: 30,
  },
});
