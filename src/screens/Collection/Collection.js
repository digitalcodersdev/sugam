import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';

const Collection = () => {
  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={'Collection'} />
      <View style={styles.container}></View>
    </ScreenWrapper>
  );
};

export default Collection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
