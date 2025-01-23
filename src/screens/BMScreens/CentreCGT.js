import React, {useEffect, useState, useMemo, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ScreenWrapper from '../../library/wrapper/ScreenWrapper';
import ChildScreensHeader from '../../components/MainComponents/ChildScreensHeader';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import {fetchProposals} from '../../store/actions/userActions';
import {
  currentUserSelector,
  proposalSelector,
} from '../../store/slices/user/user.slice';
import R from '../../resources/R';
import Loader from '../../library/commons/Loader';
import ImageView from 'react-native-images-viewer';
import GeotaggedImageModal from '../../library/modals/GeotaggedImageModal';
import {uploadCGTPhoto} from '../../datalib/services/utility.api';
import UserApi from '../../datalib/services/user.api';
import APP_CONSTANTS from '../../constants/appConstants';
import env from '../../../env';

const LoanProposalReview = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(currentUserSelector);
  const proposals = useSelector(proposalSelector);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [isVis, onClose] = useState(false);
  const [image, setImage] = useState([]);
  const [grtImage, setGrtImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Create a ref to track the first load
  const isInitialLoad = useRef(true);
  console.log('proposals', proposals);

  useEffect(() => {
    if (user?.branchid && isInitialLoad.current && proposals?.length < 1) {
      isInitialLoad.current = false; // Set to false after the first load
      fetchLoanProposalReviewData();
    }
  }, [user]);

  const fetchLoanProposalReviewData = async () => {
    setLoading(true);
    try {
      await dispatch(fetchProposals(user?.branchid));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    if (search?.length >= 1) {
      return proposals.filter(
        item =>
          item?.CenterName?.toUpperCase().includes(search?.toUpperCase()) ||
          item?.CenterNo?.toString()
            ?.toUpperCase()
            ?.includes(search?.toUpperCase()),
      );
    }
    return proposals;
  }, [search, proposals]);
  const handleImageCaptured = (uri, reset) => {
    reset && reset();
    setImage([{uri: uri}]);
    onClose(true);
    setGrtImage(uri);
    setIsModalVisible(false);
  };

  const uploadCGTImage = async ({BRANCHID, CenterNo}) => {
    try {
      setLoading(true);
      const payload = new FormData();
      payload.append('cgtPhoto', {
        uri: grtImage,
        type: 'image/jpg',
        name: `${BRANCHID}_${CenterNo}.jpg`,
      });
      const response = await uploadCGTPhoto(payload);
      if (response?.success && response?.files?.cgtPhoto?.length >= 10) {
        const res = await new UserApi().completeCGT({
          CenterID: CenterNo,
          BranchID: BRANCHID,
        });
        if (res[1] == 1) {
          fetchLoanProposalReviewData();
          Alert.alert('CGT Completed', 'You can continue to GRT');
        }
      } else {
        Alert.alert('Something Went Wrong', 'Please try again later...');
      }
      setLoading(false);
    } catch (error) {
      console.log('ERRROR____', error);
      setLoading(false);
    }
  };

  const renderItem = ({item, index}) => (
    <View style={[styles.cardView, {marginTop: index === 0 ? 0 : 20}]}>
      <Pressable
        onPress={() => {
          if (item?.CGTDoneBy !== null) {
            navigation.navigate(ScreensNameEnum.CENTRE_GRT_SCREEN , {
              centre: item,
            });
          } else {
            Alert.alert(
              'CGT Not Completed',
              'Please complete CGT before proceeding',
            );
          }
        }}
        style={styles.pressable}>
        <View style={styles.headerRow}>
          <View style={styles.proposalHeader}>
            <View style={styles.detailsRow}>
              <Text style={styles.label}>Centre No:</Text>
              <Text style={styles.value}>{item?.CenterNo}</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.label}>Centre Name:</Text>
              <Text style={styles.value}>{item?.CenterName}</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.label}>Contact Person:</Text>
              <Text style={styles.value}>{item?.ContactPerson}</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{item?.Address}</Text>
            </View>
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-around',
              paddingHorizontal: 10,
              height: '100%',
            }}>
            <Icon
              name={
                grtImage !== null || item?.CGTDoneBy !== null
                  ? 'cloud-download'
                  : 'cloud-upload'
              }
              size={40}
              color={
                grtImage !== null || item?.CGTDoneBy !== null
                  ? R.colors.GREEN
                  : R.colors.primary
              }
              onPress={() => {
                if (item?.CGTDoneBy == null) setIsModalVisible(true);
              }}
            />

            {item?.CGTDoneBy == null && grtImage !== null && (
              <TouchableOpacity
                onPress={() => {
                  uploadCGTImage({
                    CenterNo: item?.CenterNo,
                    BRANCHID: item?.BRANCHID,
                  });
                }}>
                <Text
                  style={{
                    color: R.colors.PRIMARY_LIGHT,
                    fontWeight: '800',
                    backgroundColor: R.colors.GREEN,
                    padding: 5,
                    borderRadius: 8,
                  }}>
                  Save
                </Text>
              </TouchableOpacity>
            )}

            {item.CGTDoneBy !== null && (
              <TouchableOpacity
                onPress={() => {
                  console.log('View Pressed');
                  setImage([
                    {
                      uri: `${env.SERVER_URL}/SugamCGT/${item?.BRANCHID}_${item?.CenterNo}.jpg`,
                    },
                  ]);
                  onClose(true);
                }}>
                <Text
                  style={{
                    color: R.colors.PRIMARY_LIGHT,
                    fontWeight: '800',
                    backgroundColor: R.colors.DARK_BLUE,
                    padding: 5,
                    borderRadius: 8,
                  }}>
                  View
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Pressable>
      <ImageView
        images={image}
        imageIndex={0}
        visible={isVis}
        onRequestClose={() => onClose(false)}
      />
    </View>
  );

  return (
    <ScreenWrapper header={false}>
      <ChildScreensHeader screenName={ScreensNameEnum.CENTRE_CGT_SCREEN} />
      <View style={styles.container}>
        <View style={styles.searchView}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholder="Search by Centre No..."
            placeholderTextColor={R.colors.DARKGRAY}
          />
          <Icon
            name="magnify"
            color={R.colors.primary}
            style={styles.searchIcon}
            size={30}
          />
        </View>
        <FlatList
          data={filteredData}
          keyExtractor={item => `${item?.BRANCHID}_${item?.CenterNo}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchLoanProposalReviewData}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No New Proposal Found...</Text>
          )}
        />
      </View>
      <GeotaggedImageModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onImageCaptured={handleImageCaptured}
      />
      <Loader loading={loading} />
    </ScreenWrapper>
  );
};

export default LoanProposalReview;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  cardView: {
    backgroundColor: '#fff',
    borderRadius: 12, // Slightly more rounded corners
    padding: 15,
    marginBottom: 20,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowColor: '#000',
    elevation: 5,
  },
  pressable: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    flex: 1,
  },
  clientImage: {
    width: 100,
    height: 100,
    borderRadius: 10, // More rounded
    borderWidth: 1.5,
    borderColor: '#ccc',
    marginRight: 10, // Added margin for space between image and text
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowColor: '#000',
  },
  proposalHeader: {
    flex: 1,
  },
  proposalDate: {
    fontSize: 14,
    fontWeight: '800',
    color: R.colors.primary,
    padding: 6,
    backgroundColor: '#e0f7fa', // Light background for better contrast
    borderRadius: 6,
    width: 'auto',
    alignSelf: 'flex-start', // Align date to the start of the card
  },
  loanID: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
    backgroundColor: R.colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 10, // Space between Loan ID and other info
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  label: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
    marginRight: 10,
    flex: 1, // Ensure proper spacing and alignment
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 2, // Allow more space for the value
  },
  searchView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowColor: '#000',
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 18,
    marginTop: 50,
  },
});
