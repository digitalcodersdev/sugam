import React, {useState, useEffect, useCallback} from 'react';
import {Image, View, StyleSheet} from 'react-native';
import DocumentScanner from 'react-native-document-scanner-plugin';
import Button from '../../library/commons/Button';
import R from '../../resources/R';
import Modal from 'react-native-modal';

const DocumentScannerModal = ({
  isVisible,
  onClose,
  onDocumentScanned,
  setter,
}) => {
  const [scanning, setScanning] = useState(false);

  // Function to trigger scanning only when the modal is visible
  const scanDocument = useCallback(async () => {
    if (scanning) return; // Prevent double scan attempt

    setScanning(true);

    try {
      const {scannedImages} = await DocumentScanner.scanDocument({
        maxNumDocuments: 1,
      });

      if (scannedImages?.length > 0) {
        onDocumentScanned && onDocumentScanned(scannedImages[0], setter);
        onClose && onClose(false); // Close the modal after scan
      } else {
        console.error('No document scanned.');
        onClose && onClose(false)
      }
    } catch (error) {
      console.error('Error scanning document:', error);
    } finally {
      setScanning(false);
    }
  }, [scanning, onDocumentScanned, setter, onClose]);

  useEffect(() => {
    if (isVisible) {
      scanDocument();
    }
  }, [isVisible, scanDocument]);

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContainer}>
        {scanning ? (
          <Button
            title="Scanning..."
            buttonStyle={[styles.captureButton, {backgroundColor: R.colors.LIGHT_GRAY}]}
            disabled
          />
        ) : (
          <Button
            title="Capture Document"
            onPress={scanDocument}
            buttonStyle={styles.captureButton}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  captureButton: {
    backgroundColor: R.colors.DARK_BLUE,
    width: '45%',
    alignSelf: 'center',
    margin: 20,
  },
});

export default DocumentScannerModal;
