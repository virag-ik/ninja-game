import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export interface AudioRef {
  play: (soundName: string) => void;
}

export const HiddenAudio = forwardRef<AudioRef, {}>((_, ref) => {
  const webViewRef = useRef<WebView>(null);

  useImperativeHandle(ref, () => ({
    play: (soundName: string) => {
      webViewRef.current?.injectJavaScript(`
        if (window.sound) {
          window.sound.init();
          window.sound.resume();
          switch ("${soundName}") {
            case "jump": window.sound.playJump(); break;
            case "doubleJump": window.sound.playDoubleJump(); break;
            case "dash": window.sound.playDash(); break;
            case "slash": window.sound.playSlash(); break;
            case "shuriken": window.sound.playShuriken(); break;
            case "coin": window.sound.playCoin(); break;
            case "scroll": window.sound.playScroll(); break;
            case "hit": window.sound.playHit(); break;
            case "hurt": window.sound.playHurt(); break;
            case "disguise": window.sound.playDisguise(); break;
            case "checkpoint": window.sound.playCheckpoint(); break;
          }
        }
        true;
      `);
    }
  }));

  const htmlSource = `
    <!DOCTYPE html>
    <html>
    <body>
      <script>
        class SoundManager {
          constructor() {
            this.ctx = null;
            this.muted = false;
            this.synthBgmNode = null;
            this.bgmPlaying = false;
            this.notes = [146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00];
          }

          init() {
            if (this.ctx) return;
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
              this.ctx = new AudioContext();
              this.startBgm();
            }
          }

          resume() {
            if (this.ctx && this.ctx.state === 'suspended') {
              this.ctx.resume();
            }
          }

          playJump() {
            if (!this.ctx || this.muted) return;
            this.resume();
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(350, this.ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.15);
          }

          playDoubleJump() {
            if (!this.ctx || this.muted) return;
            this.resume();
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, this.ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.2);
          }

          playDash() {
            if (!this.ctx || this.muted) return;
            this.resume();
            const bufferSize = this.ctx.sampleRate * 0.15;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
              data[i] = Math.random() * 2 - 1;
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(800, this.ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.15);
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            noise.start();
          }

          playSlash() {
            if (!this.ctx || this.muted) return;
            this.resume();
            const bufferSize = this.ctx.sampleRate * 0.1;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
              data[i] = Math.random() * 2 - 1;
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(2000, this.ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(8000, this.ctx.currentTime + 0.1);
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            noise.start();
          }

          playShuriken() {
            if (!this.ctx || this.muted) return;
            this.resume();
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.08);
          }

          playCoin() {
            if (!this.ctx || this.muted) return;
            this.resume();
            const osc = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            osc2.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(987.77, this.ctx.currentTime);
            osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08);
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1318.51, this.ctx.currentTime);
            osc2.frequency.setValueAtTime(1975.53, this.ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.25);
            osc.start();
            osc2.start();
            osc.stop(this.ctx.currentTime + 0.25);
            osc2.stop(this.ctx.currentTime + 0.25);
          }

          playScroll() {
            if (!this.ctx || this.muted) return;
            this.resume();
            const now = this.ctx.currentTime;
            const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
            notes.forEach((freq, index) => {
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              osc.connect(gain);
              gain.connect(this.ctx.destination);
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now + index * 0.06);
              gain.gain.setValueAtTime(0.1, now + index * 0.06);
              gain.gain.exponentialRampToValueAtTime(0.005, now + index * 0.06 + 0.2);
              osc.start(now + index * 0.06);
              osc.stop(now + index * 0.06 + 0.2);
            });
          }

          playHit() {
            if (!this.ctx || this.muted) return;
            this.resume();
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.12);
            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.12);
          }

          playHurt() {
            if (!this.ctx || this.muted) return;
            this.resume();
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, this.ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 0.25);
            gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.25);
          }

          playDisguise() {
            if (!this.ctx || this.muted) return;
            this.resume();
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(200, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.15);
          }

          playCheckpoint() {
            if (!this.ctx || this.muted) return;
            this.resume();
            const now = this.ctx.currentTime;
            const notes = [329.63, 440.00, 554.37, 659.25];
            notes.forEach((freq, index) => {
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              osc.connect(gain);
              gain.connect(this.ctx.destination);
              osc.type = 'triangle';
              osc.frequency.setValueAtTime(freq, now + index * 0.08);
              gain.gain.setValueAtTime(0.08, now + index * 0.08);
              gain.gain.exponentialRampToValueAtTime(0.005, now + index * 0.08 + 0.3);
              osc.start(now + index * 0.08);
              osc.stop(now + index * 0.08 + 0.3);
            });
          }

          startBgm() {
            if (!this.ctx || this.bgmPlaying) return;
            this.bgmPlaying = true;
            this.playNextBgmNote(0);
          }

          playNextBgmNote(step) {
            if (!this.bgmPlaying || this.muted || !this.ctx) return;
            const now = this.ctx.currentTime;
            const noteIndex = Math.floor(Math.sin(step * 0.3) * 4.5 + 4.5);
            const freq = this.notes[noteIndex];
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            const vibrato = this.ctx.createOscillator();
            const vibratoGain = this.ctx.createGain();
            vibrato.frequency.value = 6;
            vibratoGain.gain.value = 2;
            vibrato.connect(vibratoGain);
            vibratoGain.connect(osc.frequency);
            vibrato.start();
            filter.type = 'lowpass';
            filter.frequency.value = 800;
            gain.gain.setValueAtTime(0.0, now);
            gain.gain.linearRampToValueAtTime(0.04, now + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 1.3);
            vibrato.stop(now + 1.3);
            setTimeout(() => {
              this.playNextBgmNote(step + 1);
            }, 1000);
          }
        }
        window.sound = new SoundManager();
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.hiddenWeb}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlSource }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  hiddenWeb: {
    width: 0,
    height: 0,
    position: 'absolute',
    opacity: 0,
  }
});
