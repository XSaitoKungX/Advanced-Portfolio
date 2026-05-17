"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { randInt, randomChance, pick, shuffle } from "../_lib/crypto";
import Toggle from "../_components/Toggle";
import Slider from "../_components/Slider";
import type { ClassicOpts, ModeHandle, ModeProps } from "../_lib/types";

const LOWER   = "abcdefghijklmnopqrstuvwxyz";
const UPPER   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS  = "0123456789";
const SYM     = "!@#$%^&*()-_=+[]{}|;:,.<>?";
const SYM_EXP = "!@#$%^&*()-_=+[]{}|;:,.<>?`~'\"\\/";
const SIMILAR = /[il1Lo0O]/g;
const CONSONANTS = "bcdfghjklmnpqrstvwxyz";
const VOWELS     = "aeiou";

export function genClassic(o: ClassicOpts): string {
  const sym = o.expandedSymbols ? SYM_EXP : SYM;

  if (o.pronounceable) {
    const consArr = o.excludeSimilar ? CONSONANTS.replace(SIMILAR, "").split("") : CONSONANTS.split("");
    const vowArr  = o.excludeSimilar ? VOWELS.replace(SIMILAR, "").split("") : VOWELS.split("");
    const consU   = o.uppercase ? consArr.map(c => c.toUpperCase()) : [];
    const vowU    = o.uppercase ? vowArr.map(c => c.toUpperCase()) : [];

    const baseLen = Math.floor(o.length * 0.7);
    const chars: string[] = [];
    for (let i = 0; i < baseLen; i++) {
      const isVowel = i % 2 === 1;
      if (o.uppercase && randomChance(3, 10)) {
        chars.push(isVowel ? pick(vowU) : pick(consU));
      } else if (o.lowercase) {
        chars.push(isVowel ? pick(vowArr) : pick(consArr));
      } else {
        chars.push(isVowel ? pick(vowU) : pick(consU));
      }
    }
    // Fill remainder with digits/symbols
    const extras = o.length - baseLen;
    for (let i = 0; i < extras; i++) {
      if (o.numbers && o.symbols) {
        chars.push(i % 2 === 0 ? pick(DIGITS.split("")) : pick(sym.split("")));
      } else if (o.numbers) {
        chars.push(pick(DIGITS.split("")));
      } else if (o.symbols) {
        chars.push(pick(sym.split("")));
      } else {
        chars.push(pick(o.uppercase ? UPPER.split("") : LOWER.split("")));
      }
    }
    // Inject extras at random positions (don't shuffle — preserve CV pattern for first baseLen)
    const injected = [...chars];
    const extraChars = injected.splice(baseLen);
    for (const c of extraChars) {
      const pos = randInt(injected.length + 1);
      injected.splice(pos, 0, c);
    }
    if (o.ensureFirstAlpha && !/[a-zA-Z]/.test(injected[0])) {
      const alphaIdx = injected.findIndex(c => /[a-zA-Z]/.test(c));
      if (alphaIdx > 0) [injected[0], injected[alphaIdx]] = [injected[alphaIdx], injected[0]];
    }
    return injected.join("").slice(0, o.length);
  }

  // Standard mode
  let cs = "";
  if (o.lowercase) cs += LOWER;
  if (o.uppercase) cs += UPPER;
  if (o.numbers)   cs += DIGITS;
  if (o.symbols)   cs += sym;
  if (!cs) cs = LOWER;
  if (o.excludeSimilar) cs = cs.replace(SIMILAR, "");

  const arr = Array.from({ length: o.length }, () => pick(cs.split("")));

  const safeL = o.excludeSimilar ? LOWER.replace(SIMILAR, "") : LOWER;
  const safeU = o.excludeSimilar ? UPPER.replace(SIMILAR, "") : UPPER;
  const safeD = o.excludeSimilar ? DIGITS.replace(SIMILAR, "") : DIGITS;
  const mandatory: string[] = [];
  if (o.lowercase) mandatory.push(pick(safeL.split("")));
  if (o.uppercase) mandatory.push(pick(safeU.split("")));
  if (o.numbers)   mandatory.push(pick(safeD.split("")));
  if (o.symbols)   mandatory.push(pick(sym.split("")));
  mandatory.forEach((c, i) => { arr[i] = c; });

  const result = shuffle(arr);
  if (o.ensureFirstAlpha && !/[a-zA-Z]/.test(result[0])) {
    const alphaIdx = result.findIndex(c => /[a-zA-Z]/.test(c));
    if (alphaIdx > 0) [result[0], result[alphaIdx]] = [result[alphaIdx], result[0]];
  }
  return result.join("");
}

const DEFAULT: ClassicOpts = {
  length: 20, uppercase: true, lowercase: true, numbers: true, symbols: true,
  excludeSimilar: false, pronounceable: false, ensureFirstAlpha: false, expandedSymbols: false,
};

const ClassicMode = forwardRef<ModeHandle, ModeProps>(function ClassicMode({ onGenerate }, ref) {
  const [opts, setOpts] = useState<ClassicOpts>(DEFAULT);
  const set = (patch: Partial<ClassicOpts>) => setOpts(o => ({ ...o, ...patch }));

  useImperativeHandle(ref, () => ({
    generate() {
      onGenerate(genClassic(opts));
    },
  }));

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Options</p>
      <Slider label="Length" value={opts.length} min={4} max={128} onChange={v => set({ length: v })} />
      <div className="space-y-2">
        <Toggle label="Uppercase letters" desc="A–Z" checked={opts.uppercase} onChange={v => set({ uppercase: v })} />
        <Toggle label="Lowercase letters" desc="a–z" checked={opts.lowercase} onChange={v => set({ lowercase: v })} />
        <Toggle label="Numbers"           desc="0–9" checked={opts.numbers}   onChange={v => set({ numbers: v })} />
        <Toggle label="Symbols"           desc="! @ # $ % …" checked={opts.symbols} onChange={v => set({ symbols: v })} />
        <Toggle label="Exclude similar"   desc="i l 1 L o 0 O" checked={opts.excludeSimilar} onChange={v => set({ excludeSimilar: v })} />
        <Toggle label="Pronounceable"     desc="Consonant-vowel alternation" checked={opts.pronounceable} onChange={v => set({ pronounceable: v })} />
        <Toggle label="Start with a letter" checked={opts.ensureFirstAlpha} onChange={v => set({ ensureFirstAlpha: v })} />
        {opts.symbols && (
          <Toggle label="Expanded symbols" desc={'Adds ` ~ \' " \\ /'} checked={opts.expandedSymbols} onChange={v => set({ expandedSymbols: v })} />
        )}
      </div>
    </div>
  );
});

export default ClassicMode;
