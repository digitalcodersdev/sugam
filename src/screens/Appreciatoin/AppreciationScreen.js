import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import R from '../../resources/R';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../library/commons/Button';
import {ScrollView} from 'react-native-gesture-handler';

const AppreciationScreen = () => {
  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader
        style={{backgroundColor: R.colors.PRIMARY_LIGHT}}
        screenName={'Appreciation'}
      />
      <ScrollView horizontal={true}>
        <View style={styles.placeview}>
          <View style={styles.textinput}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 15,
                color: R.colors.PRIMARI_DARK,
              }}>
              Given To
            </Text>
            <Icon
              name="swap-vertical"
              size={15}
              color={R.colors.PRIMARI_DARK}
              style={{}}
            />

            <View style={styles.nothing}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 15,
                  color: R.colors.PRIMARI_DARK,
                }}>
                Award Name
              </Text>
            </View>
            <Icon
              name="swap-vertical"
              size={15}
              color={R.colors.PRIMARI_DARK}
            />
            <View style={styles.nothing}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: R.colors.PRIMARI_DARK,
                  fontSize: 15,
                }}>
                Given On
              </Text>
            </View>
            <Icon
              name="swap-vertical"
              size={15}
              color={R.colors.PRIMARI_DARK}
            />

            <Text
              style={{
                fontWeight: 'bold',
                color: R.colors.PRIMARI_DARK,
                fontSize: 15,
              }}>
              Action
            </Text>
            <Icon
              name="swap-vertical"
              size={15}
              color={R.colors.PRIMARI_DARK}
            />
            {/* <Button
          title="View"
          buttonStyle={{
            alignSelf: 'center',
            width: '20%',
          }}
        /> */}
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default AppreciationScreen;
const styles = StyleSheet.create({
  placeview: {
    height: 50,
    width: 600,
    backgroundColor: R.colors.LIGHTGRAY,
  },
  textinput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    color: R.colors.PRIMARI_DARK,
  },
  nothing: {},
});
