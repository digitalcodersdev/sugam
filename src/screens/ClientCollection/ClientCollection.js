import {StyleSheet, Text, View, FlatList, Pressable} from 'react-native';
import React, {useRef, useState} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextInput} from 'react-native-paper';
import Button from '../../library/commons/Button';

const ClientCollection = ({route}) => {
  const {dt} = route?.params;
  const [selectedValue, setSelectedValue] = useState(null);
  const [amount, setAmount] = useState(null);
  const [focused, setFocused] = useState(null);
  const amountRef = useRef();
  const radioButtonsData = [
    {label: 'Full', value: 'full'},
    {label: 'Partial', value: 'partial'},
    {label: 'Interest', value: 'interest'},
    {label: 'Adv.', value: 'adv'},
    {label: 'Pre-Clo.', value: 'preClo'},
  ];
  const radioButtonsAmount = [
    {label: 'Cash', value: 'Cash'},
    {label: 'AEPS(AADHAR)', value: 'AEPS(AADHAR)'},
    {label: 'QR', value: 'QR'},
  ];

  const RadioButton = ({label, value, selectedValue, onPress}) => (
    <Pressable style={styles.radioContainer} onPress={() => onPress(value)}>
      <Icon
        name={selectedValue === value ? 'radiobox-marked' : 'radiobox-blank'}
        size={24}
        color={selectedValue === value ? '#2196f3' : '#757575'}
      />
      <Text style={styles.radioLabel}>{label}</Text>
    </Pressable>
  );
  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={'Collection'} />
      <View style={styles.top}>
        <Text style={[styles.value]}>Branch Name : {dt?.name}</Text>
        <Text style={[styles.value]}>Customer ID : {dt?.laonId}</Text>
        <Text style={[styles.value]}>EMI No : {dt?.emi}</Text>
        <Text style={[styles.value]}>Contact No : {dt?.phone}</Text>
        {/* <Text style={[styles.value]}>Death Date : {dt?.laonId}</Text> */}
        <Text style={[styles.value]}> {dt?.dueBalance}</Text>
      </View>
      <View style={styles.container}>
        <FlatList
          data={radioButtonsData}
          keyExtractor={item => item?.value}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => (
            <RadioButton
              key={item.value}
              label={item.label}
              value={item.value}
              selectedValue={selectedValue}
              onPress={setSelectedValue}
            />
          )}
        />
        {/* {radioButtonsData?.map(button => (
          <RadioButton
            key={button.value}
            label={button.label}
            value={button.value}
            selectedValue={selectedValue}
            onPress={setSelectedValue}
          />
        ))} */}

        <TextInput
          label="Amount*"
          value={amount}
          onChangeText={setAmount}
          ref={amountRef}
          mode="flat"
          style={[
            styles.input,
            {
              borderBottomWidth: focused === 'amount' ? 1.5 : 1,
            },
          ]}
          activeUnderlineColor={
            focused === 'amount' ? R.colors.primary : R.colors.PRIMARI_DARK
          }
          onFocus={() => setFocused('amount')}
          onBlur={() => setFocused(null)}
        />
        {selectedValue === 'partial' ||
          (selectedValue === 'interest' && (
            <>
              <Text
                style={[
                  styles.value,
                  {
                    color: R.colors.PRIMARI_DARK,
                    textAlign: 'left',
                    width: '98%',
                    margin: 5,
                  },
                ]}>
                Choose Payment Mode :
              </Text>
              <FlatList
                data={radioButtonsAmount}
                keyExtractor={item => item?.value}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({item, index}) => (
                  <RadioButton
                    key={item.value}
                    label={item.label}
                    value={item.value}
                    selectedValue={selectedValue}
                    onPress={setSelectedValue}
                  />
                )}
              />
            </>
          ))}
        <Button
          title={selectedValue === 'full' ? 'Confirmed' : 'Request'}
          buttonStyle={styles.btn}
          backgroundColor={
            selectedValue === 'full' ? R.colors.GREEN : R.colors.primary
          }
          disabled={amount == null ? true : false}
        />
      </View>
    </ScreenWrapper>
  );
};

export default ClientCollection;

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  top: {padding: 10, backgroundColor: R.colors.SLATE_GRAY, width: '100%'},
  value: {
    color: R.colors.PRIMARY_LIGHT,
    fontWeight: '500',
    fontSize: R.fontSize.L,
    textAlign: 'left',
    flexWrap: 'wrap',
    width: '80%',
    alignSelf: 'center',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    marginHorizontal: 5,
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: R.colors.PRIMARI_DARK,
  },
  input: {
    borderBottomWidth: 1,
    color: R.colors.PRIMARI_DARK,
    textAlignVertical: 'bottom',
    fontSize: 16,
    fontWeight: '800',
    backgroundColor: R.colors.WHITE,
    marginBottom: 5,
  },
  btn: {
    borderRadius: 4,
    marginVertical: 10,
  },
});
