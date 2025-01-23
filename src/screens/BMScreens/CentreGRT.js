import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState, useEffect,} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import R from '../../resources/R';
import CentreCGTItem from '../../library/commons/CentreCGTItem';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  grtCentresSelector,
  currentUserSelector,
} from '../../store/slices/user/user.slice';

import Loader from '../../library/commons/Loader';
import {fetchGRTCentres} from '../../store/actions/userActions';
import ScreensNameEnum from '../../constants/ScreensNameEnum';

const CentreGRT = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(currentUserSelector);
  const centres = useSelector(grtCentresSelector);
  const {CenterNo, CenterName, BRANCHID} = route?.params?.centre;

  const [loading, setLoading] = useState(false);

  const data = centres?.find(item => item.centreid === CenterNo);

  useEffect(() => {
    if (CenterNo && BRANCHID) {
      fetchCentresGRT();
    }
  }, [user, CenterNo, BRANCHID]);

  const fetchCentresGRT = async () => {
    try {

      setLoading(true);
      await dispatch(
        fetchGRTCentres({
          centerId: CenterNo,
          branchId: BRANCHID,
        }),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={ScreensNameEnum.CENTRE_GRT_SCREEN} />
      <View style={styles.centerDetailsContainer}>
        <View style={styles.progressContainer}>
          <CenterInfo data={data} CenterNo={CenterNo} CenterName={CenterName} />
        </View>
      </View>
      <CentresList centres={centres} CenterNo={CenterNo} loading={loading} />
      <Loader loading={loading} />
    </ScreenWrapper>
  );
};

const CenterInfo = ({CenterNo, CenterName}) => (
  <View style={styles.centerInfo}>
    <Text style={styles.value}>Center Name: {CenterName}</Text>
    <Text style={styles.value}>Center ID: {CenterNo}</Text>
  </View>
);

const CentresList = ({centres, CenterNo, loading, meeting}) => (
  <View style={styles.container}>
    {centres.length > 0 && (
      <FlatList
        data={centres}
        keyExtractor={item => item?.EnrollmentID?.toString()}
        renderItem={({item, index}) => (
          <CentreCGTItem
            item={item}
            index={index}
            CenterNo={CenterNo}
            meeting={meeting}
          />
        )}
        refreshing={loading}
        onRefresh={() => console.log('Refresh triggered')}
      />
    )}
  </View>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  centerDetailsContainer: {
    backgroundColor: R.colors.SLATE_GRAY,
    padding: 10,
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerInfo: {
    flex: 1,
    paddingHorizontal: 10,
  },
  financialOverview: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: R.colors.PRIMARY_LIGHT,
    padding: 10,
    borderRadius: 6,
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
  fixedButton: {
    position: 'absolute',
    right: 10,
    backgroundColor: R.colors.PRIMARI_DARK,
    borderRadius: 12,
    padding: 8,
  },
  buttonText: {
    color: R.colors.WHITE,
    fontWeight: '800',
    fontSize: R.fontSize.M,
  },
});

export default CentreGRT;
