import React, {useCallback, useState} from 'react';
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

const BankDetails = ({route}) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [isvis, onModalClose] = useState(false);
  const [formData, setFormData] = useState({
    bankName: null,
    accountNo: '',
    ifscCode: '',
    accountHolderName: '',
    passbook: null,
  });
  const [coAppData, setcoAppData] = useState({
    bankName: null,
    accountNo: '',
    ifscCode: '',
    accountHolderName: '',
    passbook: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        }
      }
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Perform form validation and submission logic here
      // const isValid = validateForm();
      // if (isValid) {
      //   // Submit the form
      // }
      onModalClose(true);
    } catch (error) {
      console.error('Error during form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const closeModal = () => {
    onModalClose(false); // Function to close modal
    navigation.navigate(ScreensNameEnum.NEW_CLIENT)
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
              <View style={styles.viewInput}>
                <Text style={styles.label}>Bank Name.</Text>
                <Picker
                  selectedValue={formData.bankName}
                  onValueChange={(itemValue, itemIndex) =>
                    setFormData({...formData, bankName: itemValue})
                  }
                  mode="dropdown"
                  dropdownIconColor={R.colors.primary}
                  style={styles.input}>
                  {formData?.bankName === null && (
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
                error={errors.accountNo}
                style={[styles.input, {marginBottom: 10}]}
                keyboardType="numeric"
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
                value={formData.ifscCode}
                onChangeText={text =>
                  handleInputChange('ifscCode', text, 'app')
                }
                error={errors.ifscCode}
                style={[styles.input, {marginBottom: 10}]}
              />
              {errors.ifscCode && (
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
              />
              {errors.accountHolderName && (
                <Text style={styles.errorText}>
                  Account holder name is required.
                </Text>
              )}
              {/* Upload Passbook Button */}
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => handleImageUpload('app')}>
                <Text style={styles.uploadButtonText}>Upload Passbook</Text>
              </TouchableOpacity>
              {formData.passbook && (
                <Image
                  source={{uri: formData.passbook}}
                  style={styles.uploadedImage}
                />
              )}
            </Surface>
          </Card>
          <Card style={styles.card}>
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
              {errors.bankName && (
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
                error={errors.accountNo}
                style={[styles.input, {marginBottom: 10}]}
                keyboardType="numeric"
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
                value={coAppData.ifscCode}
                onChangeText={text =>
                  handleInputChange('ifscCode', text, 'coApplicant')
                }
                error={errors.ifscCode}
                style={[styles.input, {marginBottom: 10}]}
              />
              {errors.ifscCode && (
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
              {errors.accountHolderName && (
                <Text style={styles.errorText}>
                  Account holder name is required.
                </Text>
              )}

              {/* Upload Passbook Button */}
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
          </Card>

          <Button
            title="Submit"
            onPress={handleSubmit}
            buttonStyle={styles.submitButton}
            textStyle={styles.btnTextStyle}
            loading={isSubmitting}
          />
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
      fontWeight: '900',
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
