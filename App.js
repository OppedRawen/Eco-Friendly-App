import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Menu, Avatar, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { Alert, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { auth } from './firebaseConfig';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import MainAppScreen from './screens/MainAppScreen';

import IntroductionScreen from './screens/IntroductionScreen';

import IntroScreen  from './screens/IntroScreen';

import * as Location from 'expo-location';

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2E7D32',
    accent: '#1abc9c',
  },
};

const HeaderRight = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace("Login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <View style={styles.headerRight}>
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <TouchableOpacity onPress={openMenu}>
            <Avatar.Icon 
              size={40} 
              icon="account-circle"
              style={styles.avatar}
            />
          </TouchableOpacity>
        }
        contentStyle={styles.menuContent}
      >
        <Menu.Item 
          onPress={() => {
            closeMenu();
            handleLogout();
          }} 
          title="Logout"
          leadingIcon="logout"
        />
      </Menu>
    </View>
  );
};

export default function App() {
  const [location, setLocation] = useState(null);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        "Permission Denied",
        "Location access is required to use map features in the app.",
        [{ text: "OK" }]
      );
      return;
    }

    const userLocation = await Location.getCurrentPositionAsync({});
    setLocation(userLocation.coords);
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator 

          initialRouteName="Intro"

          screenOptions={{
            headerStyle: styles.header,
            headerTitleStyle: styles.headerTitle,
          }}
        >
          <Stack.Screen 
            name="Introduction" 
            component={IntroductionScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="SignUp" 
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Intro"
            component={IntroScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="MainApp" 
            component={MainAppScreen} 
            options={({ navigation }) => ({
              headerRight: () => <HeaderRight navigation={navigation} />,
              title: "EcoTracker",
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#5d4037',
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  headerRight: {
    marginRight: 16,
    position: 'relative',
  },
  avatar: {
    backgroundColor: '#2c3e59',
  },
  menuContent: {
    marginTop: 45,
    marginRight: 10,
  },
});
