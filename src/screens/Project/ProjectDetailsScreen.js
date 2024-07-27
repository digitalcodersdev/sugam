import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import UserApi from '../../datalib/services/user.api';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';

const ProjectDetailsScreen = ({route}) => {
  const [task, setTask] = useState({});
  useEffect(() => {
    if (route.params.taskId) {
      getProjectDetails({id: route.params.projectId});
    }
  }, [route.params.taskId]);

  const getProjectDetails = async ({id}) => {
    try {
      const res = await new UserApi().fetchProjectDetailsById({id});
      if (res) {
      setTask(res)
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
   <ScreenWrapper header={false}>
 <ChildScreensHeader
        style={{backgroundColor: R.colors.PRIMARY_LIGHT}}
        screenName={'Project Details'}
      />
   </ScreenWrapper>
  );
};

export default ProjectDetailsScreen;

const styles = StyleSheet.create({});
 