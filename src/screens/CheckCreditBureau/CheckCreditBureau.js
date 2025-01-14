import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import R from '../../resources/R';
import {TextInput} from 'react-native-gesture-handler';
import moment from 'moment';
import Button from '../../library/commons/Button';
import {Picker} from '@react-native-picker/picker';
import Toast from 'react-native-simple-toast';
import ValidationHelper from '../../helpers/ValidationHelper';
import VerifyOTPModal from '../../library/modals/VerifyOTPModal';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import UserApi from '../../datalib/services/user.api';
import Loader from '../../library/commons/Loader';
import AuthenticationApi from '../../datalib/services/authentication.api';
import {useNavigation} from '@react-navigation/native';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import {Card, Divider, Surface} from 'react-native-paper';
import axios from 'axios';
import CCRReportModal from '../../library/modals/CCRReportModal';
import AuthApi from '../../datalib/services/authentication.api';
import APP_CONSTANTS from '../../constants/appConstants';
import {json2xml} from 'xml-js';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';

I18n.translations = {
  'en-IN': {
    welcome: 'Welcome',
    alreadyCustomer: 'This Aadhar number is already registered.',
  },
  en: {
    welcome: 'Welcome',
    alreadyCustomer: 'This Aadhar number is already registered.',
    msgSent: 'OTP sent successfully',
    msgLimitEnd: 'Exceeded maximum OTP generation limit',
  },
  hi: {
    invalidPan: 'कृपया वैध पैन नंबर दर्ज करें|',
    voterDetailsMisMatch:
      'मतदाता पहचान पत्र का विवरण मेल नहीं खा रहा है। कृपया किसी अन्य दस्तावेज़ से मिलान करने का प्रयास करें।',
    wrongVoterId: 'कृपया वैध मतदाता पहचान संख्या दर्ज करें',
    firstAadhar: 'कृपया पहले सह आवेदक का आधार कार्ड सत्यापित करें।',
    alreadyCustomer: 'यह आधार नंबर पहले से मौजूद है।',
    msgSent: 'OTP सफलतापूर्वक भेजा गया',
    msgLimitEnd:
      'अधिकतम OTP जनरेशन सीमा पार हो गई| कृपया कुछ समय बाद पुनः प्रयास करें ',
    pleaseRetry: 'कुछ गलत हो गया कृपया पुनः प्रयास करें',
    enterValidAAdhar: 'कृपया वैध आधार संख्या दर्ज करें',
    panDetailsMisMatch: 'आवेदक के पैन कार्ड का विवरण मेल नहीं खा रहा है',
    noPan: 'दिए गए पैन नंबर के लिए कोई डेटा नहीं मिला',
  },
};
const FAMILY = {
  Husband: 'K02',
  Wife: 'K06',
  Father: 'K01',
  Mother: 'K03',
  Brother: 'K07',
  Sister: 'K14',
  Son: 'K04',
  Daughter: 'K05',
  Father_in_law: 'K09',
  Mother_in_law: 'K08',
  son_in_law: 'K12',
  Brother_in_law: 'K13',
  other: 'K15',
  daughter_in_law: 'K10',
  sister_in_law: 'K11',
};

