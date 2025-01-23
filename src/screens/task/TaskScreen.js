import React, {useState} from 'react';
import {View, Button, Image} from 'react-native';
import GeotaggedImageModal from '../../library/modals/GeotaggedImageModal';

const SomeComponent = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const handleImageCaptured = (uri, reset) => {
    console.log('Captured Image URI:', uri);
    setCapturedImage(uri);
    reset && reset();
    setIsModalVisible(false);
  };

  return (
    <View>
      <Button title="Open Camera" onPress={() => setIsModalVisible(true)} />
      <GeotaggedImageModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onImageCaptured={handleImageCaptured}
      />
      {capturedImage && (
        <Image
          source={{uri: capturedImage}}
          style={{width: 100, height: 100}}
        />
      )}
    </View>
  );
};

export default SomeComponent;
