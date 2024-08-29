import {ScrollView, StyleSheet, Text, View, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import R from '../../resources/R';
import Button from '../../library/commons/Button';
import { useNavigation } from '@react-navigation/native';

const MyApplication = () => {
    const navigation = useNavigation()
  const [selfIncome, setSelfInc] = useState(25000);
  const [spouseIncome, setSpouseInc] = useState(30000);
  const [otherIncome, setOtherInc] = useState(0);
  const [totalIncome, setTotalInc] = useState(null);
  const [focused, setFocused] = useState(null);

  //expenses state
  const [businessExpenses, setBusinessExpenses] = useState(10000);
  const [houseExpenses, setHouseExpenses] = useState(5000);
  const [emi, setEmi] = useState(3000);
  const [otherExp, setOtherExp] = useState(0);
  const [totalExp, setTotalExp] = useState(null);
  useEffect(() => {
    if (selfIncome || otherIncome || spouseIncome) {
      setTotalInc(
        parseInt(selfIncome) + parseInt(otherIncome) + parseInt(spouseIncome),
      );
    }
  }, [selfIncome, otherIncome, spouseIncome]);

  useEffect(() => {
    if (businessExpenses || houseExpenses || emi || otherExp) {
      setTotalExp(
        parseInt(businessExpenses) + parseInt(houseExpenses) + parseInt(emi),
        parseInt(otherExp),
      );
    }
  }, [businessExpenses, houseExpenses, emi, otherExp]);

  console.log(
    '  if(selfIncome,otherIncome,spouseIncome){}',
    selfIncome,
    otherIncome,
    spouseIncome,
  );
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
            Income and Expenditure Details
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
            <Text style={styles.label}>other Expenses*</Text>
            <TextInput
              value={otherExp?.toString()}
              onChangeText={text => setOtherExp(text)}
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
              }}>
              {totalIncome - totalExp}
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
            onPress={() =>
              navigation.navigate(ScreensNameEnum.KYC_CUSTOMER_SCREEN)
            }
          />
        </ScrollView>
      </View>
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
