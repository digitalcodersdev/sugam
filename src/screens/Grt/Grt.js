import {FlatList, StyleSheet, Text, View, Pressable} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Grt = () => {
  const [data, setData] = useState([
    {
      id: 1,
      time: '08:30 AM',
      centerId: 813,
      cename: 'Tower c subhlakhsmi Finance Private ltd',
      centerLeader: 'Ravi',
      grtDoneBy: false,
    },
    {
      id: 2,
      time: '09:30 AM',
      centerId: 817,
      cename: 'Tower c - 1',
      centerLeader: 'Raja',
      grtDoneBy: false,
    },
    {
      id: 3,
      time: '08:30 AM',
      centerId: 813,
      cename: 'Tower c subhlakhsmi Finance Private ltd',
      centerLeader: 'Ravi',
      grtDoneBy: false,
    },
    {
      id: 4,
      time: '09:30 AM',
      centerId: 817,
      cename: 'Tower c - 1',
      centerLeader: 'Raja',
      grtDoneBy: false,
    },
    {
      id: 5,
      time: '08:30 AM',
      centerId: 813,
      cename: 'Tower c subhlakhsmi Finance Private ltd',
      centerLeader: 'Ravi',
      grtDoneBy: false,
    },
    {
      id: 6,
      time: '09:30 AM',
      centerId: 817,
      cename: 'Tower c - 1',
      centerLeader: 'Raja',
      grtDoneBy: false,
    },
  ]);

  const Item = ({item}) => {
    console.log(item.cename?.length);
    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          // Update the state with a new array
          const updatedData = data.map(center =>
            center.id === item.id
              ? {...center, grtDoneBy: !center.grtDoneBy}
              : center,
          );
          setData(updatedData);
        }}>
        <Text style={styles.time}>{item.time}</Text>
        <View style={styles.centerBlock}>
          <View style={styles.row}>
            <Icon name={'counter'} size={20} color={R.colors.DARKGRAY} />
            <Text style={styles.centerId}>{item.centerId}</Text>
          </View>
          <View style={styles.row}>
            <Icon name={'map-marker'} size={20} color={R.colors.PRIMARI_DARK} />
            <Text style={styles.cname}>
              {item.cename?.length > 20
                ? item.cename?.slice(0, 20) + '...'
                : item.cename}
            </Text>
          </View>
          <View style={styles.row}>
            <Icon
              name={'account-network'}
              size={20}
              color={R.colors.DARK_BLUE}
            />
            <Text style={styles.centerLeader}>{item.centerLeader}</Text>
          </View>
        </View>
        <View style={styles.icon}>
          <Icon
            name={item?.grtDoneBy ? 'check-circle' : 'dots-horizontal'}
            size={30}
            color={!item?.grtDoneBy ? R.colors.DARKGRAY : R.colors.GREEN}
          />
        </View>
      </Pressable>
    );
  };

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={'GRT'} />
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={({item, index}) => <Item item={item} index={index} />}
          keyExtractor={item => item.id?.toString()}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Grt;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 4,
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#ddd',
    height: 100,
    overflow: 'hidden',
  },
  time: {
    fontSize: 16,
    flex: 0.6,
    backgroundColor: R.colors.DARK_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '900',
    color: R.colors.PRIMARY_LIGHT,
  },
  centerBlock: {
    fontSize: 16,
    flex: 1,
    flexDirection: 'column',
    padding: 5,
    borderRightWidth: 0.5,
    padding: 10,
    borderColor: R.colors.DARKGRAY,
    margin: 5,
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  centerId: {
    color: R.colors.DARKGRAY,
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 10,
    marginBottom: 5,
  },
  cname: {
    color: R.colors.PRIMARI_DARK,
    fontSize: R.fontSize.L,
    fontWeight: '500',
  },
  centerLeader: {
    color: R.colors.PRIMARI_DARK,
    fontSize: R.fontSize.L,
  },
  icon: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
