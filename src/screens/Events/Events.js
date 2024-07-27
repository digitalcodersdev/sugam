import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import R from '../../resources/R';

const Events = () => {
  return (
    <ScreenWrapper header={false}>
      <View style={styles.container}>
        <Text
          style={{
            fontSize: R.fontSize.XXXXL,
            textAlign: 'center',
            textAlignVertical: 'center',
            color: R.colors.LIGHTGRAY,
          }}>
          coming soon...
        </Text>
      </View>
    </ScreenWrapper>
  );
};

export default Events;

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});
