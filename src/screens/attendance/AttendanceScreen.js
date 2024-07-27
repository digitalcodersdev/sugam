import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';
import {TextInput} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../library/commons/Button';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
const AttendanceScreen = () => {
  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader
        style={{backgroundColor: R.colors.PRIMARY_LIGHT}}
        screenName={'Attandence'}
      />
      <View>
        <Text
          style={{
            fontWeight: 'bold',
            marginTop: 20,
            fontSize: 20,
            color: R.colors.PRIMARI_DARK,
          }}>
          12-02-2024 3:44 pm
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 20,
          justifyContent: 'space-around',
        }}>
        <TextInput
          style={{
            borderWidth: 0.1,
            borderRadius: 10,
            color: R.colors.PRIMARY_LIGHT,
            width: '45%',
            fontSize: 20,
          }}
          placeholder="Location"
        />
        <TextInput
          style={{
            borderWidth: 0.1,
            borderRadius: 10,
            width: '45%',
            fontWeight: 'bold',
            color: R.colors.PRIMARI_DARK,
            fontSize: 20,
          }}
          placeholder="Working From    *"
        />
      </View>
      <View style={{paddingLeft: 100}}>
        <Button
          title="Clock in"
          buttonStyle={{
            alignSelf: 'center',
            width: '40%',
            marginTop: 20,
          }}
        />
      </View>
      <View style={styles.textbar}>
        <View style={styles.ImageView}>
          <Image source={require('../../assets/Images/Image.png')} />
        </View>
        <View>
          <Text
            style={{
              color: R.colors.PRIMARI_DARK,
              fontWeight: 'bold',
              fontSize: 18,
            }}>
            Check-in
          </Text>
          <Text
            style={{
              color: R.colors.SECONDARY,
              fontWeight: 'bold',
              fontSize: 20,
            }}>
            09:30 AM
          </Text>
        </View>
        <View>
          <Text
            style={{
              color: R.colors.PRIMARI_DARK,
              fontWeight: 'bold',
              fontSize: 18,
            }}>
            Check-out
          </Text>

          <Text style={{color: '#FF5C3A', fontWeight: 'bold', fontSize: 20}}>
            09:30 PM
          </Text>
        </View>
      </View>
      <View
        style={{
          paddingLeft: 130,
          flexDirection: 'row',
          color: R.colors.PRIMARI_DARK,
        }}>
        <Icon
          name="map-marker"
          size={25}
          color={R.colors.PRIMARI_DARK}
          style={{color: '#FFA200'}}
        />
        <Text style={{fontSize: 15, color: R.colors.PRIMARI_DARK}}>
          8 S Jefferson St, New Ulm, MN
        </Text>
      </View>
    </ScreenWrapper>
  );
};

export default AttendanceScreen;
const styles = StyleSheet.create({
  textbar: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-around',
  },
});
