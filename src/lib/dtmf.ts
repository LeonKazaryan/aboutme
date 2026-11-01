// Real DTMF: every phone key is two sine waves sounding at once.
const rows = [697, 770, 852, 941];
const cols = [1209, 1336, 1477];
const keys = ["123", "456", "789", "*0#"];

let audio: AudioContext | null = null;

function play(frequencies: number[], seconds: number, volume: number) {
  audio ??= new AudioContext();
  const start = audio.currentTime;
  const gain = audio.createGain();
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.008);
  gain.gain.setValueAtTime(volume, start + seconds - 0.02);
  gain.gain.linearRampToValueAtTime(0, start + seconds);
  gain.connect(audio.destination);
  for (const frequency of frequencies) {
    const osc = audio.createOscillator();
    osc.frequency.value = frequency;
    osc.connect(gain);
    osc.start(start);
    osc.stop(start + seconds);
  }
}

export function playKey(key: string) {
  const row = keys.findIndex((line) => line.includes(key));
  if (row < 0) return;
  play([rows[row], cols[keys[row].indexOf(key)]], 0.14, 0.05);
}

/** The two-note "connected" chirp when a call is picked up. */
export function playConnect() {
  play([880], 0.09, 0.04);
  setTimeout(() => play([1320], 0.12, 0.04), 100);
}
