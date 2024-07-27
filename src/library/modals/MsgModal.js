import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import Button from '../commons/Button';
import R from '../../resources/R';
/*
 * This function is used to create the confirmation modal
 * @author Kindajobs <mohitkumar.webdev@gmail.com>
 */
const MsgModal = ({
  isVisible,
  confirmationText = '',
  onModalClose,
  onConfirm,
}) => {
  const handleConfirm = () => {
    onModalClose();
    onConfirm && onConfirm();
  };
  return (
    <Modal
      isVisible={isVisible}
      swipeDirection="down"
      onSwipeComplete={e => {
        onModalClose(false);
      }}
      onBackdropPress={e => {
        onModalClose(false);
      }}
      style={styles.modalContainer}>
      <View style={styles.modalInnerContainer}>
        {/* <View style={styles.backgroundColor}> */}
        <View
          style={{
            backgroundColor: R.colors.primary,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}>
          <Text
            style={{
              color: R.colors.PRIMARY_LIGHT,
              fontWeight: 'bold',
              padding: 10,
              textAlign: 'center',
              fontSize: R.fontSize.L,
            }}>
            Password Reset Email Sent
          </Text>
        </View>
        <View style={{padding: 20}}>
          <Text style={styles.modalHeaderText}>
            An email has been sent to you follow direction in the email to reset
            Password
          </Text>
          {/* </View> */}

          <Button
            title={'OK'}
            onPress={() => onModalClose(false)}
            buttonStyle={styles.buttonText}
            textColor={R.colors.PRIMARY_LIGHT}
            textStyle={{fontWeight: 'bold'}}
          />
        </View>
      </View>
    </Modal>
  );
};

export default MsgModal;

const styles = StyleSheet.create({
  modalHeaderText: {
    color: R.colors.PRIMARI_DARK,
    textAlign: 'center',
    fontFamily: R.fonts.Regular,
    fontSize: R.fontSize.M,
    paddingVertical: 10,
    marginBottom: 10,
  },
  modalContainer: {
    justifyContent: 'center',
    margin: 20,
    overflow: 'hidden',
  },
  modalInnerContainer: {
    backgroundColor: 'white',
    minHeight: 200,
    borderRadius: 20,
    justifyContent: 'space-between',
    borderRadius: 12,
  },
  modalFooterText: {
    flexDirection: 'row',
  },
  buttonText: {
    width: '50%',
    alignSelf: 'center',
    backgroundColor: R.colors.lightYellow,
  },
});
