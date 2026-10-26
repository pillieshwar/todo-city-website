// Accessibility check of the built site with axe-core (WCAG 2.2 A and AA),
// at desktop and phone widths, with and without motion. Prints findings as
// GitHub annotations; fails on serious or critical ones.
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const url = process.argv[2] ?? "http://localhost:4173/";
const browser = await chromium.launch();
let bad = 0;
for (const [name, viewport, motion] of [
  ["desktop", { width: 1366, height: 900 }, "no-preference"],
  ["phone", { width: 390, height: 844 }, "reduce"],
]) {
  const page = await browser.newPage({ viewport });
  await page.emulateMedia({ reducedMotion: motion });
  await page.goto(url, { waitUntil: "networkidle" });
  // Scroll through so every section has appeared.
  for (let y = 0; y < 30000; y += 700) await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(800);
  const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]).analyze();
  for (const v of r.violations) {
    const level = v.impact === "serious" || v.impact === "critical" ? "error" : "warning";
    if (level === "error") bad++;
    const where = v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ");
    console.log(`::${level} title=${name}: ${v.id} (${v.impact})::${v.help} — ${where}`);
  }
  console.log(`::notice title=${name}::${r.passes.length} rules pass, ${r.violations.length} with findings`);
  await page.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
