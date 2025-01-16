import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Image,
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import Geolocation from 'react-native-geolocation-service';
import Button from '../../library/commons/Button';
import R from '../../resources/R';

const GeotaggedImageApp = () => {
  const [location, setLocation] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);
  const [loading, setLoading] = useState(false);

  const devices = useCameraDevices();
  const device = devices.back; // Use the back camera

  // Request permissions for camera and location
  const requestPermissions = async () => {
    try {
      const cameraPermission = await Camera.requestCameraPermission();
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

      if (
        cameraPermission === PermissionsAndroid.RESULTS.GRANTED &&
        locationPermission === PermissionsAndroid.RESULTS.GRANTED
      ) {
        setHasPermission(true);
        fetchGeolocation();
      } else {
        Alert.alert(
          'Permission Denied',
          'Camera or location permission denied.',
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Fetch geolocation data
  const fetchGeolocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('position', position);
        setLocation(position.coords);
      },
      error => {
        Alert.alert('Error', 'Failed to fetch geolocation.');
        console.error(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  // Start location updates every 30 seconds
  useEffect(() => {
    if (hasPermission) {
      const intervalId = setInterval(fetchGeolocation, 30000);
      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [hasPermission]);

  // Capture photo using the camera
  const captureImage = async () => {
    if (!cameraRef || !location) {
      Alert.alert('Error', 'Camera or location data is not ready.');
      return;
    }

    setLoading(true);
    try {
      const photo = await cameraRef.takePhoto({
        flash: 'off',
      });

      const imageWithMetadata = {
        uri: `file://${photo.path}`,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      setImageUri(imageWithMetadata.uri);
      Alert.alert(
        'Image Captured',
        `Latitude: ${location.latitude}, Longitude: ${location.longitude}`,
      );
    } catch (error) {
      console.error('Error capturing image:', error);
      Alert.alert('Error', 'Failed to capture image.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);
  console.log(
    'hasPermission || !device || !location',
    hasPermission,
    device,
    location,
  );
  if (!hasPermission || !device || !location) {
    return (
      <View style={styles.centered}>
        <Text>Fetching permissions, device, or location...</Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      {imageUri ? (
        <View style={styles.resultContainer}>
          <Text style={styles.text}>Geotagged Image:</Text>
          <Image source={{uri: imageUri}} style={styles.image} />
          <Button
            title="Retry"
            onPress={() => setImageUri(null)}
            buttonStyle={{width: '40%', alignSelf: 'center'}}
            backgroundColor={R.colors.DARK_BLUE}
            textStyle={{
              fontWeight: 'bold',
            }}
          />
        </View>
      ) : (
        <>
          <View style={{flex: 1}}>
            <Camera
              ref={ref => setCameraRef(ref)}
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={true}
              photo={true} // Enable photo capture
            />
            {location && (
              <View style={styles.overlay}>
                <Text style={styles.coordinates}>
                  Latitude: {location.latitude.toFixed(6)}
                </Text>
                <Text style={styles.coordinates}>
                  Longitude: {location.longitude.toFixed(6)}
                </Text>
              </View>
            )}
          </View>
          <Button
            title="Capture Image"
            onPress={captureImage}
            layout="circle"
            icon={'camera'}
            color={R.colors.PRIMARY_LIGHT}
            size={60}
            buttonStyle={{
              height: 100,
              width: 100,
              borderRadius: 50,
              position: 'absolute',
              bottom: 20,
              alignSelf: 'center',
            }}
            backgroundColor={R.colors.DARK_ORANGE}
          />
        </>
      )}
      {loading && <Text style={styles.text}>Processing...</Text>}
    </View>
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
    bottom: 0,
    padding: 10,
    backgroundColor: '#FF6666',
    borderRadius: 8,
    height: '30%',
    width: '100%',
    opacity: 0.6,
  },
  coordinates: {
    color: R.colors.PRIMARY_LIGHT,
    fontSize: 16,
    marginVertical: 2,
    fontWeight: '800',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginVertical: 10,
  },
  image: {
    width: 300,
    height: 300,
    marginVertical: 10,
  },
});

export default GeotaggedImageApp;

// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Alert,
//   PermissionsAndroid,
//   Image,
// } from 'react-native';
// import {Camera, getCameraDevice} from 'react-native-vision-camera';
// import Geolocation from 'react-native-geolocation-service';
// import {captureScreen} from 'react-native-view-shot';
// import Button from '../../library/commons/Button';
// import R from '../../resources/R';

// const GeotaggedImageApp = () => {
//   const [location, setLocation] = useState(null);
//   const [imageUri, setImageUri] = useState(null);
//   const [hasPermission, setHasPermission] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [device, setDevice] = useState(null);

//   // Request permissions for camera and location
//   const requestPermissions = async () => {
//     try {
//       const cameraPermission = await Camera.requestCameraPermission();
//       const locationPermission = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: 'Location Permission',
//           message:
//             'This app needs access to your location to geotag the image.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );

//       if (
//         cameraPermission === PermissionsAndroid.RESULTS.GRANTED &&
//         locationPermission === PermissionsAndroid.RESULTS.GRANTED
//       ) {
//         setHasPermission(true);
//         fetchGeolocation();
//       } else {
//         Alert.alert(
//           'Permission Denied',
//           'Camera or location permission denied.',
//         );
//       }
//     } catch (err) {
//       console.warn(err);
//     }
//   };

//   // Fetch geolocation data
//   const fetchGeolocation = () => {
//     Geolocation.getCurrentPosition(
//       position => {
//         console.log('position', position);
//         setLocation(position.coords);
//       },
//       error => {
//         Alert.alert('Error', 'Failed to fetch geolocation.');
//         console.error(error);
//       },
//       {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
//     );
//   };

//   // Start location updates every 30 seconds
//   useEffect(() => {
//     if (hasPermission) {
//       const intervalId = setInterval(fetchGeolocation, 30000);
//       return () => clearInterval(intervalId); // Cleanup on unmount
//     }
//   }, [hasPermission]);

//   // Fetch available camera device
//   useEffect(() => {
//     const getDevice = async () => {
//       const devices = await Camera.getAvailableCameraDevices();
//       setDevice(getCameraDevice(devices, 'front'));
//     };
//     getDevice();
//   }, []);

//   // Capture the screen with geolocation data overlay
//   const captureImage = async () => {
//     setLoading(true);
//     try {
//       const uri = await captureScreen({
//         format: 'jpg',
//         quality: 1,
//       });
//       setImageUri(uri);
//       Alert.alert('Image Captured', 'Geotagged image saved successfully.');
//     } catch (error) {
//       console.error('Error capturing image:', error);
//       Alert.alert('Error', 'Failed to capture image.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     requestPermissions();
//   }, []);

//   if (!hasPermission || !device || !location) {
//     return (
//       <View style={styles.centered}>
//         <Text>Fetching permissions, device, or location...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{flex: 1}}>
//       {imageUri ? (
//         <View style={styles.resultContainer}>
//           <Text style={styles.text}>Geotagged Image:</Text>
//           <Image source={{uri: imageUri}} style={styles.image} />
//           <Button
//             title="Retry"
//             onPress={() => setImageUri(null)}
//             buttonStyle={{width: '40%', alignSelf: 'center'}}
//             backgroundColor={R.colors.DARK_BLUE}
//             textStyle={{
//               fontWeight: 'bold',
//             }}
//           />
//         </View>
//       ) : (
//         <>
//           <View style={{flex: 1}}>
//             <Camera
//               style={StyleSheet.absoluteFill}
//               device={device}
//               isActive={true}
//             />
//             {location && (
//               <View style={styles.overlay}>
//                 <Text style={styles.coordinates}>
//                   Latitude: {location.latitude.toFixed(6)}
//                 </Text>
//                 <Text style={styles.coordinates}>
//                   Longitude: {location.longitude.toFixed(6)}
//                 </Text>
//               </View>
//             )}
//           </View>
//           <Button
//             title="Capture Image"
//             onPress={captureImage}
//             layout="circle"
//             icon={'camera'}
//             color={R.colors.PRIMARY_LIGHT}
//             size={60}
//             buttonStyle={{
//               height: 100,
//               width: 100,
//               borderRadius: 50,
//               position: 'absolute',
//               bottom: 20,
//               alignSelf: 'center',
//             }}
//             backgroundColor={R.colors.DARK_ORANGE}
//           />
//         </>
//       )}
//       {loading && <Text style={styles.text}>Processing...</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   overlay: {
//     position: 'absolute',
//     bottom: 0,
//     padding: 10,
//     backgroundColor: '#FF6666',
//     borderRadius: 8,
//     height: '30%',
//     width: '100%',
//     opacity: 0.6,
//   },
//   coordinates: {
//     color: R.colors.PRIMARY_LIGHT,
//     fontSize: 16,
//     marginVertical: 2,
//     fontWeight: '800',
//   },
//   resultContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 16,
//     marginVertical: 10,
//   },
//   image: {
//     width: 300,
//     height: 300,
//     marginVertical: 10,
//   },
// });

// export default GeotaggedImageApp;
