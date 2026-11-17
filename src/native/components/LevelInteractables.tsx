import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Checkpoint, Chest, Scroll, ToriiGate, Trap } from '../GameState';

interface LevelInteractablesProps {
  checkpoints: Checkpoint[];
  chests: Chest[];
  scrolls: Scroll[];
  exitGate: ToriiGate | null;
  traps: Trap[];
  
  checkpointRefs: React.MutableRefObject<View[]>;
  checkpointLampsRef: React.MutableRefObject<View[]>;
  chestRefs: React.MutableRefObject<View[]>;
  scrollRefs: React.MutableRefObject<View[]>;
  gatePortalRef: React.RefObject<View>;
  sawRefs: React.MutableRefObject<View[]>;
}

export function LevelInteractables({
  checkpoints,
  chests,
  scrolls,
  exitGate,
  traps,
  checkpointRefs,
  checkpointLampsRef,
  chestRefs,
  scrollRefs,
  gatePortalRef,
  sawRefs,
}: LevelInteractablesProps) {
  return (
    <>
      {/* Checkpoints pagodas */}
      {checkpoints.map((cp, i) => (
        <View
          key={`cp-${i}`}
          ref={el => { checkpointRefs.current[i] = el!; }}
          style={[styles.checkpointContainer, { left: cp.x, top: cp.y }]}
        >
          <View style={styles.pagodaBase} />
          <View style={styles.pagodaShelf} />
          <View
            ref={el => { checkpointLampsRef.current[i] = el!; }}
            style={styles.pagodaChamber}
          />
          <View style={styles.pagodaRoof} />
        </View>
      ))}

      {/* Treasure chests */}
      {chests.map((ch, i) => (
        <View
          key={`chest-${i}`}
          ref={el => { chestRefs.current[i] = el!; }}
          style={[styles.chestContainer, { left: ch.x, top: ch.y }]}
        >
          <View style={styles.chestLid} />
          <View style={styles.chestBox}>
            <View style={styles.chestLock} />
          </View>
        </View>
      ))}

      {/* Collectible scrolls */}
      {scrolls.map((sc, i) => (
        <View
          key={`scroll-${i}`}
          ref={el => { scrollRefs.current[i] = el!; }}
          style={[styles.scrollContainer, { left: sc.x, top: sc.y }]}
        >
          <View style={styles.scrollRoll} />
          <View style={styles.scrollRibbon} />
          <View style={styles.scrollRollerTop} />
          <View style={styles.scrollRollerBottom} />
        </View>
      ))}

      {/* Exit Torii Gate */}
      {exitGate && (
        <View style={[styles.toriiGate, { left: exitGate.x, top: exitGate.y }]}>
          <View style={styles.toriiPillarLeft} />
          <View style={styles.toriiPillarRight} />
          <View style={styles.toriiCrossbeam} />
          <View style={styles.toriiHeader} />
          <View ref={gatePortalRef} style={styles.toriiPortal} />
        </View>
      )}

      {/* Traps spikes/saws */}
      {traps.map((tr, i) => {
        if (tr.type === 'spikes') {
          return (
            <View key={`trap-${i}`} style={[styles.spikesContainer, { left: tr.x, top: tr.y, width: tr.w, height: tr.h }]}>
              {Array.from({ length: 6 }).map((_, spikeIndex) => (
                <View key={`spike-${spikeIndex}`} style={styles.spikeTriangle} />
              ))}
            </View>
          );
        } else {
          return (
            <View
              key={`trap-${i}`}
              ref={el => { sawRefs.current[i] = el!; }}
              style={[styles.sawBlade, { left: tr.x, top: tr.y }]}
            >
              {Array.from({ length: 12 }).map((_, toothIdx) => (
                <View
                  key={`tooth-${toothIdx}`}
                  style={[
                    styles.sawTooth,
                    { transform: [{ rotate: (toothIdx * 30) + 'deg' }] }
                  ]}
                />
              ))}
              <View style={styles.sawCenter} />
            </View>
          );
        }
      })}
    </>
  );
}

