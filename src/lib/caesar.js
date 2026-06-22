// Caesar cipher over A–Z. Anything that isn't an uppercase letter (spaces,
// punctuation) passes through unchanged — so puzzle messages must be written
// in plain uppercase A–Z with spaces only (no accents).
export function shiftChar(ch, n) {
  if (ch < 'A' || ch > 'Z') return ch
  return String.fromCharCode(65 + ((ch.charCodeAt(0) - 65 + n + 260) % 26))
}

export function caesar(str, n) {
  return str.split('').map((c) => shiftChar(c, n)).join('')
}
