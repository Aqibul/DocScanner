import React from 'react';
import {View, StatusBar, TouchableOpacity, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MyScanner from './src/screens/MyScanner';
import MyGallery from './src/screens/MyGallery';
import {ImageProvider} from './src/components/ImageContex';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#2a2a72" />
      <ImageProvider>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#e91e63',
            headerStyle: {
              backgroundColor: '#2a2a72',
              elevation: 0, // Remove shadow on Android
              shadowOpacity: 0, // Remove shadow on iOS
              borderBottomWidth: 0, // Remove border
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 18,
            },
          }}>
          <Tab.Screen
            name="My Gallery"
            options={{
              tabBarLabel: 'Docs',
              tabBarIcon: ({color, size}) => (
                <MaterialCommunityIcons
                  name="file-document-multiple"
                  color={color}
                  size={size}
                />
              ),
              headerTitle: () => (
                <Text style={{color: '#fff', fontSize: 22}}>Gallery</Text>
              ),
            }}
            component={MyGallery}
          />
          <Tab.Screen
            name="Scanner"
            options={{
              tabBarLabel: 'Scan',
              tabBarIcon: ({color, size}) => (
                <MaterialCommunityIcons
                  name="camera"
                  color={color}
                  size={size}
                />
              ),
              headerTitle: () => (
                <Text style={{color: '#fff', fontSize: 22}}>Scanner</Text>
              ),
            }}
            component={MyScanner}
          />
        </Tab.Navigator>
      </ImageProvider>
    </NavigationContainer>
  );
};

export default App;
