import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Image,
  ActivityIndicator,
} from 'react-native';
import {Camera} from 'react-native-vision-camera';
import Geolocation from 'react-native-geolocation-service';
import Button from '../../library/commons/Button';
import R from '../../resources/R';
import ViewShot from 'react-native-view-shot';
import {launchCamera} from 'react-native-image-picker';
import Loader from '../../library/commons/Loader';
import Modal from 'react-native-modal';
import axios from 'axios';
import moment from 'moment';

const GeotaggedImageModal = ({isVisible, onClose, onImageCaptured}) => {
  const [location, setLocation] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finalImgUri, setFinalImgUri] = useState(null);
  const [address, setAddress] = useState('');
  const viewRef = useRef(null);
  const reset = () => {
    setFinalImgUri(null);
    setImageUri(null);
    setAddress(null);
  };

  const requestPermissions = useCallback(async () => {
    try {
      const locationPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This app needs access to your location to geotag the image.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      const cameraPermission = await Camera.requestCameraPermission();
      if (
        locationPermission === PermissionsAndroid.RESULTS.GRANTED &&
        cameraPermission === PermissionsAndroid.RESULTS.GRANTED
      ) {
        setHasPermission(true);
      } else {
        Alert.alert('Permission Denied', 'Required permissions were denied.');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  }, []);

  const fetchGeolocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        const API_KEY = 'AIzaSyBsc_32ip44ZxiwytqSxKdczopDmUAFpow';
        const res = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`,
        );
        const fetchedAddress = res?.data?.results[0]?.formatted_address;
        setAddress(fetchedAddress);
        setLocation(position.coords);
      },
      error => {
        Alert.alert('Error', 'Failed to fetch geolocation.');
        console.error(error);
      },
      {enableHighAccuracy: true, timeout: 30000, maximumAge: 30000},
    );
  }, []);

  const captureImageWithLatlong = useCallback(async () => {
    if (viewRef.current && location) {
      try {
        const uri = await viewRef.current.capture();
        setFinalImgUri(uri);
        if (onImageCaptured) onImageCaptured(uri, reset);
        onClose && onClose(false);
      } catch (error) {
        console.log(error);
      }
    }
  }, [onImageCaptured, location, address]);

  const capturePhoto = useCallback(() => {
    launchCamera({mediaType: 'photo', quality: 0.9}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        console.log(response.assets[0]);
        setImageUri(response.assets[0]?.uri);
      }
    });
  }, []);

  useEffect(() => {
    if (isVisible && !hasPermission) {
      requestPermissions();
    }
    if (isVisible && hasPermission && location && address != '') {
      capturePhoto();
    }
  }, [isVisible, hasPermission, requestPermissions]);

  useEffect(() => {
    if (hasPermission && location === null) {
      fetchGeolocation();
    }
  }, [hasPermission, location, fetchGeolocation]);

  useEffect(() => {
    if (imageUri && location) {
      setTimeout(() => captureImageWithLatlong(), 1000);
    }
  }, [imageUri, location, captureImageWithLatlong]);

  useEffect(() => {
    if (hasPermission && location) {
      capturePhoto();
    }
  }, [hasPermission, location, capturePhoto]);

  if (!hasPermission || !location) {
    return (
      <Modal isVisible={isVisible} onBackdropPress={onClose}>
        <View style={styles.centered}>
          <Text style={{fontSize: 14, fontWeight: '800'}}>
            Fetching permissions, camera device, or location...
          </Text>
          <ActivityIndicator size="large" color={R.colors.DARK_ORANGE} />
        </View>
      </Modal>
    );
  }

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={{flex: 1}}>
        {imageUri && finalImgUri == null ? (
          <View style={styles.resultContainer}>
            <ViewShot ref={viewRef} style={{flex: 1, position: 'absolute'}}>
              <Image source={{uri: imageUri}} style={styles.image} />
              {location && (
                <View style={styles.overlay}>
                  <Text style={styles.coordinates}>
                    Latitude: {location.latitude.toFixed(6)}
                  </Text>
                  <Text style={styles.coordinates}>
                    Longitude: {location.longitude.toFixed(6)}
                  </Text>
                  <Text style={styles.coordinates}>
                    Accuracy: {location.accuracy.toFixed(6)}
                  </Text>
                  <Text style={styles.coordinates}>
                    Altitude: {location.altitude.toFixed(6)}
                  </Text>
                  <Text style={styles.coordinates}>
                    AltitudeAccuracy: {location.altitudeAccuracy.toFixed(6)}
                  </Text>
                  <Text style={styles.coordinates}>Address: {address}</Text>
                  <Text style={styles.coordinates}>
                    Date & Time:{' '}
                    {`${moment(new Date()).format(
                      'YYYY-MM-DD',
                    )} ${new Date().toLocaleTimeString()}`}
                  </Text>
                </View>
              )}
            </ViewShot>
            <Button
              title="Retry"
              onPress={() => setImageUri(null)}
              buttonStyle={{
                width: '40%',
                alignSelf: 'center',
                position: 'absolute',
                bottom: 20,
              }}
            />
          </View>
        ) : finalImgUri !== null ? (
          <View style={styles.resultContainer}>
            <ViewShot ref={viewRef} style={{flex: 1, position: 'absolute'}}>
              <Image source={{uri: finalImgUri}} style={styles.image} />
              {location && (
                <View style={styles.overlay}>
                  <Text style={styles.coordinates}>
                    Latitude: {location.latitude.toFixed(6)}
                  </Text>
                  <Text style={styles.coordinates}>
                    Longitude: {location.longitude.toFixed(6)}
                  </Text>
                  <Text style={styles.coordinates}>
                    Accuracy: {location.accuracy.toFixed(6)}
                  </Text>
                  <Text style={styles.coordinates}>
                    Altitude: {location.altitude.toFixed(6)}
                  </Text>
                  <Text style={styles.coordinates}>
                    AltitudeAccuracy: {location.altitudeAccuracy.toFixed(6)}
                  </Text>
                  <Text style={styles.coordinates}>Address: {address}</Text>
                  <Text style={styles.coordinates}>
                    Date & Time:{' '}
                    {`${moment(new Date()).format(
                      'YYYY-MM-DD',
                    )} ${new Date().toLocaleTimeString()}`}
                  </Text>
                </View>
              )}
            </ViewShot>
            <Button
              title="Change Picture"
              onPress={() => {
                setImageUri(null);
                setFinalImgUri(null);
              }}
              buttonStyle={{
                width: '40%',
                alignSelf: 'center',
                position: 'absolute',
                bottom: 20,
              }}
            />
          </View>
        ) : (
          <Button
            title="Capture Image"
            onPress={capturePhoto}
            layout="circle"
            icon={'camera'}
            size={60}
            buttonStyle={styles.captureButton}
            backgroundColor={R.colors.DARK_ORANGE}
          />
        )}
        {loading && <Loader loading={loading} message={'please wait...'} />}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 8,
    width: '100%',
  },
  coordinates: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginVertical: 10,
    borderWidth: 1,
    resizeMode: 'cover',
  },
  captureButton: {
    height: 100,
    width: 100,
    borderRadius: 50,
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    zIndex: 999,
  },
});

export default GeotaggedImageModal;
