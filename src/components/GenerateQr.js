import React, {useEffect, useState} from 'react';
import {View, TextInput, Button, StyleSheet} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import UserApi from '../datalib/services/user.api';

const DynamicQRCode = ({amount}) => {
  // const [amount, setAmount] = useState('');
  const [qrValue, setQrValue] = useState('');
  console.log('amount', amount);
  // Function to generate UPI URL
  useEffect(() => {
    if (amount) {
      generateQRCode();
    }
  }, [amount]);
  const generateQRCode = () => {
    const upiID = 'SUBFPL.06@cmsidfc'; // Replace with actual UPI ID
    const name = 'Subhlakshmi Finance Pvt Ltd';
    const currency = 'INR';

    // Create UPI URL with dynamic amount
    const upiURL = `upi://pay?pa=${upiID}&pn=${encodeURIComponent(
      name,
    )}&am=${amount}&cu=${currency}`;

  

    // Set generated UPI URL as the QR code value
    setQrValue(upiURL);
  };

  const handleGeneratePaymentLink = async () => {
    try {
      const response = await new UserApi().createPaymentLink({
        data: {
          amount: 500,
          contact: 8265805176,
          email: 'mohitkumar.webdev@gmail.com',
        },
      });
      console.log(response);
      //   if (data) {
      //     // Display or send payment link to user
      //     Alert.alert(
      //       'Payment Link',
      //       `Please complete your payment here: ${data.short_url}`,
      //     );
      //   }
    } catch (error) {
      console.error('Error generating payment link:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* <TextInput
        style={styles.input}
        placeholder="Enter Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={text => setAmount(text)}
      />
      <Button title="Generate QR Code" onPress={generateQRCode} /> */}
      {qrValue ? (
        <View style={styles.qrContainer}>
          <QRCode value={qrValue} size={200} />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  qrContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DynamicQRCode;
