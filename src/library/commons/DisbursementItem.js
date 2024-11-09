import {StyleSheet, Text, View, Pressable, Animated, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import R from '../../resources/R';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ConfirmationModal from '../modals/ConfirmationModal';
import Loader from './Loader';
import UserApi from '../../datalib/services/user.api';
import {useSelector} from 'react-redux';
import {currentUserSelector} from '../../store/slices/user/user.slice';

const DisbursementItem = ({item, fetchData}) => {
  const [selected, setSelected] = useState('');
  const [expandAnim] = useState(new Animated.Value(0));
  const [isVis, onModalClose] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector(currentUserSelector);

  const {
    Borrower_Name,
    LoanID,
    SanctionAmount,
    ProcessingFee,
    Co_Borrower_Name,
    DocumentCharge,
    OtherCharges,
    TotalDeduction,
    Status,
  } = item;

  const icon = selected === LoanID ? 'chevron-up' : 'chevron-down';

  useEffect(() => {
    Animated.timing(expandAnim, {
      toValue: selected === LoanID ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [selected]);

  const scaleY = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleExpand = () => {
    setSelected(prevSelected => (prevSelected === LoanID ? '' : LoanID));
  };

  const upadteDisburse = async () => {
    try {
      setLoading(true);
      const res = await new UserApi().updateDisburse({
        loanId: LoanID,
        branchId: user?.BranchId,
      });
      if (res) {
        Alert.alert('Loan Disbursed Successfully');
        fetchData();
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleConfirm = data => {
    onModalClose(false);
    if (data === 'confirm') {
      upadteDisburse();
    }
  };

  return (
    <Pressable style={styles.item}>
      {/* Status Section */}
      <View style={styles.statusRow}>
        <Pressable
          style={styles.statusContainer}
          onPress={() => {
            if (Status == null) {
              onModalClose(true);
            } else {
              Alert.alert('Loan Already Disbursed');
            }
          }}>
          <Text
            style={[
              styles.statusText,
              {backgroundColor: Status == null ? '#41AA88' : '#63AA41'},
            ]}>
            {Status == null ? 'Disburse' : 'Loan Disbursed'}
          </Text>
        </Pressable>
      </View>

      {/* Customer Information */}
      <View style={styles.customerInfo}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Loan ID:</Text>
          <Text style={styles.value}>{LoanID}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Borrower:</Text>
          <Text style={styles.value}>{Borrower_Name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Co-Borrower:</Text>
          <Text style={styles.value}>{Co_Borrower_Name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Approved Amount:</Text>
          <Text style={[styles.value, styles.emiAmount]}>
            ₹{SanctionAmount}
          </Text>
        </View>
      </View>

      {/* Expand/Collapse Icon */}
      <Icon
        name={icon}
        size={24}
        color={R.colors.PRIMARI_DARK}
        onPress={handleExpand}
        style={styles.icon}
      />

      {/* Financial Summary Section */}
      <Animated.View
        style={[
          styles.financialSummary,
          {
            transform: [{scaleY}],
            borderTopWidth: selected === LoanID ? 1 : 0,
            borderTopColor: R.colors.SLATE_GRAY,
          },
        ]}>
        {selected === LoanID && (
          <>
            <SummaryItem
              label="Processing Fee:"
              value={`₹${ProcessingFee}`}
              valueStyle={styles.greenText}
            />
            <SummaryItem
              label="Insurance Amount"
              value={`₹${DocumentCharge}`}
              valueStyle={styles.yellowText}
            />
            <SummaryItem
              label="Other Charges:"
              value={`₹${OtherCharges}`}
              valueStyle={styles.redText}
            />
            <SummaryItem
              label="Total Deductions:"
              value={`₹${TotalDeduction}`}
              valueStyle={styles.redText}
            />
          </>
        )}
      </Animated.View>

      <ConfirmationModal
        isVisible={isVis}
        onModalClose={onModalClose}
        confirmationText="Are you sure you want to Disburse?"
        onConfirm={handleConfirm}
      />
      {loading && <Loader loading={loading} message={'Please wait...'} />}
    </Pressable>
  );
};

const SummaryItem = ({label, value, valueStyle}) => (
  <View style={styles.summaryItem}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={[styles.summaryValue, valueStyle]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  item: {
    padding: 16,
    marginVertical: 8,
    borderWidth: 0.5,
    borderColor: R.colors.SLATE_GRAY,
    backgroundColor: R.colors.WHITE,
    shadowColor: R.colors.BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderRadius: 12, // More rounded corners
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  statusContainer: {
    alignSelf: 'flex-end',
    marginVertical: 5, // Added margin for better spacing
  },
  statusText: {
    color: R.colors.WHITE,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: R.fontSize.M,
    paddingVertical: 6, // Increased padding for better button feel
    paddingHorizontal: 12,
    borderRadius: 8, // Slightly more rounded
  },
  customerInfo: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  label: {
    fontSize: R.fontSize.M,
    fontWeight: '600',
    color: R.colors.PRIMARI_DARK,
  },
  value: {
    fontSize: R.fontSize.M,
    fontWeight: '600',
    color: R.colors.PRIMARI_DARK,
  },
  emiAmount: {
    fontWeight: '800',
    color: R.colors.GREEN,
    fontSize: R.fontSize.L,
  },
  icon: {
    alignSelf: 'center',
    marginVertical: 10, // Added margin to separate from financial summary
  },
  financialSummary: {
    marginTop: 10, // More space before financial summary
    overflow: 'hidden', // Ensure no overflow during animation
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryLabel: {
    color: R.colors.PRIMARI_DARK,
    fontWeight: '600',
    fontSize: R.fontSize.M,
  },
  summaryValue: {
    fontWeight: '600',
    fontSize: R.fontSize.M,
  },
  greenText: {
    color: R.colors.GREEN,
    fontWeight: '800',
    fontSize: R.fontSize.M,
  },
  yellowText: {
    color: R.colors.lightYellow,
    fontWeight: '800',
    fontSize: R.fontSize.M,
  },
  redText: {
    color: R.colors.RED,
    fontWeight: 'bold',
    fontSize: R.fontSize.M,
  },
});

export default DisbursementItem;
