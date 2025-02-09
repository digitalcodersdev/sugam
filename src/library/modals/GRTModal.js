import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GeotaggedImageModal from './GeotaggedImageModal';
import Button from '../commons/Button';
import R from '../../resources/R';
import UserApi from '../../datalib/services/user.api';
import {useNavigation} from '@react-navigation/native';
import ScreensNameEnum from '../../constants/ScreensNameEnum';
import {useDispatch} from 'react-redux';
import {fetchGRTCentres} from '../../store/actions/userActions';
import Loader from '../commons/Loader';
import {uploadGRTPhoto} from '../../datalib/services/utility.api';
import moment from 'moment';

const GRTStatusModal = ({isVisible, onClose, onSubmit, data,}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [status, setStatus] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCaptureImage = () => {
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      if (!status) {
        Alert.alert('Select GRT Status', 'Please select a status.');
        return;
      }
      if (status === 'Rejected' && !remarks) {
        Alert.alert('Reason required', 'Please enter rejection reason.');
        return;
      }
      if (capturedImage == null) {
        Alert.alert('Image required', 'Please capture an image.');
        return;
      }
      setLoading(true);
      const payload = new FormData();
      payload.append('grtPhoto', {
        uri: capturedImage,
        type: 'image/jpg',
        name: `${data?.BRANCHID}_${data?.CenterNo}.jpg`,
      });
      const res = await uploadGRTPhoto(payload);
      if (res?.success && res?.files?.grtPhoto?.length >= 10) {
        const dt = {
          grtData: {
            loanId: data.loanid,
            GRTDoneDate: moment(new Date()).format('YYYY-MM-DD'),
            Status: status,
            remarks: remarks ? remarks : ' ',
          },
        };
        const response = await new UserApi().markGRTComplete(dt);
        if (response) {
          Alert.alert('GRT Completed', 'GRT Status Updated Successfully');
          await dispatch(
            fetchGRTCentres({
              centerId: data?.CenterNo,
              branchId: data?.BRANCHID,              
            }),
          );
          navigation.navigate(ScreensNameEnum.CENTRE_GRT_SCREEN, {
            centre: {
              CenterNo: data?.CenterNo,
              BRANCHID: data?.BRANCHID,
              CenterName:data?.CenterName
            },
          });
        } else {
          Alert.alert('Something went Wrong', 'Please try again later.');
        }
      } else {
        Alert.alert('Something went Wrong', 'Please try again later.');
      }

      onClose(false); // Close modal after submission
      setLoading(false);
    } catch (error) {
      console.log('ERRor', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleImageCaptured = (uri, reset) => {
    setCapturedImage(uri);
    reset && reset();
    setIsModalVisible(false);
  };
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => onClose(false)}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modal}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>GRT STATUS</Text>
          <TouchableOpacity onPress={() => onClose(false)}>
            <Icon name="close-circle" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Select Status */}
          <Text style={styles.label}>Select Status:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={status}
              onValueChange={value => setStatus(value)}
              dropdownIconColor={R.colors.DARK_BLUE}
              style={styles.picker}>
              <Picker.Item
                label="Select GRT Status"
                value={null}
                enabled={false}
              />
              <Picker.Item label="Approved" value="Approved" />
              <Picker.Item label="Rejected" value="Rejected" />
            </Picker>
          </View>

          {/* Remarks */}
          <Text style={styles.label}>Remarks:</Text>
          <TextInput
            style={styles.textArea}
            multiline
            placeholder="Enter your remarks..."
            placeholderTextColor={R.colors.DARKGRAY}
            value={remarks}
            onChangeText={text => setRemarks(text)}
            maxLength={50}
          />

          {/* Capture Image */}
          <TouchableOpacity
            style={styles.imageCaptureContainer}
            onPress={handleCaptureImage}>
            {capturedImage ? (
              <Image
                source={{uri: capturedImage}}
                style={styles.capturedImage}
              />
            ) : (
              <View style={styles.placeholderContainer}>
                <Icon name="camera" size={40} color="#fff" />
                <Text style={styles.captureText}>Capture Image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Button
          title="Submit"
          backgroundColor={R.colors.DARK_BLUE}
          buttonStyle={{
            width: '50%',
            alignSelf: 'center',
            borderRadius: 22,
          }}
          textStyle={{fontWeight: 'bold'}}
          onPress={handleSubmit}
        />
      </View>
      <GeotaggedImageModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onImageCaptured={handleImageCaptured}
      />
      {loading && <Loader loading={loading} message={'please wait...'} />}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignSelf: 'center',
    width: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4c669f',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 15,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    paddingVertical: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    height: 60,
    color: R.colors.PRIMARI_DARK,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 80,
    textAlignVertical: 'top',
    padding: 10,
    marginBottom: 20,
    color: R.colors.PRIMARI_DARK,
    fontWeight: '600',
  },
  imageCaptureContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 150,
    marginBottom: 20,
    backgroundColor: '#4c669f',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureText: {
    color: '#fff',
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GRTStatusModal;
