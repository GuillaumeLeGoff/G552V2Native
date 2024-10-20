import { registerRootComponent } from 'expo';
import * as Font from 'expo-font';
import { ExpoRoot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Empêche le SplashScreen de se cacher automatiquement
SplashScreen.preventAutoHideAsync();

function Root() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Avenir-Black': require('./assets/fonts/Avenir Black.ttf'),
          'Avenir-Book': require('./assets/fonts/Avenir Book.ttf'),
          'Avenir-Heavy': require('./assets/fonts/Avenir Heavy.ttf'),
          'Avenir-Light': require('./assets/fonts/Avenir Light.ttf'),
          'Avenir-Regular': require('./assets/fonts/Avenir Regular.ttf'),
        });
        setFontsLoaded(true);
      } catch (e) {
        console.warn(e);
      } finally {
        // Cache le SplashScreen une fois que les polices sont chargées ou en cas d'erreur
        await SplashScreen.hideAsync();
      }
    }

    loadFonts();
  }, []);

  const ctx = require.context('./app');

  if (!fontsLoaded) {
    return null; // Ou vous pouvez retourner un composant de chargement personnalisé ici
  }

  return <ExpoRoot context={ctx} />;
}

export function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Root />
    </GestureHandlerRootView>
  );
}

registerRootComponent(App);