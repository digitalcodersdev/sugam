import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import R from '../../resources/R';

export default function ChildScreensHeader({screenName, style, date, onPress}) {
  const navigation = useNavigation();

  console.log(date);
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          padding: 5,
          elevation: 1,
          backgroundColor: R.colors.SLATE_GRAY,
        },
        style,
      ]}>
      <StatusBar
        backgroundColor={R.colors.SLATE_GRAY}
        barStyle="light-content"
      />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="chevron-left" size={40} color={R.colors.PRIMARY_LIGHT} />
      </TouchableOpacity>
      <Text
        style={{
          fontFamily: 'Rubik',
          fontSize: R.fontSize.XL,
          marginHorizontal: 10,
          color: R.colors.PRIMARY_LIGHT,
          textAlign: 'left',
          width: '75%',
          fontWeight: 'bold',
        }}>
        {screenName}
      </Text>
      {date && (
        <Icon
          name="calendar-month"
          color={R.colors.PRIMARY_LIGHT}
          size={30}
          onPress={onPress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
