export type Mode =
  | "classic"
  | "passphrase"
  | "pin"
  | "iphone"
  | "session"
  | "bits"
  | "uuid"
  | "memorable"
  | "pattern";

export type SessionTab = "secret" | "jwt" | "apikey" | "csrf";

export interface ClassicOpts {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar: boolean;
  pronounceable: boolean;
  ensureFirstAlpha: boolean;
  expandedSymbols: boolean;
}

export interface PassphraseOpts {
  words: number;
  separator: string;
  capitalize: boolean;
  addNumber: boolean;
  numberPosition: "prefix" | "suffix" | "random";
}

export interface PinOpts {
  length: number;
  noRepeating: boolean;
  noSequential: boolean;
  groupDisplay: boolean;
  groupSize: number;
}

export interface IphoneOpts {
  groups: number;
  groupLen: number;
  separator: string;
  mixedCase: boolean;
}

export interface SessionSecretOpts {
  bytes: number;
  format: "hex" | "base64url";
}

export interface JwtOpts {
  algorithm: "HS256" | "HS384" | "HS512";
  format: "hex" | "base64url";
}

export interface ApiKeyOpts {
  prefix: string;
  bodyFormat: "hex" | "base62" | "base64url";
  bodyBytes: number;
}

export interface CsrfOpts {
  style: "uuid-v4" | "hex-24";
}

export interface BitsOpts {
  bits: 128 | 192 | 256;
  format: "hex" | "b64" | "b58";
  includeUuid: boolean;
  includeUlid: boolean;
}

export interface UuidOpts {
  variant: "v4" | "v7" | "ulid" | "nanoid";
}

export interface MemorableOpts {
  pattern: "adj-noun-verb-number" | "adj-noun-number";
  capitalize: boolean;
  separator: string;
  numberRange: 10 | 100 | 1000;
}

export interface PatternOpts {
  pattern: string;
}

export interface StrengthResult {
  pct: number;
  label: string;
  color: string;
  entropyBits: number;
}

export interface HistoryEntry {
  pw: string;
  ts: number;
  mode: Mode;
  label?: string;
}

export interface ModeHandle {
  generate: () => void;
}

export interface ModeProps {
  onGenerate: (pw: string, label?: string) => void;
}
