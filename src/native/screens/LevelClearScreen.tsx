import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LevelClearScreenProps {
  onBackToMenu: () => void;
  onGoUpgrades: () => void;
}

export function LevelClearScreen({ onBackToMenu, onGoUpgrades }: LevelClearScreenProps) {
  return (
    <LinearGradient colors={['#051c0d', '#020d06', '#000000']} style={styles.menuContainer}>
      <Text style={styles.titleText}>VICTORY</Text>
      <Text style={styles.subtitleText}>LEVEL COMPLETE CLEARED</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.menuButton} onPress={onBackToMenu}>
          <Text style={styles.menuButtonText}>MAIN MENU</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuButton, styles.secondaryMenuButton]} onPress={onGoUpgrades}>
          <Text style={styles.menuButtonText}>SHOP UPGRADES</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titleText: {
    fontSize: 58,
    fontWeight: '900',
    color: '#33ff77',
    textAlign: 'center',
    shadowColor: '#00ff44',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    marginBottom: 5,
    fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'normal',
  },
  subtitleText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 45,
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'normal',
  },
  menuButton: {
    width: 180,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(204, 43, 33, 0.85)',
    borderColor: '#ffffff',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff3333',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    marginHorizontal: 15,
  },
  secondaryMenuButton: {
    backgroundColor: 'rgba(30, 30, 35, 0.75)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowRadius: 6,
  },
  menuButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'normal',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
