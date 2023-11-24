import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import DocumentScanner from 'react-native-document-scanner-plugin';
import {useImage} from '../../components/ImageContex';

const MyScanner = () => {
  const {addScannedImage} = useImage();
  const [scannedImages, setScannedImages] = useState([]);
  const navigation = useNavigation();

  const scanDocument = async () => {
    try {
      const {scannedImages: newScannedImages} =
        await DocumentScanner.scanDocument({
          croppedImageQuality: 100,
        });

      if (newScannedImages != null && newScannedImages.length > 0) {
        setScannedImages(newScannedImages);

        newScannedImages.forEach(newImage => {
          addScannedImage(newImage);
        });

        navigation.navigate('My Gallery');
      }
    } catch (error) {
      console.error('Error scanning document:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {scannedImages.length > 0 && (
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.heading}>Recently Scanned</Text>
          {scannedImages.map((image, index) => (
            <Image
              key={index}
              resizeMode="contain"
              style={styles.image}
              source={{uri: image.toString()}}
            />
          ))}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.scanButton} onPress={scanDocument}>
        <Text style={styles.scanButtonText}>Scan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '80%',
    aspectRatio: 1,
    borderRadius: 10,
    marginVertical: 10,
  },
  scanButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default MyScanner;
