import {StyleSheet, Text, View, FlatList, useColorScheme} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';
import {Picker} from '@react-native-picker/picker';
import CollectionItem from '../../library/commons/CollectionItem';
import CircularProgress from '../../components/CircularProgress';
import Button from '../../library/commons/Button';
import ClientItem from '../../library/commons/ClientItem';
import { useNavigation } from '@react-navigation/native';

const CenterCollection = ({route}) => {
    const navigation = useNavigation()
    console.log(route?.params);


  const data = {
    id: 1,
    center: 385,
    time: '10:00 AM',
    target: '₹ 7,400.0',
    received: '₹ 7,400.0',
    balance: '₹ 0.0',
    percentage: 100,
    branchName: 'Karnal',
    Note: 'Before Collection Start Meeting',

  };
  const DATA = [
    {
      id: 1,
      name: 'Ramvati',
      laonId: 340987,
      dueBalance: '₹ 7,400.0',
      received: '₹ 7,400.0',
      percentage: 100,
      branchName: 'Karnal',
      Note: 'Before Collection Start Meeting',
      emi:"16/9",
      phone:8265805176
    },
    {
      id: 2,
      name: 'Punit',
      laonId: 357033,
      dueBalance: '₹ 3,400.0',
      received: '₹ 3,400.0',
      percentage: 100,
      branchName: 'Karnal',
      Note: 'Before Collection Start Meeting',
      emi:"16/8",
      phone:8265805187
    },
  ];
  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={'Collection'} />
      <View
        style={{
          backgroundColor: R.colors.SLATE_GRAY,
          padding: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <CircularProgress
            percentage={data?.percentage}
            fillColor={R.colors.GREEN}
            backgroundColor="gray"
            textColor={R.colors.PRIMARY_LIGHT}
          />

          <View style={{flex: 1, paddingHorizontal: 10}}>
     
            <Text style={[styles.value]}>Branch Name : {data?.branchName}</Text>
            <Text style={[styles.value]}>Center ID : {data?.center}</Text>
            <Text style={[styles.value]}>Center Time : {data?.center}</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.view}>
            <Text style={styles.label}>Target</Text>
            <Text style={[styles.value, {textAlign: 'center'}]}>
              {data?.target}
            </Text>
          </View>
          <View style={styles.view}>
            <Text style={styles.label}>Received</Text>
            <Text
              style={[
                styles.value,
                {color: R.colors.GREEN, textAlign: 'center'},
              ]}>
              {data?.received}
            </Text>
          </View>
          <View style={styles.view}>
            <Text style={styles.label}>Balance</Text>
            <Text
              style={[
                styles.value,
                {color: R.colors.primary, textAlign: 'center'},
              ]}>
              {data?.balance}
            </Text>
          </View>
        </View>
        <Text style={styles.msg}>Note* : Before Collection Start Meeting</Text>
      </View>

      <View style={styles.container}>
        <Button
          title="Request For QR Payment"
          buttonStyle={styles.btn}
          textStyle={{fontWeight: 'bold'}}
        />
        {DATA?.length >= 1 ? (
          <FlatList
            data={DATA}
            keyExtractor={item => item?.id}
            renderItem={({item, index}) => (
              <ClientItem Item item={item} index={index} />
            )}
          />
        ) : null}
      </View>
    </ScreenWrapper>
  );
};

export default CenterCollection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  tabText: {
    flex: 1,
    textAlign: 'center',
    color: R.colors.PRIMARY_LIGHT,
    backgroundColor: R.colors.DARKGRAY,
    textAlignVertical: 'center',
    height: 40,
    fontWeight: '700',
    fontSize: R.fontSize.L,
    margin: 10,
  },
  viewInput: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'flex-end',
    marginVertical: 5,
    borderWidth: 0.5,
    borderRadius: 6,
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    color: R.colors.PRIMARI_DARK,
    marginRight: 10,
    alignSelf: 'left',
  },
  label: {
    color: R.colors.PRIMARI_DARK,
    fontWeight: '500',
    fontSize: R.fontSize.L,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  value: {
    color: R.colors.PRIMARY_LIGHT,
    fontWeight: '700',
    fontSize: R.fontSize.L,
    textAlign: 'left',
    flexWrap: 'wrap',
  },
  view: {
    flex: 1,
    justifyContent: 'center',
  },
  msg: {
    fontWeight: '700',
    textAlign: 'center',
    color: R.colors.WHITE,
    fontSize: R.fontSize.L,
  },
  btn: {
    width: '70%',
    alignSelf: 'center',
    margin: 10,
    borderRadius: 4,
    backgroundColor: R.colors.primary,
  },
});
