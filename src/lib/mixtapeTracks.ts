export type MixtapeSide = 'A' | 'B';

export type MixtapeTrack = {
  side: MixtapeSide;
  src: string;
  title: string;
  attribution?: string;
  durationSec?: number;
  bpm?: number;
};

export const MIXTAPE_TRACKS: MixtapeTrack[] = [
  {
    side: 'A',
    src: 'audio/sideA/01.mp3',
    title: 'Sleepy Cat',
    attribution: 'Alejandro Magaña (A. M.) via Mixkit (Mixkit License)',
  },
  {
    side: 'A',
    src: 'audio/sideA/02.mp3',
    title: 'Sweet September',
    attribution: 'Arulo via Mixkit (Mixkit License)',
  },
  {
    side: 'B',
    src: 'audio/sideB/01.mp3',
    title: 'Machine Drum Vibes',
    attribution: 'Alejandro Magaña (A. M.) via Mixkit (Mixkit License)',
  },
  {
    side: 'B',
    src: 'audio/sideB/02.mp3',
    title: 'Minimal Emotion',
    attribution: 'Alejandro Magaña (A. M.) via Mixkit (Mixkit License)',
  },
];

export const MIXTAPE_SFX = {
  needleDropA: 'audio/sfx/needle-drop-a.mp3',
  needleDropB: 'audio/sfx/needle-drop-b.mp3',
  flip: 'audio/sfx/flip.mp3',
  scratchA: 'audio/sfx/scratch-a.mp3',
  scratchB: 'audio/sfx/scratch-b.mp3',
  hiss: 'audio/sfx/hiss-loop.mp3',
} as const;

export type MixtapeSfxKey = keyof typeof MIXTAPE_SFX;