const styles = StyleSheet.create({
  checkpointContainer: {
    position: 'absolute',
    width: 45,
    height: 70,
  },
  pagodaBase: {
    position: 'absolute',
    left: 15,
    top: 45,
    width: 15,
    height: 25,
    backgroundColor: '#111111',
    borderColor: '#000000',
    borderWidth: 3,
  },
  pagodaShelf: {
    position: 'absolute',
    left: 8,
    top: 38,
    width: 29,
    height: 7,
    backgroundColor: '#111111',
    borderColor: '#000000',
    borderWidth: 3,
  },
  pagodaChamber: {
    position: 'absolute',
    left: 12,
    top: 18,
    width: 21,
    height: 20,
    borderColor: '#000000',
    borderWidth: 3,
  },
  pagodaRoof: {
    position: 'absolute',
    left: 3,
    top: 2,
    width: 39,
    height: 16,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#111111',
    borderColor: '#000000',
    borderWidth: 3,
  },
  chestContainer: {
    position: 'absolute',
    width: 50,
    height: 40,
  },
  chestLid: {
    width: 50,
    height: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#15100a',
    borderColor: '#000000',
    borderWidth: 3,
  },
  chestBox: {
    width: 50,
    height: 28,
    backgroundColor: '#15100a',
    borderColor: '#000000',
    borderWidth: 3,
    borderTopWidth: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  chestLock: {
    width: 8,
    height: 10,
    backgroundColor: '#e69d24',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  scrollContainer: {
    position: 'absolute',
    width: 32,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ffe066',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
  },
  scrollRoll: {
    position: 'absolute',
    width: 26,
    height: 26,
    backgroundColor: '#ffeed1',
    borderColor: '#000000',
    borderWidth: 2,
  },
  scrollRibbon: {
    position: 'absolute',
    width: 6,
    height: 26,
    backgroundColor: '#cc2b21',
  },
  scrollRollerTop: {
    position: 'absolute',
    top: 3,
    width: 32,
    height: 4,
    backgroundColor: '#5c3a1e',
    borderRadius: 1,
  },
  scrollRollerBottom: {
    position: 'absolute',
    bottom: 3,
    width: 32,
    height: 4,
    backgroundColor: '#5c3a1e',
    borderRadius: 1,
  },
  toriiGate: {
    position: 'absolute',
    width: 120,
    height: 130,
  },
  toriiPillarLeft: {
    position: 'absolute',
    left: 20,
    top: 15,
    width: 12,
    height: 115,
    backgroundColor: '#0f0f0f',
    borderColor: '#000000',
    borderWidth: 3.5,
  },
  toriiPillarRight: {
    position: 'absolute',
    right: 20,
    top: 15,
    width: 12,
    height: 115,
    backgroundColor: '#0f0f0f',
    borderColor: '#000000',
    borderWidth: 3.5,
  },
  toriiCrossbeam: {
    position: 'absolute',
    left: 10,
    top: 30,
    width: 100,
    height: 12,
    backgroundColor: '#0f0f0f',
    borderColor: '#000000',
    borderWidth: 3.5,
  },
  toriiHeader: {
    position: 'absolute',
    left: 0,
    top: 6,
    width: 120,
    height: 12,
    backgroundColor: '#0f0f0f',
    borderColor: '#000000',
    borderWidth: 3.5,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  toriiPortal: {
    position: 'absolute',
    left: 32,
    top: 30,
    width: 56,
    height: 100,
    backgroundColor: '#0f331f',
    borderColor: '#66ff99',
    borderWidth: 1.5,
    shadowColor: '#66ff99',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 15,
  },
  spikesContainer: {
    position: 'absolute',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  spikeTriangle: {
    borderStyle: 'solid',
    borderLeftWidth: 6.6,
    borderRightWidth: 6.6,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#0c0c0d',
    width: 0,
    height: 0,
  },
  sawBlade: {
    position: 'absolute',
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sawTooth: {
    position: 'absolute',
    width: 8,
    height: 28,
    backgroundColor: '#0f0f0f',
    borderColor: '#ff3333',
    borderWidth: 1.5,
    top: 18,
    borderRadius: 1,
  },
  sawCenter: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    zIndex: 10,
  },
});
