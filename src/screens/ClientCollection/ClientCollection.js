import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Alert,
  Linking,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextInput} from 'react-native-paper';
import Button from '../../library/commons/Button';
import UserApi from '../../datalib/services/user.api';
import {useDispatch, useSelector} from 'react-redux';
// import {
//   fetchCurrentDayCollectionByBranchId,
//   fetchCurrentDayCollectionByCenterId,
//   updateCollectionAmt,
// } from '../../store/actions/userActions';
import {currentUserSelector} from '../../store/slices/user/user.slice';
import {useNavigation} from '@react-navigation/native';
import ConfirmationModal from '../../library/modals/ConfirmationModal';
import DynamicQRCode from '../../components/GenerateQr';

const ClientCollection = ({route}) => {
  const dispatch = useDispatch();
  const user = useSelector(currentUserSelector);
  const navigation = useNavigation();
  const [isVis, setVis] = useState(false);
  const {
    Borrower_Name,
    Branch_Name,
    TotalEMI,
    mblenumber,
    Center_Name,
    Co_BorrowerName,
    TodayEMI,
    customerid,
    remainingCollection,
    centerId,
    Collection_Status,
    preclose_status,
  } = route?.params?.dt;
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState(null);
  const [amount, setAmount] = useState(null);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preAmt, setPreAmt] = useState('');
  console.log('preclose_status', route?.params?.dt);
  const amountRef = useRef();
  const radioButtonsData = [
    {label: 'Full', value: 'full'},
    {label: 'Partial', value: 'partial'},
    // {label: 'Interest', value: 'interest'},
    {label: 'Advance', value: 'advance'},
    {label: 'Pre-Closure', value: 'preClo'},
    {label: 'Full-Settlement.', value: 'full_settl'},
  ];
  const radioButtonsAmount = [
    {label: 'QR', value: 'QR'},
    {label: 'Cash', value: 'Cash'},
    {label: 'AEPS(AADHAR)', value: 'AEPS(AADHAR)'},
    {label: 'Other Online Transafer', value: 'other'}, //Transaction ID and date and payment made to
  ];
  console.log(amount);
  useEffect(() => {
    if (amount > preAmt) {
      Alert.alert('Amount cannot be greater than outstanding amount...');
    }
    if (preAmt == '') {
      fetchPreClosureAmt();
    }
  }, [amount, TodayEMI]);

  const fetchPreClosureAmt = async () => {
    try {
      setLoading(true);
      const res = await new UserApi().fetchPreClosAmt({customerid: customerid});
      if (res) {
        setPreAmt(res[0]?.Foreclose_Amount);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSetAmount = val => {
    setSelectedValue(val);
    if (val == 'full') {
      setAmount(parseInt(TodayEMI));
    } else if (val == 'partial') {
      setAmount(null);
    } else if (val === 'preClo') {
      setAmount(preAmt);
    }
  };

  const handleOnPress = async () => {
    // try {
    //   setLoading(true);
    //   const response = await dispatch(
    //     updateCollectionAmt({
    //       amount,
    //       customerid: customerid,
    //       type: selectedValue,
    //       BranchID: user?.BranchId,
    //       CenterID: centerId,
    //     }),
    //   );
    //   if (response?.type.includes('fulfilled')) {
    //     await dispatch(
    //       fetchCurrentDayCollectionByCenterId({
    //         centerId,
    //         branchId: user?.BranchId,
    //       }),
    //     );
    //     await dispatch(
    //       fetchCurrentDayCollectionByBranchId({branchId: user?.BranchId}),
    //     );
    //     if (selectedValue == 'full') {
    //       Alert.alert('EMI Collected Successfully');
    //     } else if (selectedValue == 'partial') {
    //       Alert.alert('Amount Collected Successfully');
    //     } else {
    //       Alert.alert('Request Sent Successfully');
    //     }
    //     navigation.goBack();
    //   }
    //   setLoading(false);
    // } catch (error) {
    //   console.log(error);
    //   setLoading(false);
    // }
  };

  const handleConfirm = data => {
    if (data == 'confirm') {
      setVis(false);
      setLoading(true);
      handleOnPress();
    } else {
      setVis(false);
    }
  };

  const RadioButton = ({label, value, selectedValue, onPress}) => (
    <Pressable style={styles.radioContainer} onPress={() => onPress(value)}>
      <Icon
        name={selectedValue === value ? 'radiobox-marked' : 'radiobox-blank'}
        size={24}
        color={selectedValue === value ? R.colors.PRIMARY : R.colors.LIGHTGRAY}
      />
      <Text style={styles.radioLabel}>{label}</Text>
    </Pressable>
  );

  const handlePhoneCall = () => {
    Linking.openURL(`tel:${mblenumber}`);
  };

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={'Collection'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}} // Make sure it takes the full height
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.top}>
            {/* <View style={styles.card}>
              <Icon name="lan-pending" size={24} color={R.colors.DARK_ORANGE} />
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>EMI Status</Text>
                <Text
                  style={[
                    styles.cardValue,
                    {
                      color:
                        Collection_Status != 1 ? R.colors.RED : R.colors.GREEN,
                    },
                  ]}>
                  {Collection_Status != 1 ? 'Pending' : 'Paid'}
                </Text>
              </View>
            </View> */}
            <View style={styles.card}>
              <Icon name="credit-card" size={24} color={R.colors.DARK_BLUE} />
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Customer ID</Text>
                <Text style={styles.cardValue}>{customerid}</Text>
              </View>
            </View>
            <View style={styles.card}>
              <Icon
                name="account-circle-outline"
                size={24}
                color={R.colors.DARK_BLUE}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Customer Name</Text>
                <Text style={styles.cardValue}>{Borrower_Name}</Text>
              </View>
            </View>
            {/* <View style={styles.card}>
              <Icon name="home-city" size={24} color={R.colors.DARK_BLUE} />
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Branch Name</Text>
                <Text style={styles.cardValue}>{Branch_Name}</Text>
              </View>
            </View> */}

            {/* <View style={styles.card}>
              <Icon
                name="calendar-month"
                size={24}
                color={R.colors.DARK_BLUE}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>EMI No</Text>
                <Text style={styles.cardValue}>{TotalEMI}</Text>
              </View>
            </View> */}
            {/* <Pressable style={styles.card} onPress={handlePhoneCall}>
              <Icon name="phone" size={24} color={R.colors.DARK_BLUE} />
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Contact No</Text>
                <Text style={[styles.cardValue, styles.contactNumber]}>
                  {mblenumber}
                </Text>
              </View>
            </Pressable> */}
            <View style={styles.card}>
              <Icon name="currency-inr" size={24} color={R.colors.DARK_BLUE} />
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Amount</Text>
                <Text style={styles.cardValue}>{TodayEMI}</Text>
              </View>
            </View>
            <View style={[styles.card, {}]}>
              <View style={styles.container}>
                <FlatList
                  data={radioButtonsData}
                  keyExtractor={item => item.value}
                  // horizontal
                  numColumns={3}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item}) => (
                    <RadioButton
                      label={item.label}
                      value={item.value}
                      selectedValue={selectedValue}
                      onPress={handleSetAmount}
                    />
                  )}
                />
                {selectedValue !== 'full' && selectedValue !== 'preClo' ? (
                  <TextInput
                    label="Amount*"
                    value={amount?.toString()}
                    onChangeText={setAmount}
                    ref={amountRef}
                    keyboardType="decimal-pad"
                    mode="flat"
                    style={[
                      styles.input,
                      {
                        borderBottomWidth: focused === 'amount' ? 2 : 1,
                        borderColor:
                          focused === 'amount'
                            ? R.colors.PRIMARY
                            : R.colors.GREY,
                      },
                    ]}
                    activeUnderlineColor={R.colors.PRIMARY}
                    onFocus={() => setFocused('amount')}
                    onBlur={() => setFocused(null)}
                  />
                ) : (
                  <Text style={styles.amountText}>₹ {amount?.toString()}</Text>
                )}
                <FlatList
                  data={radioButtonsAmount}
                  keyExtractor={item => item.value}
                  // horizontal
                  numColumns={3}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item}) => (
                    <RadioButton
                      label={item.label}
                      value={item.value}
                      selectedValue={selectedPaymentMode}
                      onPress={setSelectedPaymentMode}
                    />
                  )}
                />

                {amount && selectedPaymentMode == 'QR' && (
                  <DynamicQRCode amount={amount} />
                )}

                {Collection_Status != 1 &&
                  preclose_status == null &&
                  selectedPaymentMode !== 'QR' && (
                    <Button
                      title={
                        selectedValue === 'full'
                          ? 'Confirm'
                          : selectedValue === 'partial'
                          ? 'Confirm'
                          : 'Request'
                      }
                      buttonStyle={styles.btn}
                      backgroundColor={
                        selectedValue === 'full'
                          ? R.colors.GREEN
                          : R.colors.PRIMARY
                      }
                      textStyle={styles.btnText}
                      disabled={!amount}
                      onPress={() => setVis(true)}
                    />
                  )}
              </View>
            </View>
          </View>

          <ConfirmationModal
            isVisible={isVis}
            onModalClose={setVis}
            onConfirm={handleConfirm}
            confirmationText="Are you sure you want to update EMI?"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default ClientCollection;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
  },
  top: {
    padding: 15,
    backgroundColor: R.colors.LIGHT_BLUE,
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: R.colors.WHITE,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 12,
    padding: 15,
  },
  cardContent: {
    marginLeft: 12,
    flex: 1,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: R.colors.DARK_BLUE,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: R.colors.DARK_BLUE,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    marginHorizontal: 8,
    paddingLeft: 8,
    // backgroundColor: R.colors.LIGHT_YELLOW,
    borderRadius: 8,
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: R.colors.DARK_BLUE,
  },
  input: {
    height: 50,
    backgroundColor: R.colors.WHITE,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: R.colors.GREY,
  },
  amountText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
    color: R.colors.DARK_BLUE,
    borderBottomWidth: 1,
    borderColor: R.colors.GREY,
  },
  btn: {
    marginVertical: 10,
    borderRadius: 8,
  },
  btnText: {
    fontWeight: '700',
    color: R.colors.WHITE,
  },
  contactNumber: {
    color: R.colors.BLUE,
  },
});

