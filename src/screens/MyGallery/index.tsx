import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  BackHandler,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Share from 'react-native-share';
import Modal from 'react-native-modal';
import RNFS from 'react-native-fs';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {useImage} from '../../components/ImageContex';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const MyGallery = () => {
  const {latestScanId} = useImage();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchAndDisplayImages();
  }, [latestScanId]);

  useEffect(() => {
    fetchAndDisplayImages();

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        closeImageModal();
        return true;
      },
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  const fetchAndDisplayImages = async () => {
    try {
      const directoryPath =
        '/storage/emulated/0/Android/data/com.docscanner/files/Pictures';

      const isDirectoryExists = await RNFS.exists(directoryPath);

      if (!isDirectoryExists) {
        setLoading(false);
        return;
      }

      const files = await RNFS.readDir(directoryPath);

      const imageFiles = files.filter(file => file.name.endsWith('.jpg'));

      if (imageFiles.length === 0) {
        setLoading(false);
        return;
      }

      setImages(
        imageFiles.map(file => ({url: `file://${file.path}`})).reverse(),
      );
      setLoading(false);
    } catch (error) {
      console.error('Error fetching and displaying images:', error.message);
    }
  };

  const openImageModal = index => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
  };

  const shareImage = async () => {
    try {
      const imageToShare = images[selectedImageIndex].url;
      const options = {
        type: 'image/jpeg',
        url: imageToShare,
      };

      await Share.open(options);
    } catch (error) {
      if (error.message === 'User did not share' && !modalVisible) {
        console.warn('User did not share the image');
      } else {
        console.error('Error sharing image:', error.message);
      }
    }
  };

  const saveToDevice = async () => {
    try {
      const imageUri = images[selectedImageIndex].url;

      const result = await CameraRoll.save(imageUri, {type: 'photo'});

      if (result) {
        console.log('Image saved successfully!');
        Alert.alert('Success', 'Image saved successfully!');
      } else {
        console.log('Failed to save image.');
        Alert.alert('Error', 'Failed to save image.');
      }
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'An error occurred while saving the image.');
    }
  };
  const deleteImage = async () => {
    try {
      const imageToDelete = images[selectedImageIndex];
      const pathToDelete = imageToDelete.url.replace('file://', '');
      await RNFS.unlink(pathToDelete);
      const updatedImages = [...images];
      updatedImages.splice(selectedImageIndex, 1);
      setImages(updatedImages);
      closeImageModal();
    } catch (error) {
      console.error('Error deleting image:', error.message);
    }
  };

  const saveAsPdf = async () => {
    try {
      const imageToSave = images[selectedImageIndex].url;

      const uniqueName = `image_${Date.now()}.pdf`;

      const pdfHtmlContent = `
      <html>
        <head></head>
        <body>
          <img src="${imageToSave}" style="width: 100%;" />
        </body>
      </html>
    `;

      const pdfOptions = {
        html: pdfHtmlContent,
        fileName: uniqueName,
        directory: RNFS.DocumentDirectoryPath,
      };

      const pdf = await RNHTMLtoPDF.convert(pdfOptions);

      const targetDirectory = '/storage/emulated/0/Documents';

      const targetPath = `${targetDirectory}/${uniqueName}`;
      await RNFS.moveFile(pdf.filePath, targetPath);

      console.log('PDF saved to:', targetPath);
      Alert.alert('Success', 'PDF saved to Documents folder in Device Storage');
    } catch (error) {
      console.error('Error saving image as PDF:', error.message);
    }
  };

  if (!loading && images.length === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>No Data to Display</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {images.map((image, index) => (
          <TouchableOpacity key={index} onPress={() => openImageModal(index)}>
            <View
              style={{
                width: Dimensions.get('window').width / 2 - 20,
                height: 200,
                borderRadius: 10,
                margin: 5,
                overflow: 'hidden', // Clip the image within the rounded corners
              }}>
              <Image
                source={{uri: image.url}}
                style={{width: '100%', height: '100%', resizeMode: 'cover'}}
              />
            </View>
          </TouchableOpacity>
        ))}

        <Modal
          isVisible={modalVisible}
          onBackdropPress={closeImageModal}
          style={{flex: 1, margin: 0}}>
          <ImageViewer
            imageUrls={images}
            index={selectedImageIndex}
            enableSwipeDown
            onSwipeDown={closeImageModal}
            enableImageZoom
            onChange={index => setSelectedImageIndex(index)}
            renderHeader={() => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingTop: Platform.OS === 'ios' ? 40 : 20,
                }}>
                <TouchableOpacity onPress={closeImageModal}>
                  <Text style={{color: 'white', fontSize: 16}}>Close</Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity onPress={() => shareImage()}>
                    <Text style={{color: 'white', fontSize: 16}}>Share</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteImage()}>
                    <Text
                      style={{color: 'white', fontSize: 16, marginLeft: 15}}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          {/* Custom Footer */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 16,
              backgroundColor: 'black',
            }}>
            <TouchableOpacity onPress={() => saveAsPdf()}>
              <Text style={{color: 'white', fontSize: 16, marginLeft: 15}}>
                Save as PDF
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => saveToDevice()}>
              <Text style={{color: 'white', fontSize: 16, marginRight: 15}}>
                Save as JPG
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default MyGallery;
