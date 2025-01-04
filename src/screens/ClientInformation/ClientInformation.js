// import React, {useEffect, useState, useCallback, useRef} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ScrollView,
//   FlatList,
//   Animated,
// } from 'react-native';
// import moment from 'moment';
// import RNHTMLtoPDF from 'react-native-html-to-pdf';
// import Share from 'react-native-share';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import CircularProgress from '../../components/CircularProgress';
// import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
// import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
// import R from '../../resources/R';

// const ClientInformation = () => {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState({
//     LoanID: '299427',
//     Borrower_Name: 'Akashdeep Singh Dhillon',
//     Co_Borrower_Name: 'Baljit Kaur',
//     LoanAmount: '110000',
//     Paid: '30000',
//     Tenor: '18',
//     COMPLETE: '10',
//     UpcomingEMI: '3400',
//     CurrentDue: '10200',
//     Branch_Name: 'Raikot',
//     Center_Name: 'Ludhiana West',
//   });
//   const [paymentHistory, setPaymentHistory] = useState([
//     {
//       InstNo: 1,
//       Due_Date: '2022-11-01',
//       Collection_Date: '2022-11-02',
//       EMI: '3400',
//       Coll_Amt: '3400',
//     },
//     {
//       InstNo: 2,
//       Due_Date: '2022-12-01',
//       Collection_Date: '2022-12-02',
//       EMI: '3400',
//       Coll_Amt: '3400',
//     },
//     {
//       InstNo: 3,
//       Due_Date: '2023-01-01',
//       Collection_Date: '2023-01-02',
//       EMI: '3400',
//       Coll_Amt: '3400',
//     },
//   ]);
//   const [hisVis, setPayhisVis] = useState(false);
//   const [expandAnim] = useState(new Animated.Value(0));
//   const flatListRef = useRef(null);

//   const percentage = useCallback(() => {
//     return data?.LoanAmount && data?.Paid
//       ? (parseInt(data?.Paid) / parseInt(data?.LoanAmount)) * 100
//       : 0;
//   }, [data?.LoanAmount, data?.Paid]);

//   const percentageTenure = useCallback(() => {
//     return data?.Tenor && data?.COMPLETE
//       ? (parseInt(data?.COMPLETE) / parseInt(data?.Tenor)) * 100
//       : 0;
//   }, [data?.Tenor, data?.COMPLETE]);

//   useEffect(() => {
//     Animated.timing(expandAnim, {
//       toValue: hisVis ? 1 : 0,
//       duration: 400,
//       useNativeDriver: true,
//     }).start();
//   }, [hisVis]);

//   const scaleY = expandAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 1],
//   });

//   const generatePDF = async () => {
//     const passbookContent = `
//       <html>
//         <head>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               margin: 20px;
//               color: #000;
//             }
//             h3, p {
//               margin: 5px 0;
//             }
//             table {
//               width: 100%;
//               border-collapse: collapse;
//               margin-top: 10px;
//             }
//             th, td {
//               border: 1px solid #000;
//               padding: 5px;
//               text-align: center;
//             }
//             th {
//               background-color: #f2f2f2;
//             }
//             .header {
//               margin-bottom: 20px;
//             }
//             .header th, .header td {
//               border: none;
//             }
//             .footer {
//               text-align: center;
//               margin-top: 20px;
//             }
//           </style>
//         </head>
//         <body>
//           <!-- Header -->
//           <table class="header">
//             <tr>
//               <th>
//                 <h3>PASSBOOK</h3>
//               </th>
//               <th>
//                 <h3>Subhlakshmi</h3>
//               </th>
//               <td>
//                 <p><b>Subhlakshmi Finance Private Limited</b></p>
//                 <p>Unit No. 904A & 904B, 9th Floor, Tower-C Unitech Cyber Park,</p>
//                 <p>Sector-39, Gurugram 122003 (Haryana)</p>
//                 <p>Email: info@subhlakshmi.in</p>
//               </td>
//             </tr>
//           </table>

