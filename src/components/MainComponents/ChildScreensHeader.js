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
// import colors from '../../../colors';

export default function ChildScreensHeader({screenName, style}) {
  const navigation = useNavigation();

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
      <StatusBar backgroundColor={R.colors.SLATE_GRAY} barStyle="light-content" />
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
    </View>
  );
}

const styles = StyleSheet.create({});
