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
import Loader from '../../library/commons/Loader';
import ConfirmationModal from '../../library/modals/ConfirmationModal';

const LAFScreen = props => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const data = props.route?.params?.data;
  const [product, setProduct] = useState(null);
  const [amountApplied, setAmountApplied] = useState(null);
  const [durationOfLoan, setDurationOfLoan] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [loanPurpose, setLoanPurpose] = useState(null);
  const [loanPurposeData, setLoanPurposeData] = useState(null);
  const [category, setCategory] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [insurance, setInsurance] = useState(null);
  const [productTypeData, setProdTypeData] = useState([]);
  const [amountData, setAmountData] = useState([]);
  const [freqTenureData, setFreqTenureData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isVis, onModalClose] = useState(false);
  console.log(product);
  useEffect(() => {
    fetchLoanTypeAndPurpose();
  }, []);

  const fetchLoanTypeAndPurpose = async () => {
    try {
      setLoading(true);
      const res = await new UserApi().fetchLoanTypeAndPurpose();
      if (res) {
        setProdTypeData(res?.loanType);
        setCategoryData(res?.loanPurpose);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchLoanAmt = async data => {
    try {
      setLoading(true);
      const res = await new UserApi().fetchLoanAmt({
        id: data,
      });
      if (res?.length >= 1) {
        setFrequency(null);
        setAmountData(res);
        setDurationOfLoan(null);
        setAmountApplied(null);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const fetchLoanPurpose = async data => {
    try {
      setLoading(true);
      const res = await new UserApi().fetchLoanPurpose({
        id: data,
      });
      console.log('res_____', res);
      if (res?.length >= 1) {
        setLoanPurposeData(res);
        // setFrequency(null);
        // setAmountData(res);
        // setDurationOfLoan(null);
        // setAmountApplied(null);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const fetchProdFreqTen = async data => {
    try {
      setLoading(true);
      const res = await new UserApi().fetchProdFreqTen({
        amt: data,
        id: product,
      });
      // console.log(res);
      if (res?.length == 1) {
        setFrequency(res[0]?.paymentfrequency?.toString());
        setDurationOfLoan(res[0]?.period?.toString());
        setFreqTenureData(res);
      } else if (res?.length > 1) {
        setFrequency(res[0]?.paymentfrequency?.toString());
        setDurationOfLoan(res[0]?.period?.toString());
        setFreqTenureData(res);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleConfirm = status => {
    if (status == 'confirm') {
      onModalClose(false);
      navigation.navigate(ScreensNameEnum.LAF_GROUP_SCREEN1, {data: data});
    }
  };

  return (
    <ScreenWrapper >
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {ScreensNameEnum.LAF_GROUP_SCREEN}
        </Text>
      </View>
      <View style={styles.container}>
        <ScrollView>
          {/* Loan Purpose Section */}
          <Text style={styles.sectionTitle}>
            Purpose and Type of Loan Facility
          </Text>
          <View style={styles.cardView}>
            {/* Product */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label(isDarkMode)}>Product</Text>
              <Picker
                selectedValue={product}
                style={styles.input(isDarkMode)}
                dropdownIconColor={R.colors.primary}
                onValueChange={itemValue => {
                  setProduct(itemValue);
                  if (itemValue) {
                    fetchLoanAmt(itemValue);
                  }
                }}>
                <Picker.Item label="-- Select Product --" value={null} />
                {productTypeData?.length >= 1 &&
                  productTypeData.map((item, index) => (
                    <Picker.Item
                      label={item?.PRODUCT_NAME}
                      value={item?.product_id}
                      key={index}
                    />
                  ))}
              </Picker>
            </View>

            {/* Amount Applied */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label(isDarkMode)}>Amount Applied</Text>
              <Picker
                selectedValue={amountApplied}
                style={styles.input(isDarkMode)}
                dropdownIconColor={R.colors.primary}
                onValueChange={itemValue => {
                  setAmountApplied(itemValue);
                  if (itemValue) {
                    fetchProdFreqTen(itemValue);
                  }
                }}>
                <Picker.Item label="-- Select Amount --" value={null} />
                {amountData?.length >= 1 &&
                  amountData.map((item, index) => (
                    <Picker.Item
                      label={item?.financeamount}
                      value={item?.financeamount}
                      key={index}
                    />
                  ))}
                {/* Add other amounts */}
              </Picker>
            </View>

            {/* Tenure */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label(isDarkMode)}>Tenure</Text>
              {freqTenureData?.length == 1 ? (
                <TextInput
                  style={styles.input(isDarkMode, true)}
                  value={durationOfLoan}
                  editable={false}
                />
              ) : freqTenureData?.length > 1 ? (
                <>
                  <Picker
                    selectedValue={durationOfLoan}
                    style={styles.input(isDarkMode)}
                    dropdownIconColor={R.colors.primary}
                    onValueChange={itemValue => {
                      setDurationOfLoan(itemValue);
                      if (itemValue) {
                        setFrequency(
                          freqTenureData?.filter(
                            item => item.period == itemValue,
                          )[0]?.paymentfrequency,
                        );
                      }
                    }}>
                    <Picker.Item label="-- Select Tenure --" value={null} />
                    {freqTenureData?.length >= 1 &&
                      freqTenureData.map((item, index) => (
                        <Picker.Item
                          label={item?.period}
                          value={item?.period}
                          key={index}
                        />
                      ))}
                  </Picker>
                </>
              ) : null}
            </View>

            {/* Frequency */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label(isDarkMode)}>Repay. Frequency</Text>
              <TextInput
                style={styles.input(isDarkMode, true)}
                value={frequency}
                editable={false}
              />
            </View>

            {/* Loan Purpose */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label(isDarkMode)}>Loan Category</Text>
              <Picker
                selectedValue={category}
                style={styles.input(isDarkMode)}
                dropdownIconColor={R.colors.primary}
                onValueChange={itemValue => {
                  setCategory(itemValue);
                  if (itemValue) {
                    fetchLoanPurpose(itemValue);
                  }
                }}>
                <Picker.Item label="-- Select Category --" value={null} />
                {categoryData?.length >= 1 &&
                  categoryData.map((item, index) => (
                    <Picker.Item
                      label={item?.categorydetail}
                      value={item?.categoryid}
                      key={index}
                    />
                  ))}
              </Picker>
            </View>
            {/* Loan Purpose */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label(isDarkMode)}>Loan Purpose</Text>
              <Picker
                selectedValue={loanPurpose}
                style={styles.input(isDarkMode)}
                dropdownIconColor={R.colors.primary}
                onValueChange={itemValue => setLoanPurpose(itemValue)}>
                <Picker.Item label="-- Select Purpose --" value={null} />
                {loanPurposeData?.length >= 1 &&
                  loanPurposeData.map((item, index) => (
                    <Picker.Item
                      label={item?.loanpurpose}
                      value={item?.purposeid}
                      key={index}
                    />
                  ))}
              </Picker>
            </View>

            {/* Insurance */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label(isDarkMode)}>Insurance</Text>
              <Picker
                selectedValue={insurance}
                style={styles.input(isDarkMode)}
                dropdownIconColor={R.colors.primary}
                onValueChange={itemValue => setInsurance(itemValue)}>
                <Picker.Item label="Yes" value="Yes" />
                <Picker.Item label="No" value="No" />
              </Picker>
            </View>
          </View>

          <Button
            title="NEXT"
            buttonStyle={styles.nextButton}
            textStyle={styles.nextButtonText}
            onPress={
              () => onModalClose(true)
              // navigation.navigate(ScreensNameEnum.LAF_GROUP_SCREEN1)
            }
          />
        </ScrollView>
      </View>
      <Loader loading={loading} message={'please wait...'} />
      <ConfirmationModal
        isVisible={isVis}
        onModalClose={onModalClose}
        confirmationText={
          'Are you sure the Selected Information Of Product is Okay and verified?'
        }
        onConfirm={handleConfirm}
      />
    </ScreenWrapper>
  );
};

export default LAFScreen;

const styles = StyleSheet.create({
  header: {
    padding: 15,
    backgroundColor: R.colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    fontSize: 24,
    color: R.colors.PRIMARY_LIGHT,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: R.colors.backgroundLight,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: R.colors.primary,
    marginBottom: 10,
  },
  cardView: {
    padding: 15,
    backgroundColor: R.colors.cardBackground,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: R.colors.LIGHTGRAY,
  },
  label: isDarkMode => ({
    color: isDarkMode ? R.colors.PRIMARI_DARK : R.colors.PRIMARI_DARK,
    marginBottom: 5,
    // borderWidth:0
  }),
  fieldValue: {
    fontSize: 16,
    color: R.colors.primaryText,
    padding: 10,
    backgroundColor: R.colors.fieldBackground,
    borderRadius: 5,
    textAlign: 'left',
  },
  input: (isDarkMode, isDisabled = false) => ({
    borderColor: R.colors.inputBorder,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    color: isDarkMode ? R.colors.PRIMARI_DARK : R.colors.PRIMARI_DARK,
    backgroundColor: isDisabled
      ? R.colors.disabledBackground
      : R.colors.inputBackground,
  }),
  nextButton: {
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
    backgroundColor: R.colors.primary,
    padding: 15,
  },
  nextButtonText: {
    color: R.colors.white,
    fontWeight: 'bold',
  },
});
