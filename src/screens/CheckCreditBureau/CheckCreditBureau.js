import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useRef, useState} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import R from '../../resources/R';
import {TextInput} from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import Button from '../../library/commons/Button';
import {Picker} from '@react-native-picker/picker';
import Toast from 'react-native-simple-toast';
import ValidationHelper from '../../helpers/ValidationHelper';
import VerifyOTPModal from '../../library/modals/VerifyOTPModal';
import axios from 'axios';
import LoaderAnimation from '../../library/commons/LoaderAnimation';

const CheckCreditBureau = () => {
  const [loading, setLoading] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [open, setOpen] = useState(false);
  const [dob, setDob] = useState(new Date());
  const [address, setAddress] = useState('');
  const [state, setState] = useState(null);
  const [relation, setRelation] = useState(null);
  const [relationName, setRelationName] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [panNo, setPanno] = useState('');
  const [aadharNo, setAadharNo] = useState('');
  const [voterId, setVoterId] = useState('');
  const [product, setProduct] = useState(null);
  const [coApplicantName, setCoApplName] = useState('');
  const [coApplDOBopen, setCoApplDOBOpen] = useState(false);
  const [coApplDOB, setCoApplDOB] = useState(new Date());
  const [coAppAddress, setCoAppAddress] = useState('');
  const [coApplState, setCoApplState] = useState(null);
  const [coApplRelation, setCoApplRelation] = useState(null);
  const [coApplRelationName, setCoAppliRelationName] = useState('');
  const [coAppPincode, setCoApplPincode] = useState('');
  const [coApplMobileNo, setCoAppMobileNo] = useState();
  const [coApplPAN, setCoApplPAN] = useState('');
  const [coApplAadhar, setCoApplAadhar] = useState('');
  const [coApplVoterid, setCoAppVoterid] = useState('');
  const [focused, setFocused] = useState(null);
  const [err, setErr] = useState({});

  const [isVisible, onModalClose] = useState(false);

  //Ref
  const applicantNameRef = useRef(null);
  const addressRef = useRef(null);
  const stateRef = useRef(null);
  const relationRef = useRef(null);
  const relationNameRef = useRef(null);
  const pincodeRef = useRef(null);
  const phoneRef = useRef(null);
  const panNoRef = useRef(null);
  const aadharNoRef = useRef(null);
  const voterIdRef = useRef(null);
  const productRef = useRef(null);
  const coApplicantNameRef = useRef(null);
  const coApplDOBRef = useRef(null);
  const coAppAddressRef = useRef(null);
  const coApplStateRef = useRef(null);
  const coApplRelationRef = useRef(null);
  const coApplRelationNameRef = useRef(null);
  const coAppPincodeRef = useRef(null);
  const coApplMobileNoRef = useRef(null);
  const coApplPANRef = useRef(null);
  const coApplAadharRef = useRef(null);
  const coApplVoteridRef = useRef(null);

  const validate = () => {
    let valid = true;
    let error = {};
    if (!applicantName.replace(/\s+/g, '').length) {
      Toast.show('Please Enter Applicant Name', Toast.SHORT, Toast.CENTER);
      error.applicantName = true;
      valid = false;
      applicantNameRef.current.focus();
      return valid;
    }
    if (
      moment(dob).format('DD MMM YYYY') ===
      moment(new Date()).format('DD MMM YYYY')
    ) {
      Toast.show('Please Enter DOB', Toast.SHORT, Toast.CENTER);
      valid = false;
      error.dob = true;
      return valid;
    }
    if (!address.replace(/\s+/g, '').length) {
      Toast.show('Please Enter Address', Toast.SHORT, Toast.CENTER);
      error.address = true;
      valid = false;
      addressRef.current.focus();
      return valid;
    }
    if (state === null) {
      Toast.show('Please Select State', Toast.SHORT, Toast.CENTER);
      error.state = true;
      valid = false;
      return valid;
    }
    if (relation === null) {
      Toast.show('Please Select Relation', Toast.SHORT, Toast.CENTER);
      error.relation = true;
      valid = false;
      return valid;
    }
    if (!relationName.replace(/\s+/g, '').length) {
      Toast.show('Please Enter Relation Name', Toast.SHORT, Toast.CENTER);
      error.relationName = true;
      valid = false;
      relationNameRef.current.focus();
      return valid;
    }
    if (pincode.replace(/\s+/g, '').length !== 6) {
      Toast.show('Please Enter Valid Pincode', Toast.SHORT, Toast.CENTER);
      error.pincode = true;
      valid = false;
      pincodeRef.current.focus();
      return valid;
    }
    if (!ValidationHelper.isPhone(phone)) {
      Toast.show('Please Enter Valid Mobile Number', Toast.SHORT, Toast.CENTER);
      error.phone = true;
      valid = false;
      phoneRef.current.focus();
      return valid;
    }
    if (!ValidationHelper.isPanValid(panNo)) {
      Toast.show('Please Enter Valid PAN No.', Toast.SHORT, Toast.CENTER);
      error.panNo = true;
      valid = false;
      panNoRef.current.focus();
      return valid;
    }
    if (!ValidationHelper.isValidAadhar(aadharNo)) {
      Toast.show('Please Enter Valid Aadhar No.', Toast.SHORT, Toast.CENTER);
      error.aadharNo = true;
      valid = false;
      aadharNoRef.current.focus();
      return valid;
    }
    if (!ValidationHelper.isValidVoterId(voterId)) {
      Toast.show('Please Enter Valid Voter Id No.', Toast.SHORT, Toast.CENTER);
      error.voterId = true;
      valid = false;
      voterIdRef.current.focus();
      return valid;
    }
    if (product === null) {
      Toast.show('Please Select Product', Toast.SHORT, Toast.CENTER);
      error.product = true;
      valid = false;
      return valid;
    }

    // co-applicant Validation starts from here

    if (!coApplicantName.replace(/\s+/g, '').length) {
      Toast.show("Please Enter Co-Applicant's Name", Toast.SHORT, Toast.CENTER);
      error.applicantName = true;
      valid = false;
      coApplicantNameRef.current.focus();
      return valid;
    }
    if (
      moment(coApplDOB).format('DD MMM YYYY') ===
      moment(new Date()).format('DD MMM YYYY')
    ) {
      Toast.show("Please Enter Co-Applicant's DOB", Toast.SHORT, Toast.CENTER);
      valid = false;
      error.coApplDOB = true;
      return valid;
    }
    if (!coAppAddress.replace(/\s+/g, '').length) {
      Toast.show(
        "Please Enter Co-Applicant's Address",
        Toast.SHORT,
        Toast.CENTER,
      );
      error.coAppAddress = true;
      valid = false;
      coAppAddressRef.current.focus();
      return valid;
    }
    if (coApplState === null) {
      Toast.show(
        "Please Select Co-Applicant's State",
        Toast.SHORT,
        Toast.CENTER,
      );
      error.coApplState = true;
      valid = false;
      return valid;
    }
    if (coApplRelation === null) {
      Toast.show(
        "Please Select Co-Applicant's Relation",
        Toast.SHORT,
        Toast.CENTER,
      );
      error.coApplRelation = true;
      valid = false;
      return valid;
    }
    if (!coApplRelationName.replace(/\s+/g, '').length) {
      Toast.show(
        "Please Enter Co-Applicant's Relation Name",
        Toast.SHORT,
        Toast.CENTER,
      );
      error.relationName = true;
      valid = false;
      coApplRelationNameRef.current.focus();
      return valid;
    }
    if (coAppPincode.replace(/\s+/g, '').length !== 6) {
      Toast.show(
        "Please Enter Co-Applicant's Valid Pincode",
        Toast.SHORT,
        Toast.CENTER,
      );
      error.coAppPincode = true;
      valid = false;
      coAppPincodeRef.current.focus();
      return valid;
    }
    if (!ValidationHelper.isPhone(coApplMobileNo)) {
      Toast.show(
        "Please Enter Co-Applicant's Valid Mobile Number",
        Toast.SHORT,
        Toast.CENTER,
      );
      error.coApplMobileNo = true;
      valid = false;
      coApplMobileNoRef.current.focus();
      return valid;
    }
    if (!ValidationHelper.isPanValid(coApplPAN)) {
      Toast.show(
        "Please Enter Co-Applicant's Valid PAN No.",
        Toast.SHORT,
        Toast.CENTER,
      );
      error.coApplPAN = true;
      valid = false;
      coApplMobileNoRef.current.focus();
      return valid;
    }
    if (!ValidationHelper.isValidAadhar(coApplAadhar)) {
      Toast.show(
        "Please Enter Co-Applicant's Valid Aadhar No.",
        Toast.SHORT,
        Toast.CENTER,
      );
      error.coApplAadhar = true;
      valid = false;
      coApplAadharRef.current.focus();
      return valid;
    }
    if (!ValidationHelper.isValidVoterId(coApplVoterid)) {
      Toast.show(
        "Please Enter Co-Applicant's Valid Voter Id No.",
        Toast.SHORT,
        Toast.CENTER,
      );
      error.voterId = true;
      valid = false;
      coApplAadharRef.current.focus();
      return valid;
    }
    setErr(error);
    return valid;
  };

  const verifyAadhar = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('aadhar_no', aadharNo);
      console.log(aadharNo);
      const res = await axios.post(
        'https://plumber-crm.rnvalves.app/public/api/aadhar_verification',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      console.log(res?.data);
      if (res && res.status === 200 && res?.data?.status) {
        onModalClose(true);
        setLoading(false);
      } else {
        Alert.alert('invalid Aadhar number...');
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      Alert.alert('something went wrong. please try again later');
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    try {
      //   const valid = validate();
      //   if (valid) {

      verifyAadhar();

      // onModalClose(true);
      //   }
    } catch (error) {
      console.log('Error Details --->', error);
    }
  };

  const currentDate = new Date();
  const eighteenYearsAgo = new Date(
    currentDate.setFullYear(new Date().getFullYear() - 18),
  );
  const fiftyNineYearsAgo = new Date(
    currentDate.setFullYear(new Date().getFullYear() - 59),
  );
  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader
        screenName={ScreensNameEnum.CHECK_CREDIT_BUREAU_SCREEN}
      />
      <View style={{flex: 1, padding: 10}}>
        <ScrollView>
          <Text style={styles.tagline}>Check Your Credit Bureau</Text>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Applicant Name</Text>
            <TextInput
              value={applicantName}
              onChangeText={text => setApplicantName(text)}
              ref={applicantNameRef}
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'applicantName'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'applicantName' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('applicantName')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>DOB</Text>
            <Text
              style={[
                styles.input,
                {
                  borderBottomWidth: 1,
                  textAlignVertical: 'bottom',
                  color: R.colors.PRIMARI_DARK,
                  textAlign: 'center',
                },
              ]}
              onPress={() => setOpen(!open)}>
              {moment(dob).format('DD MMM YYYY') ===
              moment(new Date()).format('DD MMM YYYY')
                ? ''
                : moment(dob).format('DD MMM YYYY')}
            </Text>
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              ref={addressRef}
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'address'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'address' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('address')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>State</Text>
            <Picker
              selectedValue={state}
              onValueChange={(itemValue, itemIndex) => setState(itemValue)}
              mode="dropdown"
              style={styles.input}>
              {state === null && (
                <Picker.Item label="Select State" value={null} />
              )}
              <Picker.Item label="Uttar Pradesh" value="Uttar Pradesh" />
              <Picker.Item label="Andhra Pradesh" value="Andhra Pradesh" />
            </Picker>
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Relation</Text>
            <Picker
              selectedValue={relation}
              onValueChange={(itemValue, itemIndex) => setRelation(itemValue)}
              mode="dropdown"
              style={styles.input}>
              {relation === null && (
                <Picker.Item label="Select Relation" value={null} />
              )}
              <Picker.Item label="Uttar Pradesh" value="Uttar Pradesh" />
              <Picker.Item label="Andhra Pradesh" value="Andhra Pradesh" />
            </Picker>
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Relation Name</Text>
            <TextInput
              value={relationName}
              onChangeText={setRelationName}
              ref={relationNameRef}
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'relationName'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'relationName' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('relationName')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Pin Code</Text>
            <TextInput
              value={pincode}
              onChangeText={setPincode}
              ref={pincodeRef}
              keyboardType="decimal-pad"
              maxLength={6}
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'pincode'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'pincode' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('pincode')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Mobile No</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              ref={phoneRef}
              keyboardType="decimal-pad"
              maxLength={10}
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'phone'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'phone' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('phone')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>PAN Card No.</Text>
            <TextInput
              value={panNo}
              onChangeText={text => {
                setPanno(text.toLocaleUpperCase());
              }}
              maxLength={10}
              ref={panNoRef}
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'panNo'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'panNo' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('panNo')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Aadhar No.</Text>
            <TextInput
              value={aadharNo}
              onChangeText={setAadharNo}
              maxLength={12}
              ref={aadharNoRef}
              keyboardType="decimal-pad"
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'aadharNo'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'aadharNo' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('aadharNo')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Voter Id No.</Text>
            <TextInput
              value={voterId}
              onChangeText={text => {
                setVoterId(text.toUpperCase());
              }}
              maxLength={10}
              ref={voterIdRef}
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'voterId'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'voterId' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('voterId')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Product</Text>
            <Picker
              selectedValue={product}
              onValueChange={(itemValue, itemIndex) => setProduct(itemValue)}
              mode="dropdown"
              style={styles.input}>
              {product === null && (
                <Picker.Item label="Select Product" value={null} />
              )}
              <Picker.Item label="Uttar Pradesh" value="Uttar Pradesh" />
              <Picker.Item label="Andhra Pradesh" value="Andhra Pradesh" />
            </Picker>
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Co-Appl Name</Text>
            <TextInput
              value={coApplicantName}
              onChangeText={setCoApplName}
              ref={coApplicantNameRef}
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'coApplicantName'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'coApplicantName' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('coApplicantName')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Co-Appl DOB</Text>
            <Text
              style={[
                styles.input,
                {
                  borderBottomWidth: 1,
                  textAlignVertical: 'bottom',
                  color: R.colors.PRIMARI_DARK,
                  textAlign: 'center',
                },
              ]}
              onPress={() => setCoApplDOBOpen(!open)}>
              {moment(coApplDOB).format('DD MMM YYYY') ===
              moment(new Date()).format('DD MMM YYYY')
                ? ''
                : moment(coApplDOB).format('DD MMM YYYY')}
            </Text>
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Co-Appl Address</Text>
            <TextInput
              value={coAppAddress}
              onChangeText={setCoAppAddress}
              ref={coAppAddressRef}
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'coAppAddress'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'coAppAddress' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('coAppAddress')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Co-Appl State</Text>
            <Picker
              selectedValue={coApplState}
              onValueChange={(itemValue, itemIndex) =>
                setCoApplState(itemValue)
              }
              mode="dropdown"
              style={styles.input}>
              {coApplState === null && (
                <Picker.Item label="Select State" value={null} />
              )}
              <Picker.Item label="Uttar Pradesh" value="Uttar Pradesh" />
              <Picker.Item label="Andhra Pradesh" value="Andhra Pradesh" />
            </Picker>
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}> Co-Appl Relation</Text>
            <Picker
              selectedValue={coApplRelation}
              onValueChange={(itemValue, itemIndex) =>
                setCoApplRelation(itemValue)
              }
              mode="dropdown"
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'coApplRelation'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'coApplRelation' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('coApplRelation')}
              onBlur={() => setFocused(null)}>
              {coApplRelation === null && (
                <Picker.Item label="Select Relation" value={null} />
              )}
              <Picker.Item label="Uttar Pradesh" value="Uttar Pradesh" />
              <Picker.Item label="Andhra Pradesh" value="Andhra Pradesh" />
            </Picker>
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Relation Name</Text>
            <TextInput
              value={coApplRelationName}
              onChangeText={setCoAppliRelationName}
              ref={coApplRelationNameRef}
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'coApplRelationName'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'coApplRelationName' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('coApplRelationName')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Pin Code</Text>
            <TextInput
              value={coAppPincode}
              onChangeText={setCoApplPincode}
              keyboardType="decimal-pad"
              ref={coAppPincodeRef}
              maxLength={6}
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'coAppPincode'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'coAppPincode' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('coAppPincode')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Mobile No</Text>
            <TextInput
              value={coApplMobileNo}
              onChangeText={setCoAppMobileNo}
              keyboardType="decimal-pad"
              maxLength={10}
              ref={coApplMobileNoRef}
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'coApplMobileNo'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'coApplMobileNo' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('coApplMobileNo')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>PAN Card No.</Text>
            <TextInput
              value={coApplPAN}
              onChangeText={text => setCoApplPAN(text.toUpperCase())}
              maxLength={10}
              ref={coApplPANRef}
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'coApplPAN'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'coApplPAN' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('coApplPAN')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Aadhar No.</Text>
            <TextInput
              value={coApplAadhar}
              onChangeText={setCoApplAadhar}
              keyboardType="decimal-pad"
              maxLength={12}
              ref={coApplAadharRef}
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'coApplAadhar'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'coApplAadhar' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('coApplAadhar')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Voter Id No.</Text>
            <TextInput
              value={coApplVoterid}
              onChangeText={setCoAppVoterid}
              maxLength={10}
              ref={coApplVoteridRef}
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'coApplVoterid'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'coApplVoterid' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('coApplVoterid')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View
            style={{
              width: '40%',
              alignSelf: 'center',
              justifyContent: 'center',
              marginVertical: 20,
            }}>
            <Button
              title="CONFIRM"
              buttonStyle={{borderRadius: 12, padding: 5}}
              textStyle={{
                fontWeight: '800',
              }}
              onPress={handleConfirm}
            />
          </View>
        </ScrollView>
      </View>
      <DatePicker
        modal
        open={open}
        date={dob}
        onConfirm={date => {
          setOpen(false);
          setDob(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
        mode="date"
        maximumDate={eighteenYearsAgo}
        minimumDate={fiftyNineYearsAgo}
      />
      <DatePicker
        modal
        open={coApplDOBopen}
        date={coApplDOB}
        onConfirm={date => {
          setCoApplDOBOpen(false);
          setCoApplDOB(date);
        }}
        onCancel={() => {
          setCoApplDOBOpen(false);
        }}
        mode="date"
        maximumDate={eighteenYearsAgo}
        minimumDate={fiftyNineYearsAgo}
      />
      {isVisible && (
        <VerifyOTPModal
          isVisible={isVisible}
          onModalClose={onModalClose}
          aadharNo={aadharNo}
          // onConfirm={onConfirm}
          // clientId={clientId}
          resendCode={verifyAadhar}
        />
      )}
      <LoaderAnimation loading={loading} message={'please wait...'} />
    </ScreenWrapper>
  );
};

export default CheckCreditBureau;

const styles = StyleSheet.create({
  tagline: {
    textAlign: 'center',
    fontSize: R.fontSize.L,
    fontWeight: '600',
    padding: 10,
    textDecorationLine: 'underline',
    color: R.colors.PRIMARI_DARK,
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
    textAlignVertical: 'bottom',
    height: '100%',
  },
  input: {
    borderBottomWidth: 1,
    flex: 2.5,
    height: 45,
    color: R.colors.PRIMARI_DARK,
    textAlignVertical: 'bottom',
    fontSize: 16,
    fontWeight: '500',
  },
});
