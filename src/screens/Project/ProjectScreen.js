import {View, Text, StyleSheet, FlatList, Pressable} from 'react-native';
import React, {useEffect} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScrollView} from 'react-native-gesture-handler';
import {fetchAllProjects} from '../../store/actions/userActions';
import {useDispatch, useSelector} from 'react-redux';
import {projectsSelector} from '../../store/slices/user/user.slice';
import {useNavigation} from '@react-navigation/native';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import moment from 'moment';
const ProjectScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const projects = useSelector(projectsSelector);
  useEffect(() => {
    getAllTask();
  }, []);
  const getAllTask = async () => {
    try {
      await dispatch(fetchAllProjects());
    } catch (error) {
      console.log(error);
    }
  };
  console.log('Projects', projects);
  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader
        style={{backgroundColor: R.colors.PRIMARY_LIGHT}}
        screenName={'Project'}
      />
      {/* <ScrollView horizontal={true}>
        <View style={styles.placeView}>
          <View style={styles.textview}>
            <Text>Code</Text>
            <Icon
              name="swap-vertical"
              size={15}
              color={R.colors.PRIMARI_DARK}
              style={{}}
            />
            <View style={styles.colomview}>
              <Text>project </Text>
              <Text>Name</Text>
            </View>
            <Icon
              name="swap-vertical"
              size={15}
              color={R.colors.PRIMARI_DARK}
              style={{}}
            />
            <Text>Members</Text>
            <Icon
              name="swap-vertical"
              size={15}
              color={R.colors.PRIMARI_DARK}
              style={{}}
            />
            <Text>Client</Text>
            <Icon
              name="swap-vertical"
              size={15}
              color={R.colors.PRIMARI_DARK}
              style={{}}
            />
            <Text>Status</Text>
            <Icon
              name="swap-vertical"
              size={15}
              color={R.colors.PRIMARI_DARK}
              style={{}}
            />
            <Text>Action</Text>
          </View>
        </View>
      </ScrollView> */}
      {/* <View style={styles.headerView}>
        <View style={styles.labelView}>
          <Text style={styles.label}>Project</Text>
          <Icon
            name="swap-vertical"
            size={15}
            color={R.colors.PRIMARI_DARK}
            style={{}}
          />
        </View>

        <View style={[styles.labelView, {flex: 1.1}]}>
          <Text style={styles.label}>Start Date</Text>

          <Icon name="swap-vertical" size={15} color={R.colors.PRIMARI_DARK} />
        </View>
        <View style={styles.labelView}>
          <Text style={styles.label}>Deadline</Text>
          <Icon name="swap-vertical" size={15} color={R.colors.PRIMARI_DARK} />
        </View>
        <View style={styles.labelView}>
          <Text style={styles.label}>Status</Text>
          <Icon name="swap-vertical" size={15} color={R.colors.PRIMARI_DARK} />
        </View>
        <View style={[styles.labelView, {flex: 0.6}]}>
          <Text style={styles.label}>Action</Text>
        </View>
      </View> */}
      {projects?.length >= 1 ? (
        <FlatList
          data={projects}
          keyExtractor={item => item.company_id}
          renderItem={({item}) => <Item item={item} navigation={navigation} />}
        />
      ) : (
        <Text
          style={{
            color: R.colors.LIGHTGRAY,
            flex: 1,
            textAlign: 'center',
            textAlignVertical: 'center',fontSize:R.fontSize.XXXL
          }}>
          No Projects Found
        </Text>
      )}
    </ScreenWrapper>
  );
};
const Item = ({item, navigation}) => (
  <View style={styles.taskView}>
    {/* <View style={styles.ImageView}>
  <Image source={require('../../assets/Images/Image.png')} />
</View> */}
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <Text style={[styles.nameText]}>{item.project_name}</Text>
      <Text style={[styles.dateText]}>
        {`${moment(item.start_date).format('DD MMM YY')} - ${moment(
          item.deadline,
        ).format('DD MMM YY')}`}
      </Text>
      {/* <Text>Sick Leave Request</Text> */}
    </View>
    <View style={styles.acceptView}>
      <Pressable style={styles.pendingView}>
        <Text style={styles.pendingText}>{item?.status}</Text>
      </Pressable>
      {/* <Pressable
        style={styles.cancelView}
        onPress={() =>
          navigation.navigate(ScreensNameEnum.TASK_DETAILS_SCREEN, {
            taskId: item?.id,
          })
        }>
        <Text style={styles.cancelText}>View Task</Text>
      </Pressable> */}
    </View>
  </View>
  // <View
  //   style={[
  //     styles.headerView,
  //     {backgroundColor: R.colors.PRIMARY_LIGHT, borderBottomWidth: 0.6},
  //   ]}>
  //   <View style={styles.labelView}>
  //     <Text style={styles.title}>{item.heading}</Text>
  //   </View>
  //   <View style={styles.labelView}>
  //     <Text style={[styles.title,{flex:1.1}]}>
  //       {moment(item.start_date).format('DD/MM/YYYY')}
  //     </Text>
  //   </View>
  //   <View style={styles.labelView}>
  //     <Text style={styles.title}>
  //       {moment(item.due_date).format('DD/MM/YYYY')}
  //     </Text>
  //   </View>
  //   <View style={styles.labelView}>
  //     <Text style={[styles.title, {color: R.colors.RED}]}>{item.status}</Text>
  //   </View>
  //   <View style={[styles.labelView, {flex: 0.6}]}>
  //     <Pressable
  //       onPress={() =>
  //         navigation.navigate(ScreensNameEnum.PROJECT_DETAILS_SCREEN, {
  //           projectId: item?.id,
  //         })
  //       }>
  //       <Text
  //         style={{
  //           backgroundColor: R.colors.primary,
  //           color: R.colors.PRIMARY_LIGHT,
  //           padding: 5,
  //           borderRadius: 12,
  //           paddingHorizontal: 5,
  //         }}>
  //         View
  //       </Text>
  //     </Pressable>
  //   </View>
  // </View>
);
export default ProjectScreen;
const styles = StyleSheet.create({
  placeView: {
    height: 50,
    width: 600,
    backgroundColor: R.colors.CGRAY,
    marginTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  textview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    color: R.colors.PRIMARI_DARK,
    fontSize: 20,
  },
  colomview: {flexDirection: 'column'},
  textview: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // margin: 10,
    alignItems: 'center',
    backgroundColor: R.colors.LIGHTGRAY,
    padding: 8,
  },
  nothing: {
    flexDirection: 'column',
  },
  labelView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    flexWrap: 'wrap',
  },
  label: {fontWeight: 'bold'},
  taskView: {
    flexDirection: 'row',
    backgroundColor: R.colors.PRIMARY_LIGHT,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: R.colors.LIGHTGRAY,
    marginHorizontal: 10,
    alignItems: 'center',
    // elevation: 5,
    // shadowOffset: {
    //   height: 5,
    //   width: 0, // Adjust as needed
    // },
    // shadowOpacity: 0.5, // Adjust as needed
    // shadowRadius: 5, // Adjust as needed
    shadowColor: R.colors.LIGHTGRAY,
    borderColor: '#ccc',
    marginTop: 10,
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: R.colors.PRIMARI_DARK,
    textTransform: 'capitalize',
  },
  dateText: {color: R.colors.primary, fontSize: 15},
  ImageView: {paddingRight: 20, paddingLeft: 20},
  acceptView: {
    flexDirection: 'column',
    // justifyContent: 'space-between',
    // flex: 1,
  },
  pendingView: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  cancelView: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  pendingText: {
    color: R.colors.TEXT_COLOR,
    fontWeight: 'bold',
    // backgroundColor: '#FFF7E5',
    borderRadius: 20,
    padding: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  cancelText: {
    color: R.colors.PRIMARY_LIGHT,
    fontWeight: 'bold',
    borderRadius: 20,
    backgroundColor: 'red',
    padding: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
