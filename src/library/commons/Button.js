import React, {FunctionComponent} from 'react';
import {StyleSheet, Pressable, View} from 'react-native';
import ButtonWrapper from '../wrapper/ButtonWrapper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import R from '../../resources/R';

// const btnTypes = ['primary', 'secondry', 'danger', 'info']
/*
 * This function is used to create our Universal Button
 * @author Sugam <mohitkumar.webdev@gmail.com>
 */
const Button = ({
  title = '',
  loading = false,
  disabled = false,
  onPress,
  layout = 'simple',
  backgroundColor = R.colors.primary,
  iconColor = '#FFF',
  icon,
  buttonStyle = {},
  textStyle = {},
  size= 20,
  textColor = '#FFF',
}) => {
  return layout === 'simple' ? (
    <ButtonWrapper
      title={title}
      loading={loading}
      disabled={disabled}
      style={[
        styles.btnStyle,
        disabled ? styles.disabledStyle : {backgroundColor: backgroundColor},
        buttonStyle,
      ]}
      textStyle={[styles.textStyle, {color: textColor}, textStyle]}
      onPress={onPress}
      indicatorColor={'white'}
    />
  ) : (
    <Pressable
      onPress={onPress}
      android_ripple={{color: 'grey', borderless: true}}
      style={[
        styles.circleBtn,
        {backgroundColor: backgroundColor},
        buttonStyle,
      ]}>
      <Icon name={icon} size={size} color={iconColor} />
    </Pressable>
  );
};
export default Button;
const styles = StyleSheet.create({
  btnStyle: {
    borderRadius: 30,
    paddingVertical: 12,
    justifyContent: 'center',
    width: '100%',
    elevation: 2,
  },
  activeStyle: {backgroundColor: '#ffb606'},
  disabledStyle: {backgroundColor: 'grey'},
  textStyle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    margin: 3,
    fontFamily: R.fonts.Medium,
    textTransform:"uppercase"
  },
  circleBtn: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
});
