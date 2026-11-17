import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface GameHUDProps {
  health: number;
  maxHealth: number;
  scrollsFound: number;
  gold: number;
}

export function GameHUD({ health, maxHealth, scrollsFound, gold }: GameHUDProps) {
  return (
    <View style={styles.hudTopBar}>
      <View style={styles.hudHealthContainer}>
        {Array.from({ length: maxHealth }).map((_, index) => (
          <Text
            key={`heart-${index}`}
            style={[styles.hudHeartText, index >= health && styles.depletedHeartText]}
          >
            ♥
          </Text>
        ))}
      </View>
      
      <View style={styles.hudScrollsContainer}>
        <Text style={styles.hudScrollText}>📜 SCROLLS: {scrollsFound} / 3</Text>
      </View>

      <View style={styles.hudGoldContainer}>
        <Text style={styles.hudGoldText}>🪙 {gold}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hudTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    pointerEvents: 'none',
  },
  hudHealthContainer: {
    flexDirection: 'row',
  },
  hudHeartText: {
    fontSize: 26,
    color: '#ff3333',
    marginRight: 4,
    shadowColor: '#ff0000',
    shadowOpacity: 0.6,
    shadowRadius: 5,
  },
  depletedHeartText: {
    color: '#2d0f0f',
    shadowOpacity: 0,
  },
  hudScrollsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  hudScrollText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffe066',
  },
  hudGoldContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  hudGoldText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e6ab17',
  },
});
