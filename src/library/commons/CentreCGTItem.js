import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import R from '../../resources/R';
import GRTStatusModal from '../modals/GRTModal';
import ScreensNameEnum from '../../constants/ScreensNameEnum';

const CentreCGTItem = ({item, BRANCHID, CenterNo,CenterName}) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const statusColor = item?.Status === 'Approved' ? '#4CAF50' : '#F44336';

  const closeModal = () => setModalVisible(false);

  const handleSubmit = value => {
    // setModalVisible(false);
    closeModal();
  };

  return (
    <Pressable
      style={styles.item}
      onPress={() => {
        // if (item?.Status == 'Pending') {
          navigation.navigate(ScreensNameEnum.CLIENT_GRT_SCREEN, {
            enrollmentId: item?.EnrollmentID,
            BRANCHID,
            CenterNo,
            CenterName
          });
        // }
      }}>
      <View style={styles.customerInfo}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Enrollment ID:</Text>
          <Text style={styles.value}>{item?.EnrollmentID}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Client Name:</Text>
          <Text style={styles.value}>{item?.Name}</Text>
        </View>
        <View style={[styles.detailRow, styles.borderBox]}>
          <View style={styles.innerDetail}>
            <Text style={styles.label}>Amount:</Text>
            <Text style={[styles.value, styles.amount]}>
              ₹{item?.Amount?.toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={styles.innerDetail}>
            <Text style={styles.label}>Product:</Text>
            <Text style={styles.value}>{item?.product_name}</Text>
          </View>
        </View>
      </View>

      <Pressable style={styles.statusContainer}>
        <Text style={[styles.statusText, {backgroundColor: statusColor}]}>
          Status: {item?.Status}
        </Text>
      </Pressable>
      {modalVisible && (
        <GRTStatusModal
          isVisible={modalVisible}
          onClose={setModalVisible}
          onSubmit={handleSubmit}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 16,
    margin: 8,
    borderWidth: 0.5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderRadius: 10,
  },
  customerInfo: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  amount: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  borderBox: {
    // borderWidth: 1,
    borderRadius: 8,
    padding: 6,
    borderColor: R.colors.DARKGRAY,
  },
  innerDetail: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  statusContainer: {
    marginTop: 8,
    width: '50%',
  },
  statusText: {
    color: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    fontWeight: '800',
    textAlign: 'center',
    fontSize: R.fontSize.L,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  gradientBackground: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
    width: '80%',
  },
  modalButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
    marginVertical: 10,
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CentreCGTItem;
