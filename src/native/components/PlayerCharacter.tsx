import React from 'react';
import { StyleSheet, View } from 'react-native';

interface PlayerCharacterProps {
  playerRef: React.RefObject<View>;
  playerBodyRef: React.RefObject<View>;
  playerSpinRef: React.RefObject<View>;
  playerLogRef: React.RefObject<View>;
  playerLeg1Ref: React.RefObject<View>;
  playerLeg2Ref: React.RefObject<View>;
  playerArmRef: React.RefObject<View>;
  playerSlashRef: React.RefObject<View>;
}

export function PlayerCharacter({
  playerRef,
  playerBodyRef,
  playerSpinRef,
  playerLogRef,
  playerLeg1Ref,
  playerLeg2Ref,
  playerArmRef,
  playerSlashRef,
}: PlayerCharacterProps) {
  return (
    <View ref={playerRef} style={styles.playerContainer}>
      {/* Standard Silhouette Body Pose */}
      <View ref={playerBodyRef} style={styles.playerBody}>
        {/* Head and blue glowing eyes mask */}
        <View style={styles.playerHead}>
          <View style={styles.playerEyes} />
        </View>
        
        {/* Torso */}
        <View style={styles.playerTorso} />
        
        {/* Legs and Arms (mutated by refs) */}
        <View ref={playerLeg1Ref} style={[styles.playerLeg, { left: 12 }]} />
        <View ref={playerLeg2Ref} style={[styles.playerLeg, { left: 22 }]} />
        <View ref={playerArmRef} style={styles.playerArm} />
        
        {/* Sword slash swing sweep overlay arc */}
        <View ref={playerSlashRef} style={styles.playerSlashArc} />
      </View>

      {/* Double Jump flip pose */}
      <View ref={playerSpinRef} style={styles.playerSpinPose} />

      {/* Ninja escape decoy log pose */}
      <View ref={playerLogRef} style={styles.playerLogPose}>
        <View style={styles.playerLogCore} />
        <View style={styles.playerLogCapLeft} />
        <View style={styles.playerLogCapRight} />
        <View style={styles.playerLogLeaf} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  playerContainer: {
    position: 'absolute',
    width: 40,
    height: 60,
  },
  playerBody: {
    flex: 1,
  },
  playerHead: {
    position: 'absolute',
    left: 10,
    top: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0d0d0d',
    borderColor: '#000000',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerEyes: {
    width: 5,
    height: 2.5,
    backgroundColor: '#5ac3ff',
    position: 'absolute',
    right: 3,
    top: 7,
    shadowColor: '#5ac3ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
  },
  playerTorso: {
    position: 'absolute',
    left: 10,
    top: 18,
    width: 20,
    height: 24,
    backgroundColor: '#0d0d0d',
    borderColor: '#000000',
    borderWidth: 2,
    borderRadius: 4,
  },
  playerLeg: {
    position: 'absolute',
    top: 41,
    width: 6,
    height: 16,
    backgroundColor: '#0d0d0d',
    borderRadius: 3,
  },
  playerArm: {
    position: 'absolute',
    left: 8,
    top: 18,
    width: 6,
    height: 16,
    backgroundColor: '#0d0d0d',
    borderRadius: 3,
  },
  playerSlashArc: {
    position: 'absolute',
    top: -12,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderLeftWidth: 4,
    borderColor: '#ffffff',
    transform: [{ rotate: '-10deg' }],
    shadowColor: '#66ccff',
    shadowOpacity: 0.9,
    shadowRadius: 10,
  },
  playerSpinPose: {
    position: 'absolute',
    left: 5,
    top: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0d0d0d',
    borderColor: '#2a82e6',
    borderWidth: 2,
  },
  playerLogPose: {
    position: 'absolute',
    left: -2,
    top: 15,
    width: 44,
    height: 30,
  },
  playerLogCore: {
    position: 'absolute',
    left: 6,
    width: 32,
    height: 30,
    backgroundColor: '#613a17',
    borderColor: '#000000',
    borderWidth: 2.5,
  },
  playerLogCapLeft: {
    position: 'absolute',
    left: 0,
    width: 8,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#b58351',
    borderColor: '#000000',
    borderWidth: 2.5,
  },
  playerLogCapRight: {
    position: 'absolute',
    right: 0,
    width: 8,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#b58351',
    borderColor: '#000000',
    borderWidth: 2.5,
  },
  playerLogLeaf: {
    position: 'absolute',
    top: -10,
    left: 16,
    width: 14,
    height: 8,
    borderRadius: 7,
    backgroundColor: '#24a330',
    borderColor: '#000000',
    borderWidth: 1.5,
  },
});
