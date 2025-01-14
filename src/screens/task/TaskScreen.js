import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Image,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import ImagePicker from 'react-native-image-crop-picker';
import {Camera, getCameraDevice} from 'react-native-vision-camera';
import R from '../../resources/R';
import RNFS from 'react-native-fs';
import Loader from '../../library/commons/Loader';
import RNImageManipulator from 'react-native-image-manipulator';

const CaptureWithGPSTags = () => {
  const cameraRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [isCameraReady, setCameraReady] = useState(false);
  const devices = Camera.getAvailableCameraDevices();
  const device = getCameraDevice(devices, 'back');
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState(null);

  // Request permissions for camera and location on mount
  useEffect(() => {
    requestLocationPermission();
    requestPermissions();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This app needs access to your location ' +
            'so we can know where you are.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getLocation();
      } else {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to fetch geolocation.',
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestPermissions = async () => {
    const cameraPermission = await Camera.requestCameraPermission();
    if (cameraPermission !== 'granted') {
      Alert.alert('Camera Permission Denied');
    }
  };

  const getLocation = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
      },
      error => {
        console.error('Location Error:', error);
        Alert.alert('Error getting location. Please enable location services.');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
    setLoading(false);
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


    // Function to extract text from image
    const extractTextFromImage = async (uri) => {
      try {
        const tessOptions = {
          whitelist: null, // Optional: Define whitelist to limit characters
          blacklist: null,  // Optional: Define blacklist for characters to exclude
        };
  
        const result = await TesseractOcr.recognize(uri, 'ENG', tessOptions);
        console.log('Extracted Text:', result);
        setExtractedText(result);
      } catch (error) {
        console.error('OCR Error:', error);
        Alert.alert('Error', 'Failed to extract text from the image');
      }
    };

  const captureAndCropImage = async () => {
    if (!cameraRef.current) return;

    try {
      // Capture the photo
      const photo = await cameraRef.current.takePhoto({
        quality: 1,
        skipMetadata: false,
      });

      // Copy the captured image to permanent storage
      const permanentPath = await copyImageToPermanentStorage(photo.path);
      if (permanentPath) {
        setImagePath(permanentPath);

        // // Crop the image
        // ImagePicker.openCropper({
        //   path: `file://${permanentPath}`, // Add file:// prefix for permanent file
        //   freeStyleCropEnabled: true,
        // }).then(croppedImage => {
        //   setImagePath(croppedImage.path);
        //   extractTextFromImage(croppedImage.path);

        //   // Add Latitude and Longitude to the cropped image
        //   if (location) {
        //     const {latitude, longitude} = location;

        //     RNImageManipulator.manipulate(
        //       croppedImage.path,
        //       [{rotate: 90}, {flip: {vertical: true}}],
        //       {
        //         format: 'png',
        //         metadata: {GPS: {Latitude: latitude, Longitude: longitude}},
        //       },
        //     ).then(taggedImage => {
        //       Alert.alert(
        //         'Image Captured and Tagged',
        //         `Image saved at: ${taggedImage.uri}`,
        //       );
        //     });
        //   } else {
        //     Alert.alert('Location not available');
        //   }
        // });
      }
    } catch (error) {
      console.error('Error capturing or cropping photo:', error);
      Alert.alert('Error', 'Failed to capture or crop the photo');
    }
  };

  if (device == null) {
    return <Text>Loading Camera...</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
        onInitialized={() => setCameraReady(true)}
      />
      <Pressable
        style={styles.captureButton}
        onPress={isCameraReady ? captureAndCropImage : null}>
        <Text style={styles.buttonText}>Capture and Crop Image</Text>
      </Pressable>
      {imagePath && (
        <View style={styles.imagePreviewContainer}>
          <Text>Captured Image</Text>
          <Image source={{uri: imagePath}} style={styles.imagePreview} />
        </View>
      )}
      <Loader loading={loading} message={'please wait...'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 10,
    borderColor: 'black',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  captureButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 30,
  },
  buttonText: {
    color: R.colors.PRIMARI_DARK,
    fontSize: 18,
  },
  imagePreviewContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  imagePreview: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default CaptureWithGPSTags;