const CheckCreditBureau = ({route}) => {
  I18n.locale = 'hi';
  const navigation = useNavigation();
  const {
    name,
    dob: DOB,
    adharNumber,
    careOf,
    maskedAdharNumber,
    gender,
    address: {
      house,
      street,
      landmark,
      po,
      dist,
      subdist,
      vtc,
      pc,
      state,
      country,
    },
  } = route?.params?.data;
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [loading, setLoading] = useState(false);
  const [applicantName, setApplicantName] = useState(name);
  const [dob, setDob] = useState(DOB);
  const [relation, setRelation] = useState(null);
  const [relationName, setRelationName] = useState('');
  const [phone, setPhone] = useState('');
  const [panNo, setPanno] = useState('');
  const [aadharNo, setAadharNo] = useState(adharNumber);
  const [voterId, setVoterId] = useState('');
  const [coApplicantName, setCoApplName] = useState('');
  const [coApplDOB, setCoApplDOB] = useState('');
  const [coAppAddress, setCoAppAddress] = useState('');
  const [coApplState, setCoApplState] = useState(null);
  const [coAppPincode, setCoApplPincode] = useState('');
  const [coApplMobileNo, setCoAppMobileNo] = useState();
  const [coApplPAN, setCoApplPAN] = useState('');
  const [coApplAadhar, setCoApplAadhar] = useState('');
  const [coApplVoterid, setCoAppVoterid] = useState('');
  const [focused, setFocused] = useState(null);
  const [err, setErr] = useState({});
  const [borrrowerDocumentVerified, setBorrowerDocumentVerified] = useState('');
  const [coBorrDocVer, setCoBorrDocVer] = useState('');
  const address = `${house} ${street} ${landmark} ${po} ${dist} ${subdist} ${vtc} ${pc} ${state} ${country}`;
  const [isVisible, onModalClose] = useState(false);
  const [coBorrAAdharVeriStatus, setCoBorrAadharVeriStatus] = useState(false);
  const [coBorrAadharData, setCoBorrAadharData] = useState('');
  const [otpEnabled, setOtpEnabled] = useState(false);
  const [applOtpEnabled, setApplOtpEnabled] = useState(false);
  const [extraData, setExtraData] = useState({});
  const [applMobileVerifyStatus, setAppVerifyStatus] = useState(false);
  const [coApplMobileVerifyStatus, setCoAppVerifyStatus] = useState(false);
  const [transactionId, setTrasactionId] = useState('');
  const [applTransactionId, setApplTrasactionId] = useState('');
  const [otp, setOtp] = useState('');
  const [applOtp, setApplOtp] = useState('');
  const [ccrRules, setCCRRules] = useState({});
  const [ccrVis, setCCRVis] = useState(false);
  const [coApplMaskedAadhar, setCoApplMashAadhar] = useState('');
  const [coAppCareOf, setCoApplCareOf] = useState('');
  const [coAppGender, setCoApplGender] = useState('');
  const [category, setCategory] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [productTypeData, setProdTypeData] = useState([]);
  const [loanPurpose, setLoanPurpose] = useState(null);
  const [loanPurposeData, setLoanPurposeData] = useState(null);
  const [product, setProduct] = useState(null);
  const [amountApplied, setAmountApplied] = useState(null);
  const [amountData, setAmountData] = useState([]);
  const [coAppAdd, setCoAppAdd] = useState({});
  const [freqTenureData, setFreqTenureData] = useState([]);
  const userData = useRef(null);
  const coAppData = useRef(null);
  const CCRReport = useRef(null);
  const productCurrent = useRef(null);
  const enrollmentId = useRef(null);

  //Ref
  const applicantNameRef = useRef(null);
  const relationNameRef = useRef(null);
  const phoneRef = useRef(null);
  const panNoRef = useRef(null);
  const aadharNoRef = useRef(null);
  const voterIdRef = useRef(null);
  const coApplicantNameRef = useRef(null);
  const coAppAddressRef = useRef(null);
  const coApplRelationNameRef = useRef(null);
  const coAppPincodeRef = useRef(null);
  const coApplMobileNoRef = useRef(null);
  const coApplPANRef = useRef(null);
  const coApplAadharRef = useRef(null);
  const coApplVoteridRef = useRef(null);

  useEffect(() => {
    const fetchCcrRules = async () => {
      try {
        const response = await new UserApi().fetchCCRRules();
        if (response && response?.data?.length >= 1) {
          setCCRRules(response?.data[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCcrRules();
  }, []);

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

  useEffect(() => {
    if (
      aadharNo?.length == 12 &&
      coApplAadhar?.length == 12 &&
      aadharNo == coApplAadhar
    ) {
      Alert.alert('आवेदक और सह-आवेदक का आधार नंबर एक समान नहीं हो सकता');
      setCoApplAadhar('');
    }
  }, [aadharNo, coApplAadhar]);

  useEffect(() => {
    if (panNo?.length == 10 && coApplPAN?.length == 10 && panNo == coApplPAN) {
      Alert.alert('आवेदक और सह-आवेदक का पैन नंबर एक समान नहीं हो सकता');
      setCoApplPAN('');
    }
  }, [panNo, coApplPAN]);

  useEffect(() => {
    if (
      voterId?.length == 10 &&
      coApplVoterid?.length == 10 &&
      voterId == coApplVoterid
    ) {
      Alert.alert('आवेदक और सह-आवेदक का वोटर आईडी नंबर एक समान नहीं हो सकता');
      setCoAppVoterid('');
    }
  }, [voterId, coApplVoterid]);
  useEffect(() => {
    if (
      phone?.length == 10 &&
      coApplMobileNo?.length == 10 &&
      phone == coApplMobileNo
    ) {
      Alert.alert(
        'आवेदक और सह-आवेदक का फ़ोन नंबर एक ही है। अगर आप नंबर बदलना चाहते हैं तो बदल सकते हैं',
      );
    }
  }, [phone, coApplMobileNo]);

  const fetchLoanAmt = async data => {
    try {
      setLoading(true);
      const res = await new UserApi().fetchLoanAmt({
        id: data,
      });
      console.log('_+++++++++++++++++++=========-------', res);
      if (res?.length >= 1) {
        // setFrequency(null);
        setAmountData(res);
        // setDurationOfLoan(null);
        // setAmountApplied(null);
      } else {
        setAmountData([]);
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
      // console.log('res_____', res);
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
        // setFrequency(res[0]?.paymentfrequency?.toString());
        // setDurationOfLoan(res[0]?.period?.toString());
        setFreqTenureData(res);
      } else if (res?.length > 1) {
        // setFrequency(res[0]?.paymentfrequency?.toString());
        // setDurationOfLoan(res[0]?.period?.toString());
        setFreqTenureData(res);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const validate = () => {
    let valid = true;
    let error = {};
    if (relation === null) {
      Toast.show("Please Select Applicant's Relation", Toast.SHORT, Toast.TOP);
      error.relation = true;
      valid = false;
      return valid;
    }
    // if (!relationName.replace(/\s+/g, '').length) {
    //   Toast.show(
    //     "Please Enter Applicant's Relation Name",
    //     Toast.SHORT,
    //     Toast.TOP,
    //   );
    //   error.relationName = true;
    //   valid = false;
    //   relationNameRef.current.focus();
    //   return valid;
    // }
    // if (panNo?.length >= 1 && !ValidationHelper.isPanValid(panNo)) {
    //   Toast.show('Please Enter Valid PAN No.', Toast.SHORT, Toast.TOP);
    //   error.panNo = true;
    //   valid = false;
    //   panNoRef.current.focus();
    //   return valid;
    // }
    // if (voterId?.length >= 1 && !ValidationHelper.isValidVoterId(voterId)) {
    //   Toast.show('Please Enter Valid Voter Id No.', Toast.SHORT, Toast.TOP);
    //   error.voterId = true;
    //   valid = false;
    //   voterIdRef.current.focus();
    //   return valid;
    // }

    if (borrrowerDocumentVerified == '') {
      if (voterId?.length == 10) {
        Toast.show('Please Verify Voter ID.', Toast.SHORT, Toast.TOP);
      } else if (panNo?.length == 10) {
        Toast.show('Please Verify PAN No.', Toast.SHORT, Toast.TOP);
      } else {
        Toast.show(
          "Please Verify applicant's PAN NO OR Voter ID.",
          Toast.SHORT,
          Toast.TOP,
        );
      }

      valid = false;
      return valid;
    }
    // if (!ValidationHelper.isValidVoterId(voterId)) {
    //   Toast.show('Please Enter Valid Voter Id No.', Toast.SHORT, Toast.TOP);
    //   error.voterId = true;
    //   valid = false;
    //   voterIdRef.current.focus();
    //   return valid;
    // }
    // if (product === null) {
    //   Toast.show('Please Select Product', Toast.SHORT, Toast.TOP);
    //   error.product = true;
    //   valid = false;
    //   return valid;
    // }
    if (!ValidationHelper.isValidAadhar(coApplAadhar)) {
      Toast.show(
        "Please Enter Co-Applicant's Valid Aadhar No.",
        Toast.SHORT,
        Toast.TOP,
      );
      error.coApplAadhar = true;
      valid = false;
      coApplAadharRef.current.focus();
      return valid;
    }
    if (!coBorrAAdharVeriStatus) {
      Toast.show(
        "Please Verify Co-Applicant's Aadhar No.",
        Toast.SHORT,
        Toast.TOP,
      );
      error.coApplAadhar = true;
      valid = false;
      return valid;
    }
    if (!coApplicantName.replace(/\s+/g, '').length) {
      Toast.show("Please Enter Co-Applicant's Name", Toast.SHORT, Toast.TOP);
      error.applicantName = true;
      valid = false;
      coApplicantNameRef.current.focus();
      return valid;
    }
    if (!coAppAddress.replace(/\s+/g, '').length) {
      Toast.show("Please Enter Co-Applicant's Address", Toast.SHORT, Toast.TOP);
      error.coAppAddress = true;
      valid = false;
      coAppAddressRef.current.focus();
      return valid;
    }

    // if (coApplRelation === null) {
    //   Toast.show(
    //     "Please Select Co-Applicant's Relation",
    //     Toast.SHORT,
    //     Toast.TOP,
    //   );
    //   error.coApplRelation = true;
    //   valid = false;
    //   return valid;
    // }
    // if (!coApplRelationName.replace(/\s+/g, '').length) {
    //   Toast.show(
    //     "Please Enter Co-Applicant's Relation Name",
    //     Toast.SHORT,
    //     Toast.TOP,
    //   );
    //   error.relationName = true;
    //   valid = false;
    //   coApplRelationNameRef.current.focus();
    //   return valid;
    // }

    if (!ValidationHelper.isPhone(coApplMobileNo)) {
      Toast.show(
        "Please Enter Co-Applicant's Valid Mobile Number",
        Toast.SHORT,
        Toast.TOP,
      );
      error.coApplMobileNo = true;
      valid = false;
      coApplMobileNoRef.current.focus();
      return valid;
    }
    if (!coApplMobileVerifyStatus) {
      Toast.show(
        "Please Verify Co-Applicant's Mobile Number",
        Toast.SHORT,
        Toast.TOP,
      );
      error.coApplMobileNo = true;
      valid = false;
      return valid;
    }
    if (!ValidationHelper.isPanValid(coApplPAN) && coApplPAN?.length >= 1) {
      Toast.show(
        "Please Enter Co-Applicant's Valid PAN No.",
        Toast.SHORT,
        Toast.TOP,
      );
      error.coApplPAN = true;
      valid = false;
      return valid;
    }

    if (
      !ValidationHelper.isValidVoterId(coApplVoterid) &&
      coApplVoterid?.length >= 1
    ) {
      Toast.show(
        "Please Enter Co-Applicant's Valid Voter Id No.",
        Toast.SHORT,
        Toast.TOP,
      );
      error.voterId = true;
      valid = false;
      coApplAadharRef.current.focus();
      return valid;
    }

    if (coBorrDocVer == '') {
      if (coApplVoterid?.length == 10) {
        Toast.show(
          "Please Verify Co-Applicant's Voter ID.",
          Toast.SHORT,
          Toast.TOP,
        );
      } else if (coApplPAN?.length == 10) {
        Toast.show(
          "Please Verify Co-Applicant's PAN No.",
          Toast.SHORT,
          Toast.TOP,
        );
      } else {
        Toast.show(
          "Please Verify Co-Applicant's PAN No. OR Voter ID",
          Toast.SHORT,
          Toast.TOP,
        );
      }

      valid = false;
      return valid;
    }

    if (product == null) {
      Toast.show('Please Select Product', Toast.SHORT, Toast.TOP);
      valid = false;
      return valid;
    }
    if (category == null) {
      Toast.show('Please Select Loan Category', Toast.SHORT, Toast.TOP);
      valid = false;
      return valid;
    }
    if (loanPurpose == null) {
      Toast.show('Please Select Loan Purpose', Toast.SHORT, Toast.TOP);
      valid = false;
      return valid;
    }
    if (amountApplied == null) {
      Toast.show('Please Select Loan Amount', Toast.SHORT, Toast.TOP);
      valid = false;
      return valid;
    }

    return valid;
  };

  function calculateAge(dob) {
    const [day, month, year] = dob.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  }

  const handleConfirm = async () => {
    try {
      const valid = validate();
      if (valid) {
        // var RAW_PROD = JSON.stringify({
        //   RequestHeader: {
        //     CustomerId: APP_CONSTANTS.CCR_CONSTANTS.PRODUCTION.CustomerId,
        //     UserId: APP_CONSTANTS.CCR_CONSTANTS.PRODUCTION.UserId,
        //     Password: APP_CONSTANTS.CCR_CONSTANTS.PRODUCTION.Password,
        //     MemberNumber: APP_CONSTANTS.CCR_CONSTANTS.PRODUCTION.MemberNumber,
        //     SecurityCode: APP_CONSTANTS.CCR_CONSTANTS.PRODUCTION.SecurityCode,
        //     CustRefField: '123456',
        //     ProductCode: APP_CONSTANTS.CCR_CONSTANTS.PRODUCTION.ProductCode,
        //   },
        //   RequestBody: {
        //     InquiryPurpose: '00',
        //     FirstName: 'Arjun ',
        //     MiddleName: '',
        //     LastName: 'Arya',
        //     DOB: '1996-06-20',
        //     InquiryAddresses: [
        //       {
        //         seq: '1',
        //         AddressType: ['H'],
        //         AddressLine1: 'Bagicha, Dharchula, Pithoragarh,Uttrakhand - 262545',
        //         State: 'BR',
        //         Postal: '262545',
        //       },
        //     ],
        //     InquiryPhones: [
        //       {
        //         seq: '1',
        //         Number: '8126949109',
        //         PhoneType: ['M'],
        //       },
        //     ],
        //     IDDetails: [
        //       {
        //         seq: '1',
        //         IDType: 'M',
        //         IDValue: '86625621616',
        //         Source: 'Inquiry',
        //       },
        //       {
        //         seq: '2',
        //         IDType: 'T',
        //         IDValue: 'BVDPA8941B',
        //         Source: 'Inquiry',
        //       },
        //       {
        //         seq: '3',
        //         IDType: 'V',
        //         IDValue: '',
        //         Source: 'Inquiry',
        //       },
        //     ],
        //     MFIDetails: {
        //       FamilyDetails: [
        //         {
        //           seq: '1',
        //           AdditionalNameType: 'K01',
        //           AdditionalName: 'Ganesh Arya',
        //         },
        //       ],
        //     },
        //   },
        //   Score: [
        //     {
        //       Type: 'ERS',
        //       Version: '4.0',
        //     },
        //   ],
        // });

        // var myHeaders = new Headers();
        // myHeaders.append('Content-Type', 'application/json');
        // console.log('RAW_PROD', RAW_PROD);
        // const PRODUCTION_URL =
        //   'https://ists.equifax.co.in/cir360service/cir360report';
        // const res = await axios.post(PRODUCTION_URL, JSON.parse(RAW_PROD), {
        //   headers: myHeaders,
        // });
        // console.log('RESPONSE___________CCR', res);

        // if (
        //   res &&
        //   res?.data?.CCRResponse?.Status == 1 &&
        //   res?.status == 200 &&
        //   res?.data?.CCRResponse?.CIRReportDataLst?.length >= 1
        // ) {
        //   const dt = res?.data?.CCRResponse?.CIRReportDataLst;
        //   const indexof = dt.findIndex(item => 'CIRReportData' in item);
        //   const {MicrofinanceAccountsSummary, ScoreDetails} =
        //     dt[indexof].CIRReportData;
        //   console.log('MicrofinanceAccountsSummary', MicrofinanceAccountsSummary);
        //   console.log(
        //     'ccrRules',
        //     ccrRules,
        //     ScoreDetails,
        //     MicrofinanceAccountsSummary?.length,
        //   );
        //   const score = parseInt(ScoreDetails[0]?.Value);
        //   if ('TotalBalanceAmount' in MicrofinanceAccountsSummary) {
        //     const {
        //       NoOfActiveAccounts,
        //       NoOfPastDueAccounts,
        //       RecentAccount,
        //       TotalBalanceAmount,
        //       TotalMonthlyPaymentAmount,
        //       TotalPastDue,
        //       TotalWrittenOffAmount,
        //     } = MicrofinanceAccountsSummary;
        const payload = {
          data: {
            Client_MobileNo: phone,
            Client_AadharNo: aadharNo,
            Client_Name: name,
            Client_Address: address,
            Client_DOB: dob,
            Client_State: state,
            Client_Pincode: pc,
            Client_Relation: relation,
            Client_PAN_No: panNo?.toUpperCase(),
            Client_VoterID: voterId?.toUpperCase(),
            Client_Gender: gender,
            CoApplicant_AadharNo: coApplAadhar,
            CoApplicant_Name: coApplicantName,
            CoApplicant_Address: coAppAddress,
            CoApplicant_DOB: coApplDOB,
            CoApplicant_State: coApplState,
            CoApplicant_Pincode: coAppPincode,
            CoApplicant_MobileNo: coApplMobileNo,
            CoApplicant_PAN_No: coApplPAN?.toUpperCase(),
            CoApplicant_VoterID: coApplVoterid?.toUpperCase(),
            // CreditScore: score,
            OpeningBalance: 0, //AverageOpenBalance,
            // ActiveAccount: NoOfActiveAccounts,
            // PastDue: NoOfPastDueAccounts,
            // Write_OFF: TotalWrittenOffAmount,
            // Monthly_EMI: TotalMonthlyPaymentAmount,
            BranchID: route?.params?.data.branchid,
            CenterID: route?.params?.data.centreid,
            age: calculateAge(dob),
            coAppAge: calculateAge(coApplDOB),
            // Result:
            //   score >= ccrRules?.CreditScore &&
            //   // parseInt(AverageOpenBalance) <=
            //   //   ccrRules?.AverageOpenBalance
            //   //    &&
            //   parseInt(NoOfActiveAccounts) <= ccrRules?.NoOfActiveAccounts &&
            //   parseInt(TotalPastDue) <= ccrRules?.TotalPastDue &&
            //   parseInt(TotalWrittenOffAmount) <= ccrRules?.NoOfWriteOffs &&
            //   parseInt(TotalMonthlyPaymentAmount) ==
            //     ccrRules?.TotalMonthlyPaymentAmt
            //     ? 'SUCCESS'
            //     : 'FAILED',
          },
        };
        console.log(
          'PAYLOAD____________________________________________',
          payload,
        );
        const response = await new UserApi().createEnrollmentHis(payload);
        console.log('response____', response, payload);
        if (response) {
          // CCRReport.current = {
          //   // AverageOpenBalance,
          //   CreditScore: score,

          //   NoOfActiveAccounts,
          //   NoOfPastDueAccounts,
          //   TotalWrittenOffAmount,
          //   TotalBalanceAmount,

          //   TotalMonthlyPaymentAmount,
          // };
          userData.current = {
            name,
            dob,
            address,
            aadharNo,
            panNo,
            voterId,
            maskedAdharNumber,
            phone,
            relation,
            pincode: pc,
            state,
            careOf,
            gender,
            house,
            street,
            landmark,
            po,
            dist,
            subdist,
            vtc,
            state,
            country,
          };
          coAppData.current = {
            coApplicantName,
            coApplDOB,
            coAppAddress,
            coApplAadhar,
            coApplPAN,
            coApplVoterid,
            coApplMaskedAadhar,
            coApplMobileNo,
            coApplState,
            coAppPincode,
            coAppCareOf,
            coAppGender,
            address: coAppAdd,
          };
          productCurrent.current = {
            product,
            category,
            amountApplied,
            loanPurpose,
          };
          enrollmentId.current = response;
          // console.log('CCRReport', CCRReport);
          navigation.navigate(ScreensNameEnum.LAF_GROUP_SCREEN, {
            data: {
              userData: userData.current,
              coAppData: coAppData.current,
              productCurrent: productCurrent.current,
              enrollmentId: response,
            },
          });
          // setCCRVis(true);
          // if (
          //   parseInt(NoOfActiveAccounts) <= ccrRules?.NoOfActiveAccounts &&
          //   parseInt(NoOfWriteOffs) <= ccrRules?.NoOfWriteOffs &&
          //   parseInt(TotalPastDue) <= ccrRules?.TotalPastDue &&
          //   score >= ccrRules?.CreditScore &&
          //   parseInt(NoOfWriteOfxs) == ccrRules?.NoOfWriteOffs &&
          //   // parseInt(TotalPastDue) == ccrRules?.TotalPastDue
          // ) {
        }
        //       }
        //     }
        // }

        // navigation.navigate(ScreensNameEnum.LAF_GROUP_SCREEN);
      }
    } catch (error) {
      console.log('Error Details --->', error);
    }
  };

  const currentDate = new Date();
  const eighteenYearsAgo = new Date(
    currentDate.setFullYear(new Date().getFullYear() - 18),
  );
  const fiftyNineYearsAgo = new Date(
    currentDate.setFullYear(new Date().getFullYear() - 59),
  );
  const verifyPan = async ({type}) => {
    if (type != 'client' && !coBorrAAdharVeriStatus) {
      Alert.alert(null, I18n.t('firstAadhar'));
      return;
    }
    try {
      setLoading(true);
      const myHeaders = new Headers();
      myHeaders.append(
        'Authorization',
        'Basic NDYyOTA0MTU6YjB2Z1BDeGFRcFdqbVZvY2N2VEJ5SE15eEZXRzBFWVU=',
      );
      myHeaders.append('Content-Type', 'application/json');
      const raw = JSON.stringify({
        client_ref_num: 'subh',
        pan: type == 'client' ? panNo?.toUpperCase() : coApplPAN?.toUpperCase(),
        name: type == 'client' ? applicantName : coApplicantName,
        dob:
          type == 'client'
            ? moment(dob, 'DD-MM-YYYY').format('DD/MM/YYYY')
            : moment(coApplDOB, 'DD-MM-YYYY').format('DD/MM/YYYY'),
      });

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      const response = await fetch(
        'https://svc.digitap.ai/validation/kyc/v2/pan_basic',
        requestOptions,
      );
      const result = await response.text();
      const res = JSON.parse(result);
      // console.log('res________', res,raw);
      if (res?.result && res?.result_code != '103') {
        const {dob: dobClient, name} = res?.result;
        if (dobClient != 'Y') {
          Alert.alert('आवेदक के पैन कार्ड का विवरण मेल नहीं खा रहा है');
          setLoading(false);
          return;
        }
        if (name != 'Y') {
          Alert.alert('आवेदक के पैन कार्ड का विवरण मेल नहीं खा रहा है');
          setLoading(false);
          return;
        }
        if (dobClient === 'Y' && name === 'Y') {
          if (type == 'client') {
            setBorrowerDocumentVerified('PAN');
            setVoterId('');
          } else {
            setCoBorrDocVer('PAN');
            setCoAppVoterid('');
          }
        } else {
          // Alert.alert(null, I18n.t('panDetailsMisMatch'));
          Alert.alert('आवेदक के पैन कार्ड का विवरण मेल नहीं खा रहा है');
        }
      }

      if (res?.http_response_code === 200 && res?.result_code == '103') {
        Alert.alert('कृपया वैध पैन नंबर दर्ज करें');
      }
      if (res?.http_response_code === 400) {
        Alert.alert('कृपया वैध पैन नंबर दर्ज करें');
      }
      if (res?.http_response_code === 500) {
        Alert.alert(null, I18n.t('noPan'));
      }
      setLoading(false);
      // console.log({res});
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const verifyVoterId = async ({type}) => {
    try {
      setLoading(true);
      const myHeaders = new Headers();
      myHeaders.append(
        'Authorization',
        'Basic NDYyOTA0MTU6YjB2Z1BDeGFRcFdqbVZvY2N2VEJ5SE15eEZXRzBFWVU=',
      );
      myHeaders.append('Content-Type', 'application/json');
      const raw = JSON.stringify({
        client_ref_num: 'test',
        epic_number: type == 'client' ? voterId : coApplVoterid,
      });
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };
      const response = await fetch(
        'https://svc.digitap.ai/validation/kyc/v1/voter',
        requestOptions,
      );
      const result = await response.text();
      const res = JSON.parse(result);
      console.log('res', res);
      if (res?.result_code == 103) {
        Alert.alert(null, I18n.t('wrongVoterId'));
        setLoading(false);
        return;
      }
      if (
        type == 'client'
          ? careOf
              ?.replace('S/O', '')
              ?.toUpperCase()
              .includes(res?.result?.rln_name?.trim()?.toUpperCase())
          : coBorrAadharData?.careOf
              ?.replace('S/O', '')
              ?.toUpperCase()
              .includes(res?.result?.rln_name?.trim()?.toUpperCase()) &&
            type == 'client'
          ? res?.result?.name?.toUpperCase() == name?.toUpperCase()
          : res?.result?.name?.toUpperCase() ==
            coBorrAadharData?.name?.toUpperCase()
      ) {
        if (type == 'client') {
          setBorrowerDocumentVerified('VoterId');
          setPanno('');
        } else {
          setCoBorrDocVer('VoterId');
          setCoApplPAN('');
        }
      } else {
        Alert.alert(null, I18n.t('voterDetailsMisMatch'));
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleGenerateOtp = async () => {
    try {
      setLoading(true);
      const validateAadhar = () => {
        let valid = true;
        if (!ValidationHelper.isValidAadhar(coApplAadhar)) {
          Toast.show('Please Enter Valid Aadhar No.', Toast.SHORT, Toast.TOP);
          valid = false;
          aadharNoRef.current.focus();
          return valid;
        }
        return valid;
      };
      if (validateAadhar()) {
        const res1 = await new UserApi().sendAadharOtp({
          aadharNo: coApplAadhar,
        });

        // Handle response if `data` is a string
        let res = res1;
        if (typeof res1?.data === 'string') {
          const parsedData = JSON.parse(res1.data);
          res = {...res, data: parsedData};
        }
        if (
          res?.data?.client_adharcard == coApplAadhar ||
          res?.data?.co_borrower_adharcard == coApplAadhar
        ) {
          Alert.alert(null, I18n.t('alreadyCustomer'));
          setLoading(false);
        }
        if (res?.data?.code == 500) {
          Alert.alert(null, I18n.t('msgLimitEnd'));
          setLoading(false);
        }
        if (res?.data?.code == 400) {
          Alert.alert(null, I18n.t('enterValidAAdhar'));
          setLoading(false);
        }
        if (res?.data?.model?.transactionId) {
          // Alert.alert(null, I18n.t('msgSent'));
          Toast.show(I18n.t('msgSent'), Toast.BOTTOM);
          setCoBorrAadharData(res?.data?.model);
          setExtraData(res?.data?.model);
          onModalClose(true);
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert('something went wrong. please try again later');
      setLoading(false);
    }
  };
  function calculateAge(dob) {
    const [day, month, year] = dob.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  }
  const onConfirm = data => {
    if (data) {
      const {
        address: {
          house,
          street,
          landmark,
          po,
          dist,
          subdist,
          vtc,
          pc,
          state,
          country,
        },
        maskedAdharNumber,
        careOf,
        gender,
      } = data;
      const address = `${house} ${street} ${landmark} ${po} ${dist} ${subdist} ${vtc} ${pc} ${state} ${country}`;
      const age = calculateAge(data?.dob); //
      if (age >= 18 && age < 59) {
        setCoBorrAadharData(data);
        onModalClose(false);
        setCoBorrAadharVeriStatus(true);
        setCoApplName(data?.name);
        setCoApplDOB(data?.dob);
        setCoAppAddress(address);
        setCoApplState(state);
        setCoApplPincode(pc);
        setCoApplMashAadhar(maskedAdharNumber);
        setCoApplCareOf(careOf?.split('S/O ')[1]);
        setCoApplGender(gender);
        setCoAppAdd(data?.address);
      } else {
        Alert.alert(
          'सह आवेदक ऋण प्रक्रिया के लिए पात्र नहीं है। आयु 59 वर्ष से कम तथा 18 वर्ष से अधिक होनी चाहिए',
        );
        setCoApplAadhar('');
        onModalClose(false);
      }
    }
  };

  const verifyClientPhone = async ({type}) => {
    try {
      setLoading(true);
      const res = await new UserApi().sendClientOtp({
        phone: type == 'appl' ? phone : coApplMobileNo,
        name: type == 'appl' ? applicantName : coApplicantName,
      });
      console.log('send otp', res);
      if (
        res?.success &&
        !res?.message?.includes('phone number already exist')
      ) {
        Toast.show('OTP sent successfully', Toast.LONG, Toast.TOP);
        if (type != 'appl') {
          setOtpEnabled(true);
          setTrasactionId(res?.data?.transactionId);
        } else {
          setApplOtpEnabled(true);
          setApplTrasactionId(res?.data?.transactionId);
        }
      } else {
        Alert.alert(res?.message);
        // Toast.show(res.message, Toast.LONG, Toast.TOP);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleVerifyOtp = async ({type, otp}) => {
    try {
      if (otp?.length === 4) {
        setLoading(true);
        const data = {
          otp: otp,
          transactionId: type == 'appl' ? applTransactionId : transactionId,
          phone: type == 'appl' ? phone : coApplMobileNo,
        };
        const res = await new AuthApi().verifyMobileOtpClient(data);
        if (res) {
          // const userData = await dispatch(getUserDetails());
          // if (userData?.type?.includes('fulfilled')) {
          Toast.show('OTP verified...', Toast.LONG, Toast.TOP);
          if (type != 'appl') {
            setOtpEnabled(false);
            setCoAppVerifyStatus(true);
          } else {
            setApplOtpEnabled(false);
            setAppVerifyStatus(true);
          }
          // }
        } else {
          Toast.show('Invalid otp', Toast.LONG, Toast.TOP);
        }
        setLoading(false);
      } else {
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // const handleVerifyOtp = async () => {
  //   try {
  //     if (otp?.length === 4) {
  //       setLoading(true);
  //       const data = {
  //         otp: otp,
  //         transactionId: transactionId,
  //         phone: coApplMobileNo,
  //       };
  //       const res = await new AuthenticationApi().verifyMobileOtpClient(data);
  //       if (res) {
  //         Toast.show('OTP verified...', Toast.LONG, Toast.TOP);
  //         setOtpEnabled(false);
  //         setCoAppVerifyStatus(true);
  //       } else {
  //         Toast.show('Invalid otp', Toast.LONG, Toast.TOP);
  //       }
  //       setLoading(false);
  //     } else {
  //       Alert.alert('please enter 4 digit OTP');
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // console.log('coAppAddress?.length', coAppAddress?.length, coAppAddress);
  return (
    <ScreenWrapper header={false} backDisabled>
      <ChildScreensHeader
        screenName={ScreensNameEnum.CHECK_CREDIT_BUREAU_SCREEN}
      />
      <View style={{flex: 1, padding: 10}}>
        <ScrollView keyboardShouldPersistTaps>
          {/* <Text style={styles.tagline}>Check Credit Bureau</Text> */}
          <Card style={styles.card}>
            <Surface style={styles.surface}>
              <Text
                style={[
                  styles.tagline,
                  {textAlign: 'left', fontSize: R.fontSize.M},
                ]}>
                Applicant Information
              </Text>
              <View style={styles.viewInput}>
                <Text style={styles.label}>Applicant Name</Text>
                <TextInput
                  value={applicantName}
                  onChangeText={text => setApplicantName(text)}
                  ref={applicantNameRef}
                  style={[
                    styles.input,
                    {
                      borderColor:
                        focused === 'applicantName'
                          ? R.colors.primary
                          : R.colors.PRIMARI_DARK,
                      borderBottomWidth: focused === 'applicantName' ? 1.5 : 1,
                    },
                  ]}
                  onFocus={() => setFocused('applicantName')}
                  onBlur={() => setFocused(null)}
                  editable={false}
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
                      marginLeft: 10,
                    },
                  ]}>
                  {dob}
                </Text>
              </View>
              <View style={styles.viewInput}>
                <Text style={styles.label}>Address</Text>
                <Text
                  style={[
                    styles.input,
                    {
                      borderBottomWidth: 1,
                      textAlignVertical: 'bottom',
                      color: R.colors.PRIMARI_DARK,
                      marginLeft: 10,
                      // minHeight: 80,
                      // maxHeight: 150,
                      flexWrap: 'wrap',
                      overflow: 'scroll',
                    },
                  ]}>
                  {address?.trim()}
                  {/* {!address?.length >= 80
                    ? address?.trim()
                    : address?.trim().substring(0, 80) + '...'} */}
                </Text>
              </View>
              <View style={styles.viewInput}>
                <Text style={styles.label}>State</Text>
                <Text
                  style={[
                    styles.input,
                    {
                      borderBottomWidth: 1,
                      textAlignVertical: 'bottom',
                      color: R.colors.PRIMARI_DARK,
                      marginLeft: 10,
                    },
                  ]}
                  // onPress={() => setOpen(!open)}
                >
                  {state}
                </Text>
              </View>
              <View style={styles.viewInput}>
                <Text style={styles.label}>Pin Code</Text>
                <Text
                  style={[
                    styles.input,
                    {
                      borderBottomWidth: 1,
                      textAlignVertical: 'bottom',
                      color: R.colors.PRIMARI_DARK,
                      marginLeft: 10,
                    },
                  ]}>
                  {pc}
                </Text>
              </View>
              <View style={styles.viewInput}>
                <Text style={styles.label}>Relation With Co-Borrower</Text>
                <Picker
                  selectedValue={relation}
                  onValueChange={(itemValue, itemIndex) =>
                    setRelation(itemValue)
                  }
                  mode="dropdown"
                  dropdownIconColor={R.colors.primary}
                  style={styles.input}>
                  {relation === null && (
                    <Picker.Item label="Select Relation" value={null} />
                  )}
                  <Picker.Item label="Husband" value="Husband" />
                  <Picker.Item label="Wife" value="Wife" />
                  <Picker.Item label="Father-in-law" value="Father_in_law" />
                  <Picker.Item label="Father" value="Father" />
                  <Picker.Item label="Son" value="Son" />
                  <Picker.Item label="Mother" value="Mother" />
                  <Picker.Item label="Mother-in-law" value="Mother_in_law" />
                  {/* <Picker.Item label="Brother" value="Brother" />
                  <Picker.Item label="Sister" value="Sister" />
                  <Picker.Item label="Daughter" value="Daughter" />
                  <Picker.Item label="Brother-in-law" value="Brother_in_law" />
                  <Picker.Item label="Other" value="other" /> */}
                </Picker>
              </View>
              {/* <View style={styles.viewInput}>
              <Text style={styles.label}>Relation Name</Text>
              <TextInput
                value={relationName}
                onChangeText={setRelationName}
                ref={relationNameRef}
                style={[
                  styles.input,
                  {
                    borderColor:
                      focused === 'relationName'
                        ? R.colors.primary
                        : R.colors.PRIMARI_DARK,
                    borderBottomWidth: focused === 'relationName' ? 1.5 : 1,
                  },
                ]}
                onFocus={() => setFocused('relationName')}
                onBlur={() => setFocused(null)}
              />
            </View> */}

              <View style={styles.viewInput}>
                <Text style={styles.label}>Mobile No</Text>
                {applOtpEnabled ? (
                  <TextInput
                    value={applOtp}
                    onChangeText={setApplOtp}
                    keyboardType="decimal-pad"
                    placeholder="Plese enter 4 digit OTP..."
                    placeholderTextColor={R.colors.SLATE_GRAY}
                    maxLength={4}
                    style={[
                      styles.input,
                      {
                        borderColor:
                          focused === 'otp'
                            ? R.colors.primary
                            : R.colors.PRIMARI_DARK,
                        borderBottomWidth: focused === 'otp' ? 1.5 : 1,
                      },
                    ]}
                    onFocus={() => setFocused('otp')}
                    onBlur={() => setFocused(null)}
                  />
                ) : (
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    ref={phoneRef}
                    keyboardType="decimal-pad"
                    maxLength={10}
                    style={[
                      styles.input,
                      {
                        borderColor:
                          focused === 'phone'
                            ? R.colors.primary
                            : R.colors.PRIMARI_DARK,
                        borderBottomWidth: focused === 'phone' ? 1.5 : 1,
                      },
                    ]}
                    onFocus={() => setFocused('phone')}
                    onBlur={() => setFocused(null)}
                    // editable={false}
                  />
                )}
                {applMobileVerifyStatus && (
                  <>
                    <Icon
                      name={'check-decagram'}
                      size={25}
                      color={R.colors.GREEN}
                      style={{position: 'absolute', right: 10}}
                    />
                    <Icon
                      name={'pencil-outline'}
                      size={25}
                      color={R.colors.BLUE}
                      style={{position: 'absolute', right: 50}}
                      onPress={() => {
                        setAppVerifyStatus(false);
                        setOtp('');
                      }}
                    />
                  </>
                )}
                {phone?.length === 10 && !applMobileVerifyStatus && (
                  <Text
                    onPress={() =>
                      applOtpEnabled
                        ? handleVerifyOtp({type: 'appl', otp: applOtp})
                        : verifyClientPhone({type: 'appl'})
                    }
                    style={{
                      padding: 3,
                      paddingHorizontal: 10,
                      backgroundColor:
                        coBorrDocVer == 'PAN' ? R.colors.GREEN : R.colors.RED,
                      color: R.colors.PRIMARY_LIGHT,
                      fontWeight: '900',
                      borderRadius: 4,
                      textAlignVertical: 'center',
                      height: 30,
                      alignSelf: 'center',
                    }}>
                    {applOtpEnabled ? 'Verify' : 'continue'}
                  </Text>
                )}
              </View>
              <View style={styles.viewInput}>
                <Text style={styles.label}>Aadhar No.</Text>
                <TextInput
                  value={aadharNo}
                  onChangeText={setAadharNo}
                  maxLength={12}
                  ref={aadharNoRef}
                  keyboardType="decimal-pad"
                  style={[
                    styles.input,
                    {
                      borderColor:
                        focused === 'aadharNo'
                          ? R.colors.primary
                          : R.colors.PRIMARI_DARK,
                      borderBottomWidth: focused === 'aadharNo' ? 1.5 : 1,
                    },
                  ]}
                  onFocus={() => setFocused('aadharNo')}
                  onBlur={() => setFocused(null)}
                  editable={false}
                />
                <Icon
                  name={'check-decagram'}
                  size={25}
                  color={R.colors.GREEN}
                  style={{position: 'absolute', right: 20, top: 10}}
                />
              </View>
              <View style={styles.viewInput}>
                <Text style={styles.label}>PAN Card No.</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 45,
                    flex: 2.5,
                  }}>
                  <TextInput
                    value={panNo?.toUpperCase()}
                    onChangeText={setPanno}
                    maxLength={10}
                    ref={panNoRef}
                    style={[
                      styles.input,
                      {
                        borderColor:
                          focused === 'panNo'
                            ? R.colors.primary
                            : R.colors.PRIMARI_DARK,
                        borderBottomWidth: focused === 'panNo' ? 1.5 : 1,
                      },
                    ]}
                    onFocus={() => setFocused('panNo')}
                    onBlur={() => setFocused(null)}
                    editable={
                      borrrowerDocumentVerified == 'PAN' ||
                      borrrowerDocumentVerified == 'VoterId'
                        ? false
                        : true
                    }
                  />
                  {panNo?.length === 10 && borrrowerDocumentVerified == '' && (
                    <Text
                      onPress={() => verifyPan({type: 'client'})}
                      style={{
                        padding: 3,
                        paddingHorizontal: 10,
                        backgroundColor:
                          borrrowerDocumentVerified == 'PAN'
                            ? R.colors.GREEN
                            : R.colors.RED,
                        color: R.colors.PRIMARY_LIGHT,
                        fontWeight: '900',
                        borderRadius: 4,
                      }}>
                      {borrrowerDocumentVerified == 'PAN'
                        ? 'Verified'
                        : 'Verify'}
                    </Text>
                  )}
                  {borrrowerDocumentVerified === 'PAN' && (
                    <Icon
                      name={'check-decagram'}
                      size={25}
                      color={R.colors.GREEN}
                      style={{position: 'absolute', right: 10}}
                    />
                  )}
                </View>
              </View>

              <View style={styles.viewInput}>
                <Text style={styles.label}>Voter Id No.</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 45,
                    flex: 2.5,
                  }}>
                  <TextInput
                    value={voterId}
                    onChangeText={text => {
                      setVoterId(text.toUpperCase());
                    }}
                    maxLength={10}
                    ref={voterIdRef}
                    style={[
                      styles.input,
                      {
                        borderColor:
                          focused === 'voterId'
                            ? R.colors.primary
                            : R.colors.PRIMARI_DARK,
                        borderBottomWidth: focused === 'voterId' ? 1.5 : 1,
                      },
                    ]}
                    onFocus={() => setFocused('voterId')}
                    onBlur={() => setFocused(null)}
                    editable={
                      borrrowerDocumentVerified == 'VoterId' ||
                      borrrowerDocumentVerified == 'PAN'
                        ? false
                        : true
                    }
                  />
                  {voterId?.length === 10 &&
                    borrrowerDocumentVerified !== 'VoterId' && (
                      <Text
                        onPress={() => {
                          verifyVoterId({type: 'client'});
                        }}
                        style={{
                          padding: 3,
                          paddingHorizontal: 10,
                          backgroundColor:
                            borrrowerDocumentVerified == 'VoterId'
                              ? R.colors.GREEN
                              : R.colors.RED,
                          color: R.colors.PRIMARY_LIGHT,
                          fontWeight: '900',
                          borderRadius: 4,
                        }}>
                        Verify
                      </Text>
                    )}
                  {borrrowerDocumentVerified === 'VoterId' && (
                    <Icon
                      name={'check-decagram'}
                      size={25}
                      color={R.colors.GREEN}
                      style={{position: 'absolute', right: 10}}
                    />
                  )}
                </View>
              </View>
            </Surface>
          </Card>
          <Card style={styles.card}>
            <Surface style={styles.surface}>
              <Text
                style={[
                  styles.tagline,
                  {textAlign: 'left', fontSize: R.fontSize.M},
                ]}>
                Co-Applicant Information
              </Text>
              <View style={styles.viewInput}>
                <Text style={styles.label}>Co-Appl Aadhar No.</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 45,
                    flex: 2.5,
                  }}>
                  <TextInput
                    value={coApplAadhar}
                    onChangeText={setCoApplAadhar}
                    keyboardType="decimal-pad"
                    maxLength={12}
                    ref={coApplAadharRef}
                    style={[
                      styles.input,
                      {
                        borderColor:
                          focused === 'coApplAadhar'
                            ? R.colors.primary
                            : R.colors.PRIMARI_DARK,
                        borderBottomWidth: focused === 'coApplAadhar' ? 1.5 : 1,
                      },
                    ]}
                    onFocus={() => setFocused('coApplAadhar')}
                    onBlur={() => setFocused(null)}
                    editable={!coBorrAAdharVeriStatus}
                  />
                  {coApplAadhar?.length === 12 && !coBorrAAdharVeriStatus && (
                    <Text
                      onPress={() => handleGenerateOtp()}
                      style={{
                        padding: 3,
                        paddingHorizontal: 10,
                        backgroundColor: coBorrAAdharVeriStatus
                          ? R.colors.GREEN
                          : R.colors.RED,
                        color: R.colors.PRIMARY_LIGHT,
                        fontWeight: '900',
                        borderRadius: 4,
                      }}>
                      {coBorrAAdharVeriStatus ? 'Verified' : 'Verify'}
                    </Text>
                  )}
                  {coBorrAAdharVeriStatus && (
                    <Icon
                      name={'check-decagram'}
                      size={25}
                      color={R.colors.GREEN}
                      style={{position: 'absolute', right: 10}}
                    />
                  )}
                </View>
              </View>
              <View style={styles.viewInput}>
                <Text style={styles.label}>Co-Appl Name</Text>
                <TextInput
                  value={coApplicantName}
                  onChangeText={setCoApplName}
                  ref={coApplicantNameRef}
                  style={[
                    styles.input,
                    {
                      borderColor:
                        focused === 'coApplicantName'
                          ? R.colors.primary
                          : R.colors.PRIMARI_DARK,
                      borderBottomWidth:
                        focused === 'coApplicantName' ? 1.5 : 1,
                    },
                  ]}
                  onFocus={() => setFocused('coApplicantName')}
                  onBlur={() => setFocused(null)}
                  editable={false}
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
                      marginLeft: 10,
                    },
                  ]}>
                  {coApplDOB}
                </Text>
              </View>
              <View style={styles.viewInput}>
                <Text style={styles.label}>Co-Appl Address</Text>
                <Text
                  style={[
                    styles.input,
                    {
                      borderBottomWidth: 1,
                      textAlignVertical: 'bottom',
                      color: R.colors.PRIMARI_DARK,
                      marginLeft: 10,
                      minHeight: 80,
                      maxHeight: 110,
                    },
                  ]}>
                  {coAppAddress?.trim()}
                  {/* {coAppAddress?.length >= 80
                    ? coAppAddress?.trim().substring(0, 80) + '...'
                    : coAppAddress?.trim()} */}
                </Text>
              </View>
              <View style={styles.viewInput}>
                <Text style={styles.label}>Co-Appl State</Text>
                <Text
                  style={[
                    styles.input,
                    {
                      borderBottomWidth: 1,
                      textAlignVertical: 'bottom',
                      color: R.colors.PRIMARI_DARK,
                      marginLeft: 10,
                    },
                  ]}>
                  {coApplState}
                </Text>
              </View>
              <View style={styles.viewInput}>
                <Text style={styles.label}>Pin Code</Text>
                <TextInput
                  value={coAppPincode}
                  onChangeText={setCoApplPincode}
                  keyboardType="decimal-pad"
                  ref={coAppPincodeRef}
                  maxLength={6}
                  style={[
                    styles.input,
                    {
                      borderColor:
                        focused === 'coAppPincode'
                          ? R.colors.primary
                          : R.colors.PRIMARI_DARK,
                      borderBottomWidth: focused === 'coAppPincode' ? 1.5 : 1,
                    },
                  ]}
                  onFocus={() => setFocused('coAppPincode')}
                  onBlur={() => setFocused(null)}
                />
              </View>
              {/* <View style={[styles.viewInput, {alignItems: 'center'}]}>
                <Text style={styles.label}> Co-Appl Relation</Text>
                <Picker
                  selectedValue={coApplRelation}
                  onValueChange={(itemValue, itemIndex) =>
                    setCoApplRelation(itemValue)
                  }
                  mode="dropdown"
                  dropdownIconColor={R.colors.primary}
                  style={[
                    styles.input,
                    {
                      borderColor: R.colors.PRIMARI_DARK,
                    },
                  ]}
                  onFocus={() => setFocused('coApplRelation')}
                  onBlur={() => setFocused(null)}>
                  {coApplRelation === null && (
                    <Picker.Item label="Select Relation" value={null} />
                  )}
                  <Picker.Item label="Husband" value="Husband" />
                  <Picker.Item label="Wife" value="Wife" />
                  <Picker.Item label="Father" value="Father" />
                  <Picker.Item label="Mother" value="Mother" />
                  <Picker.Item label="Son" value="Son" />
                  <Picker.Item label="Daughter" value="Daughter" />
                  <Picker.Item label="Father-in-law" value="  Father-in-law" />
                  <Picker.Item label="Mother-in-law" value="Mother-in-law" />
                  <Picker.Item label="Brother-in-law" value="Brother-in-law" />
                </Picker>
              </View> */}
              {/* <View style={styles.viewInput}>
                <Text style={styles.label}>Relation Name</Text>
                <TextInput
                  value={coApplRelationName}
                  onChangeText={setCoAppliRelationName}
                  ref={coApplRelationNameRef}
                  style={[
                    styles.input,
                    {
                      borderColor:
                        focused === 'coApplRelationName'
                          ? R.colors.primary
                          : R.colors.PRIMARI_DARK,
                      borderBottomWidth:
                        focused === 'coApplRelationName' ? 1.5 : 1,
                    },
                  ]}
                  onFocus={() => setFocused('coApplRelationName')}
                  onBlur={() => setFocused(null)}
                  // editable={false}
                />
              </View> */}

              <View style={styles.viewInput}>
                <Text style={styles.label}>Mobile No</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 45,
                    flex: 2.5,
                  }}>
                  {otpEnabled ? (
                    <TextInput
                      value={otp}
                      onChangeText={setOtp}
                      keyboardType="decimal-pad"
                      placeholder="Plese enter 4 digit OTP..."
                      placeholderTextColor={R.colors.SLATE_GRAY}
                      maxLength={4}
                      style={[
                        styles.input,
                        {
                          borderColor:
                            focused === 'otp'
                              ? R.colors.primary
                              : R.colors.PRIMARI_DARK,
                          borderBottomWidth: focused === 'otp' ? 1.5 : 1,
                        },
                      ]}
                      onFocus={() => setFocused('otp')}
                      onBlur={() => setFocused(null)}
                    />
                  ) : (
                    <TextInput
                      value={coApplMobileNo}
                      onChangeText={setCoAppMobileNo}
                      keyboardType="decimal-pad"
                      maxLength={10}
                      ref={coApplMobileNoRef}
                      style={[
                        styles.input,
                        {
                          borderColor:
                            focused === 'coApplMobileNo'
                              ? R.colors.primary
                              : R.colors.PRIMARI_DARK,
                          borderBottomWidth:
                            focused === 'coApplMobileNo' ? 1.5 : 1,
                        },
                      ]}
                      onFocus={() => setFocused('coApplMobileNo')}
                      onBlur={() => setFocused(null)}
                      editable={!coApplMobileVerifyStatus}
                    />
                  )}
                  {coApplMobileNo?.length === 10 &&
                    !coApplMobileVerifyStatus && (
                      <Text
                        onPress={() =>
                          otpEnabled
                            ? handleVerifyOtp({type: 'coAppl', otp})
                            : verifyClientPhone({type: 'coAppl'})
                        }
                        style={{
                          padding: 3,
                          paddingHorizontal: 10,
                          backgroundColor:
                            coBorrDocVer == 'PAN'
                              ? R.colors.GREEN
                              : R.colors.RED,
                          color: R.colors.PRIMARY_LIGHT,
                          fontWeight: '900',
                          borderRadius: 4,
                        }}>
                        {otpEnabled ? 'Verify' : 'continue'}
                      </Text>
                    )}
                  {coApplMobileVerifyStatus && (
                    <>
                      <Icon
                        name={'check-decagram'}
                        size={25}
                        color={R.colors.GREEN}
                        style={{position: 'absolute', right: 10}}
                      />
                      <Icon
                        name={'pencil-outline'}
                        size={25}
                        color={R.colors.BLUE}
                        style={{position: 'absolute', right: 50}}
                        onPress={() => {
                          setCoAppVerifyStatus(false);
                          setOtp('');
                        }}
                      />
                    </>
                  )}
                </View>
              </View>

              <View style={styles.viewInput}>
                <Text style={styles.label}>PAN Card No.</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 45,
                    flex: 2.5,
                  }}>
                  <TextInput
                    value={coApplPAN?.toUpperCase()}
                    onChangeText={text => setCoApplPAN(text.toUpperCase())}
                    maxLength={10}
                    ref={coApplPANRef}
                    style={[
                      styles.input,
                      {
                        borderColor:
                          focused === 'coApplPAN'
                            ? R.colors.primary
                            : R.colors.PRIMARI_DARK,
                        borderBottomWidth: focused === 'coApplPAN' ? 1.5 : 1,
                      },
                    ]}
                    onFocus={() => setFocused('coApplPAN')}
                    onBlur={() => setFocused(null)}
                    editable={coBorrDocVer == '' ? true : false}
                  />
                  {coApplPAN?.length === 10 && coBorrDocVer == '' && (
                    <Text
                      onPress={() => verifyPan({type: 'co-borrower'})}
                      style={{
                        padding: 3,
                        paddingHorizontal: 10,
                        backgroundColor:
                          coBorrDocVer == 'PAN' ? R.colors.GREEN : R.colors.RED,
                        color: R.colors.PRIMARY_LIGHT,
                        fontWeight: '900',
                        borderRadius: 4,
                      }}>
                      {coBorrDocVer == 'PAN' ? 'Verified' : 'Verify'}
                    </Text>
                  )}
                  {coBorrDocVer === 'PAN' && (
                    <Icon
                      name={'check-decagram'}
                      size={25}
                      color={R.colors.GREEN}
                      style={{position: 'absolute', right: 10}}
                    />
                  )}
                </View>
              </View>

              <View style={styles.viewInput}>
                <Text style={styles.label}>Voter Id No.</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 45,
                    flex: 2.5,
                  }}>
                  <TextInput
                    value={coApplVoterid?.toUpperCase()}
                    onChangeText={setCoAppVoterid}
                    maxLength={10}
                    ref={coApplVoteridRef}
                    style={[
                      styles.input,
                      {
                        borderColor:
                          focused === 'coApplVoterid'
                            ? R.colors.primary
                            : R.colors.PRIMARI_DARK,
                        borderBottomWidth:
                          focused === 'coApplVoterid' ? 1.5 : 1,
                      },
                    ]}
                    onFocus={() => setFocused('coApplVoterid')}
                    onBlur={() => setFocused(null)}
                    editable={coBorrDocVer == '' ? true : false}
                  />
                  {coApplVoterid?.length === 10 && coBorrDocVer == '' && (
                    <Text
                      onPress={() => verifyVoterId({type: 'co-borrower'})}
                      style={{
                        padding: 3,
                        paddingHorizontal: 10,
                        backgroundColor:
                          coBorrDocVer == 'VoterId'
                            ? R.colors.GREEN
                            : R.colors.RED,
                        color: R.colors.PRIMARY_LIGHT,
                        fontWeight: '900',
                        borderRadius: 4,
                      }}>
                      {coBorrDocVer == 'VoterId' ? 'Verified' : 'Verify'}
                    </Text>
                  )}
                  {coBorrDocVer === 'VoterId' && (
                    <Icon
                      name={'check-decagram'}
                      size={25}
                      color={R.colors.GREEN}
                      style={{position: 'absolute', right: 10}}
                    />
                  )}
                </View>
              </View>
            </Surface>
          </Card>
          <Card style={styles.card}>
            <Surface style={styles.surface}>
              <Text
                style={[
                  styles.tagline,
                  {textAlign: 'left', fontSize: R.fontSize.M},
                ]}>
                Loan Information
              </Text>
              <View style={styles.fieldContainer}>
                <Text style={styles.labelNew(isDarkMode)}>Product</Text>
                <Picker
                  selectedValue={product}
                  style={styles.inputNew(isDarkMode)}
                  dropdownIconColor={R.colors.primary}
                  onValueChange={itemValue => {
                    console.log('itemValue', itemValue);
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
              {/* Loan Purpose */}
              <View style={styles.fieldContainer}>
                <Text style={styles.labelNew(isDarkMode)}>Loan Category</Text>
                <Picker
                  selectedValue={category}
                  style={styles.inputNew(isDarkMode)}
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
              <View style={styles.fieldContainer}>
                <Text style={styles.labelNew(isDarkMode)}>Loan Purpose</Text>
                <Picker
                  selectedValue={loanPurpose}
                  style={styles.inputNew(isDarkMode)}
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
              {/* Amount Applied */}
              <View style={styles.fieldContainer}>
                <Text style={styles.labelNew(isDarkMode)}>Amount Applied</Text>
                <Picker
                  selectedValue={amountApplied}
                  style={styles.inputNew(isDarkMode)}
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
                        label={item?.financeamount?.toString()}
                        value={item?.financeamount?.toString()}
                        key={index}
                      />
                    ))}
                  {/* Add other amounts */}
                </Picker>
              </View>
            </Surface>
          </Card>

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
              onPress={handleConfirm}
              // onPress={() =>
              //   navigation.navigate(ScreensNameEnum.LAF_GROUP_SCREEN)
              // }
            />
          </View>
        </ScrollView>
      </View>

      {isVisible && (
        <VerifyOTPModal
          isVisible={isVisible}
          onModalClose={onModalClose}
          aadharNo={coApplAadhar}
          onConfirm={onConfirm}
          // clientId={clientId}
          resendCode={handleGenerateOtp}
          extraData={extraData}
        />
      )}
      {ccrVis && (
        <CCRReportModal
          isVisible={ccrVis}
          onClose={setCCRVis}
          data1={ccrRules}
          data2={CCRReport.current}
          userData={userData.current}
          coAppData={coAppData.current}
          productCurrent={productCurrent.current}
          enrollmentId={enrollmentId.current}
        />
      )}
      <Loader loading={loading} message={'please wait...'} />
    </ScreenWrapper>
  );
};