//           <!-- Borrower and Loan Details -->
//           <table>
//             <tr>
//               <td rowspan="5"></td>
//               <td>Borrower: RINKU<br>Co Borrower: KAVITA DEVI</td>
//               <td>Sanction Date: 16/10/2016<br>Disb Date: 17/10/2016</td>
//               <td colspan="2">In case of complaint/suggestion you may call Helpline<br>(Tel no. 0124-4233318) Toll Free No:-18008913318</td>
//             </tr>
//             <tr>
//               <td>Customer ID: 1<br>Loan ID: 1</td>
//               <td>Loan Amount (Rs): 50,000/-<br>Processing fees (Rs.):590.00/-<br>ROI: 29.54% (Reducing)</td>
//               <td colspan="2">Branch: KARNAL<br>Center No.: 502.00</td>
//             </tr>
//             <tr>
//               <td>Insurance (Rs.): 0.00/-<br>HospiCash (Rs.): 0.00/-</td>
//               <td>GPA (Rs): 0.00/-<br>GST on GPA (Rs.): 0.00/-</td>
//               <td colspan="2">Collection Address: UCHANA P.O<br>KARAN LAKE, UCHANA (60)</td>
//             </tr>
//             <tr>
//               <td>Address: 103, KALWA HERI, KARNAL</td>
//               <td>Client confirms that his/her yearly household income is above Rs. 3,00,000/-<br>Purpose of Loan: Dairy and Livestock</td>
//               <td colspan="2">Ceriter Meeting: 10:30 AM - Monday<br>No. of Installments: 36</td>
//             </tr>
//             <tr>
//               <td colspan="3">In case of death of borrower or Co-borrower outstanding amount shall be settled/recovered as per Insurance Policy</td>
//             </tr>
//           </table>

//           <!-- Installment Details -->
//           <h3>Installment Details</h3>
//           <table>
//             <thead>
//               <tr>
//                 <th>Inst No.</th>
//                 <th>Meeting Day</th>
//                 <th>Opening Principal</th>
//                 <th>Inst Amt.</th>
//                 <th>Interest</th>
//                 <th>Principal</th>
//                 <th>B.O.P</th>
//                 <th>Fore Close</th>
//                 <th>Amt Recd</th>
//                 <th>Amt Recd On</th>
//                 <th>(P/A)</th>
//                 <th>Signature</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>1</td>
//                 <td>01/11/2016</td>
//                 <td>50,000</td>
//                 <td>1,700</td>
//                 <td>568</td>
//                 <td>1,132</td>
//                 <td>48,868</td>
//                 <td>52,500</td>
//                 <td>1,700</td>
//                 <td>02/11/2016</td>
//                 <td></td>
//                 <td>Praveen Sharma</td>
//               </tr>
//               <!-- Additional rows can be added here -->
//             </tbody>
//           </table>

//           <!-- Footer -->
//           <div class="footer">
//             <div style="display: flex; justify-content: space-between;">
//               <div>Signature of Borrower</div>
//               <div>Signature of F.L.O</div>
//               <div>Signature of BDM</div>
//             </div>
//           </div>

//           <!-- Loan Utilization Check -->
//           <table>
//             <tr>
//               <td colspan="4" style="text-align: center;">Loan Utilization Check</td>
//             </tr>
//             <tr>
//               <td>Utilization Level:</td>
//               <td>Satisfactory:</td>
//               <td>Average:</td>
//               <td>Unsatisfactory:</td>
//             </tr>
//             <tr>
//               <td>LUC Date:</td>
//               <td>LUC Done By:</td>
//               <td>Client Sign:</td>
//               <td>Staff Sign:</td>
//             </tr>
//           </table>
//         </body>
//       </html>
//     `;

//     try {
//       const options = {
//         html: passbookContent,
//         fileName: `passbook_1`,
//         directory: 'Documents',
//       };
//       const file = await RNHTMLtoPDF.convert(options);

//       Alert.alert('Success', 'Passbook PDF has been generated');
//       Share.open({
//         title: 'Share Passbook',
//         url: `file://${file.filePath}`,
//         type: 'application/pdf',
//       });
//     } catch (error) {
//       Alert.alert('Error', 'Could not generate the PDF');
//       console.error('PDF Generation Error', error);
//     }
//   };

