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
  Image,
  TouchableOpacity,
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
import {currentUserSelector} from '../../store/slices/user/user.slice';
import {useNavigation} from '@react-navigation/native';
import ConfirmationModal from '../../library/modals/ConfirmationModal';
import Loader from '../../library/commons/Loader';
import {launchCamera} from 'react-native-image-picker';

const ClientCollection = ({route}) => {
  const dispatch = useDispatch();
  const user = useSelector(currentUserSelector);
  const navigation = useNavigation();
  const [isVis, setVis] = useState(false);
  const [qrCode, setQrCode] = useState(null);
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
    Contact,
  } = route?.params?.dt;
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState(null);
  const [amount, setAmount] = useState(null);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preAmt, setPreAmt] = useState('');
  const [clientImage, setClientImage] = useState(null);
  const [isLinkSent, setIsLinkSent] = useState(false);

  const amountRef = useRef();
  const radioButtonsData = [
    {label: 'Full', value: 'full'},
    {label: 'Partial', value: 'partial'},
    // {label: 'Interest', value: 'interest'},
    {label: 'Advance', value: 'advance'},
    {label: 'Pre-Closure', value: 'preClo'},
    // {label: 'Full-Settlement.', value: 'full_settl'},
  ];
  const radioButtonsAmount = [
    {label: 'QR', value: 'QR'},
    {label: 'Link', value: 'link'},
    {label: 'Cash', value: 'Cash'},
    {label: 'AEPS(AADHAR)', value: 'AEPS(AADHAR)'},
    // {label: 'Deposit AT Bank', value: 'AEPS(AADHAR)'},
    // {label: 'Other Online Transafer', value: 'other'}, //Transaction ID and date and payment made to
  ];
  console.log(user);
  useEffect(() => {
    function resetAllImages() {
      setClientImage(null);
      setQrCode(null);
    }
    resetAllImages();
  }, [selectedPaymentMode, selectedValue]);

  useEffect(() => {
    if (amount > preAmt && selectedValue == 'advance') {
      Alert.alert('Amount cannot be greater than outstanding amount...');
      setAmount(null);
    }
    if (amount > TodayEMI && selectedValue == 'partial') {
      Alert.alert('Amount cannot be greater than Today EMI...');
      setAmount(null);
    }
    if (preAmt == '') {
      fetchPreClosureAmt();
    }
  }, [amount, TodayEMI]);
  useEffect(() => {
    if (amount && selectedPaymentMode == 'QR') {
      setQrCode(null);
    }
  }, [amount]);

  const fetchPreClosureAmt = async () => {
    try {
      setLoading(true);
      const res = await new UserApi().fetchPreClosAmt({customerid: customerid});
      if (res) {
        setPreAmt(res[0]?.SettlementAmt);
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

  const handleImagePick = () => {
    launchCamera({mediaType: 'photo', quality: 0.9}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        console.log(response.assets[0]);
        setClientImage(response.assets[0]);
      }
    });
  };

  const handleOnPress = async () => {
    try {
      setLoading(true);
      const response = await new UserApi().sendCashRequestApproval({
        data: {
          amount: amount,
          loanId: customerid,
          paymentType: selectedValue,
          branchId: user?.branchid,
        },
      });
      if (response) {
        Alert.alert('Request For Cash Approval Sent Successfully...');
        setIsLinkSent(true);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleGeneratePaymentLink = async () => {
    try {
      setLoading(true);
      const response = await new UserApi().createPaymentLink({
        data: {
          amount: amount,
          contact: 8265805176,
          loanId: customerid,
          paymentMode: selectedPaymentMode,
          paymentType: selectedValue,
        },
      });
      if ('upi_link' in response) {
        Alert.alert('Payment link Send Successfully...');
        setIsLinkSent(true);
      }
      console.log(response);
      setLoading(false);
    } catch (error) {
      console.error('Error generating payment link:', error);
      setLoading(false);
    }
  };
  const handleGeneratePaymentQR = async () => {
    try {
      setLoading(true);
      const response = await new UserApi().createPaymentQR({
        data: {
          amount: amount,
          contact: 7318340673,
          loanId: customerid,
          paymentMode: selectedPaymentMode,
          paymentType: selectedValue,
        },
      });
      console.log('HELLO', response);
      if ('image_url' in response) {
        setQrCode(response);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error generating payment link:', error);
      setLoading(false);
    }
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
                {qrCode?.image_url && selectedPaymentMode == 'QR' && (
                  <Image
                    source={{uri: qrCode?.image_url}}
                    style={styles.qrImage}
                    resizeMode="contain"
                  />
                )}
                {Collection_Status != 1 &&
                preclose_status == null &&
                selectedPaymentMode === 'Cash' &&
                clientImage !== null ? (
                  <Button
                    title={
                      // selectedValue === 'full'
                      //   ?
                      'Request Cash Approval'
                      // : selectedValue === 'partial'
                      // ? 'Confirm'
                      // : 'Request'
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
                ) : Collection_Status != 1 &&
                  preclose_status == null &&
                  selectedPaymentMode == 'link' ? (
                  <Button
                    title="Send Payment Link"
                    onPress={handleGeneratePaymentLink}
                    backgroundColor={R.colors.PRIMARY}
                    textStyle={{fontWeight: '800'}}
                    buttonStyle={{marginVertical: 20}}
                    disabled={isLinkSent}
                  />
                ) : Collection_Status != 1 &&
                  preclose_status == null &&
                  selectedPaymentMode == 'QR' &&
                  amount > 1 &&
                  qrCode == null ? (
                  <Button
                    title="Generate Payment QR"
                    onPress={handleGeneratePaymentQR}
                    backgroundColor={R.colors.PRIMARY}
                    textStyle={{fontWeight: '800'}}
                    buttonStyle={{marginVertical: 20}}
                  />
                ) : null}

                {selectedPaymentMode == 'Cash' &&
                amount > 1 &&
                clientImage === null ? (
                  <TouchableOpacity
                    onPress={handleImagePick}
                    style={styles.imageSlot}>
                    <Icon name="camera" size={35} color="#2A89F6" />
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#2A89F6',
                        textAlign: 'center',
                        fontWeight: '800',
                      }}>
                      Capture Client Image
                    </Text>
                  </TouchableOpacity>
                ) : clientImage !== null &&
                  selectedPaymentMode == 'Cash' &&
                  amount > 1 ? (
                  <>
                    <Text
                      onPress={() => {
                        setClientImage(null);
                        handleImagePick();
                      }}
                      style={{
                        padding: 10,
                        alignSelf: 'center',
                        textAlign: 'center',
                        color: R.colors.PRIMARY_LIGHT,
                        backgroundColor: R.colors.DARK_BLUE,
                        fontWeight: 'bold',
                        fontSize: R.fontSize.L,
                        marginBottom: 15,
                        borderRadius: 12,
                      }}>
                      Retake Picture
                    </Text>
                    <Image
                      source={{uri: clientImage.uri}}
                      style={{
                        width: '100%',
                        height: 400,
                        alignSelf: 'center',
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: R.colors.DARK_BLUE,
                        resizeMode: 'cover',
                      }}
                    />
                  </>
                ) : null}
              </View>
            </View>
          </View>

          <ConfirmationModal
            isVisible={isVis}
            onModalClose={setVis}
            onConfirm={handleConfirm}
            confirmationText="Are you sure you want to send Cash Request for Approval?"
          />
        </ScrollView>
        <Loader loading={loading} message={'please wait...'} />
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
  qrImage: {
    height: 600,
    width: '100%',
    alignSelf: 'center',
  },
  imageSlot: {
    width: '80%',
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    marginRight: 10,
    alignSelf: 'center',
    flexDirection: 'row',
  },
});
