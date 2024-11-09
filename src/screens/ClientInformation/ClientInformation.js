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
    if (!paymentHistory) return;

    let passbookContent = `
      <html>
        <body>
          <h1>Client Passbook</h1>
          <table border="1" style="width:100%;">
            <tr><th>Date</th><th>Transaction Date</th><th>Amount</th></tr>
            ${paymentHistory
              .map(
                item => `
              <tr>
                <td>${moment(item?.Due_Date).format('DD/MM/YYYY')}</td>
                // <td>${item?.transaction}</td>
                <td>${item?.Coll_Amt}</td>
              </tr>
            `,
              )
              .join('')}
          </table>
        </body>
      </html>
    `;

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
                <View style={{ alignItems: 'center', marginVertical: 10 }}>
                  <TouchableOpacity style={styles.downloadButton} onPress={generatePDF}>
                    <Icon name="download" size={20} color="#fff" />
                    <Text style={styles.downloadButtonText}>Download Passbook</Text>
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
