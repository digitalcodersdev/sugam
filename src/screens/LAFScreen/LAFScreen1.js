import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  TextInput,
  Alert,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import R from '../../resources/R';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import {useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import UserApi from '../../datalib/services/user.api';
import Button from '../../library/commons/Button';
import Loader from '../../library/commons/Loader';

const LAFScreen1 = props => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [phone, setPhone] = useState('');
  const {userData, coAppData} = props.route?.params?.data;
  console.log('userData', userData, props.route?.params?.data);
  const {enrollmentId} = props.route?.params?.data;
  //new States
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [focused, setFocused] = useState(null);
  const [spouseName, setSpouseName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [dob, setDob] = useState(new Date());
  const [gender, setGender] = useState(null);
  const [noOfDependent, setnoOfDependent] = useState(null);
  const [occupation, setOccupation] = useState('');
  const [education, setEductaion] = useState('');
  const [maritalStatus, setMaritalStatus] = useState(null);
  const [houseType, setHouseType] = useState(null);
  const [village, setVillage] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [block, setBlock] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [yearsAtAddress, setYearsAtCurrAdd] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessYears, setBusinessYears] = useState('');
  const [loading, setLoading] = useState(false);
  const [caste, setCaste] = useState(null);
  const [religion, setReligion] = useState(null);
  const [eductaion, setEducation] = useState(null);

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const spouseRefName = useRef(null);
  const fatherNameRef = useRef(null);
  const motherNameRef = useRef(null);
  const noOfDependentRef = useRef(null);
  const occupationRef = useRef(null);
  const educationRef = useRef(null);
  useEffect(() => {
    if (userData) {
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
        gender,
        dist,
        vtc,
      } = userData;
      const {coApplicantName} = coAppData;
      const names = name?.split(' ');
      if (names?.length == 2) {
        setFirstName(names[0]);
        setLastName(names[1]);
      }
      setSpouseName(coApplicantName?.split(' ')[0]);
      if (names?.length == 3) {
        setFirstName(names[0]);
        setMiddleName(names[1]);
        setLastName(names[2]);
      }
      if (names?.length == 1) {
        setFirstName(names[0]);
      }

      setDob(dob);
      setPhone(phone);
      setFatherName(
        careOf?.split(' ').slice(1).toString()?.replaceAll(',', ' '),
      );
      setPincode(pincode);
      setState(state);
      setAddress(address);
      setGender(gender);
      setDistrict(dist);
      setVillage(vtc);
    }
  }, []);
  useEffect(() => {
    if (parseInt(yearsAtAddress) < 3 && yearsAtAddress != '') {
      Alert.alert('Years at Current Address Must me 3 or more years');
      setYearsAtCurrAdd('');
    }
  }, [yearsAtAddress]);
  const valid = () => {
    const errors = {};
    let valid = true;

    // Validate Occupation
    if (!occupation || occupation.trim() === '') {
      errors.occupation = 'Occupation is required';
      valid = false;
      Alert.alert('Occupation is required');
      return valid;
    }
    // Validate Education
    if (education === null) {
      errors.occupation = 'Education is required';
      valid = false;
      Alert.alert('Education is required');
      return valid;
    }

    if (!motherName || motherName.trim() === '') {
      errors.motherName = 'Mother name is required';
      valid = false;
      Alert.alert('Mother name is required');
      return valid;
    }
    // Validate Spouse Name
    if (maritalStatus === null) {
      errors.spouseName = 'Spouse name is required for married individuals';
      valid = false;
      Alert.alert('Select Marital Status');
      return valid;
    }

    // Validate Parent Names
    if (!fatherName || fatherName.trim() === '') {
      errors.fatherName = 'Father name is required';
      valid = false;
      Alert.alert('Father Name is required');
      return valid;
    }

    // Validate Number of Dependents
    if (noOfDependent !== null && (isNaN(noOfDependent) || noOfDependent < 0)) {
      errors.noOfDependent = 'Number of dependents must be a positive number';
      valid = false;
      Alert.alert('No of dependent is required');
      return valid;
    }

    // Validate Marital Status
    if (maritalStatus == null) {
      errors.maritalStatus = 'Please select a valid marital status';
      valid = false;
      Alert.alert('Merital Status id required');
      return valid;
    }

    if (religion === null) {
      Alert.alert('Please Select Religion');
      valid = false;
      return valid;
    }
    if (caste === null) {
      Alert.alert('Please Select Caste');
      valid = false;
      return valid;
    }

    // Validate Address Fields
    if (!village || village.trim() === '') {
      errors.village = 'Village is required';
      valid = false;
      Alert.alert('Village is required');
      return valid;
    }

    if (!pincode || !/^[0-9]{6}$/.test(pincode)) {
      errors.pincode = 'Please enter a valid 6-digit pincode';
      valid = false;
      Alert.alert('Pincode is required');
      return valid;
    }
    // if (!block || block.trim() === '') {
    //   errors.block = 'Block is required';
    //   valid = false;
    //   Alert.alert('Block is required');
    //   return valid;
    // }
    if (!district || district.trim() === '') {
      errors.district = 'District is required';
      valid = false;
      Alert.alert('District is required');
      return valid;
    }
    if (!state || state.trim() === '') {
      errors.state = 'State is required';
      valid = false;
      Alert.alert('State is required');
      return valid;
    }

    // Validate Years at Address
    if (!yearsAtAddress || isNaN(yearsAtAddress) || yearsAtAddress < 0) {
      errors.yearsAtAddress = 'Years at address must be a positive number';
      valid = false;
      Alert.alert('Years at current Add is required');
      return valid;
    }

    // // Validate Business Details
    // if (!businessType || businessType.trim() === '') {
    //   errors.businessType = 'Business type is required';
    //   valid = false
    //   Alert.alert("Occupation is required")
    //   return valid
    // }
    // if (!businessYears || isNaN(businessYears) || businessYears < 0) {
    //   errors.businessYears = 'Business years must be a positive number';
    // }

    return valid;
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      if (valid()) {
        const GENDER = {
          M: 1,
          F: 2,
        };
        const payload = {
          applicant: {
            name: firstName,
            client_middle_name: middleName,
            client_last_name: lastName,
            client_gender: GENDER[gender],
            client_no_of_depend: noOfDependent,
            client_occupation: occupation,
            surname: fatherName,
            spousesurname: motherName,
            client_marital_status: maritalStatus,
            spousename: spouseName,
            client_no_of_yrs: yearsAtAddress,
            enrollmentid: enrollmentId,
            client_housetype: houseType,
            address: address,
            district: district,
            state: state,
            village: village,
            pincode: pincode,
            block: block,
            religion: religion,
            caste: caste,
            education: education,
          },
        };
        const response = await new UserApi().insertApplicant(payload);
        if (response) {
          navigation.navigate(ScreensNameEnum.LAF_GROUP_SCREEN2, {
            data: props.route?.params?.data,
          });
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <ScreenWrapper header={false} backDisabled>
      <Text
        style={[
          styles.tagline,
          {
            backgroundColor: R.colors.SLATE_GRAY,
            color: R.colors.PRIMARY_LIGHT,
          },
        ]}>
        {ScreensNameEnum.LAF_GROUP_SCREEN}
      </Text>
      <View style={{flex: 1, padding: 10}}>
        <ScrollView>
          <Text
            style={[
              styles.tagline,
              {
                backgroundColor: R.colors.SLATE_GRAY,
                color: R.colors.PRIMARY_LIGHT,
                textDecorationLine: 'none',
                borderRadius: 6,
                fontWeight: R.fontSize.M,
                fontWeight: '500',
                padding: 5,
              },
            ]}>
            Personal and Employment Details
          </Text>
          <View style={styles.cardView}>
            <View style={styles.viewInput}>
              <Text style={styles.label}>First Name*</Text>
              <TextInput
                value={firstName}
                onChangeText={text => setFirstName(text)}
                ref={firstNameRef}
                editable={false}
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
              <Text style={styles.label}>Middle Name</Text>
              <TextInput
                value={middleName}
                onChangeText={text => setMiddleName(text)}
                editable={false}
                style={[
                  styles.input,
                  {
                    borderColor:
                      focused === 'middleName'
                        ? R.colors.primary
                        : R.colors.PRIMARI_DARK,
                    borderBottomWidth: focused === 'middleName' ? 1.5 : 1,
                  },
                ]}
                onFocus={() => setFocused('middleName')}
                onBlur={() => setFocused(null)}
              />
            </View>
            <View style={styles.viewInput}>
              <Text style={styles.label}>Last Name*</Text>
              <TextInput
                value={lastName}
                onChangeText={text => setLastName(text)}
                ref={lastNameRef}
                editable={false}
                style={[
                  styles.input,
                  {
                    borderColor:
                      focused === 'lastName'
                        ? R.colors.primary
                        : R.colors.PRIMARI_DARK,
                    borderBottomWidth: focused === 'lastName' ? 1.5 : 1,
                  },
                ]}
                onFocus={() => setFocused('lastName')}
                onBlur={() => setFocused(null)}
              />
            </View>
            <View style={styles.viewInput}>
              <Text style={styles.label}>DOB*</Text>
              <TextInput
                value={dob}
                onChangeText={text => setDob(text)}
                // ref={lastNameRef}
                editable={false}
                style={[
                  styles.input,
                  {
                    borderColor:
                      focused === 'dob'
                        ? R.colors.primary
                        : R.colors.PRIMARI_DARK,
                    borderBottomWidth: focused === 'dob' ? 1.5 : 1,
                  },
                ]}
                onFocus={() => setFocused('dob')}
                onBlur={() => setFocused(null)}
              />
            </View>
            <View style={[styles.viewInput]}>
              <Text style={styles.label}>Gender*</Text>
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
                mode="dropdown"
                enabled={false}
                dropdownIconColor={R.colors.PRIMARI_DARK}
                style={[
                  styles.input,
                  {
                    color: isDarkMode ? R.colors.PRIMARI_DARK : '#000000',
                    height: 50,
                  },
                ]}>
                {gender === null && (
                  <Picker.Item
                    label="Select Gender"
                    value={null}
                    enabled={false}
                  />
                )}
                <Picker.Item label="Male" value="M" />
                <Picker.Item label="Female" value="F" />
              </Picker>
            </View>
            <View style={styles.viewInput}>
              <Text style={styles.label}>Mobile No.*</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                //   ref={noOfDependentRef}
                editable={false}
                keyboardType="decimal-pad"
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
              <Text style={styles.label}>No. Of Dependent*</Text>
              <TextInput
                value={noOfDependent}
                onChangeText={setnoOfDependent}
                ref={noOfDependentRef}
                keyboardType="decimal-pad"
                style={[
                  styles.input,
                  {
                    borderColor:
                      focused === 'noOfDependent'
                        ? R.colors.primary
                        : R.colors.PRIMARI_DARK,
                    borderBottomWidth: focused === 'noOfDependent' ? 1.5 : 1,
                  },
                ]}
                onFocus={() => setFocused('noOfDependent')}
                onBlur={() => setFocused(null)}
                maxLength={1}
              />
            </View>
            <View style={styles.viewInput}>
              <Text style={styles.label}>Occupation*</Text>
              <TextInput
                value={occupation}
                onChangeText={setOccupation}
                ref={occupationRef}
                style={[
                  styles.input,
                  {
                    borderColor:
                      focused === 'occupation'
                        ? R.colors.primary
                        : R.colors.PRIMARI_DARK,
                    borderBottomWidth: focused === 'occupation' ? 1.5 : 1,
                  },
                ]}
                onFocus={() => setFocused('occupation')}
                onBlur={() => setFocused(null)}
              />
            </View>

            <View style={styles.viewInput}>
              <Text style={styles.label}>Higher Education*</Text>
              <Picker
                selectedValue={eductaion}
                onValueChange={(itemValue, itemIndex) =>
                  setEducation(itemValue)
                }
                mode="dropdown"
                dropdownIconColor={R.colors.PRIMARI_DARK}
                style={[
                  styles.input,
                  {
                    color: isDarkMode ? R.colors.PRIMARI_DARK : '#000000',
                    height: 50,
                  },
                ]}>
                {eductaion === null && (
                  <Picker.Item
                    label="Select Education"
                    value={null}
                    enabled={false}
                  />
                )}
                <Picker.Item label="Illiterate" value="Illiterate" />
                <Picker.Item label="5TH" value="5TH" />
                <Picker.Item label="8TH" value="8TH" />
                <Picker.Item label="10TH" value="10TH" />
                <Picker.Item label="12TH" value="12TH" />
                <Picker.Item label="Diploma" value="Diploma" />
                <Picker.Item label="Graduate" value="Graduate" />
                <Picker.Item label="PostGraduate" value="PostGraduate" />
              </Picker>
            </View>

            <View style={styles.viewInput}>
              <Text style={styles.label}>Father's Name*</Text>
              <TextInput
                value={fatherName}
                onChangeText={text => setFatherName(text)}
                ref={fatherNameRef}
                editable={false}
                style={[
                  styles.input,
                  {
                    borderColor:
                      focused === 'fatherName'
                        ? R.colors.primary
                        : R.colors.PRIMARI_DARK,
                    borderBottomWidth: focused === 'fatherName' ? 1.5 : 1,
                  },
                ]}
                onFocus={() => setFocused('fatherName')}
                onBlur={() => setFocused(null)}
              />
            </View>
            <View style={styles.viewInput}>
              <Text style={styles.label}>Mother's Name*</Text>
              <TextInput
                value={motherName}
                onChangeText={text => setMotherName(text)}
                ref={motherNameRef}
                style={[
                  styles.input,
                  {
                    borderColor:
                      focused === 'motherName'
                        ? R.colors.primary
                        : R.colors.PRIMARI_DARK,
                    borderBottomWidth: focused === 'motherName' ? 1.5 : 1,
                  },
                ]}
                onFocus={() => setFocused('motherName')}
                onBlur={() => setFocused(null)}
              />
            </View>
            <View style={styles.viewInput}>
              <Text style={styles.label}>Marital Status*</Text>
              <Picker
                selectedValue={maritalStatus}
                onValueChange={(itemValue, itemIndex) =>
                  setMaritalStatus(itemValue)
                }
                mode="dropdown"
                dropdownIconColor={R.colors.PRIMARI_DARK}
                style={[
                  styles.input,
                  {
                    color: isDarkMode ? R.colors.PRIMARI_DARK : '#000000',
                    height: 50,
                  },
                ]}>
                {maritalStatus === null && (
                  <Picker.Item
                    label="Select Marital Status"
                    value={null}
                    enabled={false}
                  />
                )}
                <Picker.Item label="Single" value="1" />
                <Picker.Item label="Married" value="2" />
              </Picker>
            </View>

            <View style={styles.viewInput}>
              <Text style={styles.label}>Religion*</Text>
              <Picker
                selectedValue={religion}
                onValueChange={(itemValue, itemIndex) => setReligion(itemValue)}
                mode="dropdown"
                dropdownIconColor={R.colors.PRIMARI_DARK}
                style={[
                  styles.input,
                  {
                    color: isDarkMode ? R.colors.PRIMARI_DARK : '#000000',
                    height: 50,
                  },
                ]}>
                {religion === null && (
                  <Picker.Item
                    label="Select Religion"
                    value={null}
                    enabled={false}
                  />
                )}
                <Picker.Item label="Hindu" value="Hindu" />
                <Picker.Item label="Muslim" value="Muslim" />
                <Picker.Item label="Christian" value="Christian" />
                <Picker.Item label="Sikh" value="Sikh" />
                <Picker.Item label="Buddh" value="Buddh" />
                <Picker.Item label="Jain" value="Jain" />
              </Picker>
            </View>
            <View style={styles.viewInput}>
              <Text style={styles.label}>Caste*</Text>
              <Picker
                selectedValue={caste}
                onValueChange={(itemValue, itemIndex) => setCaste(itemValue)}
                mode="dropdown"
                dropdownIconColor={R.colors.PRIMARI_DARK}
                style={[
                  styles.input,
                  {
                    color: isDarkMode ? R.colors.PRIMARI_DARK : '#000000',
                    height: 50,
                  },
                ]}>
                {caste === null && (
                  <Picker.Item
                    label="Select Caste"
                    value={null}
                    enabled={false}
                  />
                )}
                <Picker.Item label="General" value="General" />
                <Picker.Item label="SC" value="SC" />
                <Picker.Item label="ST" value="ST" />
                <Picker.Item label="OBC" value="OBC" />
              </Picker>
            </View>
            <View style={styles.viewInput}>
              <Text style={styles.label}>Spouse Name</Text>
              <TextInput
                value={spouseName}
                onChangeText={text => setSpouseName(text)}
                ref={spouseRefName}
                style={[
                  styles.input,
                  {
                    borderColor:
                      focused === 'spouseName'
                        ? R.colors.primary
                        : R.colors.PRIMARI_DARK,
                    borderBottomWidth: focused === 'spouseName' ? 1.5 : 1,
                  },
                ]}
                onFocus={() => setFocused('spouseName')}
                onBlur={() => setFocused(null)}
              />
            </View>
            <View style={styles.viewInput}>
              <Text style={styles.label}>Village*</Text>
              <TextInput
                value={village}
                onChangeText={text => setVillage(text)}
                style={[
                  styles.input,
                  {
                    borderColor:
                      focused === 'village'
                        ? R.colors.primary
                        : R.colors.PRIMARI_DARK,
                    borderBottomWidth: focused === 'village' ? 1.5 : 1,
                  },
                ]}
                onFocus={() => setFocused('village')}
                onBlur={() => setFocused(null)}
              />
            </View>
            <View style={styles.viewInput}>
              <Text style={styles.label}>Address*</Text>
              <TextInput
                value={address} //?.length <=80? address:address.substring(0,80)+"..."
                onChangeText={text => setAddress(text)}
                multiline
                style={[
                  styles.input,
                  {
                    borderColor:
                      focused === 'address'
                        ? R.colors.primary
                        : R.colors.PRIMARI_DARK,
                    borderBottomWidth: focused === 'address' ? 1.5 : 1,
                    minHeight: 80,
                    maxHeight: 120,
                  },
                ]}
                onFocus={() => setFocused('address')}
                onBlur={() => setFocused(null)}
                editable={false}
              />
            </View>
            <View style={styles.viewInput}>
              <Text style={styles.label}>Pin Code*</Text>
              <TextInput
                value={pincode}
                onChangeText={text => setPincode(text)}
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
              <Text style={styles.label}>Block/Taluka/Tehsil</Text>
              <TextInput
                value={block}
                onChangeText={text => setBlock(text)}
                style={[
                  styles.input,
                  {
                    borderColor:
                      focused === 'block'
                        ? R.colors.primary
                        : R.colors.PRIMARI_DARK,
                    borderBottomWidth: focused === 'block' ? 1.5 : 1,
                  },
                ]}
                onFocus={() => setFocused('block')}
                onBlur={() => setFocused(null)}
              />
            </View>
            <View style={styles.viewInput}>
              <Text style={styles.label}>District*</Text>
              <TextInput
                value={district}
                onChangeText={text => setDistrict(text)}
                style={[
                  styles.input,
                  {
                    borderColor:
                      focused === 'district'
                        ? R.colors.primary
                        : R.colors.PRIMARI_DARK,
                    borderBottomWidth: focused === 'district' ? 1.5 : 1,
                  },
                ]}
                onFocus={() => setFocused('district')}
                onBlur={() => setFocused(null)}
              />
            </View>
            <View style={styles.viewInput}>
              <Text style={styles.label}>State*</Text>
              <TextInput
                value={state}
                onChangeText={text => setState(text)}
                style={[
                  styles.input,
                  {
                    borderColor:
                      focused === 'state'
                        ? R.colors.primary
                        : R.colors.PRIMARI_DARK,
                    borderBottomWidth: focused === 'state' ? 1.5 : 1,
                  },
                ]}
                onFocus={() => setFocused('state')}
                onBlur={() => setFocused(null)}
              />
            </View>
            <View style={styles.viewInput}>
              <Text style={styles.label}>House Type*</Text>
              <Picker
                selectedValue={houseType}
                onValueChange={(itemValue, itemIndex) =>
                  setHouseType(itemValue)
                }
                mode="dropdown"
                dropdownIconColor={R.colors.PRIMARI_DARK}
                style={[
                  styles.input,
                  {
                    color: isDarkMode ? R.colors.PRIMARI_DARK : '#000000',
                    height: 50,
                  },
                ]}>
                {houseType === null && (
                  <Picker.Item
                    label="Select House Type"
                    value={null}
                    enabled={false}
                  />
                )}
                <Picker.Item label="Own" value="Own" />
                <Picker.Item label="Rented" value="Rented" />
              </Picker>
            </View>
            <View style={styles.viewInput}>
              <Text style={styles.label}>Years At Current Address*</Text>
              <TextInput
                value={yearsAtAddress}
                onChangeText={text => setYearsAtCurrAdd(text)}
                style={[
                  styles.input,
                  {
                    borderColor:
                      focused === 'yearsAtAddress'
                        ? R.colors.primary
                        : R.colors.PRIMARI_DARK,
                    borderBottomWidth: focused === 'yearsAtAddress' ? 1.5 : 1,
                  },
                ]}
                onFocus={() => setFocused('yearsAtAddress')}
                onBlur={() => setFocused(null)}
                maxLength={2}
                keyboardType="number-pad"
              />
            </View>
            {/* <View style={styles.viewInput}>
              <Text style={styles.label}>Business Type*</Text>
              <TextInput
                value={businessType}
                onChangeText={text => setBusinessType(text)}
                style={[
                  styles.input,
                  {
                    borderColor:
                      focused === 'businessType'
                        ? R.colors.primary
                        : R.colors.PRIMARI_DARK,
                    borderBottomWidth: focused === 'businessType' ? 1.5 : 1,
                  },
                ]}
                onFocus={() => setFocused('businessType')}
                onBlur={() => setFocused(null)}
              />
            </View>
            <View style={styles.viewInput}>
              <Text style={styles.label}>Business (Years)*</Text>
              <TextInput
                value={businessYears}
                onChangeText={text => setBusinessYears(text)}
                style={[
                  styles.input,
                  {
                    borderColor:
                      focused === 'businessYears'
                        ? R.colors.primary
                        : R.colors.PRIMARI_DARK,
                    borderBottomWidth: focused === 'businessYears' ? 1.5 : 1,
                  },
                ]}
                onFocus={() => setFocused('businessYears')}
                onBlur={() => setFocused(null)}
              />
            </View> */}
          </View>
          <Button
            title="NEXT"
            buttonStyle={{
              width: '100%',
              alignSelf: 'center',
              borderRadius: 6,
              margin: 10,
            }}
            textStyle={{fontWeight: 'bold'}}
            onPress={handleNext}
          />
        </ScrollView>
      </View>
      <Loader loading={loading} message={'please wait...'} />
    </ScreenWrapper>
  );
};

export default LAFScreen1;

const styles = StyleSheet.create({
  tagline: {
    textAlign: 'center',
    fontSize: R.fontSize.XL,
    fontWeight: '600',
    padding: 10,
    textDecorationLine: 'underline',
    color: R.colors.primary,
  },
  cardView: {
    // backgroundColor: '',
    flex: 1,
    padding: 10,
  },
  phoenNumberView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  viewInput: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'flex-end',
    marginVertical: 5,
    alignItems: 'center',
  },
  labels: {
    color: R.colors.PRIMARI_DARK,
    flex: 1.5,
    alignItems: 'center',
    fontWeight: '400',
    fontSize: 16,
    textAlignVertical: 'center',
    height: '100%',
    marginBottom: 15,
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
  fieldContainer: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
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
  //   input: (isDarkMode, isDisabled = false) => ({
  //     borderColor: isDarkMode ? R.colors.LIGHTGRAY : '#000',
  //     borderWidth: 1,
  //     borderRadius: 5,
  //     padding: 10,
  //     color: isDarkMode ? R.colors.PRIMARI_DARK : '#000',
  //     backgroundColor: isDisabled
  //       ? R.colors.LIGHTGRAY
  //       : isDarkMode
  //       ? R.colors.PRIMARY_LIGHT
  //       : '#fff',
  //     flex: 1.5,
  //   }),
  viewInput: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 5,
    alignItems: 'center',
  },
});
