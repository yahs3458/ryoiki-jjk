// All sound here is synthesised in the browser (Web Audio + built-in speech).
// No anime audio, no cloned voices — just original effects and generic text-to-speech lines.

type Domain = "gojo" | "sukuna" | "toji";
const KEY = "ryoiki-muted";

// Chrome loads TTS voices lazily; asking once early means the voice list is ready by the first click
if (typeof window !== "undefined") window.speechSynthesis?.getVoices();

export function isMuted() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setMuted(m: boolean) {
  try {
    localStorage.setItem(KEY, m ? "1" : "0");
  } catch {}
  if (m) speechSynthesis?.cancel();
}

// English lines, spoken in order by the browser's built-in voice (queued, so they never overlap)
const CHANT: Record<Domain, { pitch: number; lines: string[] }> = {
  gojo: { pitch: 1.05, lines: ["Domain Expansion.", "Unlimited Void.", "Throughout heaven and earth, I alone am the honored one."] },
  sukuna: { pitch: 0.3, lines: ["Domain Expansion.", "Malevolent Shrine.", "Stand proud. You are strong."] },
  toji: { pitch: 0.6, lines: ["Domain Expansion?", "Heavenly Restriction.", "No cursed energy. Nothing to lock on to."] },
};

function speak(d: Domain) {
  if (!("speechSynthesis" in window)) return;
  const voices = speechSynthesis.getVoices().filter((v) => v.lang.startsWith("en"));
  // a male English voice suits all three; fall back to any English voice, then the default
  const voice = voices.find((v) => /male|david|daniel|guy|ryan/i.test(v.name) && !/female/i.test(v.name)) ?? voices[0];
  speechSynthesis.cancel();
  for (const line of CHANT[d].lines) {
    const u = new SpeechSynthesisUtterance(line);
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? "en-US";
    u.rate = 0.85;
    u.pitch = CHANT[d].pitch;
    speechSynthesis.speak(u);
  }
}

function noise(ac: AudioContext, secs: number) {
  const buf = ac.createBuffer(1, ac.sampleRate * secs, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buf;
  return src;
}

// a short envelope helper: attack to `peak`, exponential decay to silence
function env(g: GainNode, t: number, peak: number, attack: number, decay: number) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

function boom(ac: AudioContext, out: AudioNode, t: number) {
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.frequency.setValueAtTime(140, t);
  o.frequency.exponentialRampToValueAtTime(32, t + 1.4);
  env(g, t, 0.9, 0.02, 1.6);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + 1.8);
}

function slashHit(ac: AudioContext, out: AudioNode, t: number, freq: number) {
  const n = noise(ac, 0.3);
  const f = ac.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.setValueAtTime(freq, t);
  f.frequency.exponentialRampToValueAtTime(freq * 3, t + 0.18);
  f.Q.value = 6;
  const g = ac.createGain();
  env(g, t, 0.6, 0.005, 0.22);
  n.connect(f).connect(g).connect(out);
  n.start(t);
}

export function playDomain(d: Domain) {
  if (isMuted() || typeof window === "undefined" || !window.AudioContext) return;
  speak(d);

  const ac = new AudioContext();
  const out = ac.createGain();
  out.gain.value = 0.45;
  out.connect(ac.destination);
  const t = ac.currentTime;

  boom(ac, out, t + 0.6);

  if (d === "gojo") {
    // the void hums: two detuned tones and a high shimmer, swelling then fading
    for (const [freq, peak] of [[110, 0.25], [110.8, 0.25], [880, 0.05], [1320, 0.03]]) {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t + 0.8);
      g.gain.exponentialRampToValueAtTime(peak, t + 2);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 6.2);
      o.connect(g).connect(out);
      o.start(t + 0.8);
      o.stop(t + 6.4);
    }
  }

  if (d === "sukuna") {
    for (let i = 0; i < 16; i++) slashHit(ac, out, t + 1.6 + i * 0.28 + Math.random() * 0.1, 900 + Math.random() * 1400);
  }

  if (d === "toji") {
    // glitchy error blips, then one clean cut through the domain
    for (let i = 0; i < 5; i++) {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "square";
      o.frequency.value = 180 + i * 90;
      env(g, t + 0.9 + i * 0.12, 0.12, 0.005, 0.06);
      o.connect(g).connect(out);
      o.start(t + 0.9 + i * 0.12);
      o.stop(t + 1.1 + i * 0.12);
    }
    slashHit(ac, out, t + 2.75, 500);
    slashHit(ac, out, t + 2.78, 2400);
  }

  setTimeout(() => ac.close(), 7500);
}
