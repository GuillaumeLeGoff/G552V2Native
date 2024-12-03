import { registerRootComponent } from 'expo';
import * as Font from 'expo-font';
import { ExpoRoot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';


// Empêche le SplashScreen de se cacher automatiquement
SplashScreen.preventAutoHideAsync();

function Root() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
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
      await SplashScreen.hideAsync();
    }
  }
  useEffect(() => {

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

    <Root />

  );
}

registerRootComponent(App);