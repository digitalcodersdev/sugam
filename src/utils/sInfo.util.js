import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Explore sharedPreferencesName and keychainService...also check how secure is this library as it maintains JWT/Firebase uid
const sInfoUtil = {
  save: async (key, value) => {
    await AsyncStorage.setItem(key, value);
  },
  fetch: async key => await AsyncStorage.getItem(key, null),
  remove: async key => {
    await AsyncStorage.removeItem(key);
  },
};

export default sInfoUtil;
