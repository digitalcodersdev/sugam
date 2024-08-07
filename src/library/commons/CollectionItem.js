import {StyleSheet, Text, View, Pressable} from 'react-native';
import React from 'react';
import R from '../../resources/R';
import CircularProgress from '../../components/CircularProgress';
import {useNavigation} from '@react-navigation/native';
import ScreensNameEnum from '../../constants/ScreensNameEnum';

const CollectionItem = ({item}) => {
  const navigation = useNavigation();
  return (
    <Pressable
      style={styles.item}
      onPress={() =>
        navigation.navigate(ScreensNameEnum.CENTER_COLECTION_SCREEN)
      }>
      <View style={{flexDirection: 'row'}}>
        <Text
          style={{
            color: R.colors.PRIMARI_DARK,
            fontWeight: '500',
            flex: 1,
            fontSize: R.fontSize.M,
          }}>
          Center : {item.center}
        </Text>
        <Text
          style={{
            color: R.colors.PRIMARI_DARK,
            fontWeight: '500',
            flex: 1,
            fontSize: R.fontSize.M,
          }}>
          Center Time : {item.time}
        </Text>
        <Text style={styles.uplaod}>Upload</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <CircularProgress
          percentage={item?.percentage}
          fillColor={R.colors.GREEN}
          backgroundColor={R.colors.LIGHTGRAY}
        />
        <View style={styles.view}>
          <Text style={styles.label}>Target</Text>
          <Text style={styles.value}>{item?.target}</Text>
        </View>
        <View style={styles.view}>
          <Text style={styles.label}>Received</Text>
          <Text style={[styles.value, {color: R.colors.GREEN}]}>
            {item?.received}
          </Text>
        </View>
        <View style={styles.view}>
          <Text style={styles.label}>Balance</Text>
          <Text style={[styles.value, {color: R.colors.primary}]}>
            {item?.balance}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 0.2,
    borderBottomColor: R.colors.SLATE_GRAY,
    backgroundColor: '#FFFFFF',
    shadowColor: R.colors.SLATE_GRAY,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 6,
  },
  uplaod: {
    color: 'blue',
    fontWeight: '800',
    fontSize: R.fontSize.M,
    textDecorationLine: 'underline',
    paddingHorizontal: 5,
  },
  label: {
    color: R.colors.PRIMARI_DARK,
    fontWeight: '400',
    fontSize: 12,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  value: {
    color: R.colors.PRIMARI_DARK,
    fontWeight: '700',
    fontSize: R.fontSize.M,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  view: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default CollectionItem;
