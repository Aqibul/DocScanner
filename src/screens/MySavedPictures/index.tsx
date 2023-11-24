import {
  View,
  Text,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

const MySavedDocs = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    hasPermission();
  }, []);

  const hasPermission = async () => {
    const permission =
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      getAllPhotos(); // Fetch photos once permission is granted
    } else {
      const status = await PermissionsAndroid.request(permission);
      if (status === 'granted') {
        getAllPhotos(); // Fetch photos if permission is granted after request
      } else {
        // Handle permission not granted
      }
    }
  };

  const getAllPhotos = async () => {
    try {
      const result = await CameraRoll.getPhotos({
        first: 20,
        assetType: 'Photos',
        groupName: 'Pictures',
      });

      setPhotos(result.edges);
    } catch (error) {
      console.error('Error loading images:', error);
      // Handle error loading images
    }
  };

  return (
    <View>
      <FlatList
        data={photos}
        numColumns={2}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                width: Dimensions.get('window').width / 2 - 20,
                height: 200,
                borderRadius: 10,
                margin: 5,
                backgroundColor: '#a8a8a8',
              }}>
              <Image
                source={{uri: item.node.image.uri}}
                style={{width: '95%', height: '95%'}}
              />
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()} // Add a keyExtractor
      />
      <TouchableOpacity onPress={() => getAllPhotos()}>
        <Text>Get</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MySavedDocs;
