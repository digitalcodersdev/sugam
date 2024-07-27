import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import UserApi from '../../datalib/services/user.api';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

const TaskDetailsScreen = ({route}) => {
  const [task, setTask] = useState({});
  useEffect(() => {
    if (route.params.taskId) {
      getTaskDetails({id: route.params.taskId});
    }
  }, [route.params.taskId]);

  const getTaskDetails = async ({id}) => {
    try {
      const res = await new UserApi().fetchTaskDetailsById({id});
      if (res) {
        setTask(res);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log('task details', task);
  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader
        style={{backgroundColor: R.colors.PRIMARY_LIGHT}}
        screenName={'Task Details'}
      />
      <View style={styles.taskdetails}>
        <View style={styles.statusView}>
          <Text
            style={{
              fontSize: 20,
              textTransform: 'capitalize',
              color: task?.status == 'incomplete' ? 'red' : 'green',
              fontWeight: 'bold',
            }}>
            {task?.status}
          </Text>
          <View style={styles.rock}>
            <Text style={{fontSize: 20, flex: 1}}>Start Date</Text>
            <Text style={{fontSize: 20, flex: 1}}>
              {moment(task?.start_date).format('DD MMM YY')}
            </Text>
          </View>
          <View style={styles.rock}>
            <Text style={{fontSize: 20, flex: 1}}>Due Date</Text>
            <Text style={{fontSize: 20, flex: 1}}>
              {moment(task?.due_date).format('DD MMM YY')}
            </Text>
          </View>
          <View style={styles.rock}>
            <Text style={{fontSize: 20, flex: 1}}>Hours Logged</Text>
            <Text style={{fontSize: 20, flex: 1}}>1m</Text>
          </View>
        </View>
        <View style={styles.rock}>
          <Text style={{fontSize: 20, flex: 1}}>Project</Text>
          <Text style={{fontSize: 40, flex: 1}}>---</Text>
        </View>
        <View style={styles.rock}>
          <Text style={{fontSize: 20, flex: 1}}>Priority</Text>
          <Text
            style={{
              fontSize: 20,
              textTransform: 'capitalize',
              flex: 1,
            }}>
            {task?.priority}
          </Text>
        </View>
        <View style={styles.rock}>
          <Text style={{fontSize: 20, flex: 1}}>Assigned To</Text>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="account-circle"
              size={25}
              color={R.colors.PRIMARI_DARK}
              style={{paddingLeft: 75}}
            />
            <Icon
              name="account-circle"
              size={25}
              color={R.colors.PRIMARI_DARK}
            />
          </View>
        </View>
        <View style={styles.rock}>
          <Text style={{fontSize: 20, flex: 1}}>Short Code</Text>
          <Text style={{fontSize: 40, flex: 1}}>---</Text>
        </View>
        <View style={styles.rock}>
          <Text style={{fontSize: 20, flex: 1}}>Milestones</Text>
          <Text style={{fontSize: 40, flex: 1}}>---</Text>
        </View>
        <View style={styles.rock}>
          <Text style={{fontSize: 20, flex: 1}}>Assigned By</Text>
          <Text style={{fontSize: 20, flex: 1}}>Mr. Prateek Goyal</Text>
        </View>
        <View style={styles.rock}>
          <Text style={{fontSize: 20, flex: 1}}>Label</Text>
          <Text style={{fontSize: 40, flex: 1}}>---</Text>
        </View>
        <View style={styles.rock}>
          <Text style={{fontSize: 20, flex: 1}}>Task Category</Text>
          <Text style={{fontSize: 40, flex: 1}}>---</Text>
        </View>
        <View style={styles.rock}>
          <Text style={{fontSize: 20, flex: 1}}>Description</Text>
          <Text style={{fontSize: 20, flex: 1}}>This Is Task Details</Text>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default TaskDetailsScreen;

const styles = StyleSheet.create({
  taskdetails: {
    flexDirection: 'column',
    marginLeft: 20,
  },
  rock: {flexDirection: 'row', color: R.colors.PRIMARI_DARK, marginTop: 20},
  statusView: {
    // borderRadius: 20,
    // flexDirection: 'row',
    color: R.colors.PRIMARI_DARK,
    marginTop: 20,
    borderBottomWidth: 0.5,
    paddingVertical: 10,
  },
});
