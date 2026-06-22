// Eurêka — couche sonore « Atelier de Minuit »
// 100 % synthétisée via la Web Audio API : aucun fichier, aucun CDN, hors-ligne,
// libre de droits. Réglages : effets (par défaut activés) + musique d'ambiance
// (par défaut coupée), tous deux gouvernés par l'interrupteur « Sons & musique ».
//
// Aucune lecture avant la première interaction : le contexte audio n'est créé
// qu'au premier geste de l'utilisatrice (ensure() appelé depuis un gestionnaire
// d'évènement). prefers-reduced-motion ne touche pas au son ; l'interrupteur, si.

const NOTES = {
  // fréquences (Hz) — gamme pentatonique douce, chaleureuse
  C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.0, A4: 440.0,
  C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.0, C6: 1046.5,
};

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.enabled = true;     // « Sons & musique » — interrupteur maître
    this.music = false;      // musique d'ambiance — coupée par défaut
    this.ambient = null;     // nœuds de la nappe d'ambiance en cours
    this._unlocked = false;
  }

  // Branche les préférences (appelé par l'app au démarrage et à chaque changement).
  setPrefs({ enabled, music }) {
    if (typeof enabled === 'boolean') this.enabled = enabled;
    if (typeof music === 'boolean') this.music = music;
    // Applique immédiatement : coupe tout si désactivé, gère l'ambiance.
    if (!this.enabled) {
      this._stopAmbient();
    } else if (this.music) {
      if (this._unlocked) this._startAmbient();
    } else {
      this._stopAmbient();
    }
  }

  // Crée / réveille le contexte. À appeler uniquement depuis un geste utilisateur.
  ensure() {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.9;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this._unlocked = true;
    if (this.enabled && this.music && !this.ambient) this._startAmbient();
    return this.ctx;
  }

  _voice(freq, t0, dur, { type = 'sine', gain = 0.18, attack = 0.01, release = 0.3, detune = 0, dest } = {}) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    if (detune) osc.detune.value = detune;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + release);
    osc.connect(g);
    g.connect(dest || this.master);
    osc.start(t0);
    osc.stop(t0 + dur + release + 0.05);
    return osc;
  }

  // Carillon doux : on résout une énigme.
  chime() {
    const ctx = this.ensure();
    if (!ctx || !this.enabled) return;
    const t = ctx.currentTime;
    this._voice(NOTES.G4, t, 0.12, { type: 'sine', gain: 0.16, release: 0.5 });
    this._voice(NOTES.C5, t + 0.06, 0.14, { type: 'sine', gain: 0.16, release: 0.6 });
    this._voice(NOTES.E5, t + 0.12, 0.5, { type: 'triangle', gain: 0.12, release: 0.8 });
  }

  // Fanfare « Eurêka ! » : arpège ascendant + scintillement.
  eureka() {
    const ctx = this.ensure();
    if (!ctx || !this.enabled) return;
    const t = ctx.currentTime;
    const seq = [NOTES.C4, NOTES.E4, NOTES.G4, NOTES.C5, NOTES.E5, NOTES.G5];
    seq.forEach((f, i) => {
      this._voice(f, t + i * 0.085, 0.16, { type: 'triangle', gain: 0.14, release: 0.5 });
    });
    // cloche finale chaleureuse
    this._voice(NOTES.C6, t + seq.length * 0.085, 0.7, { type: 'sine', gain: 0.13, release: 1.2 });
    this._voice(NOTES.G5, t + seq.length * 0.085, 0.7, { type: 'sine', gain: 0.08, detune: 4, release: 1.2 });
    // poussière d'étoiles
    for (let i = 0; i < 5; i++) {
      this._voice(NOTES.C6 + i * 60, t + 0.5 + i * 0.05, 0.05, { type: 'sine', gain: 0.05, release: 0.2 });
    }
  }

  // Petit signe du fennec — un blip tendre.
  foxCue() {
    const ctx = this.ensure();
    if (!ctx || !this.enabled) return;
    const t = ctx.currentTime;
    this._voice(NOTES.A4, t, 0.08, { type: 'sine', gain: 0.1, release: 0.15 });
    this._voice(NOTES.E5, t + 0.05, 0.1, { type: 'sine', gain: 0.08, release: 0.2 });
  }

  // Tic discret sur action (saut, tap).
  tap() {
    const ctx = this.ensure();
    if (!ctx || !this.enabled) return;
    const t = ctx.currentTime;
    this._voice(NOTES.E5, t, 0.04, { type: 'sine', gain: 0.07, attack: 0.005, release: 0.08 });
  }

  // Note montante quand la puce bondit (hauteur croît avec le numéro de saut).
  hop(step = 0) {
    const ctx = this.ensure();
    if (!ctx || !this.enabled) return;
    const t = ctx.currentTime;
    const base = NOTES.C5 * Math.pow(2, Math.min(step, 12) / 24);
    this._voice(base, t, 0.06, { type: 'triangle', gain: 0.09, release: 0.12 });
  }

  // ---- Musique d'ambiance : nappe de nuit lente et évolutive ----
  _startAmbient() {
    const ctx = this.ctx;
    if (!ctx || this.ambient || !this.enabled || !this.music) return;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, ctx.currentTime);
    out.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 3);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 700;
    out.connect(this.master);
    filter.connect(out);

    // deux oscillateurs en quinte + un LFO lent sur le filtre = respiration nocturne
    const o1 = ctx.createOscillator();
    o1.type = 'sine'; o1.frequency.value = NOTES.C4 / 2;
    const o2 = ctx.createOscillator();
    o2.type = 'sine'; o2.frequency.value = NOTES.G4 / 2; o2.detune.value = 3;
    const o3 = ctx.createOscillator();
    o3.type = 'triangle'; o3.frequency.value = NOTES.E4 / 2; o3.detune.value = -4;
    o1.connect(filter); o2.connect(filter); o3.connect(filter);

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.06;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 240;
    lfo.connect(lfoGain); lfoGain.connect(filter.frequency);

    [o1, o2, o3, lfo].forEach((n) => n.start());
    this.ambient = { out, nodes: [o1, o2, o3, lfo], filter };
  }

  _stopAmbient() {
    if (!this.ambient || !this.ctx) return;
    const { out, nodes } = this.ambient;
    const t = this.ctx.currentTime;
    try {
      out.gain.cancelScheduledValues(t);
      out.gain.setValueAtTime(out.gain.value, t);
      out.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
      nodes.forEach((n) => n.stop(t + 1.4));
    } catch (e) { /* déjà arrêté */ }
    this.ambient = null;
  }
}

export const sound = new SoundEngine();
