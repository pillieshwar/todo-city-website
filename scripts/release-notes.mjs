// Refreshes the release notes shown at /docs/release-notes from the app's
// own list (src/whats-new.json in pillieshwar/TodoCity, main branch).
//   npm run docs:release-notes
import { writeFile } from "node:fs/promises";

const url = "https://raw.githubusercontent.com/pillieshwar/TodoCity/main/src/whats-new.json";
const res = await fetch(url);
if (!res.ok) throw new Error(`release notes: ${url} answered ${res.status}`);
const notes = await res.json();
const versions = Object.keys(notes);
if (!versions.length || !versions.every((v) => /^\d+\.\d+\.\d+$/.test(v) && Array.isArray(notes[v]))) {
  throw new Error("release notes: whats-new.json isn't a list of versions with lines");
}
await writeFile(new URL("../src/docs/whats-new.json", import.meta.url), `${JSON.stringify(notes, null, 2)}\n`);
console.log(`release notes: ${versions.length} versions, newest ${versions[0]}`);
