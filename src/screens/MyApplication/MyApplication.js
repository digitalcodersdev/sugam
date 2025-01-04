import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import R from '../../resources/R';
import Button from '../../library/commons/Button';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import UserApi from '../../datalib/services/user.api';
import moment from 'moment';
import Loader from '../../library/commons/Loader';

const MyApplication = props => {
  const navigation = useNavigation();
  const {enrollmentId, loanPurpose} = props?.route?.params?.data;
  const {
    amountApplied,
    category,
    durationOfLoan,
    frequency,
    insurance,
    loanPurpose: purpose,
    product,
  } = loanPurpose;
  const [selfIncome, setSelfInc] = useState('');
  const [spouseIncome, setSpouseInc] = useState('');
  const [otherIncome, setOtherInc] = useState('');
  const [totalIncome, setTotalInc] = useState('');
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);

  //expenses state
  const [businessExpenses, setBusinessExpenses] = useState('');
  const [houseExpenses, setHouseExpenses] = useState('');
  const [emi, setEmi] = useState('');
  const [otherExp, setOtherExp] = useState('');
  const [totalExp, setTotalExp] = useState('');
  const [disposableIncome, setDisposableIncome] = useState('');
  useEffect(() => {
    if (selfIncome || otherIncome || spouseIncome) {
      setTotalInc(
        parseInt(selfIncome) + parseInt(otherIncome) + parseInt(spouseIncome),
      );
    }
  }, [selfIncome, otherIncome, spouseIncome]);

  useEffect(() => {
    function handlleDisposable() {
      if (parseInt(totalIncome) < parseInt(totalExp)) {
        Alert.alert('Expenses can not be greater than Income');
        setDisposableIncome('');
        return;
      }
      setDisposableIncome(parseInt(totalIncome) - parseInt(totalExp));
    }

    if (totalIncome && totalExp) {
      handlleDisposable();
    }
  }, [totalIncome, totalExp]);

  useEffect(() => {
    if (businessExpenses || houseExpenses || emi || otherExp) {
      setTotalExp(
        parseInt(businessExpenses) +
          parseInt(houseExpenses) +
          parseInt(emi) +
          parseInt(otherExp),
      );
    }
  }, [businessExpenses, houseExpenses, emi, otherExp]);

  const validate = () => {
    let valid = true;
    let error = {};
    if (!selfIncome.replace(/\s+/g, '').length) {
      Toast.show('Please Enter Self Income', Toast.SHORT, Toast.TOP);
      valid = false;
      //   fatherNameRef.current.focus();
      return valid;
    }
    if (!spouseIncome.replace(/\s+/g, '').length) {
      Toast.show(
        'Please Enter Spouse/Father/Son Income',
        Toast.SHORT,
        Toast.TOP,
      );
      valid = false;
      //   motherNameRef.current.focus();
      return valid;
    }

    if (!otherIncome.replace(/\s+/g, '').length) {
      Toast.show('Please Enter Other Income', Toast.SHORT, Toast.TOP);
      valid = false;
      //   occupationRef.current.focus();
      return valid;
    }
    if (!totalIncome >= 1) {
      Toast.show('Please Enter Total Income', Toast.SHORT, Toast.TOP);
      valid = false;
      //   addressRef.current.focus();
      return valid;
    }
    if (!businessExpenses.replace(/\s+/g, '').length) {
      Toast.show('Please Enter Business Expenses', Toast.SHORT, Toast.TOP);
      valid = false;
      //   addressRef.current.focus();
      return valid;
    }
    if (!houseExpenses.replace(/\s+/g, '').length) {
      Toast.show('Please Enter Household Expenses', Toast.SHORT, Toast.TOP);
      valid = false;
      //   addressRef.current.focus();
      return valid;
    }
    if (!emi >= 1) {
      Toast.show('Please Enter EMI Expenses', Toast.SHORT, Toast.TOP);
      valid = false;
      //   addressRef.current.focus();
      return valid;
    }
    if (!otherExp >= 1) {
      Toast.show('Please Enter Other Expenses', Toast.SHORT, Toast.TOP);
      valid = false;
      //   addressRef.current.focus();
      return valid;
    }
    if (!totalExp >= 1) {
      Toast.show('Please Enter Total Expenses', Toast.SHORT, Toast.TOP);
      valid = false;
      //   addressRef.current.focus();
      return valid;
    }
    if (!disposableIncome >= 1) {
      Toast.show('Disposable Income is required', Toast.SHORT, Toast.TOP);
      valid = false;
      //   addressRef.current.focus();
      return valid;
    }
    return valid;
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      if (validate()) {
        const payload = {
          loanPurpose: {
            enrollmentid: enrollmentId,
            businesstype: null,
            businesstypespouse: null,
            businessexp: null,
            purpose: purpose,
            disbdate: moment(new Date()).format('YYYY-MM-DD'),
            loanreq: 4,
            salincome: selfIncome,
            spouseincome: spouseIncome,
            otherincome: otherIncome,
            totalincome: totalIncome,
            homeexp: houseExpenses,
            loanexp: emi,
            saving: disposableIncome,
            otherexp: otherExp,
            totalexp: totalExp,
            financeamt: amountApplied,
            repayment: product,
            period: durationOfLoan,
            riskfund: 0,
            firstdateofinst: null,
            lastdateofinst: null,
            approvaldetails: null,
            status: 1,
            preclose: 0,
            purposedetails: 'Working Capital',
            renewal: null,
            cycle: 1,
            gross_net: 2,
            renewalcharge: 0,
            defaulttype: null,
            reason: null,
            willfulenterby: null,
            ins_id: 0,
            loandonedate: moment(new Date()).format('YYYY-MM-DD'),
            iskyc: 0,
            grtdoneby: null,
            deathremark: null,
            others: 0,
            refinance_id: 0,
            refinancedate: moment(new Date()).format('YYYY-MM-DD'),
            loan_type: 2,
          },
        };
        const res = await new UserApi().insertLoanPurpose(payload);
        if (res) {
          navigation.navigate(ScreensNameEnum.KYC_CUSTOMER_SCREEN, {
            data: {...props.route?.params?.data, customerid: res},
          });
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // console.log('props', props?.route?.params?.data);
  return (
    <ScreenWrapper header={true} backDisabled>
      <Text
        style={[
          styles.tagline,
          {
            backgroundColor: R.colors.SLATE_GRAY,
            color: R.colors.PRIMARY_LIGHT,
          },
        ]}>
        {ScreensNameEnum.MY_APPLICATION_SCREEN}
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
           Monthly Income and Expenditure Details
          </Text>
          <View
            style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
            <Text
              style={{
                flex: 1,
                fontWeight: 'bold',
                color: R.colors.primary,
                fontSize: R.fontSize.L,
              }}>
              A. Income Details
            </Text>
            <Text
              style={{
                flex: 1,
                fontWeight: 'bold',
                color: R.colors.primary,
                textAlign: 'center',
                fontSize: R.fontSize.L,
              }}>
              Amt. in Rs.
            </Text>
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Self Income*</Text>
            <TextInput
              value={selfIncome?.toString()}
              onChangeText={text => setSelfInc(text)}
              keyboardType="number-pad"
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'selfIncome'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'selfIncome' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('selfIncome')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Spouse/Father/Son Income*</Text>
            <TextInput
              value={spouseIncome?.toString()}
              onChangeText={text => setSpouseInc(text)}
              keyboardType="number-pad"
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'spouseIncome'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'spouseIncome' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('spouseIncome')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Other Income*</Text>
            <TextInput
              value={otherIncome?.toString()}
              onChangeText={text => setOtherInc(text)}
              keyboardType="number-pad"
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'otherIncome'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'otherIncome' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('otherIncome')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Total Income*</Text>
            <TextInput
              value={totalIncome?.toString()}
              onChangeText={text => setSelfInc(text)}
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'totalIncome'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'totalIncome' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('totalIncome')}
              onBlur={() => setFocused(null)}
              editable={false}
            />
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
            <Text
              style={{
                flex: 1,
                fontWeight: 'bold',
                color: R.colors.primary,
                fontSize: R.fontSize.L,
              }}>
              B. Expenses Details
            </Text>
            <Text
              style={{
                flex: 1,
                fontWeight: 'bold',
                color: R.colors.primary,
                textAlign: 'center',
                fontSize: R.fontSize.L,
              }}></Text>
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Business Expenses*</Text>
            <TextInput
              value={businessExpenses?.toString()}
              onChangeText={text => setBusinessExpenses(text)}
              keyboardType="number-pad"
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'businessExpenses'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'businessExpenses' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('businessExpenses')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Household Expenses*</Text>
            <TextInput
              value={houseExpenses?.toString()}
              onChangeText={text => setHouseExpenses(text)}
              keyboardType="number-pad"
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'houseExpenses'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'houseExpenses' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('houseExpenses')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>EMI Payment*</Text>
            <TextInput
              value={emi?.toString()}
              onChangeText={text => setEmi(text)}
              keyboardType="number-pad"
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'emi'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'emi' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('emi')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Other Expenses*</Text>
            <TextInput
              value={otherExp?.toString()}
              onChangeText={text => setOtherExp(text)}
              keyboardType="number-pad"
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'otherExp'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'otherExp' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('otherExp')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View style={styles.viewInput}>
            <Text style={styles.label}>Total Expenses*</Text>
            <TextInput
              value={totalExp?.toString()}
              onChangeText={text => setTotalExp(text)}
              style={[
                styles.input,
                {
                  borderColor:
                    focused === 'totalExp'
                      ? R.colors.primary
                      : R.colors.PRIMARI_DARK,
                  borderBottomWidth: focused === 'totalExp' ? 1.5 : 1,
                },
              ]}
              onFocus={() => setFocused('totalExp')}
              onBlur={() => setFocused(null)}
            />
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
            <Text
              style={{
                flex: 1,
                fontWeight: 'bold',
                color: R.colors.primary,
                fontSize: R.fontSize.L,
              }}>
              Disposable Income (A-B)
            </Text>
            <Text
              style={{
                flex: 1.7,
                fontWeight: 'bold',
                color: R.colors.PRIMARI_DARK,
                textAlign: 'center',
                fontSize: R.fontSize.L,
                borderBottomWidth: 1,
                textAlign: 'left',
              }}>
              {disposableIncome}
            </Text>
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

export default MyApplication;

const styles = StyleSheet.create({
  tagline: {
    textAlign: 'center',
    fontSize: R.fontSize.XL,
    fontWeight: '600',
    padding: 10,
    textDecorationLine: 'underline',
    color: R.colors.primary,
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

  label: {
    color: R.colors.PRIMARI_DARK,
    flex: 1.5,
    alignItems: 'center',
    fontWeight: '400',
    fontSize: 16,
    textAlignVertical: 'bottom',
    height: '100%',
    flexWrap: 'wrap',
  },
  viewInput: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'flex-end',
    marginVertical: 5,
  },
});
