// Make the Judge Smile
// Entry: one line, at most 200 characters, about a small good thing that
// happened today. The program writes the line to /output/entry.txt,
// exactly as the judge will read it.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const LINE =
  "The librarian slipped a handwritten 'you've got this' into my returned book, and I carried it in my pocket all afternoon.";

const OUT_PATH = "/output/entry.txt";

// The gate requires 1-200 characters of UTF-8 text, not only whitespace.
if (LINE.length === 0 || LINE.length > 200) {
  throw new Error(`Line must be 1-200 characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  throw new Error("Line must not be only whitespace");
}

// The entry is one line: no line breaks inside it. It is also one
// sentence: exactly one sentence-ending period, at the very end.
if (/[\r\n]/.test(LINE)) {
  throw new Error("Line must contain no line breaks");
}
const sentenceEnders = (LINE.match(/[.!?]/g) ?? []).length;
if (sentenceEnders !== 1 || !LINE.endsWith(".")) {
  throw new Error("Line must be exactly one sentence ending with a period");
}

// The judge's brief, in order: a small good thing today, warmth, surprise,
// one concrete detail, fresh wording. Guard the line against silent drift:
// every load-bearing piece of the moment must still be there.
const REQUIRED_PHRASES = [
  "librarian",
  "handwritten 'you've got this'",
  "returned book",
  "carried it in my pocket",
  "all afternoon",
];
for (const phrase of REQUIRED_PHRASES) {
  if (!LINE.includes(phrase)) {
    throw new Error(`Line is missing required phrase: ${phrase}`);
  }
}

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, LINE, "utf8");

// Read back what was written and confirm it is byte-identical to the line,
// so a partial write or encoding slip can never reach the judge.
const written = readFileSync(OUT_PATH, "utf8");
if (written !== LINE) {
  throw new Error("Verification failed: /output/entry.txt differs from the line");
}
if (written.length > 200) {
  throw new Error(`Written entry exceeds 200 characters: ${written.length}`);
}
console.log(`Wrote ${LINE.length} characters to ${OUT_PATH}`);
