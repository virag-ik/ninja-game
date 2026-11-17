import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface UpgradesScreenProps {
  gold: number;
  maxHealth: number;
  dashCooldownMax: number;
  shurikenLevel: number;
  meleeLevel: number;
  onUpgrade: (type: 'health' | 'dash' | 'shuriken' | 'melee', cost: number) => void;
  onBack: () => void;
}

export function UpgradesScreen({
  gold,
  maxHealth,
  dashCooldownMax,
  shurikenLevel,
  meleeLevel,
  onUpgrade,
  onBack,
}: UpgradesScreenProps) {
  // Cost calculations matching GameState upgrade functions
  const healthCost = maxHealth * 110;
  const dashCost = (120 - dashCooldownMax) * 80 + 75;
  const shurikenCost = shurikenLevel * 100 + 40;
  const meleeCost = meleeLevel * 120 + 30;

  const isHealthMax = maxHealth >= 5;
  const isDashMax = dashCooldownMax <= 60;
  const isShurikenMax = shurikenLevel >= 3;
  const isMeleeMax = meleeLevel >= 3;

  const renderUpgradeRow = (
    label: string,
    stat: string,
    cost: number,
    isMax: boolean,
    type: 'health' | 'dash' | 'shuriken' | 'melee'
  ) => {
    return (
      <View style={styles.upgradeRow}>
        <View style={{ flex: 2 }}>
          <Text style={styles.upgradeLabel}>{label}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.upgradeStat}>{stat}</Text>
        </View>
        <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
          {isMax ? (
            <Text style={styles.maxText}>MAX LEVEL</Text>
          ) : (
            <TouchableOpacity
              style={[styles.buyButton, gold < cost && styles.disabledBuyButton]}
              disabled={gold < cost}
              onPress={() => onUpgrade(type, cost)}
            >
              <Text style={styles.buyText}>🪙 {cost}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#08040a', '#140c1a', '#22142d']} style={styles.menuContainer}>
      <Text style={styles.pageTitleText}>ARASHI SHOP</Text>
      
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>BACK</Text>
      </TouchableOpacity>

      <Text style={styles.goldIndicatorText}>GOLD: 🪙 {gold}</Text>

      <View style={styles.upgradesListContainer}>
        {renderUpgradeRow(
          "Max Health (Hearts)",
          `${maxHealth} / 5`,
          healthCost,
          isHealthMax,
          'health'
        )}
        {renderUpgradeRow(
          "Dash Speed (Cooldown)",
          `${140 - dashCooldownMax}%`,
          dashCost,
          isDashMax,
          'dash'
        )}
        {renderUpgradeRow(
          "Shurikens Level",
          `Lvl ${shurikenLevel} / 3`,
          shurikenCost,
          isShurikenMax,
          'shuriken'
        )}
        {renderUpgradeRow(
          "Melee Sword Damage",
          `Lvl ${meleeLevel} / 3`,
          meleeCost,
          isMeleeMax,
          'melee'
        )}
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
  pageTitleText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'normal',
  },
  backButton: {
    position: 'absolute',
    left: 40,
    top: 35,
    width: 110,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(30, 30, 35, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'normal',
  },
  goldIndicatorText: {
    position: 'absolute',
    right: 40,
    top: 42,
    fontSize: 22,
    fontWeight: '700',
    color: '#e6ab17',
    fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'normal',
  },
  upgradesListContainer: {
    width: '85%',
    maxWidth: 700,
    marginTop: 10,
  },
  upgradeRow: {
    flexDirection: 'row',
    height: 60,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  upgradeLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  upgradeStat: {
    fontSize: 17,
    fontWeight: '700',
    color: '#99ccff',
  },
  maxText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#cc3333',
  },
  buyButton: {
    width: 120,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#e69d24',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e69d24',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  disabledBuyButton: {
    backgroundColor: '#4d3919',
  },
  buyText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#ffffff',
  },
});
