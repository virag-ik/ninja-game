import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ParallaxSceneryProps {
  bg1Ref: React.RefObject<View>;
  bg2Ref: React.RefObject<View>;
  cherryRefs: React.MutableRefObject<View[]>;
}

export function ParallaxScenery({ bg1Ref, bg2Ref, cherryRefs }: ParallaxSceneryProps) {
  return (
    <>
      {/* Parallax distant hills and pagodas */}
      <View ref={bg1Ref} style={styles.parallaxBackground}>
        {Array.from({ length: 4 }).map((_, i) => {
          const px = i * 1100;
          return (
            <View key={`bg-pagoda-${i}`} style={[styles.bgPagodaHill, { left: px }]}>
              <View style={styles.bgPagodaPeak} />
              <View style={styles.bgPagodaRoof1} />
              <View style={styles.bgPagodaRoof2} />
              <View style={styles.bgPagodaTower} />
            </View>
          );
        })}
      </View>

      {/* Parallax bamboo forest */}
      <View ref={bg2Ref} style={styles.parallaxBackground}>
        {Array.from({ length: 28 }).map((_, i) => {
          const bx = i * 220;
          const bh = 350 + Math.sin(i * 1.7) * 120;
          return (
            <View
              key={`bg-bamboo-${i}`}
              style={[
                styles.bgBambooStalk,
                {
                  left: bx,
                  height: bh,
                  bottom: 120,
                }
              ]}
            >
              <View style={[styles.bgBambooNode, { top: '30%' }]} />
              <View style={[styles.bgBambooNode, { top: '60%' }]} />
              <View style={[styles.bgBambooNode, { top: '90%' }]} />
            </View>
          );
        })}
      </View>

      {/* Floating ambient cherry petals */}
      {Array.from({ length: 40 }).map((_, i) => (
        <View
          key={`ambient-cherry-${i}`}
          ref={el => { cherryRefs.current[i] = el!; }}
          style={styles.ambientCherryPetal}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  parallaxBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 2500,
    height: 720,
  },
  bgPagodaHill: {
    position: 'absolute',
    bottom: 120,
    width: 600,
    height: 350,
    justifyContent: 'flex-end',
  },
  bgPagodaPeak: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 300,
    borderRightWidth: 300,
    borderBottomWidth: 350,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#12081c',
    opacity: 0.5,
  },
  bgPagodaTower: {
    position: 'absolute',
    left: 280,
    bottom: 220,
    width: 40,
    height: 80,
    backgroundColor: '#12081c',
    opacity: 0.5,
  },
  bgPagodaRoof1: {
    position: 'absolute',
    left: 260,
    bottom: 255,
    width: 80,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#12081c',
    opacity: 0.5,
  },
  bgPagodaRoof2: {
    position: 'absolute',
    left: 250,
    bottom: 225,
    width: 100,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#12081c',
    opacity: 0.5,
  },
  bgBambooStalk: {
    position: 'absolute',
    width: 14,
    backgroundColor: '#0a0510',
    opacity: 0.65,
  },
  bgBambooNode: {
    position: 'absolute',
    left: -2,
    width: 18,
    height: 2.5,
    backgroundColor: '#000000',
  },
  ambientCherryPetal: {
    position: 'absolute',
    width: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(245, 170, 185, 0.55)',
  },
});
