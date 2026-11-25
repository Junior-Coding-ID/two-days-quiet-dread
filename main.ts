import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One line of quiet dread: 94 characters, exactly as specified.
const TEXT = "LGTM. The tests pass, the linter is quiet, and I no longer remember what this service was for.";
const EXPECTED_BYTES = 95;

function validate(text: string): void {
  if (text.length < 1 || text.length > 140) {
    throw new Error(`entry must be 1-140 characters, got ${text.length}`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  const bytes = Buffer.byteLength(text + "\n", "utf8");
  if (bytes !== EXPECTED_BYTES) {
    throw new Error(`entry must be ${EXPECTED_BYTES} bytes with newline, got ${bytes}`);
  }
}

validate(TEXT);

const outDir = process.env.MAKEFUN_OUTPUT ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, TEXT + "\n", "utf8");

// Round-trip check: what landed on disk must be exactly TEXT + newline.
const onDisk = readFileSync(outPath, "utf8");
if (onDisk !== TEXT + "\n") {
  throw new Error("entry.txt on disk does not match the expected line");
}
console.log(`wrote ${outPath} (${TEXT.length} chars, ${EXPECTED_BYTES} bytes)`);
