import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Linking,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import UserApi from '../../datalib/services/user.api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import R from '../../resources/R';

const ContactUs = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    fetchConatctInformation();
  }, []);

  const fetchConatctInformation = async () => {
    try {
      const res = await new UserApi().fetchConatctInformation();
      if (res) {
        setData(res?.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePhonePress = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`).catch(err =>
      console.error('Error opening dialer:', err),
    );
  };

  const handleEmailPress = email => {
    Linking.openURL(`mailto:${email}`).catch(err =>
      console.error('Error opening email:', err),
    );
  };

  const handleWebsitePress = website => {
    Linking.openURL(website).catch(err =>
      console.error('Error opening website:', err),
    );
  };
  console.log(data);
  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={'Help Desk'} />

      <ImageBackground
        source={require('../../assets/Images/mainbg.png')}
        resizeMode="stretch"
        style={styles.container}>
        <View style={styles.card}>
          <View style={styles.row}>
            <Icon name="location-on" size={24} color="#708090" />
            <Text style={styles.text}>Address: {data?.address}</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleEmailPress('support@example.com')}>
            <View style={styles.row}>
              <Icon name="email" size={24} color="#708090" />
              <Text style={styles.link}>Support Email: {data?.email}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleWebsitePress('https://www.example.com')}>
            <View style={styles.row}>
              <Icon name="language" size={24} color="#708090" />
              <Text style={styles.link}>Website: {data?.Website}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePhonePress(`+91${data.phone}`)}>
            <View style={styles.row}>
              <Icon name="phone" size={24} color="#708090" />
              <Text style={styles.link}>Contact No.: +91 {data.phone}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePhonePress(`+91${data.helpDeskNumber}`)}>
            <View style={styles.row}>
              <Icon name="phone" size={24} color="#708090" />
              <Text style={styles.link}>
                HelpDesk No.: +91 {data.helpDeskNumber}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    width: '90%',
    shadowColor: R.colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  link: {
    color: R.colors.SLATE_GRAY,
    fontSize: 16,
    marginLeft: 10,
    fontWeight:"500"
  },
  text: {
    color: '#000',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default ContactUs;
