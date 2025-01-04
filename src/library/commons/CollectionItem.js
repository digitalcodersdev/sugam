import {StyleSheet, Text, View, Pressable} from 'react-native';
import React, {useCallback, memo} from 'react';
import R from '../../resources/R';
import CircularProgress from '../../components/CircularProgress';
import {useNavigation} from '@react-navigation/native';
import ScreensNameEnum from '../../constants/ScreensNameEnum';

const CollectionItem = ({item}) => {
  const navigation = useNavigation();

  const percentage = useCallback(() => {
    const collAmount = parseInt(item?.Coll_Amount || 0);
    const target = parseInt(item?.Target || 0);
    return target > 0 ? (collAmount / target) * 100 : 0;
  }, [item?.Coll_Amount, item?.Target]);

  const {Center_Time} = item;
  const res = parseInt(Center_Time.split(':')[0]);
  const time = `${Center_Time?.substring(0, 5)}${res < 12 ? ' AM' : ' PM'}`;

  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        navigation.navigate(ScreensNameEnum.CENTER_COLECTION_SCREEN, {
          centerData: {...item, percentage: percentage(), Meeting_Time: time},
        })
      }>
      {/* Top Section */}
      <View style={styles.header}>
        <CircularProgress
          percentage={percentage().toFixed(2)}
          fillColor={R.colors.GREEN}
          backgroundColor={R.colors.LIGHTGRAY}
          height="70"
          width="70"
        />
        <View>
          <Text style={styles.centerTitle}>Center ID</Text>
          <Text style={styles.centerValue}>{item.CenterID}</Text>
        </View>
        <View>
          <Text style={styles.centerTitle}>Meeting Time</Text>
          <Text style={styles.centerValue}>{time}</Text>
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.body}>
        <View style={styles.statsContainer}>
          <View
            style={[
              styles.statsContainerRow,
              {borderBottomWidth: 0.5, borderBottomColor: R.colors.DARKGRAY},
            ]}>
            <View style={styles.statItem}>
              <Text style={styles.statTitle}>Target</Text>
              <Text style={styles.statValue}>₹ {item?.Target || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statTitle}>Received</Text>
              <Text style={[styles.statValue, styles.received]}>
                ₹ {item?.Coll_Amount || 0}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statTitle}>Balance</Text>
              <Text style={[styles.statValue, styles.balance]}>
                ₹ {item?.Target || 0 - item?.Coll_Amount || 0}
              </Text>
            </View>
          </View>
          <View style={styles.statsContainerRow}>
            <View style={styles.statItem}>
              <Text style={styles.statTitle}>Arrear</Text>
              <Text style={[styles.statValue, styles.arrear]}>
                ₹ {item?.ArrearDue || 0}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statTitle}>Received</Text>
              <Text style={[styles.statValue, styles.received]}>
                ₹ {item?.Coll_Amount || 0}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statTitle}>Balance</Text>
              <Text style={[styles.statValue, styles.balance]}>
                ₹ {item?.Target || 0 - item?.Coll_Amount || 0}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: R.colors.DARKGRAY,
    paddingBottom: 5,
  },
  centerTitle: {
    fontSize: 14,
    color: R.colors.SLATE_GRAY,
    fontWeight: '500',
  },
  centerValue: {
    fontSize: 16,
    fontWeight: '600',
    color: R.colors.PRIMARI_DARK,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsContainer: {
    flex: 1,
    // marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainerRow: {
    flex: 1,
    // marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: R.colors.DARKGRAY,
  },
  statItem: {
    marginBottom: 10,
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    color: R.colors.PRIMARI_DARK,
    fontWeight: '400',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: R.colors.PRIMARI_DARK,
    justifyContent: 'center',
    flex: 1,
  },
  received: {
    color: R.colors.GREEN,
  },
  arrear: {
    color: R.colors.DARK_ORANGE,
  },
  balance: {
    color: R.colors.RED,
  },
});

export default memo(CollectionItem);
