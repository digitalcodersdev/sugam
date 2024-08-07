import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Card, Icon, Divider } from 'react-native-elements';

const themeColor = '#C72C08';

const AddharInformationUser = ({ data }) => {
  const {
    name,
    gender,
    dob,
    careOf,
    adharNumber,
    maskedAdharNumber,
    address: { house, street, landmark, po, dist, subdist, vtc, pc, state, country },
    image
  } = data.model;

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.card}>
        <Image source={{ uri: `data:image/jpeg;base64,${image}` }} style={styles.image} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.info}>Gender: {gender}</Text>
        <Text style={styles.info}>Date of Birth: {dob}</Text>
        <Text style={styles.info}>Care Of: {careOf}</Text>
        <Text style={styles.info}>Aadhar Number: {maskedAdharNumber}</Text>
        <Divider style={styles.divider} />
        <Text style={styles.sectionTitle}>Address</Text>
        <Text style={styles.info}>House: {house}</Text>
        <Text style={styles.info}>Street: {street}</Text>
        <Text style={styles.info}>Landmark: {landmark}</Text>
        <Text style={styles.info}>Post Office: {po}</Text>
        <Text style={styles.info}>District: {dist}</Text>
        <Text style={styles.info}>Sub-district: {subdist}</Text>
        <Text style={styles.info}>Village/Town/City: {vtc}</Text>
        <Text style={styles.info}>Pincode: {pc}</Text>
        <Text style={styles.info}>State: {state}</Text>
        <Text style={styles.info}>Country: {country}</Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    borderRadius: 10,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
  info: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
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


