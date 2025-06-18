// Audio effects utility for BoperCheck
// Provides sound feedback for user interactions

interface AudioEffectsConfig {
  enabled: boolean;
  volume: number;
}

class AudioEffects {
  private config: AudioEffectsConfig = {
    enabled: true,
    volume: 0.3
  };

  private audioContext: AudioContext | null = null;

  constructor() {
    // Initialize audio context on first user interaction
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.initializeAudioContext();
    }
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new AudioContext();
    } catch (error) {
      console.warn('Audio context not supported:', error);
    }
  }

  // Play coin drop sound effect
  playCoinDrop() {
    if (!this.config.enabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Create coin drop sound
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);

      gainNode.gain.setValueAtTime(this.config.volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Error playing coin drop sound:', error);
    }
  }

  // Play success chime
  playSuccess() {
    if (!this.config.enabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Create success chime
      oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2); // G5

      gainNode.gain.setValueAtTime(this.config.volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.4);
    } catch (error) {
      console.warn('Error playing success sound:', error);
    }
  }

  // Play notification sound
  playNotification() {
    if (!this.config.enabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Create notification beep
      oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
      gainNode.gain.setValueAtTime(this.config.volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);
    } catch (error) {
      console.warn('Error playing notification sound:', error);
    }
  }

  // Toggle audio on/off
  toggle() {
    this.config.enabled = !this.config.enabled;
    return this.config.enabled;
  }

  // Set volume (0-1)
  setVolume(volume: number) {
    this.config.volume = Math.max(0, Math.min(1, volume));
  }

  // Get current settings
  getConfig() {
    return { ...this.config };
  }

  // Check if audio is enabled
  isAudioEnabled() {
    return this.config.enabled;
  }

  // Set audio enabled state
  setEnabled(enabled: boolean) {
    this.config.enabled = enabled;
  }
}

// Export singleton instance
export const audioEffects = new AudioEffects();

// Export individual functions for convenience
export const playCoinDrop = () => audioEffects.playCoinDrop();
export const playSuccess = () => audioEffects.playSuccess();
export const playNotification = () => audioEffects.playNotification();
export const toggleAudio = () => audioEffects.toggle();
export const setAudioVolume = (volume: number) => audioEffects.setVolume(volume);