import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Enemy } from '../GameState';

interface LevelEnemiesProps {
  enemies: Enemy[];
  enemyRefs: React.MutableRefObject<View[]>;
  enemyLeg1Refs: React.MutableRefObject<View[]>;
  enemyLeg2Refs: React.MutableRefObject<View[]>;
  enemyHornsRefs?: React.MutableRefObject<View[]>; // optional for Oni boss
}

export function LevelEnemies({
  enemies,
  enemyRefs,
  enemyLeg1Refs,
  enemyLeg2Refs,
  enemyHornsRefs,
}: LevelEnemiesProps) {
  return (
    <>
      {enemies.map((en, i) => (
        <View
          key={`enemy-${i}`}
          ref={el => { enemyRefs.current[i] = el!; }}
          style={[styles.enemyContainer, { width: en.width, height: en.height }]}
        >
          {en.type === 'oni' ? (
            <View style={styles.oniBody}>
              <View style={styles.oniHornsContainer}>
                <View
                  ref={el => { if (enemyHornsRefs) enemyHornsRefs.current[i] = el!; }}
                  style={styles.oniHorns}
                />
              </View>
              <View style={styles.oniFace}>
                <View style={styles.oniEyes} />
              </View>
              <View style={styles.oniTorso} />
              <View style={styles.oniFlame1} />
              <View style={styles.oniFlame2} />
            </View>
          ) : (
            <View style={styles.soldierBody}>
              <View style={styles.soldierHead}>
                <View style={styles.soldierEyes} />
              </View>
              <View style={styles.soldierTorso} />
              <View ref={el => { enemyLeg1Refs.current[i] = el!; }} style={[styles.soldierLeg, { left: 10 }]} />
              <View ref={el => { enemyLeg2Refs.current[i] = el!; }} style={[styles.soldierLeg, { left: 22 }]} />
              {en.type === 'archer' && <View style={styles.archerBow} />}
              {en.type === 'spear' && <View style={styles.spearStave} />}
            </View>
          )}
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  enemyContainer: {
    position: 'absolute',
  },
  soldierBody: {
    flex: 1,
  },
  soldierHead: {
    position: 'absolute',
    left: 10,
    top: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0a0a0a',
    borderColor: '#000000',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  soldierEyes: {
    width: 4,
    height: 2,
    backgroundColor: '#ff1a1a',
    position: 'absolute',
    right: 4,
    top: 7,
  },
  soldierTorso: {
    position: 'absolute',
    left: 10,
    top: 24,
    width: 20,
    height: 23,
    backgroundColor: '#0a0a0a',
    borderColor: '#000000',
    borderWidth: 2,
    borderRadius: 3,
  },
  soldierLeg: {
    position: 'absolute',
    top: 45,
    width: 6,
    height: 15,
    backgroundColor: '#0a0a0a',
    borderRadius: 2.5,
  },
  archerBow: {
    position: 'absolute',
    left: 24,
    top: 15,
    width: 14,
    height: 32,
    borderColor: '#0a0a0a',
    borderLeftWidth: 3.5,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  spearStave: {
    position: 'absolute',
    left: 20,
    top: 8,
    width: 4,
    height: 48,
    backgroundColor: '#0a0a0a',
    borderRadius: 2,
  },
  oniBody: {
    flex: 1,
  },
  oniFace: {
    position: 'absolute',
    left: 17,
    top: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#080808',
    borderColor: '#000000',
    borderWidth: 3,
  },
  oniEyes: {
    width: 12,
    height: 4,
    backgroundColor: '#ff5500',
    position: 'absolute',
    right: 6,
    top: 14,
  },
  oniHornsContainer: {
    position: 'absolute',
    left: 12,
    top: -4,
    flexDirection: 'row',
    width: 46,
    justifyContent: 'space-between',
  },
  oniHorns: {
    width: 10,
    height: 16,
    backgroundColor: '#ff1100',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  oniTorso: {
    position: 'absolute',
    left: 12,
    top: 44,
    width: 46,
    height: 52,
    backgroundColor: '#080808',
    borderColor: '#000000',
    borderWidth: 3.5,
    borderRadius: 6,
  },
  oniFlame1: {
    position: 'absolute',
    left: -5,
    top: 25,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ff3300',
    opacity: 0.65,
  },
  oniFlame2: {
    position: 'absolute',
    right: -5,
    top: 45,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ffaa00',
    opacity: 0.65,
  },
});
