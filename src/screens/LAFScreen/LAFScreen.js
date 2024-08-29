import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import R from '../../resources/R';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import {useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import UserApi from '../../datalib/services/user.api';
import Button from '../../library/commons/Button';

const LAFScreen = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [phone, setPhone] = useState('8265805176');
  const [product, setProduct] = useState(null);
  const [amountApplied, setAmountApplied] = useState(null);
  const [durationOfLoan, setDurationOfLoan] = useState('26 Weeks');
  const [frequency, setFrequency] = useState(null);
  const [loanPurpose, setLoanPurpose] = useState(null);
  const [insurance, setInsurance] = useState(null);

  useEffect(() => {
    fetchLoanType();
  }, []);

  const fetchLoanType = async () => {
    try {
      const res = await new UserApi().fetchLoanType();
      console.log('res', res);
    } catch (error) {
      console.log(error);
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
          <View style={styles.phoenNumberView}>
            <Text style={styles.labels}>Mobile No.</Text>
            <Text
              style={[
                styles.labels,
                {
                  flex: 2.5,
                  textAlign: 'left',
                  paddingLeft: 40,
                },
              ]}>
              {phone}
            </Text>
          </View>
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
                padding:5
              },
            ]}>
            Purpose and Type of Loan Facility
          </Text>
          <View style={styles.cardView}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label(isDarkMode)}>Product</Text>
              <Picker
                selectedValue={product}
                style={styles.input(isDarkMode)}
                dropdownIconColor={R.colors.primary}
                onValueChange={itemValue => setProduct(itemValue)}>
                {product === null && (
                  <Picker.Item
                    label="-- Select Product --"
                    value={null}
                    enabled={false}
                  />
                )}
                <Picker.Item label="IGL" value="IGL" />
                <Picker.Item label="BL" value="BL" />
              </Picker>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label(isDarkMode)}>Amount Applied</Text>
              <Picker
                selectedValue={amountApplied}
                style={styles.input(isDarkMode)}
                dropdownIconColor={R.colors.primary}
                onValueChange={itemValue => setAmountApplied(itemValue)}>
                {amountApplied === null && (
                  <Picker.Item
                    label="-- Select Amount --"
                    value={null}
                    enabled={false}
                  />
                )}
                <Picker.Item label="5,000" value="5000" />
                <Picker.Item label="10,000" value="10000" />
                <Picker.Item label="15,000" value="15000" />
                <Picker.Item label="20,000" value="20000" />
                <Picker.Item label="25,000" value="25000" />
                <Picker.Item label="30,000" value="30000" />
                <Picker.Item label="35,000" value="35000" />
                <Picker.Item label="40,000" value="40000" />
                <Picker.Item label="45,000" value="45000" />
                <Picker.Item label="50,000" value="50000" />
              </Picker>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label(isDarkMode)}>Tenure</Text>
              <TextInput
                style={styles.input(isDarkMode, true)}
                keyboardType="numeric"
                value={durationOfLoan}
                onChangeText={setDurationOfLoan}
                editable={false}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label(isDarkMode)}>Repay. Frequency</Text>
              <Picker
                selectedValue={frequency}
                style={styles.input(isDarkMode)}
                dropdownIconColor={R.colors.primary}
                onValueChange={itemValue => setFrequency(itemValue)}>
                {frequency === null && (
                  <Picker.Item
                    label="-- Select Frequency --"
                    value={null}
                    enabled={false}
                  />
                )}
                <Picker.Item label="5,000" value="5000" />
                <Picker.Item label="10,000" value="10000" />
                <Picker.Item label="15,000" value="15000" />
                <Picker.Item label="20,000" value="20000" />
                <Picker.Item label="25,000" value="25000" />
                <Picker.Item label="30,000" value="30000" />
                <Picker.Item label="35,000" value="35000" />
                <Picker.Item label="40,000" value="40000" />
                <Picker.Item label="45,000" value="45000" />
                <Picker.Item label="50,000" value="50000" />
              </Picker>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label(isDarkMode)}>Loan Category</Text>
              <Picker
                selectedValue={loanPurpose}
                style={styles.input(isDarkMode)}
                dropdownIconColor={R.colors.primary}
                onValueChange={itemValue => setLoanPurpose(itemValue)}>
                {loanPurpose === null && (
                  <Picker.Item
                    label="-- Select Loan Category --"
                    value={null}
                    enabled={false}
                  />
                )}
                <Picker.Item label="5,000" value="5000" />
                <Picker.Item label="10,000" value="10000" />
                <Picker.Item label="15,000" value="15000" />
                <Picker.Item label="20,000" value="20000" />
                <Picker.Item label="25,000" value="25000" />
                <Picker.Item label="30,000" value="30000" />
                <Picker.Item label="35,000" value="35000" />
                <Picker.Item label="40,000" value="40000" />
                <Picker.Item label="45,000" value="45000" />
                <Picker.Item label="50,000" value="50000" />
              </Picker>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label(isDarkMode)}>Loan Purpose</Text>
              <Picker
                selectedValue={loanPurpose}
                style={styles.input(isDarkMode)}
                dropdownIconColor={R.colors.primary}
                onValueChange={itemValue => setLoanPurpose(itemValue)}>
                {loanPurpose === null && (
                  <Picker.Item
                    label="-- Select Purpose --"
                    value={null}
                    enabled={false}
                  />
                )}
                <Picker.Item label="5,000" value="5000" />
                <Picker.Item label="10,000" value="10000" />
                <Picker.Item label="15,000" value="15000" />
                <Picker.Item label="20,000" value="20000" />
                <Picker.Item label="25,000" value="25000" />
                <Picker.Item label="30,000" value="30000" />
                <Picker.Item label="35,000" value="35000" />
                <Picker.Item label="40,000" value="40000" />
                <Picker.Item label="45,000" value="45000" />
                <Picker.Item label="50,000" value="50000" />
              </Picker>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label(isDarkMode)}>Insurance</Text>
              <Picker
                selectedValue={insurance}
                style={styles.input(isDarkMode)}
                dropdownIconColor={R.colors.primary}
                onValueChange={itemValue => setInsurance(itemValue)}>
                {insurance === null && (
                  <Picker.Item
                    label="-- Select Insurance --"
                    value={null}
                    enabled={false}
                  />
                )}
                <Picker.Item label="Yes" value="Yes" />
                <Picker.Item label="No" value="No" />
              </Picker>
            </View>
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
            onPress={()=>navigation.navigate(ScreensNameEnum.LAF_GROUP_SCREEN1)}
          />
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default LAFScreen;

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
  label: isDarkMode => ({
    color: isDarkMode ? R.colors.PRIMARI_DARK : '#000',
    marginBottom: 5,
    flex: 1,
  }),
  input: (isDarkMode, isDisabled = false) => ({
    borderColor: isDarkMode ? R.colors.LIGHTGRAY : '#000',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    color: isDarkMode ? R.colors.PRIMARI_DARK : '#000',
    backgroundColor: isDisabled
      ? R.colors.LIGHTGRAY
      : isDarkMode
      ? R.colors.PRIMARY_LIGHT
      : '#fff',
    flex: 1.5,
  }),
});
