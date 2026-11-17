import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface VirtualControlsProps {
  touchesRef: React.MutableRefObject<Record<string, boolean>>;
  dashCooldownRef: React.RefObject<View>;
}

export function VirtualControls({ touchesRef, dashCooldownRef }: VirtualControlsProps) {
  return (
    <>
      {/* Left Corner Movement Controls */}
      <View style={[styles.touchCorner, styles.leftTouchCorner]}>
        <View
          style={styles.circleButtonWrapper}
          onTouchStart={() => { touchesRef.current.left = true; }}
          onTouchEnd={() => { touchesRef.current.left = false; }}
        >
          <View style={styles.circleButton}>
            <Text style={styles.buttonTextSymbol}>◀</Text>
          </View>
        </View>

        <View
          style={styles.circleButtonWrapper}
          onTouchStart={() => { touchesRef.current.right = true; }}
          onTouchEnd={() => { touchesRef.current.right = false; }}
        >
          <View style={styles.circleButton}>
            <Text style={styles.buttonTextSymbol}>▶</Text>
          </View>
        </View>
      </View>

      {/* Right Corner Combat Controls */}
      <View style={[styles.touchCorner, styles.rightTouchCorner]}>
        {/* Disguise Log */}
        <View
          style={[styles.circleButtonWrapper, styles.disguiseButtonOffset]}
          onTouchStart={() => { touchesRef.current.disguise = true; }}
          onTouchEnd={() => { touchesRef.current.disguise = false; }}
        >
          <View style={[styles.circleButton, styles.smallerButton, styles.disguiseColor]}>
            <Text style={styles.buttonTextSymbol}>LOG</Text>
          </View>
        </View>

        {/* Shuriken throw */}
        <View
          style={[styles.circleButtonWrapper, styles.shurikenButtonOffset]}
          onTouchStart={() => { touchesRef.current.shuriken = true; }}
          onTouchEnd={() => { touchesRef.current.shuriken = false; }}
        >
          <View style={[styles.circleButton, styles.smallerButton, styles.shurikenColor]}>
            <Text style={styles.buttonTextSymbol}>✵</Text>
          </View>
        </View>

        {/* Sword slash */}
        <View
          style={[styles.circleButtonWrapper, styles.slashButtonOffset]}
          onTouchStart={() => { touchesRef.current.slash = true; }}
          onTouchEnd={() => { touchesRef.current.slash = false; }}
        >
          <View style={[styles.circleButton, styles.meleeColor]}>
            <Text style={styles.buttonTextSymbol}>⚔</Text>
          </View>
        </View>

        {/* Dash Invincibility */}
        <View
          style={[styles.circleButtonWrapper, styles.dashButtonOffset]}
          onTouchStart={() => { touchesRef.current.dash = true; }}
          onTouchEnd={() => { touchesRef.current.dash = false; }}
        >
          <View style={[styles.circleButton, styles.smallerButton, styles.dashColor]}>
            <View ref={dashCooldownRef} style={styles.dashCooldownOverlay} />
            <Text style={[styles.buttonTextSymbol, { zIndex: 5 }]}>DSH</Text>
          </View>
        </View>

        {/* Jump */}
        <View
          style={[styles.circleButtonWrapper, styles.jumpButtonOffset]}
          onTouchStart={() => { touchesRef.current.jump = true; }}
          onTouchEnd={() => { touchesRef.current.jump = false; }}
        >
          <View style={[styles.circleButton, styles.jumpColor]}>
            <Text style={styles.buttonTextSymbol}>JMP</Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  touchCorner: {
    position: 'absolute',
    bottom: 25,
    height: 150,
    width: 320,
    pointerEvents: 'box-none',
  },
  leftTouchCorner: {
    left: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  rightTouchCorner: {
    right: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  circleButtonWrapper: {
    position: 'absolute',
    width: 84,
    height: 84,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(20, 20, 25, 0.65)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  smallerButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  buttonTextSymbol: {
    fontSize: 20,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  disguiseButtonOffset: {
    right: 200,
    bottom: 0,
  },
  shurikenButtonOffset: {
    right: 115,
    bottom: 80,
  },
  slashButtonOffset: {
    right: 110,
    bottom: 0,
  },
  dashButtonOffset: {
    right: 10,
    bottom: 85,
  },
  jumpButtonOffset: {
    right: 0,
    bottom: 0,
  },
  disguiseColor: {
    backgroundColor: 'rgba(97, 58, 23, 0.75)',
    borderColor: 'rgba(181, 131, 81, 0.3)',
  },
  shurikenColor: {
    backgroundColor: 'rgba(20, 30, 45, 0.75)',
    borderColor: 'rgba(102, 204, 255, 0.3)',
  },
  meleeColor: {
    backgroundColor: 'rgba(102, 10, 10, 0.75)',
    borderColor: 'rgba(255, 102, 102, 0.35)',
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  dashColor: {
    backgroundColor: 'rgba(20, 40, 35, 0.75)',
    borderColor: 'rgba(102, 255, 153, 0.3)',
  },
  jumpColor: {
    backgroundColor: 'rgba(15, 15, 18, 0.75)',
    borderColor: 'rgba(255, 255, 255, 0.35)',
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  dashCooldownOverlay: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: '0%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    zIndex: 1,
  },
});
