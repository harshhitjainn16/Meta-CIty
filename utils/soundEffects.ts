// Sound effects utility for MetaCity
// Generates programmatic sounds when audio files are not available

export type SoundType =
  | "success"
  | "error"
  | "vote"
  | "mint"
  | "claim"
  | "notification";

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
  decay?: boolean;
}

const soundConfigs: Record<SoundType, SoundConfig[]> = {
  success: [
    { frequency: 523, duration: 0.1, type: "sine", volume: 0.3 },
    { frequency: 659, duration: 0.1, type: "sine", volume: 0.3, decay: true },
    { frequency: 784, duration: 0.2, type: "sine", volume: 0.4, decay: true },
  ],
  error: [
    { frequency: 220, duration: 0.15, type: "sawtooth", volume: 0.4 },
    {
      frequency: 196,
      duration: 0.15,
      type: "sawtooth",
      volume: 0.3,
      decay: true,
    },
  ],
  vote: [
    { frequency: 440, duration: 0.08, type: "triangle", volume: 0.25 },
    { frequency: 550, duration: 0.12, type: "sine", volume: 0.3, decay: true },
  ],
  mint: [
    { frequency: 880, duration: 0.05, type: "sine", volume: 0.3 },
    { frequency: 1100, duration: 0.05, type: "sine", volume: 0.35 },
    { frequency: 1320, duration: 0.1, type: "sine", volume: 0.4, decay: true },
    { frequency: 1760, duration: 0.15, type: "sine", volume: 0.3, decay: true },
  ],
  claim: [
    { frequency: 660, duration: 0.1, type: "sine", volume: 0.35 },
    { frequency: 880, duration: 0.1, type: "sine", volume: 0.3 },
    { frequency: 1100, duration: 0.15, type: "sine", volume: 0.4, decay: true },
  ],
  notification: [
    { frequency: 800, duration: 0.1, type: "sine", volume: 0.25 },
    { frequency: 600, duration: 0.1, type: "sine", volume: 0.2, decay: true },
  ],
};

class SoundManager {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    try {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        this.audioContext = new AudioContext();
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
      }
    } catch (error) {
      console.warn("Web Audio API not supported:", error);
    }
  }

  private async resumeAudioContext() {
    if (this.audioContext?.state === "suspended") {
      await this.audioContext.resume();
    }
  }

  async playSound(soundType: SoundType, volume: number = 1) {
    if (!this.audioContext || !this.gainNode) {
      this.fallbackBeep(soundType);
      return;
    }

    try {
      await this.resumeAudioContext();

      const configs = soundConfigs[soundType];
      let startTime = this.audioContext.currentTime;

      for (const config of configs) {
        this.createTone(config, startTime, volume);
        startTime += config.duration * 0.8; // Slight overlap for smoother transitions
      }
    } catch (error) {
      console.warn("Error playing programmatic sound:", error);
      this.fallbackBeep(soundType);
    }
  }

  private createTone(
    config: SoundConfig,
    startTime: number,
    globalVolume: number
  ) {
    if (!this.audioContext || !this.gainNode) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.gainNode);

    oscillator.frequency.setValueAtTime(config.frequency, startTime);
    oscillator.type = config.type;

    const volume = config.volume * globalVolume;
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);

    if (config.decay) {
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        startTime + config.duration
      );
    } else {
      gainNode.gain.setValueAtTime(volume, startTime + config.duration - 0.01);
      gainNode.gain.linearRampToValueAtTime(0, startTime + config.duration);
    }

    oscillator.start(startTime);
    oscillator.stop(startTime + config.duration);
  }

  private fallbackBeep(soundType: SoundType) {
    // Simple fallback for browsers without Web Audio API support
    try {
      const frequency = soundConfigs[soundType][0]?.frequency || 500;
      console.log(
        `🔊 ${soundType.toUpperCase()} notification (${frequency}Hz)`
      );
    } catch (error) {
      console.log(`🔊 ${soundType.toUpperCase()} notification`);
    }
  }

  // Cyber-themed sound variations
  async playCyberSound(
    type:
      | "data_transfer"
      | "system_boot"
      | "access_granted"
      | "access_denied"
      | "terminal_beep"
  ) {
    const cyberSounds: Record<string, SoundConfig[]> = {
      data_transfer: [
        { frequency: 1200, duration: 0.05, type: "square", volume: 0.2 },
        { frequency: 800, duration: 0.05, type: "square", volume: 0.15 },
        { frequency: 1400, duration: 0.05, type: "square", volume: 0.25 },
        { frequency: 600, duration: 0.05, type: "square", volume: 0.1 },
      ],
      system_boot: [
        { frequency: 200, duration: 0.1, type: "sawtooth", volume: 0.3 },
        { frequency: 400, duration: 0.1, type: "sawtooth", volume: 0.35 },
        {
          frequency: 800,
          duration: 0.2,
          type: "sine",
          volume: 0.4,
          decay: true,
        },
      ],
      access_granted: [
        { frequency: 440, duration: 0.1, type: "sine", volume: 0.3 },
        {
          frequency: 880,
          duration: 0.15,
          type: "sine",
          volume: 0.4,
          decay: true,
        },
      ],
      access_denied: [
        {
          frequency: 150,
          duration: 0.3,
          type: "sawtooth",
          volume: 0.4,
          decay: true,
        },
      ],
      terminal_beep: [
        { frequency: 800, duration: 0.1, type: "square", volume: 0.25 },
      ],
    };

    if (!this.audioContext || !this.gainNode) {
      console.log(`🔊 CYBER: ${type.replace("_", " ").toUpperCase()}`);
      return;
    }

    try {
      await this.resumeAudioContext();

      const configs = cyberSounds[type] || cyberSounds.terminal_beep;
      let startTime = this.audioContext.currentTime;

      for (const config of configs) {
        this.createTone(config, startTime, 1);
        startTime += config.duration * 0.9;
      }
    } catch (error) {
      console.warn("Error playing cyber sound:", error);
    }
  }
}

// Singleton instance
export const soundManager = new SoundManager();

// Convenience functions
export const playNotificationSound = (type: SoundType, volume?: number) => {
  soundManager.playSound(type, volume);
};

export const playCyberSound = (
  type:
    | "data_transfer"
    | "system_boot"
    | "access_granted"
    | "access_denied"
    | "terminal_beep"
) => {
  soundManager.playCyberSound(type);
};
