import React, {useCallback, useReducer, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Alert,
  Pressable,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';

ScreensNameEnum;
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {useNavigation} from '@react-navigation/native';
import Button from '../../library/commons/Button';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import {
  uploadFile,
  uploadClientPhoto,
} from '../../datalib/services/utility.api';
import UserApi from '../../datalib/services/user.api';
import Loader from '../../library/commons/Loader';
import ImagePicker from 'react-native-image-crop-picker';
import {Camera, getCameraDevice} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import ImageView from 'react-native-images-viewer';

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
  const [loading, setLoading] = useState(false);
  const [isCamera, setCamera] = useState(false);
  const [isCameraReady, setCameraReady] = useState(false);
  const [isVis, onClose] = useState(false);
  const [image, setImage] = useState([]);
  const devices = Camera.getAvailableCameraDevices();
  const device = getCameraDevice(devices, 'back');
  const selected = useRef(null);
  const cameraRef = useRef(null);

  const {userData, enrollmentId} = route?.params?.data;

  const applicantName = userData?.name?.split(' ')[0];

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Sugam App Camera Permission',
          message: 'Sugam App needs access to your camera ',

          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleImagePick = setter => {
    requestCameraPermission();
    selected.current = setter;
    setCamera(true);
  };

  // Function to copy the image to permanent storage
  const copyImageToPermanentStorage = async sourcePath => {
    try {
      const destPath = `${RNFS.DocumentDirectoryPath}/image_${Date.now()}.jpg`;
      await RNFS.copyFile(sourcePath, destPath);

      const fileExists = await RNFS.exists(destPath);
      if (fileExists) {
        return destPath;
      } else {
        console.error('File does not exist after copying:', destPath);
        return null;
      }
    } catch (error) {
      console.error('Error copying image:', error);
      return null;
    }
  };

  const captureAndCropImage = async setter => {
    if (!cameraRef.current) return;
    try {
      // Capture the photo
      const photo = await cameraRef.current.takePhoto({
        quality: 1,
        skipMetadata: false,
      });
      console.log('photo', photo);
      // Copy the captured image to permanent storage
      const permanentPath = await copyImageToPermanentStorage(photo.path);
      if (permanentPath) {
        setter(permanentPath);
        // selected.current
        // console.log(permanentPath, selected.current(permanentPath));
        // Crop the image
        ImagePicker.openCropper({
          path: `file://${permanentPath}`, // Add file:// prefix for permanent file
          freeStyleCropEnabled: true,
        }).then(croppedImage => {
          console.log('croppedImage', croppedImage);
          setter(croppedImage);
          setCamera(false);
          // extractTextFromImage(croppedImage.path);
        });
      }
    } catch (error) {
      console.error('Error capturing or cropping photo:', error);
      Alert.alert('Error', 'Failed to capture or crop the photo');
    }
  };

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

    if (userData?.panNo !== '') {
      if (!panCard) {
        newErrors.panCard = !panCard;
        valid = false;
        setErr(newErrors);
        Alert.alert('Please Upload Pan card Front');
        return valid;
      }
    }
    if (userData?.voterId !== '') {
      if (!voterId || !voterIdBack) {
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
        valid = false;
        setErr(newErrors);
        Alert.alert('Please Upload PAN OR Voter ID ');
        return valid;
      }
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
    try {
      setLoading(true);
      if (validateForm()) {
        const formData = new FormData();
        // Append files to FormData
        formData.append('aadharFront', {
          uri: aadharFront.path,
          type: aadharFront.mime,
          name: `${enrollmentId}.jpg`,
        });
        formData.append('aadharBack', {
          uri: aadharBack.path,
          type: aadharBack.mime,
          name: `${enrollmentId}.jpg`,
        });
        if (voterId) {
          formData.append('voterId', {
            uri: voterId.path,
            type: voterId.mime,
            name: `${enrollmentId}.jpg`,
          });
        }
        if (voterIdBack) {
          formData.append('voterIdBack', {
            uri: voterId.path,
            type: voterId.mime,
            name: `${enrollmentId}.jpg`,
          });
        }
        if (panCard) {
          formData.append('panCard', {
            uri: panCard.path,
            type: panCard.mime,
            name: `${enrollmentId}.jpg`,
          });
        }
        formData.append('housePhoto', {
          uri: housePhoto.path,
          type: housePhoto.mime,
          name: `${enrollmentId}.jpg`,
        });

        const response = await uploadFile(formData);
        if (response?.success) {
          const payload = new FormData();
          payload.append('clientPhoto', {
            uri: clientPhoto.path,
            type: clientPhoto.mime,
            name: `${enrollmentId}.jpg`,
          });
          const resp = await uploadClientPhoto(payload);
          if (resp?.success) {
            Alert.alert('Client Documents Uploaded Successfully...');
            navigation.navigate(ScreensNameEnum.KYC_CO_CUSTOMER_SCREEN, {
              data: route?.params?.data,
            });
          }
          // const payload = {
          //   borrowerDocuments: {
          //     ClientImage: response?.files?.clientPhoto,
          //     ClientAadharFront: response?.files?.aadharFront,
          //     ClientAadharBack: response?.files?.aadharBack,
          //     ClientPAN: response?.files?.panCard,
          //     ClientVoterFront: response?.files?.voterId,
          //     ClientVoterBack: response?.files?.voterIdBack,
          //     HouseImage: response?.files?.housePhoto,
          //     Enrollment_ID: enrollmentId,
          //   },
          // };
          // const res = await new UserApi().updateBorrowerDocuments(payload);
          // if (res?.success) {
          Alert.alert('Client Documents Uploaded Successfully...');
          navigation.navigate(ScreensNameEnum.KYC_CO_CUSTOMER_SCREEN, {
            data: route?.params?.data,
          });
          // }
        } else {
          Alert.alert(response.message);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setLoading(false);
    }
  };

  const styles = createStyles(colorScheme);
  console.log('isCameraReady', isCameraReady);
  return (
    <ScreenWrapper header={false} backDisabled title="Client KYC">
      <ScrollView contentContainerStyle={styles.scrollView}>
        {isCamera ? (
          <>
            <Camera
              ref={cameraRef}
              style={styles.camera}
              device={device}
              isActive={true}
              photo={true}
              onInitialized={() => setCameraReady(true)}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                position: 'absolute',
                bottom: 30,
                alignSelf: 'center',
              }}>
              <Pressable
                style={[
                  styles.captureButton,
                  {backgroundColor: R.colors.DARKGRAY},
                ]}
                onPress={() => setCamera(false)}>
                <Text
                  style={[styles.buttonText, {color: R.colors.PRIMARY_LIGHT}]}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                style={styles.captureButton}
                onPress={() =>
                  isCameraReady ? captureAndCropImage(selected.current) : null
                }>
                <Text
                  style={[styles.buttonText, {color: R.colors.PRIMARY_LIGHT}]}>
                  Capture Image
                </Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.container}>
            <Text style={styles.header}>{applicantName} KYC </Text>
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
                    <>
                      {/* Remove Icon */}
                      <Icon
                        name="close"
                        size={32}
                        color={R.colors.PRIMARY_LIGHT}
                        style={styles.icon}
                        onPress={() => {
                          setClientPhoto(null);
                        }}
                      />
                      {/* Display Image */}
                      <TouchableOpacity
                        onPress={() => {
                          if (clientPhoto?.path) {
                            // Example: Show full-screen image
                            setImage([{uri: clientPhoto?.path}]);
                            onClose(true); // Optional: Open modal or perform an action
                          }
                        }}>
                        <Image
                          source={{uri: clientPhoto?.path}}
                          style={styles.image}
                        />
                      </TouchableOpacity>
                    </>
                  )}

                  {/* Fallback Image */}
                  {!clientPhoto && (
                    <Image
                      source={require('../../assets/Images/activeProfile.jpeg')}
                      style={styles.image}
                    />
                  )}
                </View>
              </TouchableOpacity>

              {/* <TouchableOpacity
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
                        ? {uri: clientPhoto?.path}
                        : require('../../assets/Images/activeProfile.jpeg')
                    }
                    style={styles.image}
                    onPress={() => {
                      if (clientPhoto?.path) {
                        setImage([
                          {
                            uri: clientPhoto?.path,
                          },
                        ]);
                        onClose(true);
                      }
                    }}
                  />
                </View>
              </TouchableOpacity> */}
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
                    <>
                      {/* Remove Icon */}
                      <Icon
                        name="close"
                        size={32}
                        color={R.colors.PRIMARY_LIGHT}
                        style={styles.icon}
                        onPress={() => {
                          setAadharFront(null);
                        }}
                      />
                      {/* Display Image */}
                      <TouchableOpacity
                        onPress={() => {
                          if (aadharFront?.path) {
                            setImage([{uri: aadharFront?.path}]);
                            onClose(true);
                          }
                        }}>
                        <Image
                          source={{uri: aadharFront?.path}}
                          resizeMode="center"
                          style={[styles.image, {width: 150}]}
                        />
                      </TouchableOpacity>
                    </>
                  )}

                  {/* Fallback Image */}
                  {!aadharFront && (
                    <Image
                      source={require('../../assets/Images/aadhar.png')}
                      resizeMode="center"
                      style={[styles.image, {width: 150}]}
                    />
                  )}
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
                    <>
                      {/* Remove Icon */}
                      <Icon
                        name="close"
                        size={32}
                        color={R.colors.PRIMARY_LIGHT}
                        style={styles.icon}
                        onPress={() => {
                          setAadharBack(null);
                        }}
                      />
                      {/* Display Image */}
                      <TouchableOpacity
                        onPress={() => {
                          if (aadharBack?.path) {
                            setImage([{uri: aadharBack?.path}]);
                            onClose(true);
                          }
                        }}>
                        <Image
                          source={{uri: aadharBack?.path}}
                          style={styles.image}
                          resizeMode="center"
                        />
                      </TouchableOpacity>
                    </>
                  )}

                  {/* Fallback Image */}
                  {!aadharBack && (
                    <Image
                      source={require('../../assets/Images/aadharBack.png')}
                      style={styles.image}
                      resizeMode="center"
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.textView}>
              <Text style={styles.label}>Aadhar No.</Text>
              <Text style={styles.value}>{userData?.aadharNo}</Text>
            </View>
            {userData?.voterId && (
              <>
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
                        <>
                          {/* Remove Icon */}
                          <Icon
                            name="close"
                            size={32}
                            color={R.colors.PRIMARY_LIGHT}
                            style={styles.icon}
                            onPress={() => {
                              setVoterId(null);
                            }}
                          />
                          {/* Display Image */}
                          <TouchableOpacity
                            onPress={() => {
                              if (voterId?.path) {
                                // Example: Show full-screen image or perform an action
                                setImage([{uri: voterId?.path}]);
                                onClose(true);
                              }
                            }}>
                            <Image
                              source={{uri: voterId?.path}}
                              style={styles.image}
                              resizeMode="cover"
                            />
                          </TouchableOpacity>
                        </>
                      )}

                      {/* Fallback Image */}
                      {!voterId && (
                        <Image
                          source={require('../../assets/Images/VoterId.png')}
                          style={styles.image}
                          resizeMode="cover"
                        />
                      )}
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
                        <>
                          {/* Remove Icon */}
                          <Icon
                            name="close"
                            size={32}
                            color={R.colors.PRIMARY_LIGHT}
                            style={styles.icon}
                            onPress={() => {
                              setVoterIdBack(null);
                            }}
                          />
                          {/* Display Image */}
                          <TouchableOpacity
                            onPress={() => {
                              if (voterIdBack?.path) {
                                // Example: Show full-screen image or perform an action
                                setImage([{uri: voterIdBack?.path}]);
                                onClose(true);
                              }
                            }}>
                            <Image
                              source={{uri: voterIdBack?.path}}
                              style={styles.image}
                              resizeMode="cover"
                            />
                          </TouchableOpacity>
                        </>
                      )}

                      {/* Fallback Image */}
                      {!voterIdBack && (
                        <Image
                          source={require('../../assets/Images/VoterId.png')}
                          style={styles.image}
                          resizeMode="cover"
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.textView}>
                  <Text style={styles.label}>Voter ID No.</Text>
                  <Text style={styles.value}>
                    {userData?.voterId?.toUpperCase()}
                  </Text>
                </View>{' '}
              </>
            )}

            {userData?.panNo !== '' && (
              <>
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
                        <>
                          {/* Remove Icon */}
                          <Icon
                            name="close"
                            size={32}
                            color={R.colors.PRIMARY_LIGHT}
                            style={styles.icon}
                            onPress={() => {
                              setPanCard(null);
                            }}
                          />
                          {/* Display Image */}
                          <TouchableOpacity
                            onPress={() => {
                              if (panCard?.path) {
                                setImage([{uri: panCard?.path}]);
                                onClose(true);
                              }
                            }}>
                            <Image
                              source={{uri: panCard?.path}}
                              resizeMode="center"
                              style={[styles.image, {width: 180}]}
                            />
                          </TouchableOpacity>
                        </>
                      )}

                      {/* Fallback Image */}
                      {!panCard && (
                        <Image
                          source={require('../../assets/Images/panCard.png')}
                          resizeMode="center"
                          style={[styles.image, {width: 180}]}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.textView}>
                  <Text style={styles.label}>PAN Card No.</Text>
                  <Text style={styles.value}>
                    {userData?.panNo?.toUpperCase()}
                  </Text>
                </View>
              </>
            )}
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
                <Text style={styles.buttonText}>
                  Upload Client's House Photo
                </Text>
                <View>
                  {housePhoto && (
                    <>
                      {/* Remove Icon */}
                      <Icon
                        name="close"
                        size={32}
                        color={R.colors.PRIMARY_LIGHT}
                        style={styles.icon}
                        onPress={() => {
                          setHousePhoto(null);
                        }}
                      />
                      {/* Display Image */}
                      <TouchableOpacity
                        onPress={() => {
                          if (housePhoto?.path) {
                            setImage([{uri: housePhoto?.path}]);
                            onClose(true);
                          }
                        }}>
                        <Image
                          source={{uri: housePhoto?.path}}
                          style={styles.image}
                          resizeMode="center"
                        />
                      </TouchableOpacity>
                    </>
                  )}

                  {/* Fallback Image */}
                  {!housePhoto && (
                    <Image
                      source={require('../../assets/Images/homeVillage.jpeg')}
                      style={styles.image}
                      resizeMode="center"
                    />
                  )}
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
        )}
      </ScrollView>
      <Loader loading={loading} message={'please wait...'} />
      <ImageView
        images={image}
        imageIndex={0}
        visible={isVis}
        onRequestClose={() => onClose(false)}
      />
    </ScreenWrapper>
  );
};

