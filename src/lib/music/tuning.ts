export const A4_MIDI = 69;
export const A4_HZ = 440;

export function midiToFreq(midi: number): number {
  return A4_HZ * Math.pow(2, (midi - A4_MIDI) / 12);
}

const NAMES: Record<string, number> = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5,
  'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11,
};

export function noteToMidi(note: string): number {
  const match = note.match(/^([A-G][b#]?)(-?\d+)$/);
  if (!match) throw new Error(`bad note: ${note}`);
  const [, name, octaveStr] = match;
  const octave = parseInt(octaveStr, 10);
  return (octave + 1) * 12 + NAMES[name];
}

export function chord(root: string, intervals: number[]): number[] {
  const r = noteToMidi(root);
  return intervals.map((i) => r + i);
}

export const F_PENTATONIC = ['F', 'G', 'A', 'C', 'D'];
export const D_DORIAN_PENT = ['D', 'F', 'G', 'A', 'C'];
