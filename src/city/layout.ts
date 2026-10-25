/**
 * What's built where. The 3D engine draws whatever a layout describes; the
 * hero's big city and the playground's small block are both layouts.
 */

export interface Home {
  /** Someone lives here: the task is done and the lights are on. */
  lit: boolean;
  /** Sub-tasks under way: a faint glow behind the curtains. */
  readying?: boolean;
  /** Past its day: blinks amber. */
  late?: boolean;
  /** Shown when hovered (the task). */
  title?: string;
}

export interface Tower {
  kind: "tower";
  id: string;
  name: string;
  /** Lot on the grid. */
  gx: number;
  gy: number;
  /** Ground floor first, then floors by size (each never wider than the one below). */
  floors: { name: string; homes: Home[] }[];
  /** No homes yet: an empty lot with a crane. */
  planned?: boolean;
  /** "Moving in today" billboard lines. */
  billboard?: string[];
}

export interface Houses {
  kind: "houses";
  id: string;
  gx: number;
  gy: number;
  homes: Home[];
}

export interface Park {
  kind: "park";
  id: string;
  gx: number;
  gy: number;
}

export type Lot = Tower | Houses | Park;

export interface Layout {
  lots: Lot[];
}

/** A small seeded random, so the city is the same on every visit. */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const PROJECTS = [
  "Product launch",
  "Kitchen remodel",
  "Wedding",
  "Thesis",
  "Marathon training",
  "Q4 roadmap",
  "Move to Lisbon",
  "Podcast",
  "Garden",
  "Hiring",
  "Taxes",
  "Novel draft",
  "Studio website",
  "Family trip",
  "Side project",
  "Open source",
  "Reading list",
  "Home office",
  "Fundraiser",
  "Course",
];

const FLOOR_NAMES = ["Planning", "Design", "Build", "Travel", "Program", "Research", "Writing", "Admin", "Errands", "Ideas"];

const TASKS = [
  "Book the venue",
  "Call the plumber",
  "Send the invoice",
  "Draft the outline",
  "Renew passport",
  "Pick paint colors",
  "Review the contract",
  "Water the plants",
  "Order business cards",
  "Reply to Maya",
  "Plan the long run",
  "Back up the laptop",
  "Write chapter three",
  "Pay rent",
  "Fix the leaky tap",
  "Prep the 1:1",
  "Pack for the trip",
  "Read two chapters",
  "Update the roadmap",
  "Send thank-you notes",
];

/** The hero's city: a busy downtown of towers, houses at the edges, a couple of parks. */
export function bigCity(seed = 7): Layout {
  const rnd = seeded(seed);
  const lots: Lot[] = [];
  const R = 4;
  let p = 0;
  for (let gx = -R; gx <= R; gx++) {
    for (let gy = -R; gy <= R; gy++) {
      const d = Math.max(Math.abs(gx), Math.abs(gy));
      const id = `${gx},${gy}`;
      if ((gx === 2 && gy === -1) || (gx === -2 && gy === 2)) {
        lots.push({ kind: "park", id, gx, gy });
        continue;
      }
      if (d >= 3 && rnd() < 0.62) {
        const n = 4 + Math.floor(rnd() * 6);
        lots.push({ kind: "houses", id, gx, gy, homes: Array.from({ length: n }, () => home(rnd, 0.5)) });
        continue;
      }
      // Downtown is taller and brighter.
      const tall = Math.max(1, Math.round((5 - d) * 1.4 + rnd() * 3));
      const floors: Tower["floors"] = [];
      let width = 4 + Math.floor(rnd() * 5);
      for (let f = 0; f < tall; f++) {
        if (f > 0 && rnd() < 0.35) width = Math.max(2, width - 1);
        const homes = Array.from({ length: width * 4 }, () => home(rnd, 0.22 + (4 - d) * 0.08));
        floors.push({ name: f === 0 ? "Ground floor" : FLOOR_NAMES[(f + p) % FLOOR_NAMES.length], homes });
      }
      const planned = d >= 2 && rnd() < 0.08;
      lots.push({
        kind: "tower",
        id,
        gx,
        gy,
        name: PROJECTS[p++ % PROJECTS.length],
        floors: planned ? [] : floors,
        planned,
        billboard: !planned && d <= 1 && rnd() < 0.5 ? ["9:00 AM  Stand-up notes", "1:30 PM  Review the contract", "4:00 PM  Call the plumber"] : undefined,
      });
    }
  }
  return { lots };
}

function home(rnd: () => number, litChance: number): Home {
  const lit = rnd() < litChance;
  const r = rnd();
  return { lit, readying: !lit && r < 0.12, late: !lit && r > 0.96, title: TASKS[Math.floor(rnd() * TASKS.length)] };
}

/** How many homes fit along a side of a floor, for the floor's width. */
export function perSide(homes: number): number {
  return Math.max(1, Math.min(6, Math.ceil(homes / 4)));
}