const createStyles = colorScheme =>
  StyleSheet.create({
    scrollView: {
      padding: 12,
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
        colorScheme === 'dark' ? R.colors.GRAY : R.colors.LIGHTGRAY,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor:
        colorScheme === 'dark' ? R.colors.LIGHTGRAY : R.colors.DARKGRAY,
    },
    smallUploadButton: {
      width: '48%',
      padding: 16,
      backgroundColor:
        colorScheme === 'dark' ? R.colors.GRAY : R.colors.LIGHTGRAY,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor:
        colorScheme === 'dark' ? R.colors.LIGHTGRAY : R.colors.DARKGRAY,
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
      resizeMode: 'contain',
      zIndex: 999,
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
      width: '75%',
      alignSelf: 'center',
      fontSize: R.fontSize.XL,
    },
    label: {
      color: R.colors.PRIMARI_DARK,
      textAlign: 'center',
      width: '60%',
      alignSelf: 'center',
      fontSize: R.fontSize.XL,
      flex: 1,
    },
    value: {
      color: R.colors.PRIMARI_DARK,
      textAlign: 'center',
      borderBottomWidth: 1,
      fontSize: R.fontSize.XL,
      alignSelf: 'center',
      flex: 1,
      borderColor: R.colors.LIGHTGRAY,
    },
    camera: {
      // flex: 1,
      // width: '100%',
      height: Dimensions.get('screen').height - 100,
    },
    captureButton: {
      backgroundColor: '#007bff',
      padding: 15,
      borderRadius: 24,
      alignItems: 'center',
      width: '40%',
    },
  });

export default KYCCustomer;
