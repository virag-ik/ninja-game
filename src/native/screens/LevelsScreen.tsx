import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LevelsScreenProps {
  levelUnlocked: number;
  gold: number;
  onBack: () => void;
  onPlayLevel: (levelIdx: number) => void;
}

export function LevelsScreen({ levelUnlocked, gold, onBack, onPlayLevel }: LevelsScreenProps) {
  const levels = Array.from({ length: 15 }, (_, i) => i + 1);

  return (
    <LinearGradient colors={['#0d0714', '#170c26', '#26143c']} style={styles.menuContainer}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>BACK</Text>
        </TouchableOpacity>
        
        <Text style={styles.pageTitleText}>SELECT LEVEL</Text>

        <Text style={styles.goldIndicatorText}>GOLD: 🪙 {gold}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
        <View style={styles.levelsGrid}>
          {levels.map(idx => {
            const locked = idx > levelUnlocked;
            return (
              <TouchableOpacity
                key={`lvl-card-${idx}`}
                style={[styles.levelCard, locked && styles.lockedCard]}
                disabled={locked}
                onPress={() => onPlayLevel(idx)}
              >
                <Text style={[styles.levelCardText, locked && styles.lockedCardText]}>LEVEL {idx}</Text>
                {locked ? (
                  <Text style={styles.lockIconText}>🔒 LOCKED</Text>
                ) : (
                  <Text style={styles.playIconText}>READY ▶</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 10,
  },
  pageTitleText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'normal',
    textShadowColor: 'rgba(204, 43, 33, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  backButton: {
    width: 100,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(30, 30, 35, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'normal',
  },
  goldIndicatorText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e6ab17',
    fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'normal',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  levelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 960,
  },
  levelCard: {
    width: 160,
    height: 120,
    borderRadius: 12,
    backgroundColor: 'rgba(204, 43, 33, 0.85)',
    borderColor: '#ffffff',
    borderWidth: 1.8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    shadowColor: '#ff3333',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  lockedCard: {
    backgroundColor: 'rgba(20, 20, 25, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 0,
  },
  levelCardText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 10,
  },
  lockedCardText: {
    color: '#666666',
  },
  lockIconText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#cc3333',
  },
  playIconText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffe5b4',
  },
});
