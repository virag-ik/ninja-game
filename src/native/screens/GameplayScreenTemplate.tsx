import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameState, V_WIDTH, V_HEIGHT } from '../GameState';
import { GameHUD } from '../components/GameHUD';
import { VirtualControls } from '../components/VirtualControls';
import { ParallaxScenery } from '../components/ParallaxScenery';
import { EntityPools } from '../components/EntityPools';
import { PlayerCharacter } from '../components/PlayerCharacter';
import { LevelInteractables } from '../components/LevelInteractables';
import { LevelEnemies } from '../components/LevelEnemies';

export interface GameplayScreenTemplateProps {
  levelNumber: number;
  gradientColors: [string, string, ...string[]];
  playSound: (soundName: string) => void;
  onGameOver: () => void;
  onLevelClear: () => void;
  onSyncState: (gold: number, levelUnlocked: number) => void;
}

export function GameplayScreenTemplate({
  levelNumber,
  gradientColors,
  playSound,
  onGameOver,
  onLevelClear,
  onSyncState,
}: GameplayScreenTemplateProps) {
  const [gold, setGold] = useState(0);
  const [health, setHealth] = useState(3);
  const [maxHealth, setMaxHealth] = useState(3);
  const [scrollsFound, setScrollsFound] = useState(0);

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription.remove();
  }, []);

  const { width: screenWidth, height: screenHeight } = dimensions;
  const scale = screenHeight / V_HEIGHT;

  const keysRef = useRef<Record<string, boolean>>({});
  const touchesRef = useRef<Record<string, boolean>>({});
  const requestRef = useRef<number | null>(null);
  const gameStateRef = useRef<GameState | null>(null);

  const worldRef = useRef<View>(null);
  const playerRef = useRef<View>(null);
  const playerBodyRef = useRef<View>(null);
  const playerSpinRef = useRef<View>(null);
  const playerLogRef = useRef<View>(null);
  const playerLeg1Ref = useRef<View>(null);
  const playerLeg2Ref = useRef<View>(null);
  const playerArmRef = useRef<View>(null);
  const playerSlashRef = useRef<View>(null);

  const bg1Ref = useRef<View>(null);
  const bg2Ref = useRef<View>(null);

  const scarfRefs = useRef<View[]>([]);
  const cherryRefs = useRef<View[]>([]);
  const particleRefs = useRef<View[]>([]);
  const projectileRefs = useRef<View[]>([]);
  const coinRefs = useRef<View[]>([]);
  
  const checkpointRefs = useRef<View[]>([]);
  const checkpointLampsRef = useRef<View[]>([]);
  const chestRefs = useRef<View[]>([]);
  const scrollRefs = useRef<View[]>([]);
  const sawRefs = useRef<View[]>([]);
  
  const enemyRefs = useRef<View[]>([]);
  const enemyLeg1Refs = useRef<View[]>([]);
  const enemyLeg2Refs = useRef<View[]>([]);
  const enemyHornsRefs = useRef<View[]>([]);
  
  const gatePortalRef = useRef<View>(null);
  const dashCooldownRef = useRef<View>(null);

  const projShurikenRefs = useRef<View[]>([]);
  const projArrowRefs = useRef<View[]>([]);
  const projFireballRefs = useRef<View[]>([]);

  const lastGoldRef = useRef(0);
  const lastHealthRef = useRef(3);
  const lastMaxHealthRef = useRef(3);
  const lastScrollsRef = useRef(0);
  const lastSceneRef = useRef<'menu' | 'levels' | 'upgrades' | 'play' | 'gameover' | 'clear'>('play');

  useEffect(() => {
    const state = new GameState(playSound);
    state.startLevel(levelNumber);
    gameStateRef.current = state;
    
    setGold(state.gold);
    setHealth(state.player.health);
    setMaxHealth(state.player.maxHealth);

    lastGoldRef.current = state.gold;
    lastHealthRef.current = state.player.health;
    lastMaxHealthRef.current = state.player.maxHealth;
  }, [levelNumber]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const loop = () => {
      const state = gameStateRef.current;
      if (!state) {
        requestRef.current = requestAnimationFrame(loop);
        return;
      }

      state.update(keysRef.current, touchesRef.current);

      if (state.gold !== lastGoldRef.current) {
        lastGoldRef.current = state.gold;
        setGold(state.gold);
        onSyncState(state.gold, state.levelUnlocked);
      }
      if (state.player.health !== lastHealthRef.current) {
        lastHealthRef.current = state.player.health;
        setHealth(state.player.health);
      }
      if (state.player.maxHealth !== lastMaxHealthRef.current) {
        lastMaxHealthRef.current = state.player.maxHealth;
        setMaxHealth(state.player.maxHealth);
      }
      if (state.scrollsFound !== lastScrollsRef.current) {
        lastScrollsRef.current = state.scrollsFound;
        setScrollsFound(state.scrollsFound);
      }
      if (state.scene !== lastSceneRef.current) {
        lastSceneRef.current = state.scene;
        if (state.scene === 'gameover') {
          onGameOver();
        } else if (state.scene === 'clear') {
          onSyncState(state.gold, state.levelUnlocked);
          onLevelClear();
        }
      }

      updateVisuals(state);
      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [onGameOver, onLevelClear, onSyncState]);

  const updateVisuals = (state: GameState) => {
    worldRef.current?.setNativeProps({
      style: { transform: [{ translateX: -state.cameraX }] },
    });

    bg1Ref.current?.setNativeProps({
      style: { transform: [{ translateX: -state.cameraX * 0.15 }] },
    });
    bg2Ref.current?.setNativeProps({
      style: { transform: [{ translateX: -state.cameraX * 0.4 }] },
    });

    state.ambientCherry.forEach((p, i) => {
      const ref = cherryRefs.current[i];
      ref?.setNativeProps({
        style: {
          transform: [
            { translateX: p.x },
            { translateY: p.y },
            { rotate: p.rotation + 'rad' }
          ]
        }
      });
    });

    gatePortalRef.current?.setNativeProps({
      style: { opacity: 0.35 + Math.sin(Date.now() * 0.005) * 0.25 },
    });

    const player = state.player;
    if (playerRef.current) {
      const isVisible = !(player.invincibleTimer > 0 && Math.floor(player.invincibleTimer / 3) % 2 === 0);
      playerRef.current.setNativeProps({
        style: {
          opacity: isVisible ? 1 : 0,
          transform: [
            { translateX: player.x },
            { translateY: player.y },
            { scaleX: player.dir }
          ]
        }
      });

      const isDoubleJumping = (!player.grounded && player.doubleJumpsLeft === 0);
      if (player.dead) {
        playerBodyRef.current?.setNativeProps({ style: { display: 'flex', transform: [{ rotate: '90deg' }] } });
        playerSpinRef.current?.setNativeProps({ style: { display: 'none' } });
        playerLogRef.current?.setNativeProps({ style: { display: 'none' } });
      } else if (player.isDisguised) {
        playerBodyRef.current?.setNativeProps({ style: { display: 'none' } });
        playerSpinRef.current?.setNativeProps({ style: { display: 'none' } });
        playerLogRef.current?.setNativeProps({ style: { display: 'flex' } });
      } else if (isDoubleJumping) {
        playerBodyRef.current?.setNativeProps({ style: { display: 'none' } });
        playerSpinRef.current?.setNativeProps({ style: { display: 'flex', transform: [{ rotate: (Date.now() * 0.02) + 'rad' }] } });
        playerLogRef.current?.setNativeProps({ style: { display: 'none' } });
      } else {
        playerBodyRef.current?.setNativeProps({ style: { display: 'flex', transform: [{ rotate: '0deg' }] } });
        playerSpinRef.current?.setNativeProps({ style: { display: 'none' } });
        playerLogRef.current?.setNativeProps({ style: { display: 'none' } });

        if (Math.abs(player.vx) > 0.5 && player.grounded) {
          const phase = player.animCycle;
          const rot1 = Math.sin(phase) * 35;
          const rot2 = Math.sin(phase + Math.PI) * 35;
          playerLeg1Ref.current?.setNativeProps({ style: { transform: [{ rotate: rot1 + 'deg' }] } });
          playerLeg2Ref.current?.setNativeProps({ style: { transform: [{ rotate: rot2 + 'deg' }] } });
        } else if (!player.grounded) {
          playerLeg1Ref.current?.setNativeProps({ style: { transform: [{ rotate: '-25deg' }] } });
          playerLeg2Ref.current?.setNativeProps({ style: { transform: [{ rotate: '15deg' }] } });
        } else {
          playerLeg1Ref.current?.setNativeProps({ style: { transform: [{ rotate: '0deg' }] } });
          playerLeg2Ref.current?.setNativeProps({ style: { transform: [{ rotate: '0deg' }] } });
        }

        if (player.isSlashing) {
          playerArmRef.current?.setNativeProps({ style: { transform: [{ rotate: '70deg' }] } });
          playerSlashRef.current?.setNativeProps({ style: { opacity: 1 } });
        } else {
          playerArmRef.current?.setNativeProps({ style: { transform: [{ rotate: '0deg' }] } });
          playerSlashRef.current?.setNativeProps({ style: { opacity: 0 } });
        }
      }
    }

    player.scarfPoints.forEach((pt, i) => {
      const ref = scarfRefs.current[i];
      ref?.setNativeProps({
        style: {
          transform: [
            { translateX: pt.x },
            { translateY: pt.y }
          ]
        }
      });
    });

    state.checkpoints.forEach((cp, i) => {
      const ref = checkpointLampsRef.current[i];
      if (ref) {
        ref.setNativeProps({
          style: {
            backgroundColor: cp.active ? '#3399ff' : '#4a1111',
            shadowOpacity: cp.active ? 0.9 : 0,
            shadowRadius: cp.active ? 15 : 0
          }
        });
      }
    });

    state.chests.forEach((ch, i) => {
      const ref = chestRefs.current[i];
      ref?.setNativeProps({
        style: { display: ch.active ? 'flex' : 'none' }
      });
    });

    state.scrolls.forEach((sc, i) => {
      const ref = scrollRefs.current[i];
      if (ref) {
        if (!sc.active) {
          ref.setNativeProps({ style: { display: 'none' } });
        } else {
          const floatY = Math.sin(Date.now() * 0.004 + sc.floatOffset) * 6;
          ref.setNativeProps({
            style: {
              display: 'flex',
              transform: [
                { translateX: sc.x },
                { translateY: sc.y + floatY }
              ]
            }
          });
        }
      }
    });

    const activeProjectiles = state.projectiles;
    for (let i = 0; i < 20; i++) {
      const ref = projectileRefs.current[i];
      if (ref) {
        if (i < activeProjectiles.length) {
          const p = activeProjectiles[i];
          ref.setNativeProps({
            style: {
              opacity: 1,
              transform: [
                { translateX: p.x - p.radius },
                { translateY: p.y - p.radius },
                { rotate: p.angle + 'rad' }
              ]
            }
          });
          projShurikenRefs.current[i]?.setNativeProps({ style: { display: p.type === 'shuriken' ? 'flex' : 'none' } });
          projArrowRefs.current[i]?.setNativeProps({ style: { display: p.type === 'arrow' ? 'flex' : 'none' } });
          projFireballRefs.current[i]?.setNativeProps({ style: { display: p.type === 'fireball' ? 'flex' : 'none' } });
        } else {
          ref.setNativeProps({ style: { opacity: 0 } });
        }
      }
    }

    const activeCoins = state.coins;
    for (let i = 0; i < 20; i++) {
      const ref = coinRefs.current[i];
      if (ref) {
        if (i < activeCoins.length) {
          const c = activeCoins[i];
          ref.setNativeProps({
            style: {
              opacity: 1,
              transform: [
                { translateX: c.x - c.radius },
                { translateY: c.y - c.radius },
                { scaleX: Math.abs(Math.sin(c.spin)) }
              ]
            }
          });
        } else {
          ref.setNativeProps({ style: { opacity: 0 } });
        }
      }
    }

    const activeParticles = state.particles;
    for (let i = 0; i < 80; i++) {
      const ref = particleRefs.current[i];
      if (ref) {
        if (i < activeParticles.length) {
          const p = activeParticles[i];
          const opacity = p.life / p.maxLife;
          ref.setNativeProps({
            style: {
              opacity: opacity,
              backgroundColor: p.color,
              width: p.size * 2,
              height: p.size * 2,
              borderRadius: p.size,
              transform: [
                { translateX: p.x - p.size },
                { translateY: p.y - p.size }
              ]
            }
          });
        } else {
          ref.setNativeProps({ style: { opacity: 0 } });
        }
      }
    }

    state.enemies.forEach((en, i) => {
      const ref = enemyRefs.current[i];
      if (ref) {
        if (!en.active) {
          ref.setNativeProps({ style: { display: 'none' } });
        } else {
          ref.setNativeProps({
            style: {
              display: 'flex',
              transform: [
                { translateX: en.x },
                { translateY: en.y },
                { scaleX: en.dir }
              ],
              backgroundColor: en.hurtTimer > 0 ? 'rgba(255, 51, 51, 0.45)' : 'transparent',
            }
          });

          const leg1 = enemyLeg1Refs.current[i];
          const leg2 = enemyLeg2Refs.current[i];
          if (leg1 && leg2) {
            if (Math.abs(en.vx) > 0.1) {
              const rot = Math.sin(en.animCycle) * 30;
              leg1.setNativeProps({ style: { transform: [{ rotate: rot + 'deg' }] } });
              leg2.setNativeProps({ style: { transform: [{ rotate: -rot + 'deg' }] } });
            } else {
              leg1.setNativeProps({ style: { transform: [{ rotate: '0deg' }] } });
              leg2.setNativeProps({ style: { transform: [{ rotate: '0deg' }] } });
            }
          }

          if (en.type === 'oni') {
            const horn = enemyHornsRefs.current[i];
            horn?.setNativeProps({
              style: { opacity: 0.7 + Math.sin(Date.now() * 0.01) * 0.3 }
            });
          }
        }
      }
    });

    if (dashCooldownRef.current) {
      const ratio = player.dashCooldown / player.dashCooldownMax;
      dashCooldownRef.current.setNativeProps({
        style: { height: (ratio * 100) + '%' }
      });
    }
  };

  const renderPlatforms = () => {
    const state = gameStateRef.current;
    if (!state) return null;
    return state.platforms.map((plat, i) => (
      <View
        key={`plat-${i}`}
        style={[
          styles.solidPlatform,
          {
            left: plat.x,
            top: plat.y,
            width: plat.w,
            height: plat.h,
          },
        ]}
      >
        {Array.from({ length: Math.ceil(plat.w / 45) }).map((_, gi) => (
          <View
            key={`grass-${gi}`}
            style={[
              styles.grassBlade,
              { left: gi * 45 }
            ]}
          />
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.playViewport}>
      <View
        style={[
          styles.gameContainer,
          {
            width: V_WIDTH,
            height: V_HEIGHT,
            transform: [
              { scale: scale },
              { translateX: (screenWidth / scale - V_WIDTH) / 2 },
              { translateY: 0 },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          style={StyleSheet.absoluteFill}
        />

        <ParallaxScenery bg1Ref={bg1Ref} bg2Ref={bg2Ref} cherryRefs={cherryRefs} />

        <View ref={worldRef} style={styles.worldWrapper}>
          {renderPlatforms()}
          
          {gameStateRef.current && (
            <>
              <LevelInteractables
                checkpoints={gameStateRef.current.checkpoints}
                chests={gameStateRef.current.chests}
                scrolls={gameStateRef.current.scrolls}
                exitGate={gameStateRef.current.exitGate}
                traps={gameStateRef.current.traps}
                checkpointRefs={checkpointRefs}
                checkpointLampsRef={checkpointLampsRef}
                chestRefs={chestRefs}
                scrollRefs={scrollRefs}
                gatePortalRef={gatePortalRef}
                sawRefs={sawRefs}
              />

              <LevelEnemies
                enemies={gameStateRef.current.enemies}
                enemyRefs={enemyRefs}
                enemyLeg1Refs={enemyLeg1Refs}
                enemyLeg2Refs={enemyLeg2Refs}
                enemyHornsRefs={enemyHornsRefs}
              />
            </>
          )}

          <EntityPools
            projectileRefs={projectileRefs}
            projShurikenRefs={projShurikenRefs}
            projArrowRefs={projArrowRefs}
            projFireballRefs={projFireballRefs}
            coinRefs={coinRefs}
            particleRefs={particleRefs}
            scarfRefs={scarfRefs}
          />

          <PlayerCharacter
            playerRef={playerRef}
            playerBodyRef={playerBodyRef}
            playerSpinRef={playerSpinRef}
            playerLogRef={playerLogRef}
            playerLeg1Ref={playerLeg1Ref}
            playerLeg2Ref={playerLeg2Ref}
            playerArmRef={playerArmRef}
            playerSlashRef={playerSlashRef}
          />
        </View>
      </View>

      {/* --- HUD OVERLAY --- */}
      <View style={styles.hudOverlay}>
        <GameHUD health={health} maxHealth={maxHealth} scrollsFound={scrollsFound} gold={gold} />
        <VirtualControls touchesRef={touchesRef} dashCooldownRef={dashCooldownRef} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  playViewport: {
    flex: 1,
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  gameContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#0d0d0d',
    overflow: 'hidden',
  },
  worldWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 720,
    width: 5500,
  },
  solidPlatform: {
    position: 'absolute',
    backgroundColor: '#080809',
    borderColor: '#000000',
    borderWidth: 4,
  },
  grassBlade: {
    position: 'absolute',
    top: -12,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#080809',
  },
  hudOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 15,
    pointerEvents: 'box-none',
  },
});
