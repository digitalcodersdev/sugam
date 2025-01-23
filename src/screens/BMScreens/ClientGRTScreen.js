import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  Linking,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import UserApi from '../../datalib/services/user.api';
import R from '../../resources/R';
import moment from 'moment';
import {Image} from 'react-native';
import env from '../../../env';
import GRTStatusModal from '../../library/modals/GRTModal';
import Button from '../../library/commons/Button';

const ClientGRTScreen = ({route}) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState({});
  const {enrollmentId} = route.params;
  const URL = `${env.SERVER_URL}/clientphoto/${enrollmentId}.jpeg`;
  const PASSBOOK_URL = `${env.SERVER_URL}/clientbankDetail/${data.loanid}.pdf`;
  const KYC_URL = `${env.SERVER_URL}/KycPhoto/${enrollmentId}.pdf`;
  const KYC_URL_CO_Borrower = `${env.SERVER_URL}/Co-BorrowerDoc/${enrollmentId}.pdf`;
  useEffect(() => {
    if (enrollmentId) {
      fetchClientData();
    }
  }, [enrollmentId]);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      const response = await new UserApi().getClientDetailsForGrt({
        enrollmentId,
      });
      if (response?.success && response?.data?.length === 1) {
        setData(response?.data[0]);
      } else {
        Alert.alert('Something Went Wrong', 'Please Try Again Later.');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = async () => {
    await Linking.openURL(KYC_URL);
  };
  const handlePressPassbook = async () => {
    await Linking.openURL(PASSBOOK_URL);
  };
  const handleCoPress = async () => {
    await Linking.openURL(KYC_URL_CO_Borrower);
  };

  const renderField = (label, value) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value ?? 'N/A'}</Text>
    </View>
  );
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const handleSubmit = value => {
    setModalVisible(false);
    closeModal();
  };

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={ScreensNameEnum.CLIENT_GRT_SCREEN} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color="#4c669f" />
        ) : (
          <>
            <View style={styles.labelHeaderView}>
              <Text style={styles.labelHeader}>Office Use</Text>
              {renderField('Loan ID', data.loanid)}
              {renderField('Customer ID', data.loanid)}
              {renderField('First Name', data.firstname)}
              {renderField('Middle Name', data.middlename)}
              {renderField('Last Name', data.lastname)}
              {renderField('Loan Amount', data.financeamt)}
              {renderField('Centre No', data.centreid)}
              {renderField('Branch Name', data.branchname)}
              {renderField('Sourced By', data.SOURCEDBY)}
              {renderField('Sourced Date', data.SOURCEDDATE)}
            </View>

            <View style={styles.labelHeaderView}>
              <Text style={styles.labelHeader}>Loan Details</Text>
              {renderField('Product Name', data.product_name)}
              {renderField('Loan Amount', data.financeamt)}
              {renderField('Loan Purpose', data.LOANPURPOSE)}
              {renderField('Payment Frequency', data.PAYMENTFREQUENCY)}
              {renderField('Tenure', data.PERIOD)}
            </View>

            <View style={styles.labelHeaderView}>
              <Text style={styles.labelHeader}>Personal Details</Text>
              {renderField('First Name', data.firstname)}
              {renderField('Middle Name', data.middlename)}
              {renderField('Last Name', data.lastname)}
              {renderField('Date of Birth', data.dob)}
              {renderField('Gender', data.gender)}
              {renderField('Mobile No.', data.client_mobile)}
              {renderField('No. Of Dependents', data.depend)}
              {renderField('Client Occupation', data.client_occupation)}
              {renderField("Father's Name", data.surname)}
              {renderField("Mother's Name", data.spousesurname)}
              {renderField('Marital Status', data.MaritalStatus)}
              {renderField('Education', data.client_education)}
              {renderField('Religion', data.client_cast)}
              {renderField('Category', data.client_category)}
              {renderField('Loan Purpose', data.LOANPURPOSE)}
              {renderField('Years At Current Address', data.client_no_of_yrs)}
              {renderField('Bank Name', data.bankname)}
              {renderField('Account Number', data.accountnumber)}
              {renderField('IFSC Code', data.ifsccode)}
            </View>

            <View style={styles.labelHeaderView}>
              <Text style={styles.labelHeader}>Permanent Address</Text>
              {renderField('House Type', data.client_housetype)}
              {renderField('Village', data.village)}
              {renderField('Address', data.kyc)}
              {renderField('District', data.client_district_permanent)}
              {renderField('State', data.client_state)}
              {renderField('Pincode', data.client_pincode_permanent)}
            </View>
            <View style={styles.labelHeaderView}>
              <Text style={styles.labelHeader}>Current Address</Text>

              {renderField('House Type', data.client_housetype)}
              {renderField('Village', data.village)}
              {renderField('Address', data.kyc)}
              {renderField('District', data.client_district_permanent)}
              {renderField('State', data.client_state)}
              {renderField('Pincode', data.client_pincode_permanent)}
            </View>

            <View style={styles.labelHeaderView}>
              <Text style={styles.labelHeader}>Co-Applicant Details</Text>
              {renderField('Co-Borrower Name', data.coborrower)}
              {renderField('Date of Birth', moment(new Date(data.co_borrower_dateof_birth)).format("DD-MM-YYYY"))}
              {renderField('Gender', data.co_borrowe_gender)}
              {renderField('Mobile No.', data.co_borrower_mobile)}
              {renderField('No. Of Dependents', data.co_borrowe_gender)}
              {renderField('Client Occupation', data.co_borrower_occupation)}
              {renderField(
                "Father's Name",
                data.co_applicant_father_husband_name,
              )}
              {renderField('Marital Status', data.marrital)}
              {renderField('Education', data.co_applicatnt_education)}
              {renderField('Religion', data.co_borrower_cast)}
              {renderField('Category', data.co_borrower_category)}
              {renderField(
                'Years At Current Address',
                data.co_borrower_no_of_yrs,
              )}
            </View>

            <View style={styles.labelHeaderView}>
              <Text style={styles.labelHeader}>Permanent Address</Text>
              {renderField('House Type', data.co_borrower_housetype)}
              {renderField('Village', data.co_borrower_area)}
              {renderField('Address', data.co_borrower_flat)}
              {renderField('District', data.co_borrower_district)}
              {renderField('State', data.co_borrower_state_permanent)}
              {renderField('Pincode', data.co_borrower_pincode)}
            </View>

            <View style={styles.labelHeaderView}>
              <Text style={styles.labelHeader}>Current Address</Text>
              {renderField('House Type', data.co_borrower_housetype)}
              {renderField('Village', data.co_borrower_area)}
              {renderField('Address', data.co_borrower_flat)}
              {renderField('District', data.co_borrower_district)}
              {renderField('State', data.co_borrower_state_permanent)}
              {renderField('Pincode', data.co_borrower_pincode)}
            </View>
            <View style={styles.labelHeaderView}>
              <Text style={styles.labelHeader}>Income And Expenditure</Text>
              {renderField('Self Income', data.salincome)}
              {renderField('Spouse/Father/Son Income', data.spouseincome)}
              {renderField('Other Income', data.otherincome)}
              {renderField('Total Income', data.totalincome)}
              {renderField('Business Expenses', data.business_expenses)}
              {renderField('House Hold Expenses', data.homeexp)}
              {renderField('EMI Payment', data.loanexp)}
              {renderField('Other Expenses', data.otherexp)}
              {renderField('Total Expenses', data.totalexp)}
              {renderField('Disposable Income', data.saving)}
            </View>
            <View style={styles.labelHeaderView}>
              <Text style={styles.labelHeader}>Applicant KYC</Text>
              <View style={styles.row}>
                <Text style={{color: R.colors.PRIMARI_DARK, fontWeight: '800'}}>
                  Client Image
                </Text>
                <Image source={{uri: URL}} style={styles.image} />
              </View>
              <View style={styles.row}>
                <Text style={{color: R.colors.PRIMARI_DARK, fontWeight: '800'}}>
                  KYC Details
                </Text>
                <Text
                  style={{
                    color: R.colors.PRIMARY_LIGHT,
                    backgroundColor: R.colors.DARK_BLUE,
                    padding: 10,
                    borderRadius: 8,
                    fontWeight: '800',
                  }}
                  onPress={handlePress}>
                  View KYC
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={{color: R.colors.PRIMARI_DARK, fontWeight: '800'}}>
                  Passbook
                </Text>
                <Text
                  style={{
                    color: R.colors.PRIMARY_LIGHT,
                    backgroundColor: R.colors.DARK_BLUE,
                    padding: 10,
                    borderRadius: 8,
                    fontWeight: '800',
                  }}
                  onPress={handlePressPassbook}>
                  Bank Passbook
                </Text>
              </View>
            </View>
            <View style={styles.labelHeaderView}>
              <Text style={styles.labelHeader}>Co-Applicant KYC</Text>
              <View style={styles.row}>
                <Text style={{color: R.colors.PRIMARI_DARK, fontWeight: '800'}}>
                  KYC Details Co-Borrower
                </Text>
                <Text
                  style={{
                    color: R.colors.PRIMARY_LIGHT,
                    backgroundColor: R.colors.DARK_BLUE,
                    padding: 10,
                    borderRadius: 8,
                    fontWeight: '800',
                    marginTop: 10,
                  }}
                  onPress={handleCoPress}>
                  View KYC
                </Text>
              </View>
            </View>

            <Button
              title="Continue To GRT"
              backgroundColor={R.colors.DARK_BLUE}
              buttonStyle={{width: '60%', alignSelf: 'center'}}
              textStyle={{fontWeight: 'bold'}}
              onPress={openModal}
            />
          </>
        )}
        {modalVisible && (
          <GRTStatusModal
            isVisible={modalVisible}
            onClose={setModalVisible}
            onSubmit={handleSubmit}
            data={data}
          />
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

export default ClientGRTScreen;

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  fieldContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  value: {
    fontSize: 16,
    fontWeight: '400',
    color: '#555',
    marginTop: 4,
  },
  labelHeaderView: {
    padding: 10,
    borderWidth: 1,
    borderColor: R.colors.DARK_BLUE,
    marginBottom: 10,
    borderRadius: 12,
  },
  labelHeader: {
    backgroundColor: R.colors.DARK_BLUE,
    color: R.colors.PRIMARY_LIGHT,
    fontWeight: '800',
    padding: 5,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: R.colors.DARKGRAY,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
