import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Alert,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
ScreensNameEnum;
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import {uploadFile} from '../datalib/services/utility.api';

import {useNavigation} from '@react-navigation/native';
import Button from '../../library/commons/Button';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';

const KYCCustomer = ({route}) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [clientPhoto, setClientPhoto] = useState(null);
  const [aadharFront, setAadharFront] = useState(null);
  const [aadharBack, setAadharBack] = useState(null);
  const [voterId, setVoterId] = useState(null);
  const [voterIdBack, setVoterIdBack] = useState(null);
  const [panCard, setPanCard] = useState(null);
  const [housePhoto, setHousePhoto] = useState(null);
  const [err, setErr] = useState({});
  //   console.log("route",route?.params);

  //   const {EnrollmentID} = route?.params?.data;

  const handleImagePick = setter => {
    launchCamera({mediaType: 'photo', quality: 0.8}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        console.log(response.assets[0]);
        setter(response.assets[0]);
      }
    });
  };
  console.log(voterIdBack);

  const validateForm = useCallback(() => {
    let valid = true;
    const newErrors = {};

    if (!clientPhoto) {
      newErrors.clientPhoto = true;
      valid = false;
      Alert.alert('Please Upload Client Photo');
      setErr(newErrors);
      return valid;
    }

    if (!aadharFront || !aadharBack) {
      newErrors.aadharFront = !aadharFront;
      newErrors.aadharBack = !aadharBack;
      valid = false;
      Alert.alert('Please Upload Aadhar Front And Back Both');
      setErr(newErrors);
      return valid;
    }

    if ((!voterId || !voterIdBack) && !panCard) {
      if (!voterId && voterIdBack) {
        newErrors.voterId = !voterId;
        valid = false;
        setErr(newErrors);
        Alert.alert('Please Upload Voter ID Front');
        return valid;
      }
      if (voterId && !voterIdBack) {
        console.log('_______', {voterId, voterIdBack});
        newErrors.voterIdBack = !voterIdBack;
        valid = false;
        setErr(newErrors);
        Alert.alert('Please Upload Voter ID Back');
        return valid;
      }
      newErrors.voterId = !voterId;
      newErrors.voterIdBack = !voterIdBack;
      newErrors.panCard = !panCard;
      valid = false;
      setErr(newErrors);
      Alert.alert('Please Upload PAN OR Voter ID ');
      return valid;
    }

    if (!housePhoto) {
      newErrors.housePhoto = true;
      valid = false;
      setErr(newErrors);
      Alert.alert("Please Upload Client's House Photo");
      return valid;
    }

    setErr(newErrors);
    return valid;
  }, [clientPhoto, aadharFront, aadharBack, voterId, panCard, housePhoto]);

  const handleSubmit = async () => {
    if (validateForm()) {
      const formData = new FormData();
      // Append files to FormData
      formData.append('clientPhoto', {
        uri: clientPhoto.uri,
        type: clientPhoto.type,
        name: clientPhoto.fileName,
      });
      formData.append('aadharFront', {
        uri: aadharFront.uri,
        type: aadharFront.type,
        name: aadharFront.fileName,
      });
      formData.append('aadharBack', {
        uri: aadharBack.uri,
        type: aadharBack.type,
        name: aadharBack.fileName,
      });
      if (voterId) {
        formData.append('voterId', {
          uri: voterId.uri,
          type: voterId.type,
          name: voterId.fileName,
        });
      }
      if (voterIdBack) {
        formData.append('voterIdBack', {
          uri: voterId.uri,
          type: voterId.type,
          name: voterId.fileName,
        });
      }
      if (panCard) {
        formData.append('panCard', {
          uri: panCard.uri,
          type: panCard.type,
          name: panCard.fileName,
        });
      }
      formData.append('housePhoto', {
        uri: housePhoto.uri,
        type: housePhoto.type,
        name: housePhoto.fileName,
      });

      try {
        navigation.navigate(ScreensNameEnum.KYC_CO_CUSTOMER_SCREEN)
        // const response = await uploadFile(formData);
        // if (response?.success) {
        //   const payload = {
        //     borrowerDocuments: {
        //       ClientImage: response?.files?.clientPhoto,
        //       ClientAadharFront: response?.files?.aadharFront,
        //       ClientAadharBack: response?.files?.aadharBack,
        //       ClientPAN: response?.files?.panCard,
        //       ClientVoterFront: response?.files?.voterId,
        //       ClientVoterBack: response?.files?.voterIdBack,
        //       HouseImage: response?.files?.housePhoto,
        //       Enrollment_ID: EnrollmentID,
        //     },
        //   };
        //   const res = await new UserApi().updateBorrowerDocuments(payload);
        //   if (res?.success) {
        //     Alert.alert("Client Documents Uploaded Successfully...");
        //     navigation.navigate(ScreensNameEnum.CO_BORROWER_KYC_SCREEN, {
        //       EnrollmentID,
        //     });
        //   }
        // } else {
        //   Alert.alert(response.message);
        // }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }
  };

  const styles = createStyles(colorScheme);
  console.log(voterIdBack);
  return (
    <ScreenWrapper header={false} backDisabled title="Client KYC">
      {/* <ChildScreensHeader screenName={ScreensNameEnum.CLIENT_KYC_FORM} /> */}
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.header}>Applicant KYC Form</Text>
          <View style={[styles.section]}>
            <TouchableOpacity
              onPress={() => handleImagePick(setClientPhoto)}
              style={[
                styles.uploadButton,
                {
                  borderColor: err?.clientPhoto
                    ? R.colors.RED
                    : R.colors.PRIMARI_DARK,
                  borderWidth: err?.clientPhoto ? 1.5 : 1,
                },
              ]}>
              <Text style={styles.buttonText}>Upload Client Photo</Text>
              <View>
                {clientPhoto && (
                  <Icon
                    name="close"
                    size={32}
                    color={R.colors.PRIMARY_LIGHT}
                    style={styles.icon}
                    onPress={() => {
                      setClientPhoto(null);
                    }}
                  />
                )}
                <Image
                  source={
                    clientPhoto
                      ? {uri: clientPhoto?.uri}
                      : require('../../assets/Images/activeProfile.jpeg')
                  }
                  style={styles.image}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionRow}>
            <TouchableOpacity
              onPress={() => handleImagePick(setAadharFront)}
              style={[
                styles.smallUploadButton,
                {
                  borderColor: err?.aadharFront
                    ? R.colors.primary
                    : R.colors.PRIMARI_DARK,
                  borderWidth: err?.aadharFront ? 1.5 : 1,
                },
              ]}>
              <Text style={styles.buttonText}>Upload Aadhar Front</Text>
              <View>
                {aadharFront && (
                  <Icon
                    name="close"
                    size={32}
                    color={R.colors.PRIMARY_LIGHT}
                    style={styles.icon}
                    onPress={() => {
                      setAadharFront(null);
                    }}
                  />
                )}
                <Image
                  source={
                    aadharFront
                      ? {uri: aadharFront?.uri}
                      : require('../../assets/Images/aadhar.png')
                  }
                  resizeMode="center"
                  style={[styles.image, {width: 150}]}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleImagePick(setAadharBack)}
              style={[
                styles.smallUploadButton,
                {
                  borderColor: err?.aadharBack
                    ? R.colors.primary
                    : R.colors.PRIMARI_DARK,
                  borderWidth: err?.aadharBack ? 1.5 : 1,
                },
              ]}>
              <Text style={styles.buttonText}>Upload Aadhar Back</Text>
              <View>
                {aadharBack && (
                  <Icon
                    name="close"
                    size={32}
                    color={R.colors.PRIMARY_LIGHT}
                    style={styles.icon}
                    onPress={() => {
                      setAadharBack(null);
                    }}
                  />
                )}
                <Image
                  source={
                    aadharBack
                      ? {uri: aadharBack?.uri}
                      : require('../../assets/Images/aadharBack.png')
                  }
                  style={styles.image}
                  resizeMode="center"
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.textView}>
            <Text style={styles.label}>Aadhar No.</Text>
            <Text
              style={styles.value}>
              {'968081693804'}
            </Text>
          </View>
          <View style={styles.sectionRow}>
            <TouchableOpacity
              onPress={() => handleImagePick(setVoterId)}
              style={[
                styles.smallUploadButton,
                {
                  borderColor: err?.voterId
                    ? R.colors.primary
                    : R.colors.PRIMARI_DARK,
                  borderWidth: err?.voterId ? 1.5 : 1,
                },
              ]}>
              <Text style={styles.buttonText}>Upload Voter ID Front</Text>
              <View>
                {voterId && (
                  <Icon
                    name="close"
                    size={32}
                    color={R.colors.PRIMARY_LIGHT}
                    style={styles.icon}
                    onPress={() => {
                      setVoterId(null);
                    }}
                  />
                )}
                <Image
                  source={
                    voterId
                      ? {uri: voterId?.uri}
                      : require('../../assets/Images/VoterId.png')
                  }
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleImagePick(setVoterIdBack)}
              style={[
                styles.smallUploadButton,
                {
                  borderColor: err?.voterIdBack
                    ? R.colors.primary
                    : R.colors.PRIMARI_DARK,
                  borderWidth: err?.voterIdBack ? 1.5 : 1,
                },
              ]}>
              <Text style={styles.buttonText}>Upload Voter ID Back</Text>
              <View>
                {voterIdBack && (
                  <Icon
                    name="close"
                    size={32}
                    color={R.colors.PRIMARY_LIGHT}
                    style={styles.icon}
                    onPress={() => {
                      setVoterIdBack(null);
                    }}
                  />
                )}
                <Image
                  source={
                    voterIdBack
                      ? {uri: voterIdBack?.uri}
                      : require('../../assets/Images/VoterId.png')
                  }
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.textView}>
            <Text style={styles.label}>Voter ID No.</Text>
            <Text
              style={styles.value}>
              {'XQC4496545'}
            </Text>
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              onPress={() => handleImagePick(setPanCard)}
              style={[
                styles.uploadButton,
                {
                  borderColor: err?.panCard
                    ? R.colors.primary
                    : R.colors.PRIMARI_DARK,
                  borderWidth: err?.panCard ? 1.5 : 1,
                },
              ]}>
              <Text style={styles.buttonText}>Upload PAN Card</Text>
              <View>
                {panCard && (
                  <Icon
                    name="close"
                    size={32}
                    color={R.colors.PRIMARY_LIGHT}
                    style={styles.icon}
                    onPress={() => {
                      setPanCard(null);
                    }}
                  />
                )}
                <Image
                  source={
                    panCard
                      ? {uri: panCard?.uri}
                      : require('../../assets/Images/panCard.png')
                  }
                  resizeMode="center"
                  style={[styles.image, {width: 180}]}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.textView}>
            <Text style={styles.label}>PAN Card No.</Text>
            <Text
              style={styles.value}>
              {'EQUPK1336K'}
            </Text>
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              onPress={() => handleImagePick(setHousePhoto)}
              style={[
                styles.uploadButton,
                {
                  borderColor: err?.housePhoto
                    ? R.colors.primary
                    : R.colors.PRIMARI_DARK,
                  borderWidth: err?.housePhoto ? 1.5 : 1,
                },
              ]}>
              <Text style={styles.buttonText}>Upload Client's House Photo</Text>
              <View>
                {housePhoto && (
                  <Icon
                    name="close"
                    size={32}
                    color={R.colors.PRIMARY_LIGHT}
                    style={styles.icon}
                    onPress={() => {
                      setHousePhoto(null);
                    }}
                  />
                )}
                <Image
                  source={
                    housePhoto
                      ? {uri: housePhoto?.uri}
                      : require('../../assets/Images/homeVillage.jpeg')
                  }
                  style={styles.image}
                  resizeMode="center"
                />
              </View>
            </TouchableOpacity>
          </View>

          <Button
            title="Submit"
            onPress={handleSubmit}
            buttonStyle={styles.submitButton}
            textStyle={styles.btnTextStyle}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const createStyles = colorScheme =>
  StyleSheet.create({
    scrollView: {
      paddingVertical: 16,
      paddingHorizontal: 24,
    },
    container: {
      flex: 1,
      //   padding: 16,
      backgroundColor:
        colorScheme === 'dark'
          ? R.colors.DARK_BACKGROUND
          : R.colors.LIGHT_BACKGROUND,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 24,
      textAlign: 'center',
      color:
        colorScheme === 'dark' ? R.colors.PRIMARI_DARK : R.colors.PRIMARI_DARK,
    },
    section: {
      marginBottom: 20,
    },
    sectionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    uploadButton: {
      padding: 16,
      backgroundColor:
        colorScheme === 'dark' ? R.colors.GRAY : R.colors.LIGHT_GRAY,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor:
        colorScheme === 'dark' ? R.colors.LIGHT_GRAY : R.colors.DARK_GRAY,
    },
    smallUploadButton: {
      width: '48%',
      padding: 16,
      backgroundColor:
        colorScheme === 'dark' ? R.colors.GRAY : R.colors.LIGHT_GRAY,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor:
        colorScheme === 'dark' ? R.colors.LIGHT_GRAY : R.colors.DARK_GRAY,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color:
        colorScheme === 'dark' ? R.colors.PRIMARI_DARK : R.colors.PRIMARI_DARK,
    },
    image: {
      marginTop: 12,
      width: 120,
      height: 120,
      borderRadius: 8,
      resizeMode: 'cover',
    },
    submitButton: {
      marginTop: 32,
      paddingVertical: 12,
      borderRadius: 12,
    },
    btnTextStyle: {
      fontWeight: '900',
    },
    icon: {
      position: 'absolute',
      right: -10,
      borderWidth: 1,
      borderRadius: 6,
      backgroundColor: R.colors.GREEN,
      zIndex: 999,
    },
    textView: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      borderRadius: 6,
      marginVertical: 10,
      padding: 5,
      width: '70%',
      alignSelf: 'center',
      fontSize: R.fontSize.XL
    },
    label: {
      color: R.colors.PRIMARI_DARK,
      textAlign: 'center',
      width: '60%',
      alignSelf: 'center',
      fontSize: R.fontSize.XL,
      flex:1
    },
    value:{
        color: R.colors.PRIMARI_DARK,
        textAlign: 'center',
        borderBottomWidth: 1,
        fontSize: R.fontSize.XL,
        alignSelf: 'center',
        flex:1,
        borderColor:R.colors.LIGHTGRAY
      }
  });

export default KYCCustomer;
