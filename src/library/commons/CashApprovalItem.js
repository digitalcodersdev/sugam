import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useRef, useState} from 'react';
import R from '../../resources/R';
import {useNavigation} from '@react-navigation/native';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import moment from 'moment';
import ConfirmationModal from '../modals/ConfirmationModal';
import UserApi from '../../datalib/services/user.api';

const CashApprovalItem = ({item, getData}) => {
  const navigation = useNavigation();
  const [isVis, onModalClose] = useState(false);
  const [loading, setLoading] = useState(false);
  const msg = useRef();
  const status = useRef();
  const updatePaymentStatus = async status => {
    try {
      setLoading(true);
      const payload = {
        data: {
          status: status,
          requestId: item.RequestID,
        },
      };
      const response = await new UserApi().updatePaymentStatus(payload);
      if (response) {
        Alert.alert(
          'Cash Approval',
          'Cash Approval has been updated successfully',
        );
        getData();
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const handleConfirm = data => {
    onModalClose(false);
    if (data == 'Approved') {
      updatePaymentStatus(data);
    } else {
      updatePaymentStatus(data);
    }
  };

  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        navigation.navigate(ScreensNameEnum.CENTER_COLECTION_SCREEN, {})
      }>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerItem}>
          <Text style={styles.headerLabel}>Center</Text>
          <Text style={styles.headerValue}>{item.centreid}</Text>
        </View>
        <View style={styles.headerItem}>
          <Text style={styles.headerLabel}>Name</Text>
          <Text style={styles.headerValue}>
            {item?.cename?.trim() || 'N/A'}
          </Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoContainer}>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Amount</Text>
          <Text style={styles.value}>₹ {item?.Amount || 0}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Requested Date</Text>
          <Text style={[styles.value, styles.dateValue]}>
            {item?.RequestDate
              ? moment(item?.RequestDate).format('YYYY-MM-DD')
              : '-'}
          </Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Staff Name</Text>
          <Text style={[styles.value, styles.staffValue]}>
            {item?.staffname || 'N/A'}
          </Text>
        </View>
      </View>

      {/* Buttons Section */}
      {item?.Status == 'Pending' ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.receivedButton]}
            onPress={() => {
              msg.current = `Are you sure you have received ${item?.Amount}/Rs for loan id : ${item.LoanID}`;
              onModalClose(true);
              status.current = 'Approved';
            }}>
            <Text style={styles.buttonText}>Mark Received</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.missingButton]}
            onPress={() => {
              msg.current = `Are you sure ${item?.Amount} Rs is missing for loan id : ${item.LoanID}`;
              onModalClose(true);
              status.current = 'Missing';
            }}>
            <Text style={styles.buttonText}>Mark Missing</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text
          style={{
            color: R.colors.PRIMARI_DARK,
            fontSize: R.fontSize.L,
            fontWeight: '600',
          }}>
          {item?.Status == 'Approved' ? 'Approved' : 'Missing Marked'} on :{' '}
          <Text style={{color: R.colors.DARK_BLUE}}>
            {moment(item?.ApprovalDate).format('YYYY-MM-DD')}
          </Text>
        </Text>
      )}
      <ConfirmationModal
        isVisible={isVis}
        onModalClose={onModalClose}
        confirmationText={msg.current}
        onConfirm={handleConfirm}
        status={status.current}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fdfdfd',
    borderRadius: 12,
    marginVertical: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: R.colors.SLATE_GRAY,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  headerItem: {
    alignItems: 'flex-start',
    flex: 1,
    paddingHorizontal: 5,
  },
  headerLabel: {
    fontSize: 14,
    color: R.colors.SLATE_GRAY,
    fontWeight: '600',
  },
  headerValue: {
    fontSize: 16,
    color: R.colors.PRIMARI_DARK,
    fontWeight: '700',
    marginTop: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoBlock: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#f4f4f8',
    borderRadius: 8,
    padding: 10,
  },
  label: {
    fontSize: 13,
    color: R.colors.SLATE_GRAY,
    fontWeight: '500',
    marginBottom: 6,
  },
  value: {
    fontSize: 15,
    color: R.colors.PRIMARI_DARK,
    fontWeight: '700',
  },
  dateValue: {
    color: R.colors.GREEN,
  },
  staffValue: {
    color: R.colors.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  receivedButton: {
    backgroundColor: R.colors.GREEN,
  },
  missingButton: {
    backgroundColor: R.colors.RED,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});

export default CashApprovalItem;
