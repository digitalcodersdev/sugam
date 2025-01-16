import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {Card, Divider} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import axios from 'axios';
import Button from '../../library/commons/Button';
import {useNavigation} from '@react-navigation/native';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import R from '../../resources/R';

const themeColor = '#C72C08';

const AddharInformationUser = ({route}) => {
  const navigation = useNavigation();
  const {
    name,
    gender,
    dob,
    careOf,
    maskedAdharNumber,
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
    image,
    latitude,
    longitude,
  } = route?.params?.data;
  console.log(route?.params?.data);

  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  //   useEffect(() => {
  //     const fetchLocation = async () => {
  //       try {
  //         // const address = `${house}, ${street}, ${landmark}, ${po}, ${dist}, ${subdist}, ${vtc}, ${pc}, ${state}, ${country}`;

  //         const address =
  //           '87 ganga nagar colonly ramlila road etawah 206001 uttar pradesh';
  //         console.log(address);
  //         const location = await getLatLng(address);
  //         console.log(location);
  //         setLocation(location);

  //         // Example: Calculate distance from a fixed point (e.g., a known location)
  //         const fixedLocation = {lat: latitude, lng: longitude}; // Replace with actual coordinates
  //         const calculatedDistance = getDistance(
  //           location.lat,
  //           location.lng,
  //           fixedLocation.lat,
  //           fixedLocation.lng,
  //         );
  //         console.log(calculatedDistance);
  //         setDistance(calculatedDistance);
  //       } catch (error) {
  //         console.error(
  //           'Error fetching location or calculating distance:',
  //           error,
  //         );
  //       }
  //     };

  //     fetchLocation();
  //   }, []);

  return (
    <ScreenWrapper header={false} backDisabled>
      <ScrollView style={styles.container}>
        <Card containerStyle={styles.card}>
          <Image
            source={{uri: `data:image/jpeg;base64,${image}`}}
            style={styles.image}
            resizeMode="center"
          />
          <Text style={styles.name}>{name}</Text>
          <View style={styles.infoRow}>
            <Icon name="gender-male" size={20} color={themeColor} />
            <Text style={styles.info}>Gender: {gender}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="calendar-today" size={20} color={themeColor} />
            <Text style={styles.info}>Date of Birth: {dob}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="account" size={20} color={themeColor} />
            <Text style={styles.info}>Care Of: {careOf}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="credit-card" size={20} color={themeColor} />
            <Text style={styles.info}>Aadhar Number: {maskedAdharNumber}</Text>
          </View>
          <Divider style={styles.divider} />
          <Text style={styles.sectionTitle}>Address</Text>
          <View style={styles.infoRow}>
            <Icon name="home" size={20} color={themeColor} />
            <Text style={styles.info}>House: {house}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="map" size={20} color={themeColor} />
            <Text style={styles.info}>Street: {street}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="map-marker" size={20} color={themeColor} />
            <Text style={styles.info}>Landmark: {landmark}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="post" size={20} color={themeColor} />
            <Text style={styles.info}>Post Office: {po}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="map" size={20} color={themeColor} />
            <Text style={styles.info}>District: {dist}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="map" size={20} color={themeColor} />
            <Text style={styles.info}>Sub-district: {subdist}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="map" size={20} color={themeColor} />
            <Text style={styles.info}>Village/Town/City: {vtc}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="pin" size={20} color={themeColor} />
            <Text style={styles.info}>Pincode: {pc}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="map" size={20} color={themeColor} />
            <Text style={styles.info}>State: {state}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="map" size={20} color={themeColor} />
            <Text style={styles.info}>Country: {country}</Text>
          </View>

          {/* {distance && (
            <Text style={styles.info}>
              Distance from fixed point: {distance.toFixed(2)} km
            </Text>
          )} */}
          <View
            style={{
              height: 100,
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Button
              title="Cancel"
              onPress={() => {
                navigation.navigate(ScreensNameEnum.NEW_CLIENT);
              }}
              buttonStyle={{
                width: '40%',
                alignSelf: 'center',
                borderRadius: 6,
                // justifyContent: 'flex-end',
              }}
              textStyle={{padding: 0, fontWeight: 'bold'}}
              backgroundColor={R.colors.DARKGRAY}
            />
            <Button
              title="Continue"
              onPress={() => {
                navigation.navigate(
                  ScreensNameEnum.CHECK_CREDIT_BUREAU_SCREEN,
                  {
                    data: route?.params?.data,
                  },
                );
              }}
              buttonStyle={{
                width: '40%',
                alignSelf: 'center',
                borderRadius: 6,
                // justifyContent: 'flex-end',
              }}
              textStyle={{padding: 0, fontWeight: 'bold'}}
            />
          </View>
        </Card>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    borderRadius: 10,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 10,
    // height: Dimensions.get('screen').height,
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: themeColor,
    textAlign: 'center',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  divider: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: themeColor,
    marginBottom: 10,
  },
});

export default AddharInformationUser;
