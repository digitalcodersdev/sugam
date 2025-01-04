import React, {useCallback, useEffect, useState} from 'react';
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
import {launchCamera} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import Button from '../../library/commons/Button';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import {TextInput, Card, Divider, Surface} from 'react-native-paper';
import R from '../../resources/R';
import {Picker} from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import UserApi from '../../datalib/services/user.api';
import Loader from '../../library/commons/Loader';
import moment from 'moment';
import {uploadBankFile} from '../../datalib/services/utility.api';

const BankDetails = ({route}) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [isvis, onModalClose] = useState(false);
  const {enrollmentId, customerid} = route?.params?.data;
  const [formData, setFormData] = useState({
    bankName: null,
    accountNo: '',
    ifscCode: '',
    branch: '',
    accountHolderName: '',
    passbook: null,
  });
  const [file, setFile] = useState(null);
  const [coAppData, setcoAppData] = useState({
    bankName: null,
    accountNo: '',
    ifscCode: '',
    branch: '',
    accountHolderName: '',
    passbook: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [accountVerified, setAccVerified] = useState(false);
  const [bankData, setBankData] = useState([]);

  useEffect(() => {
    getBankDorpDown();
  }, []);

  const getBankDorpDown = async () => {
    try {
      setLoading(true);
      const response = await new UserApi().getBankDropdown();
      if (response) {
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
    console.log('code', bank);
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
      setcoAppData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleImageUpload = usertype => {
    launchCamera({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else {
        const imageUri = response.assets[0].uri;
        if (usertype === 'coApplicant') {
          setcoAppData(prevState => ({
            ...prevState,
            passbook: imageUri,
          }));
        } else {
          setFormData(prevState => ({
            ...prevState,
            passbook: imageUri,
          }));
          setFile(response.assets[0]);
        }
      }
    });
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

    if (file === null) {
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
          uri: file.uri,
          type: file.type,
          name: `bankDetails-${enrollmentId}.jpg`,
        });
        const res = await uploadBankFile(dt);
        // console.log('res', res);
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
              bankDetailsImage: res?.files?.bankDetails,
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
          setFormData({
            ...formData,
            accountHolderName: finalData?.model?.beneficiaryName,
          });
          setAccVerified(true);
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
              <View
                style={[
                  styles.viewInput,
                  {
                    flexDirection: 'column',
                    borderWidth: 1,
                    borderRadius: 6,
                    borderColor: R.colors.DARKGRAY,
                  },
                ]}>
                <Text style={[styles.label, {marginTop: 10}]}>Bank Name.</Text>
                <Picker
                  selectedValue={formData.bankName}
                  onValueChange={(itemValue, itemIndex) =>
                    setFormData({...formData, bankName: itemValue})
                  }
                  enabled={accountVerified ? false : true}
                  mode="dropdown"
                  dropdownIconColor={R.colors.primary}
                  style={[styles.input]}
                  dropDownContainerStyle={{height: 200}}>
                  {formData?.bankName === null && (
                    <Picker.Item
                      label="-- Select Bank Name --"
                      value={null}
                      enabled={false}
                    />
                  )}
                  {bankData?.length >= 1 &&
                    bankData?.map(item => {
                      return (
                        <Picker.Item
                          label={item.bank_name}
                          value={item.bank_name}
                        />
                      );
                    })}
                </Picker>
              </View>
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
                onPress={() =>
                  !accountVerified ? handleImageUpload('app') : null
                }>
                <Text style={styles.uploadButtonText}>Upload Passbook</Text>
              </TouchableOpacity>
              {formData.passbook && (
                <Image
                  source={{uri: formData.passbook}}
                  style={styles.uploadedImage}
                />
              )}
              {errors.passbook && (
                <Text style={styles.errorText}>
                  Please Upload Passbook Image
                </Text>
              )}
            </Surface>
          </Card>
          {/* <Card style={styles.card}>
            <Surface style={styles.surface}>
              <Text style={{color: R.colors.PRIMARI_DARK, fontWeight: '500'}}>
                Co-Applicant's Details
              </Text>
              <View style={styles.viewInput}>
                <Text style={styles.label}>Bank Name.</Text>
                <Picker
                  selectedValue={coAppData.bankName}
                  onValueChange={(itemValue, itemIndex) =>
                    setcoAppData({...coAppData, bankName: itemValue})
                  }
                  mode="dropdown"
                  dropdownIconColor={R.colors.primary}
                  style={styles.input}>
                  {coAppData?.bankName === null && (
                    <Picker.Item
                      label="-- Select Bank Name --"
                      value={null}
                      enabled={false}
                    />
                  )}
                  <Picker.Item
                    label="State Bank of India"
                    value="State Bank of India"
                  />
                  <Picker.Item label="HDFC Bank" value="HDFC Bank" />
                  <Picker.Item label="ICICI Bank" value="ICICI Bank" />
                  <Picker.Item
                    label="Punjab National Bank"
                    value="Punjab National Bank"
                  />
                  <Picker.Item label="Axis Bank" value="Axis Bank" />
                  <Picker.Item
                    label="Kotak Mahindra Bank"
                    value="Kotak Mahindra Bank"
                  />
                  <Picker.Item label="Bank of Baroda" value="Bank of Baroda" />
                  <Picker.Item label="Canara Bank" value="Canara Bank" />
                  <Picker.Item
                    label="Union Bank of India"
                    value="Union Bank of India"
                  />
                  <Picker.Item label="IndusInd Bank" value="IndusInd Bank" />
                  <Picker.Item
                    label="IDFC First Bank"
                    value="IDFC First Bank"
                  />
                  <Picker.Item label="Yes Bank" value="Yes Bank" />
                  <Picker.Item label="Bank of India" value="Bank of India" />
                  <Picker.Item
                    label="Central Bank of India"
                    value="Central Bank of India"
                  />
                  <Picker.Item label="Indian Bank" value="Indian Bank" />
                  <Picker.Item label="UCO Bank" value="UCO Bank" />
                  <Picker.Item
                    label="Indian Overseas Bank"
                    value="Indian Overseas Bank"
                  />
                  <Picker.Item
                    label="Bank of Maharashtra"
                    value="Bank of Maharashtra"
                  />
                  <Picker.Item
                    label="Punjab & Sind Bank"
                    value="Punjab & Sind Bank"
                  />
                  <Picker.Item label="Federal Bank" value="Federal Bank" />
                  <Picker.Item
                    label="South Indian Bank"
                    value="South Indian Bank"
                  />
                  <Picker.Item label="Karnataka Bank" value="Karnataka Bank" />
                  <Picker.Item label="RBL Bank" value="RBL Bank" />
                  <Picker.Item label="Dhanlaxmi Bank" value="Dhanlaxmi Bank" />
                  <Picker.Item label="IDBI Bank" value="IDBI Bank" />
                  <Picker.Item
                    label="Jammu & Kashmir Bank"
                    value="Jammu & Kashmir Bank"
                  />
                  <Picker.Item
                    label="Suryoday Small Finance Bank"
                    value="Suryoday Small Finance Bank"
                  />
                  <Picker.Item
                    label="Equitas Small Finance Bank"
                    value="Equitas Small Finance Bank"
                  />
                  <Picker.Item
                    label="AU Small Finance Bank"
                    value="AU Small Finance Bank"
                  />
                  <Picker.Item
                    label="Ujjivan Small Finance Bank"
                    value="Ujjivan Small Finance Bank"
                  />
                  <Picker.Item
                    label="ESAF Small Finance Bank"
                    value="ESAF Small Finance Bank"
                  />
                </Picker>
              </View>
              {errors.co_bankName && (
                <Text style={styles.errorText}>Bank Name is required.</Text>
              )}

              <TextInput
                mode="outlined"
                label="Account Number"
                placeholder="Enter account number"
                value={coAppData.accountNo}
                onChangeText={text =>
                  handleInputChange('accountNo', text, 'coApplicant')
                }
                error={errors.co_accountNo}
                style={[styles.input, {marginBottom: 10}]}
                keyboardType="numeric"
              />
              {errors.co_accountNo && (
                <Text style={styles.errorText}>
                  Please enter a valid account number.
                </Text>
              )}

              <TextInput
                mode="outlined"
                label="IFSC Code"
                placeholder="Enter IFSC code"
                value={coAppData.ifscCode}
                onChangeText={text =>
                  handleInputChange('ifscCode', text, 'coApplicant')
                }
                error={errors.co_ifscCode}
                style={[styles.input, {marginBottom: 10}]}
              />
              {errors.co_ifscCode && (
                <Text style={styles.errorText}>IFSC Code is required.</Text>
              )}

              <TextInput
                mode="outlined"
                label="Account Holder Name"
                placeholder="Enter account holder name"
                value={coAppData.accountHolderName}
                onChangeText={text =>
                  handleInputChange('accountHolderName', text, 'coApplicant')
                }
                error={errors.accountHolderName}
                style={[styles.input, {marginBottom: 10}]}
              />
              {errors.co_accountHolderName && (
                <Text style={styles.errorText}>
                  Account holder name is required.
                </Text>
              )}

              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => handleImageUpload('coApplicant')}>
                <Text style={styles.uploadButtonText}>Upload Passbook</Text>
              </TouchableOpacity>
              {coAppData.passbook && (
                <Image
                  source={{uri: coAppData.passbook}}
                  style={styles.uploadedImage}
                />
              )}
            </Surface>
          </Card> */}

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
