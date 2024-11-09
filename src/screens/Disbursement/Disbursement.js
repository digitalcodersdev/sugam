import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import R from '../../resources/R';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import UserApi from '../../datalib/services/user.api';
import {useSelector} from 'react-redux';
import {currentUserSelector} from '../../store/slices/user/user.slice';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import DisbursementItem from '../../library/commons/DisbursementItem';

const Disbursement = ({item}) => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState('');
  const [expandAnim] = useState(new Animated.Value(0));
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector(currentUserSelector);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await new UserApi().fetchDisburesemnt({
        branchId: user?.BranchId,
      });
      if (response?.data?.length >= 1) {
        setData(response?.data);
      }
    } catch (error) {
      console.log('Error fetching disbursement data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={'Disbursement '} />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color={R.colors.primary} />
        ) : (
          <FlatList
            data={data}
            keyExtractor={item => item.LoanID?.toString()}
            renderItem={({item, index}) => <DisbursementItem item={item} fetchData={fetchData}/>}
            ListEmptyComponent={
              <Text style={styles.emptyMessage}>
                No disbursement data available.
              </Text>
            }
            onRefresh={fetchData}
            refreshing={loading}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10
  },
  listContent: {
    paddingBottom: 20, // Optional: Add padding for the end of the list
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    color: R.colors.textSecondary,
    fontSize: 16,
  },
});

export default Disbursement;
