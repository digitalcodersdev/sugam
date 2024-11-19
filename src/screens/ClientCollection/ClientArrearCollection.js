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
  // import UserApi from '../../datalib/services/user.api';
  import {useDispatch, useSelector} from 'react-redux';
  // import {
  //   fetchCurrentDayCollectionByBranchId,
  //   fetchCurrentDayCollectionByCenterId,
  //   updateCollectionAmt,
  // } from '../../store/actions/userActions';
  import {currentUserSelector} from '../../store/slices/user/user.slice';
  import {useNavigation} from '@react-navigation/native';
  import ConfirmationModal from '../../library/modals/ConfirmationModal';
  
  const ClientArrearCollection = ({route}) => {
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
      EMI_Amount,
      LoanID,
      remainingCollection,
      centerId,
      Collection_Status,
      preclose_status,
    } = route?.params?.dt;
    const [selectedValue, setSelectedValue] = useState(null);
    const [amount, setAmount] = useState(null);
    const [focused, setFocused] = useState(null);
    const [loading, setLoading] = useState(false);
    const [preAmt, setPreAmt] = useState('');
    console.log('preclose_status', preclose_status);
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
  
    // useEffect(() => {
    //   if (amount > preAmt) {
    //     Alert.alert('Amount cannot be greater than outstanding amount...');
    //   }
    // if (preAmt == '') {
    //   fetchPreClosureAmt();
    // }
    // }, [amount, EMI_Amount]);
  
    // const fetchPreClosureAmt = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await new UserApi().fetchPreClosAmt({loanId: LoanID});
    //     if (res) {
    //       setPreAmt(res[0]?.Foreclose_Amount);
    //     }
    //     setLoading(false);
    //   } catch (error) {
    //     console.log(error);
    //     setLoading(false);
    //   }
    // };
  
    const handleSetAmount = val => {
      setSelectedValue(val);
      if (val == 'full') {
        setAmount(EMI_Amount);
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
      //       loanId: LoanID,
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
              <View style={styles.card}>
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
              <View style={styles.card}>
                <Icon name="credit-card" size={24} color={R.colors.DARK_BLUE} />
                <View style={styles.cardContent}>
                  <Text style={styles.cardLabel}>Customer ID</Text>
                  <Text style={styles.cardValue}>{LoanID}</Text>
                </View>
              </View>
              <View style={styles.card}>
                <Icon
                  name="calendar-month"
                  size={24}
                  color={R.colors.DARK_BLUE}
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardLabel}>EMI No</Text>
                  <Text style={styles.cardValue}>{TotalEMI}</Text>
                </View>
              </View>
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
                  <Text style={styles.cardValue}>₹{EMI_Amount}</Text>
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
                        selectedValue={selectedValue}
                        onPress={handleSetAmount}
                      />
                    )}
                  />
  
                  {Collection_Status != 1 && preclose_status == null && (
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
  
  export default ClientArrearCollection;
  
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
  
  