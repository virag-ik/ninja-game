import React, { useEffect } from 'react';
import { StyleSheet, View, StatusBar, Platform } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as NavigationBar from 'expo-navigation-bar';
import { GameView } from './src/native/GameView';

export default function App() {
  useEffect(() => {
    async function lockOrientationAndFullscreen() {
      try {
        // Force landscape orientation for the platformer game
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        
        // Hide Status Bar programmatically
        StatusBar.setHidden(true, 'none');

        // Hide Android bottom navigation bar (Home/Back/Recent) and set to swipe overlay
        if (Platform.OS === 'android') {
          await NavigationBar.setVisibilityAsync('hidden');
          await NavigationBar.setBehaviorAsync('overlay-swipe');
        }
      } catch (err) {
        console.warn('Could not lock orientation/fullscreen: ', err);
      }
    }
    lockOrientationAndFullscreen();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <GameView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
});

