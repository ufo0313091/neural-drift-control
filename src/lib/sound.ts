
let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
const activeNodes: AudioNode[] = [];

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function stopAll() {
  activeNodes.forEach((n) => {
    try { (n as OscillatorNode | AudioBufferSourceNode).stop?.(); } catch {}
    try { n.disconnect(); } catch {}
  });
  activeNodes.length = 0;
}

function brownNoise(ac: AudioContext): AudioBufferSourceNode {
  const bufSec = 4;
  const buf = ac.createBuffer(1, ac.sampleRate * bufSec, ac.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < d.length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    d[i] = last * 3.5;
  }
  const src = ac.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  return src;
}

function pinkNoise(ac: AudioContext): AudioBufferSourceNode {
  const bufSec = 4;
  const buf = ac.createBuffer(1, ac.sampleRate * bufSec, ac.sampleRate);
  const d = buf.getChannelData(0);
  let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1;
    b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759;
    b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856;
    b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
    d[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.11;
    b6=w*0.115926;
  }
  const src = ac.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  return src;
}

function lfo(ac: AudioContext, freq: number, depth: number): GainNode {
  const osc = ac.createOscillator();
  osc.frequency.value = freq;
  const g = ac.createGain();
  g.gain.value = depth;
  osc.connect(g);
  osc.start();
  activeNodes.push(osc);
  return g;
}

export function startSound(mode: "rain" | "wave" | "forest" | "ambient", volume: number) {
  stopAll();
  const ac = getCtx();
  if (ac.state === "suspended") ac.resume();

  if (!masterGain) {
    masterGain = ac.createGain();
    masterGain.connect(ac.destination);
  }
  masterGain.gain.setTargetAtTime(volume, ac.currentTime, 0.1);

  if (mode === "rain") {
    const bn = brownNoise(ac);
    const lpf = ac.createBiquadFilter();
    lpf.type = "lowpass"; lpf.frequency.value = 900;
    const pn = pinkNoise(ac);
    const bpf = ac.createBiquadFilter();
    bpf.type = "bandpass"; bpf.frequency.value = 1400; bpf.Q.value = 0.5;
    const wetGain = ac.createGain(); wetGain.gain.value = 0.55;
    const wetGain2 = ac.createGain(); wetGain2.gain.value = 0.3;
    const lfoN = lfo(ac, 0.12, 0.08);
    lfoN.connect(wetGain.gain);
    bn.connect(lpf); lpf.connect(wetGain); wetGain.connect(masterGain!);
    pn.connect(bpf); bpf.connect(wetGain2); wetGain2.connect(masterGain!);
    bn.start(); pn.start();
    activeNodes.push(bn, pn, lpf, bpf, wetGain, wetGain2, lfoN);
  } else if (mode === "wave") {
    const bn = brownNoise(ac);
    const bpf = ac.createBiquadFilter();
    bpf.type = "bandpass"; bpf.frequency.value = 300; bpf.Q.value = 0.8;
    const lpf = ac.createBiquadFilter();
    lpf.type = "lowpass"; lpf.frequency.value = 600;
    const wg = ac.createGain(); wg.gain.value = 0.0;
    const waveLfo = lfo(ac, 0.09, 0.45);
    const rippleLfo = lfo(ac, 0.33, 0.07);
    waveLfo.connect(wg.gain);
    rippleLfo.connect(wg.gain);
    bn.connect(bpf); bpf.connect(lpf); lpf.connect(wg); wg.connect(masterGain!);
    bn.start();
    activeNodes.push(bn, bpf, lpf, wg, waveLfo, rippleLfo);
  } else if (mode === "forest") {
    const bn = brownNoise(ac);
    const lpf = ac.createBiquadFilter();
    lpf.type = "lowpass"; lpf.frequency.value = 400;
    const pn = pinkNoise(ac);
    const bpf = ac.createBiquadFilter();
    bpf.type = "bandpass"; bpf.frequency.value = 2200; bpf.Q.value = 1.2;
    const g1 = ac.createGain(); g1.gain.value = 0.4;
    const g2 = ac.createGain(); g2.gain.value = 0.15;
    lfo(ac, 0.07, 0.06).connect(g1.gain);
    lfo(ac, 0.19, 0.04).connect(g2.gain);
    bn.connect(lpf); lpf.connect(g1); g1.connect(masterGain!);
    pn.connect(bpf); bpf.connect(g2); g2.connect(masterGain!);
    bn.start(); pn.start();
    activeNodes.push(bn, pn, lpf, bpf, g1, g2);
  } else if (mode === "ambient") {
    const freqs = [174, 174.7, 285, 285.4];
    freqs.forEach((f, i) => {
      const osc = ac.createOscillator();
      osc.type = "sine"; osc.frequency.value = f;
      const g = ac.createGain(); g.gain.value = 0.07;
      const breathLfo = lfo(ac, 0.05, 0.025);
      breathLfo.connect(g.gain);
      osc.connect(g); g.connect(masterGain!);
      osc.start(ac.currentTime + i * 0.1);
      activeNodes.push(osc, g, breathLfo);
    });
    const pn = pinkNoise(ac);
    const hpf = ac.createBiquadFilter();
    hpf.type = "highpass"; hpf.frequency.value = 8000;
    const qg = ac.createGain(); qg.gain.value = 0.015;
    pn.connect(hpf); hpf.connect(qg); qg.connect(masterGain!);
    pn.start();
    activeNodes.push(pn, hpf, qg);
  }
}

export function stopSound() {
  stopAll();
}

export function setVolume(volume: number) {
  if (masterGain) {
    const ac = getCtx();
    masterGain.gain.setTargetAtTime(volume, ac.currentTime, 0.1);
  }
}
