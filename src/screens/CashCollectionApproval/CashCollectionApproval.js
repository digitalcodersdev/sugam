import {StyleSheet, FlatList, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import Loader from '../../library/commons/Loader';
import R from '../../resources/R';
import CashApprovalItem from '../../library/commons/CashApprovalItem';
import UserApi from '../../datalib/services/user.api';
const CashCollectionApproval = () => {
  const [data, setData] = useState();
  const [realData, setRealData] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log(':data', data);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await new UserApi().getCashApprovalRequests();
      if (response) {
        setData(response);
        setRealData(response);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader
        screenName={ScreensNameEnum.CASH_COLLCETION_APPROVAL_SCREEN}
      />
      <View style={styles.container}>
        {data?.length >= 1 ? (
          <FlatList
            data={data}
            keyExtractor={item => item?.LoanID + '/' + item?.RequestID}
            renderItem={({item, index}) => (
              <CashApprovalItem item={item} index={index} getData={getData} />
            )}
            refreshing={loading}
            onRefresh={getData}
          />
        ) : (
          <Text
            style={{
              color: R.colors.DARKGRAY,
              flex: 1,
              justifyContent: 'center',
              textAlign: 'center',
              textAlignVertical: 'center',
              fontSize: R.fontSize.L,
              fontWeight: '800',
            }}>
            No Data Found...
          </Text>
        )}
      </View>

      <Loader loading={loading} message={'please wait...'} />
    </ScreenWrapper>
  );
};

export default CashCollectionApproval;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
