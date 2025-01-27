import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import Button from '../../library/commons/Button';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import {TextInput, Card, Surface} from 'react-native-paper';
import R from '../../resources/R';
import Modal from 'react-native-modal';
import UserApi from '../../datalib/services/user.api';
import Loader from '../../library/commons/Loader';
import moment from 'moment';
import {uploadBankFile} from '../../datalib/services/utility.api';
import DropDownPicker from 'react-native-dropdown-picker';
import ImageView from 'react-native-images-viewer';
import DocumentScannerModal from '../../library/modals/ScanDocument';

const BankDetails = ({route}) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [isvis, onModalClose] = useState(false);
  const {enrollmentId, customerid, userData, coAppData, productCurrent} =
    route?.params?.data;

  const [open, setOpen] = useState(false);
  const [isVis, onClose] = useState(false);
  const [image, setImage] = useState([]);
  const [isDocModalVisible, setDocModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    bankName: null,
    accountNo: '',
    ifscCode: '',
    branch: '',
    accountHolderName: '',
    passbook: null,
  });
  const [file, setFile] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [accountVerified, setAccVerified] = useState(false);
  const [bankData, setBankData] = useState([]);
  const [items, setItems] = useState([]);

  const {name} = userData;
  const {coApplicantName} = coAppData;

  useEffect(() => {
    getBankDorpDown();
  }, []);

  const getBankDorpDown = async () => {
    try {
      setLoading(true);
      const response = await new UserApi().getBankDropdown();
      if (response) {
        setItems(
          response[0]?.map(item => {
            return {label: item.bank_name, value: item?.bank_name};
          }),
        );
        setBankData(response[0]);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.ifscCode?.length == 4 && formData.bankName !== null) {
      checkIFSC();
    }
  }, [formData.ifscCode, formData.bankName]);
  const checkIFSC = () => {
    const bank = bankData.filter(item => item.bank_name == formData.bankName);
    if (bank?.length == 1) {
      const bankCode = bank[0].ifsc_code;
      if (!formData?.ifscCode?.toUpperCase()?.includes(bankCode)) {
        Alert.alert(
          'Invalid IFSC',
          `Please Enter Valid IFSC For the ${formData.bankName}`,
        );
        setFormData({...formData, ifscCode: ''});
      }
    }
  };

  const handleInputChange = (name, value, usertype) => {
    if (usertype == 'coApplicant') {
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  function validateIFSC(ifsc) {
    // Regular expression to validate the IFSC code format
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (ifscRegex.test(ifsc)) {
      return true;
    } else {
      return false;
    }
  }

  const isValidAccountNumber = accountNumber => {
    const length = accountNumber.length;
    return length >= 9 && length <= 18 && /^\d+$/.test(accountNumber);
  };

  const validate = () => {
    let valid = true;
    let errors = {};
    if (formData.bankName === null) {
      errors.bankName = 'Bank Name is Required';
      valid = false;
    }
    if (
      formData?.accountNo?.length == 0 &&
      !isValidAccountNumber(formData?.accountNo)
    ) {
      errors.accountNo = 'Enter valid Account Number';
      valid = false;
    }
    if (
      formData.ifscCode == '' ||
      !validateIFSC(formData?.ifscCode?.toUpperCase())
    ) {
      errors.ifscCode = 'Enter Valid IFSC Code';
      valid = false;
    }
    if (formData.branch == '') {
      errors.branch = 'Branch Name is Required';
      valid = false;
    }
    // if (formData.accountHolderName == '') {
    //   errors.accountHolderName = 'Account Holder Name is Required';
    //   valid = false;
    // }

    if (formData.passbook == null) {
      errors.passbook = 'passbook is Required';
      valid = false;
    }

    console.log('errors', errors);
    setErrors(errors);
    return valid;
  };

  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (validate()) {
        if (!accountVerified) {
          Alert.alert('Please verify your account details first');
          setLoading(false);
          return;
        }
        const dt = new FormData();
        dt.append('bankDetails', {
          uri: formData.passbook,
          type: 'image/jpg',
          name: `${customerid}.pdf`,
        });
        const res = await uploadBankFile(dt);
        await new UserApi().mergeAllFiles({
          loanId: customerid,
          enrollmentId: enrollmentId,
        });
        if (res?.success) {
          const payload = {
            bankDetails: {
              customerid: customerid,
              bankname: formData.bankName,
              bankbranch: formData.branch,
              entrydate: moment(new Date()).format('YYYY-MM-DD'),
              entrytime: getCurrentTime(),
              ifsccode: formData.ifscCode,
              accountnumber: formData.accountNo,
              status: 0,
              approvedby: null,
              modifiedby: null,
              cheque: formData.accountHolderName,
              enrollmentid: enrollmentId,
              livestatus: 1,
              EntryMode: 'Sugam',
              bankDetailsImage: null,
              //GRT Details entry fields
              Client_Name: name,
              Co_Borrower_Name: coApplicantName,
              FinanceAmt: productCurrent?.amountApplied,
              Status: 'Pending',
              GRTDoneBy: null,
              GRTDoneDate: null,
              EntryDate: moment(new Date()).format('YYYY-MM-DD'),
            },
          };

          const response = await new UserApi().saveBankDetails(payload);
          if (response && response?.success) {
            onModalClose(true);
          } else {
            Alert.alert('Something went wrong while saving bank details');
          }
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error during form submission:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      if (validate()) {
        const myHeaders = new Headers();
        myHeaders.append(
          'ent_authorization',
          'NDYyOTA0MTU6IGIwdmdQQ3hhUXBXam1Wb2NjdlRCeUhNeXhGV0cwRVlV',
        );
        myHeaders.append('Content-Type', 'application/json');

        const raw = JSON.stringify({
          ifsc: formData.ifscCode,
          accNo: formData.accountNo,
        });

        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow',
        };
        const response = await fetch(
          'https://api.digitap.ai/penny-drop/v2/check-valid',
          requestOptions,
        );
        const result = await response.text();
        const finalData = await JSON.parse(result);
        if (
          finalData.code == 200 &&
          finalData?.model?.status?.toUpperCase()?.includes('SUCCESS')
        ) {
          const applicantName = userData?.name?.split(' ')[0];
          const coAppName = coAppData?.coApplicantName?.split(' ')[0];
          if (
            finalData?.model?.beneficiaryName
              ?.toUpperCase()
              ?.includes(applicantName?.toUpperCase()) ||
            finalData?.model?.beneficiaryName
              ?.toUpperCase()
              ?.includes(coAppName?.toUpperCase())
          ) {
            setFormData({
              ...formData,
              accountHolderName: finalData?.model?.beneficiaryName,
            });
            setAccVerified(true);
          } else {
            Alert.alert(
              'Invalid Account Details',
              `Please Give Account Details Of ${userData?.name} Or ${coAppData?.coApplicantName} `,
            );
          }
        } else {
          Alert.alert(
            'Inavlid Account Details',
            'Please check your Account Details and try again.',
          );
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error during form submission:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const closeModal = () => {
    onModalClose(false); // Function to close modal
    navigation.navigate(ScreensNameEnum.NEW_CLIENT);
  };

  const styles = createStyles(colorScheme);

  const handleScannedDocument = (uri, setter) => {
    // setter(uri);
    setFormData(prevState => ({
      ...prevState,
      passbook: uri,
    }));
    // setFile(response.assets[0]);
    setDocModalVisible(false);
  };

  return (
    <ScreenWrapper header={false} backDisabled title="Client KYC">
      <Text style={styles.header}>Bank Details</Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Card style={styles.card}>
            <Surface style={styles.surface}>
              <Text style={{color: R.colors.PRIMARI_DARK, fontWeight: '500'}}>
                Applicant's Details
              </Text>
              <DropDownPicker
                style={[
                  styles.viewInput,
                  {
                    borderWidth: 1,
                    borderRadius: 6,
                    borderColor: R.colors.DARKGRAY,
                    flexDirection: 'row',
                  },
                ]}
                dropDownContainerStyle={{
                  height: 600, // Adjust this based on open state
                }}
                open={open}
                value={formData?.bankName}
                placeholder="Select Bank"
                items={items}
                setOpen={setOpen}
                setValue={val => {
                  console.log('Selected Value:', val());
                  setFormData({...formData, bankName: val()});
                }}
                setItems={setItems}
                searchable
                // dropDownContainerStyle={{
                //   height: open ? 600 : 300, // Adjust this based on open state
                // }}
              />
              {errors.bankName && (
                <Text style={styles.errorText}>Bank Name is required.</Text>
              )}

              <TextInput
                mode="outlined"
                label="Account Number"
                placeholder="Enter account number"
                value={formData.accountNo}
                onChangeText={text =>
                  handleInputChange('accountNo', text, 'app')
                }
                maxLength={18}
                error={errors.accountNo}
                style={[styles.input, {marginBottom: 10}]}
                keyboardType="numeric"
                disabled={accountVerified ? true : false}
              />
              {errors.accountNo && (
                <Text style={styles.errorText}>
                  Please enter a valid account number.
                </Text>
              )}

              <TextInput
                mode="outlined"
                label="IFSC Code"
                placeholder="Enter IFSC code"
                value={formData.ifscCode?.toUpperCase()}
                onChangeText={text =>
                  handleInputChange('ifscCode', text, 'app')
                }
                error={errors.ifscCode}
                style={[styles.input, {marginBottom: 10}]}
                disabled={accountVerified ? true : false}
              />
              {errors.ifscCode && (
                <Text style={styles.errorText}>{errors.ifscCode}</Text>
              )}
              <TextInput
                mode="outlined"
                label="Branch Name"
                placeholder="Enter Branch Name"
                value={formData.branch}
                onChangeText={text => handleInputChange('branch', text, 'app')}
                error={errors.branch}
                style={[styles.input, {marginBottom: 10}]}
                disabled={accountVerified ? true : false}
              />
              {errors.branch && (
                <Text style={styles.errorText}>IFSC Code is required.</Text>
              )}

              <TextInput
                mode="outlined"
                label="Account Holder Name"
                placeholder="Enter account holder name"
                value={formData.accountHolderName}
                onChangeText={text =>
                  handleInputChange('accountHolderName', text, 'app')
                }
                error={errors.accountHolderName}
                style={[styles.input, {marginBottom: 10}]}
                disabled={true}
              />
              {errors.accountHolderName && (
                <Text style={styles.errorText}>
                  Account holder name is required.
                </Text>
              )}
              {/* Upload Passbook Button */}
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => {
                  if (!accountVerified) {
                    setDocModalVisible(true);
                    setFile(null);
                  }
                }}
                // onPress={() =>
                //   ? handleImageUpload('app') : null
                // }
              >
                <Text style={styles.uploadButtonText}>Upload Passbook</Text>
              </TouchableOpacity>

              {formData.passbook && (
                <TouchableOpacity
                  onPress={() => {
                    if (formData?.passbook) {
                      setImage([{uri: formData?.passbook}]);
                      onClose(true);
                    }
                  }}>
                  <Image
                    source={{uri: formData.passbook}}
                    style={styles.uploadedImage}
                  />
                </TouchableOpacity>
              )}
              {errors.passbook && (
                <Text style={styles.errorText}>
                  Please Upload Passbook Image
                </Text>
              )}
            </Surface>
          </Card>

          {accountVerified ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <Button
                title="Change Account Details"
                onPress={() => {
                  setAccVerified(false);
                  setFormData({
                    bankName: null,
                    accountNo: '',
                    ifscCode: '',
                    branch: '',
                    accountHolderName: '',
                    passbook: null,
                  });
                  setFile(null);
                }}
                buttonStyle={[
                  styles.submitButton,
                  {width: '46%', backgroundColor: R.colors.DARKGRAY},
                ]}
                textStyle={styles.btnTextStyle}
                // loading={isSubmitting}
              />
              <Button
                title="Submit"
                onPress={handleSubmit}
                buttonStyle={[styles.submitButton, {width: '44%'}]}
                textStyle={styles.btnTextStyle}
                // loading={isSubmitting}
              />
            </View>
          ) : (
            <Button
              title="Verify Account Details"
              onPress={handleVerify}
              buttonStyle={styles.submitButton}
              textStyle={styles.btnTextStyle}

              // loading={isSubmitting}
            />
          )}
        </View>
        {/* Success Modal */}
        <Modal isVisible={isvis} onBackdropPress={closeModal}>
          <View style={styles.modalContainer}>
            <Icon
              name="check-circle-outline"
              size={100}
              color={R.colors.GREEN}
              style={styles.successIcon}
            />
            <Text style={styles.modalText}>
              Loan Application Form Submitted Successfully
            </Text>
            <Button
              title="OK"
              onPress={closeModal}
              buttonStyle={styles.modalButton}
              textStyle={styles.modalButtonText}
            />
          </View>
        </Modal>
      </ScrollView>
      {loading && (
        <Loader loading={loading} message={'saving bank details...'} />
      )}
      <ImageView
        images={image}
        imageIndex={0}
        visible={isVis}
        onRequestClose={() => onClose(false)}
      />
      <DocumentScannerModal
        isVisible={isDocModalVisible}
        onClose={() => setDocModalVisible(false)}
        onDocumentScanned={handleScannedDocument}
        setter={setFormData}
      />
    </ScreenWrapper>
  );
};

const createStyles = colorScheme =>
  StyleSheet.create({
    scrollView: {
      paddingVertical: 16,
      paddingHorizontal: 24,
    },
    container: {
      flex: 1,
      //   backgroundColor:
      //     colorScheme === 'dark'
      //       ? R.colors.DARK_BACKGROUND
      //       : R.colors.LIGHT_BACKGROUND,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      margin: 24,
      textAlign: 'center',
      color: R.colors.PRIMARI_DARK,
      textDecorationLine: 'underline',
    },
    card: {
      borderRadius: 12,
      marginBottom: 20,
      //   backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    surface: {
      padding: 20,
      elevation: 4,
      borderRadius: 12,
      //   backgroundColor: colorScheme === 'dark' ? '#444' : '#fff',
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      marginBottom: 10,
    },
    submitButton: {
      marginTop: 32,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: R.colors.primary,
    },
    btnTextStyle: {
      fontWeight: '800',
      color: '#fff',
    },
    viewInput: {
      flexDirection: 'row',
      paddingHorizontal: 10,
      justifyContent: 'flex-end',
      marginVertical: 5,
    },
    label: {
      color: R.colors.PRIMARI_DARK,
      flex: 1.5,
      alignItems: 'center',
      fontWeight: '400',
      fontSize: 16,
      textAlignVertical: 'center',
      height: '100%',
    },
    input: {
      //   borderBottomWidth: 1,
      flex: 2.5,
      height: 45,
      color: R.colors.PRIMARI_DARK,
      textAlignVertical: 'bottom',
      fontSize: 16,
      fontWeight: '500',
    },
    uploadButton: {
      backgroundColor: R.colors.PRIMARI_DARK,
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 10,
    },
    uploadButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    uploadedImage: {
      width: 100,
      height: 100,
      marginTop: 10,
      borderRadius: 8,
      alignSelf: 'center',
    },
    modalContainer: {
      backgroundColor: R.colors.PRIMARY_LIGHT,
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    successIcon: {
      marginBottom: 20,
    },
    modalText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: R.colors.PRIMARI_DARK,
      marginBottom: 20,
      textAlign: 'center',
    },
    modalButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: R.colors.primary,
      borderRadius: 6,
      width: 100,
    },
    modalButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default BankDetails;