//   const handleExpand = () => {
//     setPayhisVis(prevVis => !prevVis);
//     if (!hisVis) {
//       setTimeout(() => {
//         flatListRef.current?.scrollToOffset({offset: 0, animated: true});
//       }, 400);
//     }
//   };

//   const renderItem = ({item}) => (
//     <View style={styles.paymentRow}>
//       <Text style={styles.listText}>{item.InstNo}</Text>
//       <Text style={styles.listText}>
//         {moment(item.Due_Date).format('DD/MM/YYYY')}
//       </Text>
//       <Text style={styles.listText}>
//         {moment(item.Collection_Date).format('DD/MM/YYYY')}
//       </Text>
//       <Text style={styles.listText}>{item.EMI}</Text>
//       <Text style={styles.listText}>{item.Coll_Amt}</Text>
//     </View>
//   );

//   return (
//     <ScreenWrapper header={false}>
//       <ChildScreensHeader screenName="Loan Details" />
//       <ScrollView>
//         <View style={styles.detailsRow}>
//           <Text>Borrower Name: {data?.Borrower_Name}</Text>
//           <Text>Loan Amount: ₹{data?.LoanAmount}</Text>
//         </View>
//         <View style={styles.statsContainer}>
//           <CircularProgress percentage={percentage()} textColor="#000" />
//           <CircularProgress percentage={percentageTenure()} textColor="#000" />
//         </View>
//         <TouchableOpacity style={styles.downloadButton} onPress={generatePDF}>
//           <Icon name="download" size={20} color="#fff" />
//           <Text style={styles.downloadButtonText}>Download Passbook</Text>
//         </TouchableOpacity>
//         {hisVis && (
//           <Animated.View
//             style={[styles.historyContainer, {transform: [{scaleY}]}]}>
//             <FlatList
//               data={paymentHistory}
//               renderItem={renderItem}
//               keyExtractor={item => item.InstNo.toString()}
//             />
//           </Animated.View>
//         )}
//         <TouchableOpacity onPress={handleExpand}>
//           <Text>Toggle Payment History</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </ScreenWrapper>
//   );
// };

// const styles = StyleSheet.create({
//   detailsRow: {padding: 10, backgroundColor: '#f0f0f0'},
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     padding: 20,
//   },
//   downloadButton: {
//     flexDirection: 'row',
//     padding: 10,
//     backgroundColor: '#007bff',
//     alignItems: 'center',
//   },
//   downloadButtonText: {color: '#fff', marginLeft: 5},
//   paymentRow: {
//     flexDirection: 'row',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//   },
//   listText: {flex: 1, textAlign: 'center'},
//   historyContainer: {overflow: 'hidden'},
// });

// export default ClientInformation;

import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  FlatList,
} from 'react-native';
import UserApi from '../../datalib/services/user.api';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import {ScreenWidth} from 'react-native-elements/dist/helpers';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import R from '../../resources/R';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../library/commons/Button';
import Loader from '../../library/commons/Loader';
import CircularProgress from '../../components/CircularProgress';
import moment from 'moment';
import RNHTMLtoPDF from 'react-native-html-to-pdf'; // For PDF generation
import Share from 'react-native-share'; // For sharing the file

