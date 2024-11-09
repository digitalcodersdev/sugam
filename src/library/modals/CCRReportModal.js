import React from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import Modal from 'react-native-modal';
import Button from '../commons/Button';
import R from '../../resources/R';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Surface} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import ScreensNameEnum from '../../constants/ScreensNameEnum';

const CCRReportModal = ({
  isVisible,
  onClose,
  data1,
  data2,
  userData,
  coAppData,
}) => {
  const navigation = useNavigation();
  const {
    name,
    dob,
    address,
    aadharNo,
    panNo,
    voterId,
    maskedAdharNumber,
    phone,
    relation,
    pincode,
    state,
    careOf,
  } = userData;
  const {
    coApplicantName,
    coApplDOB,
    coAppAddress,
    coApplAadhar,
    coApplPAN,
    coApplVoterid,
    coApplMaskedAadhar,
    coApplMobileNo,
    coApplState,
    coAppPincode,
    coAppCareOf,
  } = coAppData;

  const res =
    data2.CreditScore >= data1?.CreditScore &&
    parseInt(data2?.AverageOpenBalance) <= data1?.AverageOpenBalance &&
    parseInt(data2?.NoOfActiveAccounts) <= data1?.NoOfActiveAccounts &&
    parseInt(data2?.TotalPastDue) <= data1?.TotalPastDue &&
    parseInt(data2?.NoOfWriteOffs) <= data1?.NoOfWriteOffs &&
    parseInt(data2?.TotalMonthlyPaymentAmount) == data1?.TotalMonthlyPaymentAmt;

  console.log(res, '_____');
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.modalContent}>
        <ScrollView>
          <View style={{flexDirection: 'row', flex: 1}}>
            <Text style={[styles.Label]}>Applicant's Information</Text>
            <Text style={styles.Label}>CCR Report Information</Text>
          </View>
          <Surface style={styles.profileContainer} elevation={4}>
            <View style={{flex: 1, margin: 5}}>
              <Text style={styles.lbl}>
                Name : <Text style={styles.val}>{name}</Text>
              </Text>
              <Text style={styles.lbl}>
                DOB : <Text style={styles.val}>{dob}</Text>
              </Text>
              <Text style={styles.lbl}>
                Phone : <Text style={styles.val}>{phone}</Text>
              </Text>
              <Text style={styles.lbl}>
                Address :{' '}
                <Text style={styles.val}>
                  {address?.length <= 60
                    ? address
                    : address.substring(0, 60) + '...'}
                </Text>
              </Text>
              <Text style={styles.lbl}>
                Aadhar : <Text style={styles.val}>{maskedAdharNumber}</Text>
              </Text>
              <Text style={styles.lbl}>
                PAN : <Text style={styles.val}>{panNo}</Text>
              </Text>
              <Text style={styles.lbl}>
                Voter ID : <Text style={styles.val}>{voterId}</Text>
              </Text>
            </View>
            <View style={{flex: 1, margin: 5}}>
              <Text style={styles.lbl}>
                Name : <Text style={styles.val}>{coApplicantName}</Text>
              </Text>
              <Text style={styles.lbl}>
                DOB : <Text style={styles.val}>{coApplDOB}</Text>
              </Text>
              <Text style={styles.lbl}>
                Phone : <Text style={styles.val}>{coApplMobileNo}</Text>
              </Text>
              <Text style={styles.lbl}>
                Address :{' '}
                <Text style={styles.val}>
                  {coAppAddress?.length <= 60
                    ? coAppAddress
                    : coAppAddress.substring(0, 60) + '...'}
                </Text>
              </Text>
              <Text style={styles.lbl}>
                Aadhar : <Text style={styles.val}>{coApplMaskedAadhar}</Text>
              </Text>
              <Text style={styles.lbl}>
                PAN : <Text style={styles.val}>{coApplPAN}</Text>
              </Text>
              <Text style={styles.lbl}>
                Voter ID : <Text style={styles.val}>{coApplVoterid}</Text>
              </Text>
            </View>
          </Surface>
          <Surface style={styles.profileContainer} elevation={4}>
            <Text style={styles.Label}>CCR Report Information</Text>
          </Surface>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, {flex: 2}]}>Parameter</Text>
              <Text style={styles.headerCell}>Our Criteria</Text>
              <Text style={styles.headerCell}>Client Data</Text>
              <Text style={styles.headerCell}>Result</Text>
            </View>
            <View style={styles.tableRow}>
              <View style={{flex: 2}}>
                <Text
                  style={[styles.cell, styles.cellVal, {textAlign: 'left'}]}>
                  Credit Score {`(\>=)`}
                </Text>
                <Text
                  style={[styles.cell, styles.cellVal, {textAlign: 'left'}]}>
                  Avg. Open. Bal.(=)
                </Text>
                <Text
                  style={[styles.cell, styles.cellVal, {textAlign: 'left'}]}>
                  No. Of Active Acc. {`(\<=)`}
                </Text>
                <Text
                  style={[styles.cell, styles.cellVal, {textAlign: 'left'}]}>
                  No. Of Past Due Acc. (=)
                </Text>
                <Text
                  style={[styles.cell, styles.cellVal, {textAlign: 'left'}]}>
                  No. Of Write-Offs (=)
                </Text>
                {/* <Text
                  style={[styles.cell, styles.cellVal, {textAlign: 'left'}]}>
                  Total Balance Amount {`(\<=)`}
                </Text> */}
                <Text
                  style={[styles.cell, styles.cellVal, {textAlign: 'left'}]}>
                  Total Monthly EMI {`(\<=)`}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={[styles.cell, styles.cellVal]}>
                  {data1?.CreditScore}
                </Text>
                <Text style={[styles.cell, styles.cellVal]}>
                  {data1?.AverageOpenBalance}
                </Text>
                <Text style={[styles.cell, styles.cellVal]}>
                  {data1?.NoOfActiveAccounts}
                </Text>
                <Text style={[styles.cell, styles.cellVal]}>
                  {data1?.NoOfPastDueAccounts}
                </Text>
                <Text style={[styles.cell, styles.cellVal]}>
                  {data1?.NoOfWriteOffs}
                </Text>
                <Text style={[styles.cell, styles.cellVal]}>
                  {data1?.TotalMonthlyPaymentAmt}
                </Text>
                {/* <Text style={[styles.cell, styles.cellVal]}>19800</Text> */}
              </View>
              <View style={{flex: 1}}>
                <Text style={[styles.cell, styles.cellVal]}>
                  {data2?.CreditScore}
                </Text>
                <Text style={[styles.cell, styles.cellVal]}>
                  {parseInt(data2?.AverageOpenBalance)?.toFixed(1)}
                </Text>
                <Text style={[styles.cell, styles.cellVal]}>
                  {data2?.NoOfActiveAccounts}
                </Text>
                <Text style={[styles.cell, styles.cellVal]}>
                  {data2?.NoOfPastDueAccounts}
                </Text>
                <Text style={[styles.cell, styles.cellVal]}>
                  {data2?.NoOfWriteOffs}
                </Text>
                <Text style={[styles.cell, styles.cellVal]}>
                  {data2?.TotalMonthlyPaymentAmount}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={[styles.cell, styles.cellVal]}>
                  <Icon
                    name={
                      data2?.CreditScore >= data1?.CreditScore
                        ? 'check'
                        : 'window-close'
                    }
                    color={
                      data2?.CreditScore >= data1?.CreditScore
                        ? R.colors.GREEN
                        : R.colors.RED
                    }
                    size={25}
                  />
                </Text>
                <Text style={[styles.cell, styles.cellVal]}>
                  <Icon
                    name={
                      data2?.AverageOpenBalance <= data1?.AverageOpenBalance
                        ? 'check'
                        : 'window-close'
                    }
                    color={
                      data2?.AverageOpenBalance <= data1?.AverageOpenBalance
                        ? R.colors.GREEN
                        : R.colors.RED
                    }
                    size={25}
                  />
                </Text>
                <Text style={[styles.cell, styles.cellVal]}>
                  <Icon
                    name={
                      data2?.NoOfActiveAccounts <= data1?.NoOfActiveAccounts
                        ? 'check'
                        : 'window-close'
                    }
                    color={
                      data2?.NoOfActiveAccounts <= data1?.NoOfActiveAccounts
                        ? R.colors.GREEN
                        : R.colors.RED
                    }
                    size={25}
                  />
                </Text>
                <Text style={[styles.cell, styles.cellVal]}>
                  <Icon
                    name={
                      data2?.NoOfPastDueAccounts <= data1?.NoOfPastDueAccounts
                        ? 'check'
                        : 'window-close'
                    }
                    color={
                      data2?.NoOfPastDueAccounts <= data1?.NoOfPastDueAccounts
                        ? R.colors.GREEN
                        : R.colors.RED
                    }
                    size={25}
                  />
                </Text>
                <Text style={[styles.cell, styles.cellVal]}>
                  <Icon
                    name={
                      data2?.NoOfWriteOffs <= data1?.NoOfWriteOffs
                        ? 'check'
                        : 'window-close'
                    }
                    color={
                      data2?.NoOfWriteOffs <= data1?.NoOfWriteOffs
                        ? R.colors.GREEN
                        : R.colors.RED
                    }
                    size={25}
                  />
                </Text>
                <Text style={[styles.cell, styles.cellVal]}>
                  <Icon
                    name={
                      data2?.TotalMonthlyPaymentAmount <= 19800
                        ? 'check'
                        : 'window-close'
                    }
                    color={
                      data2?.TotalMonthlyPaymentAmount <= 19800
                        ? R.colors.GREEN
                        : R.colors.RED
                    }
                    size={25}
                  />
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button
            title="Process"
            onPress={() => {
              // if (
              //   data2.CreditScore >= data1?.CreditScore &&
              //   parseInt(data2?.AverageOpenBalance) <=
              //     data1?.AverageOpenBalance &&
              //   parseInt(data2?.NoOfActiveAccounts) <=
              //     data1?.NoOfActiveAccounts &&
              //   parseInt(data2?.TotalPastDue) <= data1?.TotalPastDue &&
              //   parseInt(data2?.NoOfWriteOffs) <= data1?.NoOfWriteOffs &&
              //   parseInt(data2?.TotalMonthlyPaymentAmount) ==
              //     data1?.TotalMonthlyPaymentAmt
              //     ) {
              navigation.navigate(ScreensNameEnum.LAF_GROUP_SCREEN, {
                data: {userData, coAppData},
              });
              // } else {
              //   Alert.alert('आपका ऋण स्वीकृत नहीं हुआ');
              //   navigation.navigate(ScreensNameEnum.ENROLLMENT_SCREEN)
              // }
              onClose(false);
            }}
            buttonStyle={{borderRadius: 6, paddingVertical: 5}}
            textStyle={{fontWeight: 'bold', paddingVertical: 0}}
            backgroundColor={R.colors.BLUE}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    margin: 5,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    minHeight: '60%',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '98%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: R.colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    width: '100%',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 5,
    color: R.colors.PRIMARY_LIGHT,
    flexWrap: 'wrap',
    borderColor: R.colors.PRIMARY_LIGHT,
    borderRightWidth: 1,
  },
  tableRow: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingVertical: 5,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 5,
    color: R.colors.PRIMARI_DARK,
    padding: 5,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  cellVal: {
    textAlign: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  profileContainer: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  lbl: {
    color: R.colors.PRIMARI_DARK,
    textAlign: 'left',
    width: '100%',
    backgroundColor: R.colors.PRIMARY_LIGHT,
    padding: 5,
  },
  val: {
    color: R.colors.PRIMARI_DARK,
    fontWeight: '800',
  },
  Label: {
    color: R.colors.PRIMARY_LIGHT,
    padding: 5,
    backgroundColor: R.colors.SLATE_GRAY,
    fontWeight: '800',
    textAlign: 'center',
    flex: 1,
    margin: 5,
  },
});

export default CCRReportModal;
