import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import R from '../../resources/R';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import LinearGradient from 'react-native-linear-gradient';

const ClientArrearItem = ({item, centerId, meeting}) => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState('');
  const [expandAnim] = useState(new Animated.Value(0));
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [attendance, setAttendance] = useState(null); // State for attendance

  const {
    Borrower_Name,
    customerid,
    TodayEMI,
    financeamt,
    CollAmount,
    TotalColl,
    Collection_Status,
    Interest,
  } = item;

  const remainingCollection = parseInt(financeamt) - parseInt(CollAmount);
  const isPaid = Collection_Status == 1;
  const statusColor = isPaid ? R.colors.GREEN : R.colors.RED;
  const statusText = isPaid ? 'Paid' : 'Pending';
  const icon = selected == customerid ? 'chevron-up' : 'chevron-down';

  useEffect(() => {
    Animated.timing(expandAnim, {
      toValue: selected == customerid ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [selected]);

  const scaleY = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleExpand = () => {
    if (selected == customerid) {
      setSelected(''); // Collapse
    } else {
      setSelected(customerid); // Expand
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleAttendance = value => {
    setAttendance(value);
    closeModal();
  };

  return (
    <Pressable style={styles.item}>
      <View style={styles.statusRow}>
        <Pressable
          style={styles.statusContainer}
          onPress={() => {
            if (meeting && meeting?.EndTime == null) {
              navigation.navigate(ScreensNameEnum.CLIENT_COLLECTION_SCREEN, {
                dt: {
                  ...item,
                  remainingCollection,
                  centerId,
                },
              });
            } else if (meeting && meeting?.EndTime?.length >= 1) {
              Alert.alert('Center Meeting Is Already Finished.');
            } else {
              Alert.alert('Please Start Center Meeting First.');
            }
          }}>
          <Text
            style={[
              styles.statusText,
              {
                backgroundColor: R.colors.lightYellow,
                alignSelf: 'flex-start',
              },
            ]}>
            Collect EMI
          </Text>
        </Pressable>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, {backgroundColor: statusColor}]}>
            {statusText}
          </Text>
        </View>
      </View>

      <View style={styles.customerInfo}>
        <View
          style={[
            styles.detailRow,
            {
              alignItems: 'center',
              justifyContent: 'space-between',
            },
          ]}>
          <Text style={[styles.title, {flex: 1}]}>{Borrower_Name}</Text>
          <Pressable
            style={[
              styles.attendanceButton,
              {
                backgroundColor:
                  attendance == null
                    ? '#2196F3'
                    : attendance == 'Present'
                    ? '#4CAF50'
                    : '#F44336',
              },
            ]}
            onPress={openModal}>
            <Text style={styles.attendanceButtonText}>
              {attendance ? `Marked as - ${attendance}` : 'Mark Attendance'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Loan ID:</Text>
          <Text style={styles.value}>{customerid}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>EMI Amount:</Text>
          <Text style={[styles.value, styles.emiAmount]}>₹{TodayEMI}</Text>
        </View>
      </View>

      <Icon
        name={icon}
        size={30}
        color={R.colors.PRIMARI_DARK}
        onPress={handleExpand}
        style={styles.icon}
      />

      <Animated.View
        style={[
          styles.financialSummary,
          {
            transform: [{scaleY}],
            borderTopWidth: selected == customerid ? 1 : 0,
            borderTopColor: R.colors.SLATE_GRAY,
          },
        ]}>
        {selected == customerid && (
          <>
            <SummaryItem
              label="Total Disbursed:"
              value={`₹${financeamt}`}
              valueStyle={styles.greenText}
            />
            <SummaryItem
              label="Total Interest:"
              value={`₹${Interest}`}
              valueStyle={styles.greenText}
            />
            <SummaryItem
              label="Total Collected:"
              value={`₹${TotalColl}`}
              valueStyle={styles.yellowText}
            />
            <SummaryItem
              label="Remaining:"
              value={`₹${financeamt + Interest - TotalColl}`}
              valueStyle={styles.redText}
            />
          </>
        )}
      </Animated.View>

      {/* Modal for Attendance Selection */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <Animated.View style={styles.modalContent}>
            <LinearGradient
              colors={['#4c669f', '#3b5998', '#192f6a']}
              style={styles.gradientBackground}>
              <Text style={styles.modalTitle}>Select Attendance</Text>
              <TouchableOpacity
                style={[styles.modalButton, {backgroundColor: '#4CAF50'}]}
                onPress={() => handleAttendance('Present')}>
                <Icon name="check-circle" size={20} color="#fff" />
                <Text style={styles.modalButtonText}>Present</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity
                style={[styles.modalButton, {backgroundColor: '#F44336'}]}
                onPress={() => handleAttendance('Absent')}>
                <Icon name="close-circle" size={20} color="#fff" />
                <Text style={styles.modalButtonText}>Absent</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
    </Pressable>
  );
};

const SummaryItem = ({label, value, valueStyle}) => (
  <View style={styles.summaryItem}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={[styles.summaryValue, valueStyle]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  item: {
    padding: 16,
    marginVertical: 8,
    borderWidth: 0.5,
    borderColor: R.colors.SLATE_GRAY,
    backgroundColor: R.colors.WHITE,
    shadowColor: R.colors.BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderRadius: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  statusContainer: {
    alignSelf: 'flex-end',
    flex: 1,
  },
  statusText: {
    color: R.colors.WHITE,
    textAlign: 'center',
    fontWeight: '800',
    fontSize: R.fontSize.S,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    width: 100,
    alignSelf: 'flex-end',
  },
  customerInfo: {
    marginTop: 10,
  },
  title: {
    fontSize: R.fontSize.XL,
    fontWeight: 'bold',
    color: R.colors.PRIMARI_DARK,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  label: {
    fontSize: R.fontSize.M,
    fontWeight: '600',
    color: R.colors.PRIMARI_DARK,
  },
  value: {
    fontSize: R.fontSize.M,
    fontWeight: '600',
    color: R.colors.PRIMARI_DARK,
  },
  emiAmount: {
    fontWeight: '800',
    color: R.colors.RED,
    fontSize: R.fontSize.L,
  },
  icon: {
    alignSelf: 'center',
  },
  financialSummary: {
    marginTop: 5,
    overflow: 'hidden',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryLabel: {
    color: R.colors.PRIMARI_DARK,
    fontWeight: '600',
    fontSize: R.fontSize.M,
  },
  summaryValue: {
    fontWeight: '600',
    fontSize: R.fontSize.M,
  },
  greenText: {
    color: R.colors.GREEN,
    fontWeight: '800',
    fontSize: R.fontSize.L,
  },
  yellowText: {
    color: R.colors.lightYellow,
    fontWeight: '800',
    fontSize: R.fontSize.L,
  },
  redText: {
    color: R.colors.RED,
    fontWeight: '800',
    fontSize: R.fontSize.L,
  },
  attendanceButton: {
    padding: 5,
    borderRadius: 6,
    alignItems: 'center',
  },
  attendanceButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    // justifyContent: 'center',
    width: '80%',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: R.colors.PRIMARY_LIGHT,
    width: '100%',
    marginVertical: 10,
  },
  closeButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 15,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
  gradientBackground: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: 300,
  },
});

export default ClientArrearItem;
