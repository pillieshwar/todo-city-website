import { useMemo, useRef } from "react";
import type { CityEngine } from "../city/engine";
import type { Home, Layout, Lot, Tower } from "../city/layout";
import { GENERAL, type DemoProject, type DemoTask } from "../demo/data";
import { CityCanvas } from "./CityCanvas";

/** Where each project stands; tasks in no project are the houses. */
const SPOTS: Record<string, [number, number]> = { launch: [0, 0], kitchen: [1, -1], lisbon: [-1, 1], home: [-1, -1] };
const HOUSES: [number, number] = [1, 1];
const PARKS: [number, number][] = [[0, 1], [1, 0], [-1, 0], [0, -1]];

const homeOf = (t: DemoTask): Home => ({
  lit: t.done,
  late: !t.done && typeof t.day === "number" && t.day < 0,
  readying: !t.done && !!t.sub?.some((s) => s.done),
  title: t.title,
});

/** The demo's tasks as a small city: a building per project, a floor per section. */
export function cityOf(tasks: DemoTask[], projects: DemoProject[]): Layout {
  const lots: Lot[] = [];
  for (const p of projects) {
    const [gx, gy] = SPOTS[p.id] ?? [0, 0];
    const mine = tasks.filter((t) => t.project === p.id);
    const floors = p.sections
      .map((s) => ({ name: s === GENERAL ? "Ground floor" : s, homes: mine.filter((t) => (t.section ?? GENERAL) === s).map(homeOf) }))
      .filter((f, i) => i === 0 || f.homes.length);
    const [ground, ...rest] = floors;
    rest.sort((a, b) => b.homes.length - a.homes.length);
    const tower: Tower = { kind: "tower", id: p.id, gx, gy, name: p.name, floors: mine.length ? [ground, ...rest] : [], planned: !mine.length };
    lots.push(tower);
  }
  const loose = tasks.filter((t) => !t.project && t.day !== "someday");
  lots.push({ kind: "houses", id: "houses", gx: HOUSES[0], gy: HOUSES[1], homes: loose.map(homeOf) });
  for (const [gx, gy] of PARKS) lots.push({ kind: "park", id: `park-${gx},${gy}`, gx, gy });
  return { lots };
}

/** The city view inside the demo app: the visitor's own tasks, in 3D. */
export function DemoCity({
  tasks,
  projects,
  focus,
  population,
  today,
  onOpenProject,
}: {
  tasks: DemoTask[];
  projects: DemoProject[];
  /** A project to glide to when the city opens. */
  focus?: string;
  population: number;
  today: number;
  onOpenProject: (id: string) => void;
}) {
  const layout = useMemo(() => cityOf(tasks, projects), [tasks, projects]);
  const engine = useRef<CityEngine | null>(null);

  const fly = (id: string) => {
    const c = engine.current?.lotCenter(id);
    if (c) engine.current?.flyTo([c[0], Math.max(0.6, c[1]), c[2]], Math.max(9, c[1] * 3.5 + 7), 1.0, 0.8, 1300);
  };

  return (
    <div className="dc">
      <CityCanvas
        layout={layout}
        className="dc-canvas"
        label="Your city in 3D: a building for each project, a floor for each section, and a window for each task. Lit windows are finished tasks."
        options={{ interactive: true, labels: true, zoom: 0.95, wheelZoom: false }}
        onEngine={(e) => {
          engine.current = e;
          if (e && focus) window.setTimeout(() => fly(focus), 450);
        }}
      />
      <div className="dc-panel">
        <p className="dc-name">Lumen Bay</p>
        <p className="dc-pop">
          Population <b>{population}</b>
          {today > 0 && <span> · +{today} today</span>}
        </p>
        <ul className="dc-key">
          <li>
            Project <span aria-hidden>→</span> <b>Building</b>
          </li>
          <li>
            Section <span aria-hidden>→</span> <b>Floor</b>
          </li>
          <li>
            Task <span aria-hidden>→</span> <b>Home</b>
          </li>
          <li>
            Done <span aria-hidden>→</span> <b>Lights on</b>
          </li>
        </ul>
        <p className="dc-sub">Your buildings</p>
        <ul className="dc-list">
          {projects.map((p) => {
            const mine = tasks.filter((t) => t.project === p.id);
            const lit = mine.filter((t) => t.done).length;
            return (
              <li key={p.id}>
                <button type="button" onClick={() => fly(p.id)} onDoubleClick={() => onOpenProject(p.id)}>
                  <i style={{ background: p.color }} aria-hidden />
                  <span>{p.name}</span>
                  <em>
                    {lit}/{mine.length} lived in
                  </em>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="dc-hint" aria-hidden>
        Drag to turn · hover a window to see its task
      </p>
    </div>
  );
}
