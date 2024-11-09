import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {currentUserSelector, pendingEnrollmentsSelector} from '../../store/slices/user/user.slice';
import {getPendingEnrollments} from '../../store/actions/userActions';

const PendingEnrollments = () => {
  const dispatch = useDispatch();
  const user = useSelector(currentUserSelector)
  const enrollments = useSelector(pendingEnrollmentsSelector);
  console.log(user);
  useEffect(() => {
    if (enrollments?.length) {
    //   dispatch(getPendingEnrollments());
    }
  }, []);
  return (
    <View>
      <Text>PendingEnrollments</Text>
    </View>
  );
};

export default PendingEnrollments;
