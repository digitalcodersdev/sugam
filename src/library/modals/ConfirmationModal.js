import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import Button from '../commons/Button';
import R from '../../resources/R';
/*
 * This function is used to create the confirmation modal
 * @author Sugam <mohitkumar.webdev@gmail.com>
 */
const ConfirmationModal = ({
  isVisible,
  confirmationText = '',
  onModalClose,
  onConfirm,
  status,
}) => {
  const handleConfirm = () => {
    onModalClose();
    onConfirm && onConfirm(status ? status : 'confirm');
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
        <View style={styles.backgroundColor}>
          <Text style={styles.modalHeaderText}>{confirmationText}</Text>
        </View>
        <View style={styles.modalFooterText}>
          <Button
            title={'Cancel'}
            onPress={() => onModalClose(false)}
            buttonStyle={styles.buttonText}
            backgroundColor={R.colors.PRIMARY_LIGHT}
            textColor={R.colors.SECONDRY_DARK}
            textStyle={{fontWeight: '800'}}
          />
          <Button
            title={'Confirm'}
            onPress={handleConfirm}
            buttonStyle={styles.buttonText}
            textStyle={{fontWeight: '800'}}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  modalHeaderText: {
    color: R.colors.PRIMARI_DARK,
    textAlign: 'center',
    fontFamily: R.fonts.Regular,
    fontSize: R.fontSize.L,
    paddingVertical: 10,
    marginBottom: 10,
    fontWeight: '700',
  },
  backgroundColor: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flex: 3,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalInnerContainer: {
    backgroundColor: 'white',
    minHeight: 200,
    borderRadius: 20,
    justifyContent: 'space-between',
    padding: 10,
  },
  modalFooterText: {
    flexDirection: 'row',
  },
  buttonText: {
    flex: 1,
    marginHorizontal: 5,
    fontWeight: 'bold',
    borderRadius: 12,
  },
});
