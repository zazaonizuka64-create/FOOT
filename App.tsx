import React, { useCallback, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { colors } from './src/theme/colors';
import AppNavigator from './src/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync();

function App(): React.JSX.Element {
  const [appReady, setAppReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if ((fontsLoaded || fontError) && !appReady) {
      setAppReady(true);
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, appReady]);

  if (!fontsLoaded && !fontError) {
  return <View style={styles.root} />;
}

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <View style={styles.root} onLayout={onLayoutRootView}>
          <StatusBar barStyle="light-content" backgroundColor={colors.background} />
          <AppNavigator />
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default App;