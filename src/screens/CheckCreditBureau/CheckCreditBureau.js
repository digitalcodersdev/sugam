import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import R from '../../resources/R';
import {TextInput} from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import Button from '../../library/commons/Button';

const CheckCreditBureau = () => {
  const [applicantName, setApplicantName] = useState('');
  const [open, setOpen] = useState(false);
  const [dob, setDob] = useState(new Date());
  const [Address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [relation, setRelations] = useState('');
  const [relationName, setRelationName] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [panNo, setPanno] = useState('');
  const [aadharNo, setAadharNo] = useState('');
  const [voterId, setVoterId] = useState('');
  const [product, setProduct] = useState('');
  const [coApplicantName, setCoApplName] = useState('');
  const [coApplDOBopen, setCoApplDOBOpen] = useState(false);
  const [coApplDOB, setCoApplDOB] = useState(new Date());
  const [coAppAddress, setCoAppAddress] = useState('');
  const [coApplState, setCoApplState] = useState('');
  const [coApplRelation, setCoApplRelation] = useState();
  const [coApplRelationName, setCoAppliRelationName] = useState('');
  const [coAppPincode, setCoApplPincode] = useState('');
  const [coApplMobileNo, setCoAppMobileNo] = useState();
  const [coApplPAN, setCoApplPAN] = useState('');
  const [coApplAadhar, setCoApplAadhar] = useState('');
  const [coApplVoterid, setCoAppVoterid] = useState('');

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
              onChangeText={setApplicantName}
              style={styles.input}
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
              {moment(dob).format('DD MMM YYYY')}
            </Text>
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              value={applicantName}
              onChangeText={setApplicantName}
              style={styles.input}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>State</Text>
            <TextInput
              value={applicantName}
              onChangeText={setApplicantName}
              style={styles.input}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Relation</Text>
            <TextInput
              value={applicantName}
              onChangeText={setApplicantName}
              style={styles.input}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Relation Name</Text>
            <TextInput
              value={applicantName}
              onChangeText={setApplicantName}
              style={styles.input}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Pin Code</Text>
            <TextInput
              value={applicantName}
              onChangeText={setApplicantName}
              style={styles.input}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Mobile No</Text>
            <TextInput
              value={applicantName}
              onChangeText={setApplicantName}
              style={styles.input}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>PAN Card No.</Text>
            <TextInput
              value={applicantName}
              onChangeText={setApplicantName}
              style={styles.input}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Aadhar No.</Text>
            <TextInput
              value={applicantName}
              onChangeText={setApplicantName}
              style={styles.input}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Voter Id No.</Text>
            <TextInput
              value={applicantName}
              onChangeText={setApplicantName}
              style={styles.input}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Product</Text>
            <TextInput
              value={applicantName}
              onChangeText={setApplicantName}
              style={styles.input}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Co-Appl Name</Text>
            <TextInput
              value={applicantName}
              onChangeText={setApplicantName}
              style={styles.input}
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
              {moment(coApplDOB).format('DD MMM YYYY')}
            </Text>
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Co-Appl Address</Text>
            <TextInput
              value={applicantName}
              onChangeText={setApplicantName}
              style={styles.input}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Co-Appl State</Text>
            <TextInput
              value={applicantName}
              onChangeText={setApplicantName}
              style={styles.input}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}> Co-Appl Relation</Text>
            <TextInput
              value={applicantName}
              onChangeText={setApplicantName}
              style={styles.input}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Relation Name</Text>
            <TextInput
              value={applicantName}
              onChangeText={setApplicantName}
              style={styles.input}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Pin Code</Text>
            <TextInput
              value={applicantName}
              onChangeText={setApplicantName}
              style={styles.input}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Mobile No</Text>
            <TextInput
              value={applicantName}
              onChangeText={setApplicantName}
              style={styles.input}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>PAN Card No.</Text>
            <TextInput
              value={applicantName}
              onChangeText={setApplicantName}
              style={styles.input}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Aadhar No.</Text>
            <TextInput
              value={applicantName}
              onChangeText={setApplicantName}
              style={styles.input}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Voter Id No.</Text>
            <TextInput
              value={applicantName}
              onChangeText={setApplicantName}
              style={styles.input}
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
        maximumDate={new Date()}
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
        maximumDate={new Date()}
      />
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
  },
  label: {
    color: R.colors.PRIMARI_DARK,
    flex: 1.5,
    alignItems: 'center',
    fontWeight: '500',
    fontSize: 16,
    textAlignVertical: 'bottom',
    height: '100%',
  },
  input: {
    borderBottomWidth: 1,
    flex: 2.5,
    height: 40,
    color: R.colors.PRIMARI_DARK,
  },
});
