import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface MenuScreenProps {
  onSelectLevel: () => void;
  onGoUpgrades: () => void;
}

export function MenuScreen({ onSelectLevel, onGoUpgrades }: MenuScreenProps) {
  return (
    <LinearGradient colors={['#10061e', '#3a1132', '#6c2230']} style={styles.menuContainer}>
      <Text style={styles.titleText}>NINJA ARASHI</Text>
      <Text style={styles.subtitleText}>SHADOW LEGEND</Text>

      <TouchableOpacity style={styles.menuButton} onPress={onSelectLevel}>
        <Text style={styles.menuButtonText}>SELECT LEVEL</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.menuButton, styles.secondaryMenuButton]} onPress={onGoUpgrades}>
        <Text style={styles.menuButtonText}>UPGRADES</Text>
      </TouchableOpacity>

      <Text style={styles.instructionText}>
        Desktop web: A/D - Move | Space/W - Jump | J - Dash | K - Slash | L - Shuriken | I - Disguise
      </Text>
      <Text style={styles.mobileInstructionText}>
        Mobile screen: Dual landscape on-screen controls
      </Text>
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
    color: '#ff3333',
    textAlign: 'center',
    shadowColor: '#cc2121',
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
    width: 250,
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
    marginBottom: 20,
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
  instructionText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    position: 'absolute',
    bottom: 40,
  },
  mobileInstructionText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    position: 'absolute',
    bottom: 15,
  },
});