const ClientInformation = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [loanId, setLoanId] = useState('');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [hisVis, setPayhisVis] = useState(false);
  const [expandAnim] = useState(new Animated.Value(0));
  const flatListRef = useRef(null);
  console.log('data', paymentHistory, data);

  const fetchClientData = async () => {
    const regex = /^[0-9]+$/;
    if (loanId?.length >= 1 && regex.test(loanId)) {
      try {
        setLoading(true);
        const response = await new UserApi().fetchClientInformationByLoanId({
          loanId,
        });
        if (response?.data) {
          setData(response.data?.basicData);
          setPaymentHistory(response.data?.paymentHistory);
        } else {
          setData({});
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    } else {
      Alert.alert('Please Enter A Valid Loan ID');
    }
  };

  const percentage = useCallback(() => {
    return data?.LoanAmount && data?.Paid
      ? (parseInt(data?.Paid) / parseInt(data?.LoanAmount)) * 100
      : 0;
  }, [data?.LoanAmount, data?.Paid]);

  const percentageTenure = useCallback(() => {
    return data?.Tenor && data?.COMPLETE
      ? (parseInt(data?.COMPLETE) / parseInt(data?.Tenor)) * 100
      : 0;
  }, [data?.Tenor, data?.COMPLETE]);

  useEffect(() => {
    Animated.timing(expandAnim, {
      toValue: hisVis ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [hisVis]);

  const scaleY = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const generatePDF = async () => {
    const passbookContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #000;
            }
            h3, p {
              margin: 5px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #000;
              padding: 5px;
              text-align: center;
            }
            th {
              background-color: #f2f2f2;
            }
            .header {
              margin-bottom: 20px;
            }
            .header th, .header td {
              border: none;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <!-- Header -->
          <table class="header">
            <tr>
              <th>
                <h3>PASSBOOK</h3>
              </th>
              <th>
                <h3>Subhlakshmi</h3>
              </th>
              <td>
                <p><b>Subhlakshmi Finance Private Limited</b></p>
                <p>Unit No. 904A & 904B, 9th Floor, Tower-C Unitech Cyber Park,</p>
                <p>Sector-39, Gurugram 122003 (Haryana)</p>
                <p>Email: info@subhlakshmi.in</p>
              </td>
            </tr>
          </table>
  
          <!-- Borrower and Loan Details -->
          <table>
            <tr>
              <td rowspan="5"></td>
              <td>Borrower: RINKU<br>Co Borrower: KAVITA DEVI</td>
              <td>Sanction Date: 16/10/2016<br>Disb Date: 17/10/2016</td>
              <td colspan="2">In case of complaint/suggestion you may call Helpline<br>(Tel no. 0124-4233318) Toll Free No:-18008913318</td>
            </tr>
            <tr>
              <td>Customer ID: 1<br>Loan ID: 1</td>
              <td>Loan Amount (Rs): 50,000/-<br>Processing fees (Rs.):590.00/-<br>ROI: 29.54% (Reducing)</td>
              <td colspan="2">Branch: KARNAL<br>Center No.: 502.00</td>
            </tr>
            <tr>
              <td>Insurance (Rs.): 0.00/-<br>HospiCash (Rs.): 0.00/-</td>
              <td>GPA (Rs): 0.00/-<br>GST on GPA (Rs.): 0.00/-</td>
              <td colspan="2">Collection Address: UCHANA P.O<br>KARAN LAKE, UCHANA (60)</td>
            </tr>
            <tr>
              <td>Address: 103, KALWA HERI, KARNAL</td>
              <td>Client confirms that his/her yearly household income is above Rs. 3,00,000/-<br>Purpose of Loan: Dairy and Livestock</td>
              <td colspan="2">Ceriter Meeting: 10:30 AM - Monday<br>No. of Installments: 36</td>
            </tr>
            <tr>
              <td colspan="3">In case of death of borrower or Co-borrower outstanding amount shall be settled/recovered as per Insurance Policy</td>
            </tr>
          </table>
  
          <!-- Installment Details -->
          <h3>Installment Details</h3>
          <table>
            <thead>
              <tr>
                <th>Inst No.</th>
                <th>Meeting Day</th>
                <th>Opening Principal</th>
                <th>Inst Amt.</th>
                <th>Interest</th>
                <th>Principal</th>
                <th>B.O.P</th>
                <th>Fore Close</th>
                <th>Amt Recd</th>
                <th>Amt Recd On</th>
                <th>(P/A)</th>
                <th>Signature</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>01/11/2016</td>
                <td>50,000</td>
                <td>1,700</td>
                <td>568</td>
                <td>1,132</td>
                <td>48,868</td>
                <td>52,500</td>
                <td>1,700</td>
                <td>02/11/2016</td>
                <td></td>
                <td>Praveen Sharma</td>
              </tr>
              <!-- Additional rows can be added here -->
            </tbody>
          </table>
  
          <!-- Footer -->
          <div class="footer">
            <div style="display: flex; justify-content: space-between;">
              <div>Signature of Borrower</div>
              <div>Signature of F.L.O</div>
              <div>Signature of BDM</div>
            </div>
          </div>
  
          <!-- Loan Utilization Check -->
          <table>
            <tr>
              <td colspan="4" style="text-align: center;">Loan Utilization Check</td>
            </tr>
            <tr>
              <td>Utilization Level:</td>
              <td>Satisfactory:</td>
              <td>Average:</td>
              <td>Unsatisfactory:</td>
            </tr>
            <tr>
              <td>LUC Date:</td>
              <td>LUC Done By:</td>
              <td>Client Sign:</td>
              <td>Staff Sign:</td>
            </tr>
          </table>
        </body>
      </html>
    `;

    try {
      const options = {
        html: passbookContent,
        fileName: `passbook_1`,
        directory: 'Documents',
      };
      const file = await RNHTMLtoPDF.convert(options);

      Alert.alert('Success', 'Passbook PDF has been generated');
      Share.open({
        title: 'Share Passbook',
        url: `file://${file.filePath}`,
        type: 'application/pdf',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not generate the PDF');
      console.error('PDF Generation Error', error);
    }

    try {
      const options = {
        html: passbookContent,
        fileName: `passbook_${loanId}`,
        directory: 'Documents',
      };
      const file = await RNHTMLtoPDF.convert(options);

      Alert.alert('Success', 'Passbook PDF has been generated');
      Share.open({
        title: 'Share Passbook',
        url: `file://${file.filePath}`,
        type: 'application/pdf',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not generate the PDF');
      console.error('PDF Generation Error', error);
    }
  };

  const handleExpand = () => {
    setPayhisVis(prevVis => !prevVis);
    if (!hisVis) {
      // Ensure scrolling happens after animation
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({offset: 0, animated: true});
      }, 400); // Delay matches animation duration
    }
  };

  const renderItem = ({item, index}) => (
    <View
      style={{
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        backgroundColor: R.colors.DARKGRAY,
        borderBottomWidth: 1,
        borderColor: R.colors.PRIMARY_LIGHT,
      }}>
      <Text style={[styles.listText, {flex: 0.5}]}>{item?.InstNo}</Text>
      <Text style={styles.listText}>
        {moment(item?.Due_Date).format('DD/MM/YY')}
      </Text>
      <Text style={styles.listText}>
        {moment(item?.Collection_Date).format('DD/MM/YY')}
      </Text>
      <Text style={styles.listText}>{item?.EMI}</Text>
      <Text style={styles.listText}>{item?.Coll_Amt}</Text>
    </View>
  );

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={'Loan Details'} />
      <View style={styles.textView}>
        <TextInput
          placeholder="Enter Loan ID to search..."
          value={loanId}
          onChangeText={setLoanId}
          placeholderTextColor={R.colors.LIGHTGRAY}
          style={styles.textInput}
          keyboardType="decimal-pad"
          keyboardAppearance="light"
          maxLength={10}
        />
        <TouchableOpacity
          onPress={fetchClientData}
          style={{
            position: 'absolute',
            right: -5,
            top: -5,
            padding: 8,
            borderRadius: 50,
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: R.colors.LIGHTGRAY,
          }}>
          <Icon
            name="magnify"
            size={30}
            color={R.colors.PRIMARY_LIGHT}
            style={{
              backgroundColor: R.colors.BLUE,
              borderRadius: 30,
              padding: 5,
            }}
          />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        {Object.keys(data)?.length ? (
          <>
            <View style={{backgroundColor: R.colors.BACKGROUND, flex: 1}}>
              <View style={[styles.detailsRow, {flexDirection: 'column'}]}>
                <View style={styles.detailsRow}>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Branch</Text>
                    <Text style={styles.detailValue}>{data?.Branch_Name}</Text>
                  </View>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Center Name</Text>
                    <Text style={styles.detailValue}>{data?.Center_Name}</Text>
                  </View>
                </View>
                <View style={styles.loanCard}>
                  <View style={styles.loanInfo}>
                    <View style={styles.imagePlaceholder}>
                      <Image
                        source={
                          data?.ClientImage
                            ? {uri: data?.ClientImage}
                            : require('../../assets/Images/activeProfile.jpeg')
                        }
                        resizeMode="cover"
                        style={styles.imagePlaceholder}
                      />
                    </View>
                    <View style={styles.loanDetails}>
                      <Text style={styles.infoText}>
                        Loan No.:{' '}
                        <Text style={styles.infoValue}>{data?.LoanID}</Text>
                      </Text>
                      <Text style={styles.infoText}>
                        Borrower Name:{' '}
                        <Text style={styles.infoValue}>
                          {data?.Borrower_Name}
                        </Text>
                      </Text>
                      <Text style={styles.infoText}>
                        Co-Borrower Name:{' '}
                        <Text style={styles.infoValue}>
                          {data?.Co_Borrower_Name}
                        </Text>
                      </Text>
                      <Text style={styles.infoText}>
                        Mobile No.:{' '}
                        <Text style={styles.infoValue}>{data?.mblenumber}</Text>
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.statsContainer}>
                  <View
                    style={[
                      styles.statsBox,
                      {borderRightWidth: 1.5, borderColor: R.colors.LIGHTGRAY},
                    ]}>
                    <Text style={styles.statsTitle}>Loan Amount</Text>
                    <Text style={styles.statsTitle}>
                      {data?.LoanAmount ? data?.LoanAmount : 0}
                    </Text>
                    <CircularProgress
                      percentage={percentage().toFixed(2)}
                      fillColor={R.colors.GREEN}
                      backgroundColor={R.colors.LIGHTGRAY}
                      textColor={R.colors.GREEN}
                    />
                    <Text style={styles.statsSubText}>
                      <View
                        style={{
                          height: 15,
                          width: 15,
                          backgroundColor: R.colors.GREEN,
                        }}
                      />{' '}
                      Paid: {data?.Paid ? data?.Paid : 0}
                    </Text>
                    <Text style={styles.statsSubText}>
                      <View
                        style={{
                          height: 15,
                          width: 15,
                          backgroundColor: R.colors.LIGHTGRAY,
                        }}
                      />{' '}
                      Due: {data?.CurrentDue ? data?.CurrentDue : 0}
                    </Text>
                  </View>
                  <View style={styles.statsBox}>
                    <Text style={styles.statsTitle}>Tenure</Text>
                    <Text style={styles.statsTitle}>
                      {data?.Tenor ? data?.Tenor : 0} Months
                    </Text>
                    <CircularProgress
                      percentage={percentageTenure().toFixed(2)}
                      fillColor={R.colors.BLUE}
                      backgroundColor={R.colors.LIGHTGRAY}
                      textColor={R.colors.BLUE}
                    />
                    <Text style={[styles.statsSubText, {marginLeft: 20}]}>
                      <View
                        style={{
                          height: 15,
                          width: 15,
                          backgroundColor: R.colors.BLUE,
                        }}
                      />{' '}
                      Complete: {data?.COMPLETE ? data?.COMPLETE : 0}
                    </Text>

                    <Text style={[styles.statsSubText, {marginLeft: 20}]}>
                      <View
                        style={{
                          height: 15,
                          width: 15,
                          backgroundColor: R.colors.LIGHTGRAY,
                        }}
                      />{' '}
                      Pending:{' '}
                      {parseInt(data?.Tenor) -
                        parseInt(data?.COMPLETE ? data?.COMPLETE : 0)}
                    </Text>
                  </View>
                </View>
                <View style={styles.dueContainer}>
                  <View
                    style={[
                      styles.dueBox,
                      {borderRightWidth: 1.5, borderColor: R.colors.LIGHTGRAY},
                    ]}>
                    <Text style={styles.dueLabel}>Current Due</Text>
                    <Text style={styles.dueValue}>
                      {data?.CurrentDue ? data?.CurrentDue : 0}
                    </Text>
                  </View>
                  <View style={styles.dueBox}>
                    <Text style={styles.dueLabel}>Upcoming EMI</Text>
                    <Text style={styles.dueValue}>
                      {' '}
                      {data?.UpcomingEMI ? data?.UpcomingEMI : 0}
                    </Text>
                    {/* <Text style={styles.emiDate}>
                      {data?.UpcomingEMI ? data?.UpcomingEMI : 0}
                    </Text> */}
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    onPress={handleExpand}
                    style={{
                      color: R.colors.BLUE,
                      textAlign: 'center',
                      fontWeight: '800',
                      alignItems: 'center',
                      // borderWidth:1
                    }}>
                    Check Payment History{'  '}
                  </Text>
                  <Icon
                    name={!hisVis ? 'chevron-down' : 'chevron-up'}
                    size={30}
                    color={R.colors.PRIMARI_DARK}
                    onPress={handleExpand}
                    style={styles.icon}
                  />
                </View>
                {paymentHistory && (
                  <View style={{alignItems: 'center', marginVertical: 10}}>
                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={generatePDF}>
                      <Icon name="download" size={20} color="#fff" />
                      <Text style={styles.downloadButtonText}>
                        Download Passbook
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                {hisVis &&
                  (paymentHistory?.length >= 1 ? (
                    <Animated.View
                      style={[
                        styles.financialSummary,
                        {
                          transform: [{scaleY}], // Apply transform scaling for vertical animation
                          borderTopWidth: hisVis ? 1 : 0,
                          borderTopColor: R.colors.SLATE_GRAY,
                        },
                      ]}>
                      <FlatList
                        data={paymentHistory}
                        renderItem={renderItem}
                        keyExtractor={item => item?.InstNo}
                        ListHeaderComponent={() => (
                          <View style={styles.headerRow}>
                            <Text style={[styles.listText, {flex: 0.5}]}>
                              Inst. No.
                            </Text>
                            <Text style={styles.listText}>Due Date</Text>
                            <Text style={styles.listText}>Collection Date</Text>
                            <Text style={styles.listText}>EMI</Text>
                            <Text style={styles.listText}>Coll. Amt</Text>
                          </View>
                        )}
                        ref={flatListRef}
                      />
                    </Animated.View>
                  ) : (
                    <Text
                      style={{
                        color: R.colors.PRIMARI_DARK,
                        fontWeight: '800',
                        fontSize: R.fontSize.XXL,
                        textAlign: 'center',
                      }}>
                      No Data Available
                    </Text>
                  ))}
              </View>
            </View>
          </>
        ) : (
          <Text
            style={{
              color: R.colors.PRIMARI_DARK,
              fontWeight: '800',
              fontSize: R.fontSize.XXL,
              textAlign: 'center',
            }}>
            No Data Available
          </Text>
        )}
      </ScrollView>
      {/* <Loader loading={loading} /> */}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  textView: {
    margin: 20,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 40,
    borderColor: R.colors.LIGHTGRAY,
    color: R.colors.PRIMARI_DARK,
    fontSize: R.fontSize.L,
    backgroundColor: '#fff',
    paddingLeft: 15,
  },
  backArrow: {
    fontSize: 24,
    color: '#000',
    marginRight: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: R.colors.PRIMARY_LIGHT,
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    elevation: 3,
  },
  detailBox: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  loanCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    elevation: 3,
    backgroundColor: R.colors.LIGHT_YELLOW,
  },
  loanInfo: {
    flexDirection: 'row',
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dfe6e9',
    marginRight: 15,
  },
  loanDetails: {
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
    color: R.colors.PRIMARI_DARK,
  },
  infoValue: {
    fontWeight: 'bold',
    color: '#000',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 8,
    elevation: 3,
    marginBottom: 15,
  },
  statsBox: {
    alignItems: 'center',
    flex: 1,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: R.colors.PRIMARI_DARK,
  },
  statsValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statsSubText: {
    fontSize: 14,
    color: '#7f8c8d',
    alignItems: 'center',
    textAlign: 'left',
    width: '100%',
  },
  dueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  dueBox: {
    alignItems: 'center',
    flex: 1,
  },
  dueLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  dueValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginVertical: 5,
  },
  emiDate: {
    fontSize: 14,
    color: '#27ae60',
  },
  financialSummary: {
    marginTop: 5,
    overflow: 'hidden', // Ensure no overflow during animation
  },
  listText: {
    flex: 1,
    textAlign: 'center',
    color: R.colors.PRIMARY_LIGHT,
    fontSize: R.fontSize.M,
    padding: 5,
    fontWeight: 'bold',
  },
  icon: {
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    // paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: R.colors.LIGHTGRAY,
    backgroundColor: R.colors.DARK_ORANGE,
    alignItems: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    backgroundColor: R.colors.BLUE,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default ClientInformation;
