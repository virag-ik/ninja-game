import React from 'react';
import { StyleSheet, View } from 'react-native';

interface EntityPoolsProps {
  projectileRefs: React.MutableRefObject<View[]>;
  projShurikenRefs: React.MutableRefObject<View[]>;
  projArrowRefs: React.MutableRefObject<View[]>;
  projFireballRefs: React.MutableRefObject<View[]>;
  coinRefs: React.MutableRefObject<View[]>;
  particleRefs: React.MutableRefObject<View[]>;
  scarfRefs: React.MutableRefObject<View[]>;
}

export function EntityPools({
  projectileRefs,
  projShurikenRefs,
  projArrowRefs,
  projFireballRefs,
  coinRefs,
  particleRefs,
  scarfRefs,
}: EntityPoolsProps) {
  return (
    <>
      {/* Projectiles pool */}
      {Array.from({ length: 20 }).map((_, i) => (
        <View
          key={`projectile-${i}`}
          ref={el => { projectileRefs.current[i] = el!; }}
          style={styles.projectileWrapper}
        >
          <View ref={el => { projShurikenRefs.current[i] = el!; }} style={styles.projShuriken} />
          <View ref={el => { projArrowRefs.current[i] = el!; }} style={styles.projArrow} />
          <View ref={el => { projFireballRefs.current[i] = el!; }} style={styles.projFireball} />
        </View>
      ))}

      {/* Coins pool */}
      {Array.from({ length: 20 }).map((_, i) => (
        <View
          key={`coin-loot-${i}`}
          ref={el => { coinRefs.current[i] = el!; }}
          style={styles.coinLoot}
        >
          <View style={styles.coinSquareHole} />
        </View>
      ))}

      {/* Combat Particles pool */}
      {Array.from({ length: 80 }).map((_, i) => (
        <View
          key={`comb-part-${i}`}
          ref={el => { particleRefs.current[i] = el!; }}
          style={styles.combatParticle}
        />
      ))}

      {/* Scarf segments */}
      {Array.from({ length: 8 }).map((_, i) => (
        <View
          key={`scarf-seg-${i}`}
          ref={el => { scarfRefs.current[i] = el!; }}
          style={[
            styles.scarfSegment,
            {
              width: 9 - i,
              height: 9 - i,
              borderRadius: (9 - i) / 2,
            }
          ]}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  projectileWrapper: {
    position: 'absolute',
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  projShuriken: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#111111',
    borderColor: '#ffffff',
    borderWidth: 2,
    shadowColor: '#66ccff',
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  projArrow: {
    width: 24,
    height: 3,
    backgroundColor: '#ffffff',
    borderRadius: 1,
  },
  projFireball: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ff3300',
    borderColor: '#ffcc00',
    borderWidth: 3,
    shadowColor: '#ff3300',
    shadowOpacity: 0.9,
    shadowRadius: 12,
  },
  coinLoot: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#e6ab17',
    borderColor: '#4d3700',
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinSquareHole: {
    width: 5,
    height: 5,
    backgroundColor: '#111111',
  },
  combatParticle: {
    position: 'absolute',
  },
  scarfSegment: {
    position: 'absolute',
    backgroundColor: '#2a82e6',
  },
});
