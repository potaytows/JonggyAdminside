import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import Tabs from './src/components/Tabs';
import addOwner from './src/screens/addOwner';
import * as SecureStore from 'expo-secure-store';
import Login from './src/screens/auth/login';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

const App = () => {
  const [UserAuth, setUserAuth] = useState(null); // Initialize with null
  const [isAuthChecked, setIsAuthChecked] = useState(false); // Track auth check completion
  const [loaded, error] = useFonts({
    'Kanit-Regular': require('./assets/fonts/Kanit-Regular.ttf'),
    'Kanit-Bold': require('./assets/fonts/Kanit-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    const getLoginInformation = async () => {
      try {
        const user = await SecureStore.getItemAsync('userAuth');
        setUserAuth(user);
      } catch (e) {
        console.log(e);
      } finally {
        setIsAuthChecked(true);
      }
    };

    getLoginInformation();
  }, []);

  if (!loaded && !error) {
    return null; // Prevents rendering before fonts are loaded
  }

  if (!isAuthChecked) {
    return null; // Wait for auth check to complete before rendering
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#ff8a24' },
          headerTintColor: 'white',
        }}
      >
        {UserAuth == null ? (
          <>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="addOwner" component={addOwner} options={{ title: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
