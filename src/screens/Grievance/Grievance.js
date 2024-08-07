import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, StyleSheet, useColorScheme} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import R from '../../resources/R';
import Button from '../../library/commons/Button';
import UserApi from '../../datalib/services/user.api';
import moment from 'moment';
import Toast from "react-native-simple-toast"

const Grievance = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [loading, setLoading] = useState(false);
  const [relatedWith, setRelatedWith] = useState(null);
  const [department, setDepartment] = useState(null);
  const [queryRelatedTo, setQueryRelatedTo] = useState(null);
  const [msg, setMsg] = useState('');
  const [loanId, setLoanId] = useState(null);
  const [departmentData, setDepartmentData] = useState([]);
  const [relatedToData, setRelatedToData] = useState([]);
  const [name, setname] = useState('');
  const [clientContactNo, setClientContactNo] = useState('');
  const [clientLocation, setClientLocation] = useState('');
  const [panNo, setPanNo] = useState('');
  const [aadharNo, setAadharNo] = useState('');

  useEffect(() => {
    fetchDropdowns();
  }, []);
  const fetchDropdowns = async () => {
    try {
      setLoading(true);
      const res = await new UserApi().fetchGrievanceDropdowns();
      if (res) {
        setDepartmentData(res?.dept);
        setRelatedToData(res?.queryRelated);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const validate = () => {
    let valid = true;
    // if()
    return valid;
  };

  const hanldeSubmit = async () => {
    try {
      if (validate()) {
        const payload = {
          grievance: {
            RelatedWith: relatedWith,
            LoanID: loanId ? loanId : null,
            Name: name,
            ContactNo: clientContactNo,
            Location: clientLocation ? clientLocation : null,
            Department: department ? department : null,
            RelatedTo: queryRelatedTo,
            AadharNo: aadharNo ? aadharNo : null,
            PAN_No: panNo ? panNo : null,
            Message: msg ? msg : null,
            CallTime: moment(new Date()).format('LT'),
          },
        };
        const res = await new UserApi().saveGrievance(payload);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={'Grievance'} />
      <View style={styles.container}>
        <View style={styles.viewInput}>
          <Text style={styles.label}>Related With :</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={relatedWith}
              onValueChange={(itemValue, itemIndex) =>
                setRelatedWith(itemValue)
              }
              mode="dropdown"
              style={[
                {color: isDarkMode ? R.colors.PRIMARI_DARK : '#000000'},
                styles.picker,
              ]}
              dropdownIconColor={R.colors.DARKGRAY}>
              {relatedWith === null && (
                <Picker.Item
                  label="-- Select --"
                  value={null}
                  enabled={false}
                />
              )}
              <Picker.Item label="Client" value="Client" />
              <Picker.Item label="Staff" value="Staff" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        </View>
        {relatedWith === 'Client' && (
          <View style={styles.viewInput}>
            <Text style={styles.label}>Loan ID :</Text>
            <TextInput
              value={loanId}
              onChangeText={setLoanId}
              placeholder="Loan ID..."
              keyboardType="decimal-pad"
              placeholderTextColor={R.colors.SLATE_GRAY}
              style={[
                styles.input,
                {
                  marginTop: 10,
                  borderColor: R.colors.SLATE_GRAY,
                  borderRadius: 6,
                  flex: 2,
                },
              ]}
            />
          </View>
        )}
        {relatedWith === 'Client' && (
          <View style={styles.viewInput}>
            <Text style={styles.label}>Client Name :</Text>
            <TextInput
              value={name}
              onChangeText={setname}
              placeholder="Client Name..."
              keyboardType="decimal-pad"
              placeholderTextColor={R.colors.SLATE_GRAY}
              style={[
                styles.input,
                {
                  marginTop: 10,
                  borderColor: R.colors.SLATE_GRAY,
                  borderRadius: 6,
                  flex: 2,
                },
              ]}
            />
          </View>
        )}

        {relatedWith === 'Client' && (
          <View style={styles.viewInput}>
            <Text style={styles.label}>Client Contcat No :</Text>
            <TextInput
              value={clientContactNo}
              onChangeText={setClientContactNo}
              placeholder="Client Contact No..."
              keyboardType="decimal-pad"
              placeholderTextColor={R.colors.SLATE_GRAY}
              style={[
                styles.input,
                {
                  marginTop: 10,
                  borderColor: R.colors.SLATE_GRAY,
                  borderRadius: 6,
                  flex: 2,
                },
              ]}
            />
          </View>
        )}
        {relatedWith === 'Client' && (
          <View style={styles.viewInput}>
            <Text style={styles.label}>Client Location :</Text>
            <TextInput
              value={clientLocation}
              onChangeText={setClientLocation}
              placeholder="Client Location..."
              keyboardType="decimal-pad"
              placeholderTextColor={R.colors.SLATE_GRAY}
              style={[
                styles.input,
                {
                  marginTop: 10,
                  borderColor: R.colors.SLATE_GRAY,
                  borderRadius: 6,
                  flex: 2,
                },
              ]}
            />
          </View>
        )}
        <View style={styles.viewInput}>
          <Text style={styles.label}>Department :</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={department}
              onValueChange={(itemValue, itemIndex) => setDepartment(itemValue)}
              mode="dropdown"
              style={[
                {color: isDarkMode ? R.colors.PRIMARI_DARK : '#000000'},
                styles.picker,
              ]}
              dropdownIconColor={R.colors.DARKGRAY}>
              {department === null && (
                <Picker.Item
                  label="-- Select --"
                  value={null}
                  enabled={false}
                />
              )}
              {departmentData?.length >= 1 &&
                departmentData?.map((item, index) => (
                  <Picker.Item
                    label={item?.department}
                    value={item?.department}
                    key={index}
                  />
                ))}
            </Picker>
          </View>
        </View>
        <View style={styles.viewInput}>
          <Text style={styles.label}>Query Related To :</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={queryRelatedTo}
              onValueChange={(itemValue, itemIndex) =>
                setQueryRelatedTo(itemValue)
              }
              mode="dropdown"
              style={[
                {color: isDarkMode ? R.colors.PRIMARI_DARK : '#000000'},
                styles.picker,
              ]}
              dropdownIconColor={R.colors.DARKGRAY}>
              {queryRelatedTo === null && (
                <Picker.Item
                  label="-- Select --"
                  value={null}
                  enabled={false}
                />
              )}
              {relatedToData?.length >= 1 &&
                relatedToData?.map((item, index) => (
                  <Picker.Item
                    label={item?.QueryRelated}
                    value={item?.QueryRelated}
                    key={index}
                  />
                ))}
            </Picker>
          </View>
        </View>
        {relatedWith === 'Other' && queryRelatedTo?.includes('Bureau') ? (
          <>
            <View style={styles.viewInput}>
              <Text style={styles.label}>Name :</Text>
              <TextInput
                value={loanId}
                onChangeText={setLoanId}
                placeholder="Name..."
                placeholderTextColor={R.colors.SLATE_GRAYx}
                style={[
                  styles.input,
                  {
                    marginTop: 10,
                    borderColor: R.colors.SLATE_GRAY,
                    borderRadius: 6,
                    flex: 2,
                  },
                ]}
              />
            </View>
            <View style={styles.viewInput}>
              <Text style={styles.label}>Contact No :</Text>
              <TextInput
                value={clientContactNo}
                onChangeText={setClientContactNo}
                placeholder="Contact No..."
                keyboardType="decimal-pad"
                placeholderTextColor={R.colors.SLATE_GRAY}
                style={[
                  styles.input,
                  {
                    marginTop: 10,
                    borderColor: R.colors.SLATE_GRAY,
                    borderRadius: 6,
                    flex: 2,
                  },
                ]}
              />
            </View>
            <View style={styles.viewInput}>
              <Text style={styles.label}>Aadhar No :</Text>
              <TextInput
                value={aadharNo}
                onChangeText={setAadharNo}
                placeholder="Aadhar No..."
                keyboardType="decimal-pad"
                placeholderTextColor={R.colors.SLATE_GRAY}
                style={[
                  styles.input,
                  {
                    marginTop: 10,
                    borderColor: R.colors.SLATE_GRAY,
                    borderRadius: 6,
                    flex: 2,
                  },
                ]}
              />
            </View>
            <View style={styles.viewInput}>
              <Text style={styles.label}>PAN No :</Text>
              <TextInput
                value={panNo}
                onChangeText={setPanNo}
                placeholder="PAN No..."
                placeholderTextColor={R.colors.SLATE_GRAY}
                style={[
                  styles.input,
                  {
                    marginTop: 10,
                    borderColor: R.colors.SLATE_GRAY,
                    borderRadius: 6,
                    flex: 2,
                  },
                ]}
              />
            </View>
          </>
        ) : null}

        <TextInput
          value={msg}
          onChangeText={setMsg}
          multiline
          placeholder="Type Your Grievance message..."
          placeholderTextColor={R.colors.SLATE_GRAY}
          style={[
            styles.input,
            {
              height: 100,
              borderWidth: 1,
              marginTop: 10,
              borderColor: R.colors.SLATE_GRAY,
              borderRadius: 6,
              textAlignVertical: 'top',
              lineHeight: 25,
            },
          ]}
        />
      </View>
      <View
        style={{
          borderRadius: 12,
          padding: 10,
        }}>
        <Button
          title="Submit"
          onPress={hanldeSubmit}
          buttonStyle={{
            borderRadius: 12,
          }}
          textStyle={{
            fontWeight: 'bold',
          }}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  pickerContainer: {
    flex: 2,
    borderBottomWidth: 1,
    borderColor: R.colors.SLATE_GRAY,
  },
  viewInput: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: 5,
  },
  label: {
    color: R.colors.PRIMARI_DARK,
    flex: 1,
    fontWeight: '400',
    fontSize: 16,
    textAlignVertical: 'center',
  },
  picker: {
    height: 45,
  },
  input: {
    borderBottomWidth: 1,
    color: R.colors.PRIMARI_DARK,
    fontSize: 15,
    fontWeight: '500',
    borderColor: R.colors.SLATE_GRAY,
  },
});

export default Grievance;