// import {StyleSheet, Text, View, FlatList, Pressable} from 'react-native';
// import React, {useRef, useState} from 'react';
// import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
// import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
// import R from '../../resources/R';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import {TextInput} from 'react-native-paper';
// import Button from '../../library/commons/Button';

// const ClientCollection = ({route}) => {
//   const {dt} = route?.params;
//   const [selectedValue, setSelectedValue] = useState(null);
//   const [amount, setAmount] = useState(null);
//   const [focused, setFocused] = useState(null);
//   const amountRef = useRef();
//   const radioButtonsData = [
//     {label: 'Full', value: 'full'},
//     {label: 'Partial', value: 'partial'},
//     {label: 'Interest', value: 'interest'},
//     {label: 'Adv.', value: 'adv'},
//     {label: 'Pre-Clo.', value: 'preClo'},
//   ];
//   const radioButtonsAmount = [
//     {label: 'Cash', value: 'Cash'},
//     {label: 'AEPS(AADHAR)', value: 'AEPS(AADHAR)'},
//     {label: 'QR', value: 'QR'},
//   ];

//   const RadioButton = ({label, value, selectedValue, onPress}) => (
//     <Pressable style={styles.radioContainer} onPress={() => onPress(value)}>
//       <Icon
//         name={selectedValue === value ? 'radiobox-marked' : 'radiobox-blank'}
//         size={24}
//         color={selectedValue === value ? '#2196f3' : '#757575'}
//       />
//       <Text style={styles.radioLabel}>{label}</Text>
//     </Pressable>
//   );
//   return (
//     <ScreenWrapper header={false}>
//       <ChildScreensHeader screenName={'Collection'} />
//       <View style={styles.top}>
//         <Text style={[styles.value]}>Branch Name : {dt?.name}</Text>
//         <Text style={[styles.value]}>Customer ID : {dt?.laonId}</Text>
//         <Text style={[styles.value]}>EMI No : {dt?.emi}</Text>
//         <Text style={[styles.value]}>Contact No : {dt?.phone}</Text>
//         {/* <Text style={[styles.value]}>Death Date : {dt?.laonId}</Text> */}
//         <Text style={[styles.value]}> {dt?.dueBalance}</Text>
//       </View>
//       <View style={styles.container}>
//         <FlatList
//           data={radioButtonsData}
//           keyExtractor={item => item?.value}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           renderItem={({item, index}) => (
//             <RadioButton
//               key={item.value}
//               label={item.label}
//               value={item.value}
//               selectedValue={selectedValue}
//               onPress={setSelectedValue}
//             />
//           )}
//         />
//         {/* {radioButtonsData?.map(button => (
//           <RadioButton
//             key={button.value}
//             label={button.label}
//             value={button.value}
//             selectedValue={selectedValue}
//             onPress={setSelectedValue}
//           />
//         ))} */}

