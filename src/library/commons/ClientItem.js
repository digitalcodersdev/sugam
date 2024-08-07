import {StyleSheet, Text, View, Pressable} from 'react-native';
import React from 'react';
import R from '../../resources/R';
import CircularProgress from '../../components/CircularProgress';
import {useNavigation} from '@react-navigation/native';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import Button from './Button';

const ClientItem = ({item}) => {
  const navigation = useNavigation();
  return (
    <Pressable style={styles.item} onPress={() => {}}>
      <View style={styles.row}>
        <Text style={styles.name}>{item?.name}</Text>
        <Text
          style={styles.loanId}
          onPress={() =>
            navigation.navigate(ScreensNameEnum.CLIENT_COLLECTION_SCREEN, {
              dt: item,
            })
          }>
          Loan ID: {item?.laonId}
        </Text>
        <Text style={styles.dueBalance}>{item?.dueBalance}</Text>
      </View>
      <View style={styles.row}>
        <Button
          buttonStyle={styles.presentBtn}
          textStyle={styles.btnText}
          textColor={R.colors.PRIMARY_LIGHT}
          title="Present"
        />
        <Button
          buttonStyle={styles.absentBtn}
          textStyle={styles.btnText}
          textColor={R.colors.PRIMARY_LIGHT}
          title="Absent"
        />
        <Text style={styles.received}>{item?.received}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 15,
    marginVertical: 8,
    borderWidth: 0.5,
    borderColor: R.colors.SLATE_GRAY,
    backgroundColor: '#FFFFFF',
    shadowColor: R.colors.SLATE_GRAY,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  name: {
    color: R.colors.PRIMARI_DARK,
    fontWeight: '500',
    fontSize: R.fontSize.M,
    flex: 1,
  },
  loanId: {
    color: R.colors.primary,
    fontWeight: '500',
    fontSize: 15,
    flex: 1,
  },
  dueBalance: {
    color: 'blue',
    fontWeight: '800',
    fontSize: R.fontSize.L,
    textDecorationLine: 'underline',
    paddingHorizontal: 5,
    flex: 1,
    textAlign: 'right',
  },
  btn: {
    flex: 1,
    margin: 5,
  },
  presentBtn: {
    backgroundColor: R.colors.GREEN,
    borderRadius: 4,
    height: 45,
    width: '30%',
    marginHorizontal: 5,
  },
  absentBtn: {
    backgroundColor: R.colors.primary,
    borderRadius: 4,
    height: 45,
    width: '30%',
    marginHorizontal: 5,
  },
  btnText: {
    padding: 0,
    margin: 0,
  },
  received: {
    color: R.colors.GREEN,
    fontWeight: '500',
    fontSize: R.fontSize.L,
    textAlign: 'right',
    flex: 1,
  },
});

export default ClientItem;