export default CheckCreditBureau;

const styles = StyleSheet.create({
  tagline: {
    textAlign: 'center',
    fontSize: R.fontSize.XL,
    fontWeight: '600',
    padding: 10,
    textDecorationLine: 'underline',
    color: R.colors.primary,
  },
  viewInput: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'flex-end',
    marginVertical: 5,
  },
  label: {
    color: R.colors.PRIMARI_DARK,
    flex: 1.5,
    alignItems: 'center',
    fontWeight: '400',
    fontSize: 16,
    textAlignVertical: 'center',
    height: '100%',
  },
  input: {
    borderBottomWidth: 1,
    flex: 2.5,
    color: R.colors.PRIMARI_DARK,
    textAlignVertical: 'bottom',
    fontSize: 16,
    fontWeight: '500',
  },
  card: {
    borderRadius: 12,
    marginBottom: 20,
    //   backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  surface: {
    padding: 20,
    elevation: 4,
    borderRadius: 12,
    //   backgroundColor: colorScheme === 'dark' ? '#444' : '#fff',
  },
  fieldContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: R.colors.LIGHTGRAY,
  },
  labelNew: isDarkMode => ({
    color: isDarkMode ? R.colors.PRIMARI_DARK : R.colors.PRIMARI_DARK,
    marginBottom: 5,
    // borderWidth:0
  }),
  inputNew: (isDarkMode, isDisabled = false) => ({
    borderColor: R.colors.inputBorder,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    color: isDarkMode ? R.colors.PRIMARI_DARK : R.colors.PRIMARI_DARK,
    backgroundColor: isDisabled
      ? R.colors.disabledBackground
      : R.colors.inputBackground,
  }),
});
