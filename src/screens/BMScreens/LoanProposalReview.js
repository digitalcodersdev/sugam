import React, {useEffect, useState, useMemo, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
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
import ImageWithLoading from '../../library/commons/Images';
import ImageView from 'react-native-images-viewer';

const LoanProposalReview = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(currentUserSelector);
  const proposals = useSelector(proposalSelector);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [isVis, onClose] = useState(false);
  const [image, setImage] = useState([]);

  // Create a ref to track the first load
  const isInitialLoad = useRef(true);
  console.log('proposals', user);

  useEffect(() => {
    if (user?.branchid && isInitialLoad.current && proposals?.length < 1) {
      isInitialLoad.current = false; // Set to false after the first load
      fetchLoanProposalReviewData();
    }
  }, [user]);

  const fetchLoanProposalReviewData = async () => {
    setLoading(true);
    try {
      await dispatch(fetchProposals(user?.BranchId));
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
          item?.EnrollmentID?.toUpperCase().includes(search?.toUpperCase()) ||
          item?.NewLoanID?.toString()
            ?.toUpperCase()
            ?.includes(search?.toUpperCase()),
      );
    }
    return proposals;
  }, [search, proposals]);
  const renderItem = ({item, index}) => (
    <View style={[styles.cardView, {marginTop: index === 0 ? 0 : 20}]}>
      <Pressable
        onPress={() =>
          navigation.navigate(ScreensNameEnum.FINAL_PROPOSAL_REVIEW_SCREEN, {
            proposal: item,
          })
        }
        style={styles.pressable}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.loanID}>Loan ID: {item?.NewLoanID}</Text>
            <Pressable
              onPress={() => {
                setImage([{uri: item?.ClientImage}]);
                onClose(true);
                console.log('Image Pressed');
              }}>
              <ImageWithLoading
                source={{
                  uri: item?.ClientImage,
                }}
                style={styles.clientImage}
                loaderColor={R.colors.primary}
              />
            </Pressable>
          </View>

          <View style={styles.proposalHeader}>
            <View style={styles.detailsRow}>
              <Text style={styles.label}>Proposal Date:</Text>
              <Text style={styles.proposalDate}>{item?.ProposalDate}</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.label}>Enroll ID:</Text>
              <Text style={styles.value}>{item?.EnrollmentID}</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.label}>Appli.:</Text>
              <Text style={styles.value}>
                {`${item?.firstname?.trim()} ${
                  item?.middlename?.trim() ? item?.middlename?.trim() : ''
                } ${item?.lastname?.trim()}`}
              </Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.label}>Co-Appli.:</Text>
              <Text style={styles.value}>
                {`${item?.Co_borrower_firstname?.trim()} ${
                  item?.Co_borrower_middlename?.trim()
                    ? item?.Co_borrower_middlename?.trim()
                    : ''
                } ${item?.Co_borrower_lastname?.trim()}`}
              </Text>
            </View>
          </View>
          <Icon name="chevron-right" size={30} color={R.colors.primary} />
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
      <ChildScreensHeader screenName={ScreensNameEnum.PROPOSAL_REVIEW_SCREEN} />
      <View style={styles.container}>
        <View style={styles.searchView}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholder="Search by Enrollment or Loan ID..."
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
          keyExtractor={item => item?.EnrollmentID}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchLoanProposalReviewData}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No New Proposal Found...</Text>
          )}
        />
      </View>
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