//         <TextInput
//           label="Amount*"
//           value={amount}
//           onChangeText={setAmount}
//           ref={amountRef}
//           mode="flat"
//           style={[
//             styles.input,
//             {
//               borderBottomWidth: focused === 'amount' ? 1.5 : 1,
//             },
//           ]}
//           activeUnderlineColor={
//             focused === 'amount' ? R.colors.primary : R.colors.PRIMARI_DARK
//           }
//           onFocus={() => setFocused('amount')}
//           onBlur={() => setFocused(null)}
//         />
//         {selectedValue === 'partial' ||
//           (selectedValue === 'interest' && (
//             <>
//               <Text
//                 style={[
//                   styles.value,
//                   {
//                     color: R.colors.PRIMARI_DARK,
//                     textAlign: 'left',
//                     width: '98%',
//                     margin: 5,
//                   },
//                 ]}>
//                 Choose Payment Mode :
//               </Text>
//               <FlatList
//                 data={radioButtonsAmount}
//                 keyExtractor={item => item?.value}
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 renderItem={({item, index}) => (
//                   <RadioButton
//                     key={item.value}
//                     label={item.label}
//                     value={item.value}
//                     selectedValue={selectedValue}
//                     onPress={setSelectedValue}
//                   />
//                 )}
//               />
//             </>
//           ))}
//         <Button
//           title={selectedValue === 'full' ? 'Confirmed' : 'Request'}
//           buttonStyle={styles.btn}
//           backgroundColor={
//             selectedValue === 'full' ? R.colors.GREEN : R.colors.primary
//           }
//           disabled={amount == null ? true : false}
//         />
//       </View>
//     </ScreenWrapper>
//   );
// };

// export default ClientCollection;

// const styles = StyleSheet.create({
//   container: {
//     flexWrap: 'wrap',
//     justifyContent: 'space-around',
//     padding: 10,
//   },
//   top: {padding: 10, backgroundColor: R.colors.SLATE_GRAY, width: '100%'},
//   value: {
//     color: R.colors.PRIMARY_LIGHT,
//     fontWeight: '500',
//     fontSize: R.fontSize.L,
//     textAlign: 'left',
//     flexWrap: 'wrap',
//     width: '80%',
//     alignSelf: 'center',
//   },
//   radioContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     margin: 10,
//     marginHorizontal: 5,
//   },
//   radioLabel: {
//     marginLeft: 8,
//     fontSize: 16,
//     color: R.colors.PRIMARI_DARK,
//   },
//   input: {
//     borderBottomWidth: 1,
//     color: R.colors.PRIMARI_DARK,
//     textAlignVertical: 'bottom',
//     fontSize: 16,
//     fontWeight: '800',
//     backgroundColor: R.colors.WHITE,
//     marginBottom: 5,
//   },
//   btn: {
//     borderRadius: 4,
//     marginVertical: 10,
//   },
// });
