import { useEffect } from 'react';
import BackgroundGeolocation from 'react-native-background-geolocation';
import UserApi from '../../datalib/services/user.api';
import { useSelector } from 'react-redux';
import { currentUserSelector } from '../../store/slices/user/user.slice';
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBsc_32ip44ZxiwytqSxKdczopDmUAFpow';

const useLocationTracking = () => {
  const user = useSelector(currentUserSelector);
  console.log('user____', user);

  useEffect(() => {
    if (!user) return;

    const configureLocationTracking = async () => {
      await BackgroundGeolocation.ready(
        {
          desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
          distanceFilter: 10, // Updates every 10 meters
          stopOnTerminate: false,
          startOnBoot: true,
          debug: true, // Enable logs (set to false in production)
          logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        },
        (state) => {
          if (!state.enabled) {
            console.log('____START');
            BackgroundGeolocation.start(); // Start tracking
          }
        }
      );

      // Listen for location updates
      const locationHandler = (location) => {
        console.log('New location:', location);
        saveLocation(location);
      };

      BackgroundGeolocation.onLocation(locationHandler);

      return () => {
        BackgroundGeolocation.removeListener(locationHandler);
        BackgroundGeolocation.removeListeners(); // Ensures cleanup
      };
    };

    configureLocationTracking();
  }, [user]); // ✅ Added user as a dependency

  const saveLocation = async (location) => {
    try {
      const { latitude, longitude } = location?.coords;
      console.log('Saving location:', latitude, longitude);

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );

      const fetchedAddress = response?.data?.results[0]?.formatted_address;
      console.log('Fetched Address:', fetchedAddress);

      if (fetchedAddress) {
        const payload = {
          data: {
            StaffID: user?.staffid,
            StaffType: user?.stafftype,
            Lat: latitude,
            Long: longitude,
            TimeTamp: location?.timestamp, // Timestamp of location update
            Address: fetchedAddress,
            Distance: 0,
          },
        };

        const res = await new UserApi().startTracking(payload);
        console.log('Tracking Response:', res);
      }
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };
};

export default useLocationTracking;















// import {useEffect} from 'react';
// import BackgroundGeolocation from 'react-native-background-geolocation';
// import UserApi from '../../datalib/services/user.api';
// import {useSelector} from 'react-redux';
// import {currentUserSelector} from '../../store/slices/user/user.slice';
// import axios from 'axios';

// const useLocationTracking = () => {
//   const user = useSelector(currentUserSelector);
//   console.log('user____', user);
//   useEffect(() => {
//     if (user) {
//       BackgroundGeolocation.ready(
//         {
//           desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
//           distanceFilter: 10, // Updates every 10 meters
//           stopOnTerminate: false,
//           startOnBoot: true,
//           debug: true, // Set to true to see logs
//           logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
//           // schedule: [
//           //   "1 17:30-21:00",    // Sunday: 5:30pm-9:00pm
//           //   "2-6 9:00-17:00",   // Mon-Fri: 9:00am to 5:00pm
//           //   "2,4,6 20:00-00:00",// Mon, Web, Fri: 8pm to midnight (next day)
//           //   "7 10:00-19:00"     // Sat: 10am-7pm
//           // ]
//         },
//         state => {
//           if (!state.enabled) {
//             console.log('____START');
//             BackgroundGeolocation.start(); // Start tracking
//           }
//         },
//       );

//       // Listen for location updates
//       BackgroundGeolocation.onLocation(location => {
//         console.log('New location:', location);
//         saveLocation(location);
//       });

//       return () => {
//         BackgroundGeolocation.removeListeners();
//       };
//     }
//   }, []);

//   const saveLocation = async location => {
//     const {latitude, longitude} = location?.coords;
//     console.log('Saving location:', latitude, longitude);
//     const API_KEY = 'AIzaSyBsc_32ip44ZxiwytqSxKdczopDmUAFpow';

//     const response = await axios.get(
//       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`,
//     );
//     const fetchedAddress = response?.data?.results[0]?.formatted_address;
//     console.log('fetchedAddress', fetchedAddress);
//     if (fetchedAddress) {
//       const payload = {
//         data: {
//           StaffID: user?.staffid,
//           StaffType: user?.stafftype,
//           Lat: latitude,
//           Long: longitude,
//           TimeTamp: location?.timestamp, // Current timestamp
//           Address: fetchedAddress,
//           Distance: 0,
//         },
//       };

//       const res = await new UserApi().startTracking(payload);
//       console.log('________', res);
//     }
//     // You can save to AsyncStorage, SQLite, or send to an API
//   };
// };

// export default useLocationTracking;
