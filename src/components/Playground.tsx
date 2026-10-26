import { useMemo, useRef, useState, type FormEvent } from "react";
import { bigCity, type Layout, type Lot, type Tower } from "../city/layout";
import type { CityEngine } from "../city/engine";
import { CityCanvas } from "./CityCanvas";
import { Check } from "./Icons";

interface Task {
  id: number;
  title: string;
  done: boolean;
  floor: string;
}
interface Project {
  id: string;
  name: string;
  floors: string[];
  tasks: Task[];
}

/** Lots at the edge of the city kept free for the visitor's own buildings. */
const FREE: [number, number][] = [
  [-1, -3],
  [1, 3],
  [3, 1],
  [-3, -1],
  [3, -3],
  [-3, 3],
];
const GROUND = "Ground floor";

let nextId = 1;
const task = (title: string, floor = GROUND, done = false): Task => ({ id: nextId++, title, floor, done });

const START: Project[] = [
  {
    id: "p1",
    name: "Kitchen remodel",
    floors: [GROUND, "Design", "Build"],
    tasks: [
      task("Measure the space", GROUND, true),
      task("Pick paint colors", "Design", true),
      task("Choose the countertop", "Design"),
      task("Order cabinets", "Build"),
      task("Book the electrician", "Build"),
      task("Get three quotes", GROUND, true),
    ],
  },
];

/** The visitor's projects as towers on the free lots; the rest of the city stays as it is. */
function cityWith(projects: Project[]): Layout {
  const base = bigCity(21);
  const lots: Lot[] = base.lots.filter((l) => !FREE.some(([x, y]) => l.gx === x && l.gy === y));
  FREE.forEach(([gx, gy], i) => {
    const p = projects[i];
    if (!p) {
      lots.push({ kind: "park", id: `free-${gx},${gy}`, gx, gy });
      return;
    }
    // Floors with the most homes at the bottom — the ground floor first.
    const floors = p.floors
      .map((name) => ({ name, homes: p.tasks.filter((t) => t.floor === name).map((t) => ({ lit: t.done, title: t.title })) }))
      .filter((f, fi) => fi === 0 || f.homes.length);
    const [ground, ...rest] = floors;
    rest.sort((a, b) => b.homes.length - a.homes.length);
    const tower: Tower = {
      kind: "tower",
      id: p.id,
      gx,
      gy,
      name: p.name,
      floors: p.tasks.length ? [ground, ...rest] : [],
      planned: !p.tasks.length,
    };
    lots.push(tower);
  });
  return { lots };
}

/**
 * Try it: start a project and a building goes up; add tasks and they're
 * dark windows; tick one and someone moves in.
 */
export function Playground() {
  const [projects, setProjects] = useState<Project[]>(START);
  const [sel, setSel] = useState("p1");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [floor, setFloor] = useState(GROUND);
  const [newFloor, setNewFloor] = useState("");
  const [moved, setMoved] = useState(0);
  const engine = useRef<CityEngine | null>(null);
  const layout = useMemo(() => cityWith(projects), [projects]);
  const p = projects.find((x) => x.id === sel) ?? projects[0];
  const full = projects.length >= FREE.length;

  const focus = (id: string) => {
    window.setTimeout(() => {
      const c = engine.current?.lotCenter(id);
      if (c) engine.current?.flyTo([c[0], Math.max(0.6, c[1]), c[2]], Math.max(7, c[1] * 3 + 6), 1.0, 0.8, 1300);
    }, 60);
  };

  function addProject(e: FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (!n || full) return;
    const id = `p${Date.now()}`;
    setProjects((ps) => [...ps, { id, name: n, floors: [GROUND], tasks: [] }]);
    setSel(id);
    setFloor(GROUND);
    setName("");
    focus(id);
  }
  function addTask(e: FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t || !p) return;
    let f = floor;
    if (floor === "__new") {
      f = newFloor.trim() || GROUND;
      setNewFloor("");
      setFloor(f);
    }
    setProjects((ps) => ps.map((x) => (x.id === p.id ? { ...x, floors: x.floors.includes(f) ? x.floors : [...x.floors, f], tasks: [...x.tasks, task(t, f)] } : x)));
    setTitle("");
    focus(p.id);
  }
  function toggle(id: number) {
    if (!p) return;
    const t = p.tasks.find((x) => x.id === id);
    if (t && !t.done) setMoved((m) => m + 1);
    setProjects((ps) => ps.map((x) => (x.id === p.id ? { ...x, tasks: x.tasks.map((k) => (k.id === id ? { ...k, done: !k.done } : k)) } : x)));
    focus(p.id);
  }
  function remove(id: number) {
    if (!p) return;
    setProjects((ps) => ps.map((x) => (x.id === p.id ? { ...x, tasks: x.tasks.filter((k) => k.id !== id) } : x)));
  }
  function deleteProject(id: string) {
    setProjects((ps) => ps.filter((x) => x.id !== id));
    setSel(projects.find((x) => x.id !== id)?.id ?? "");
    engine.current?.goHome();
  }

  const done = p ? p.tasks.filter((t) => t.done).length : 0;
  return (
    <section className="play" id="city" aria-label="Build your own block">
      <div className="section-head">
        <p className="eyebrow">Try it</p>
        <h2>
          Put up a building. <em>Light it up.</em>
        </h2>
        <p className="lede">This is a real city — turn it, zoom in, hover any window. Then start a project of your own and watch it rise on the edge of town.</p>
      </div>
      <div className="play-grid">
        <div className="play-stage">
          <CityCanvas
            layout={layout}
            className="play-city"
            label="A 3D city with your projects as buildings on its edge. Finished tasks are lit windows. Drag to turn it; use the buttons to zoom."
            options={{ interactive: true, labels: true, wheelZoom: true, zoom: 0.72 }}
            onEngine={(e) => (engine.current = e)}
          />
          <div className="play-zoom">
            <button type="button" aria-label="Zoom in" onClick={() => engine.current?.zoomBy(0.75)}>
              +
            </button>
            <button type="button" aria-label="Zoom out" onClick={() => engine.current?.zoomBy(1.33)}>
              −
            </button>
            <button type="button" aria-label="See the whole city" onClick={() => engine.current?.goHome()}>
              ⤢
            </button>
          </div>
          <p className="sr-only" aria-live="polite">
            {moved > 0 ? `${moved} ${moved === 1 ? "resident" : "residents"} moved in` : ""}
          </p>
          {moved > 0 && (
            <div className="play-moved" key={moved} aria-hidden>
              +{moved} {moved === 1 ? "resident" : "residents"} moved in
            </div>
          )}
        </div>

        <div className="play-panel" role="group" aria-label="Your projects">
          <form className="play-new" onSubmit={addProject}>
            <label htmlFor="pname">Start a project</label>
            <div className="play-row">
              <input id="pname" value={name} maxLength={28} placeholder={full ? "The edge of town is full" : "e.g. Wedding, Thesis, Garden"} disabled={full} onChange={(e) => setName(e.target.value)} />
              <button type="submit" className="btn btn-primary btn-sm" disabled={!name.trim() || full}>
                Build
              </button>
            </div>
          </form>

          <div className="play-tabs" role="group" aria-label="Your buildings">
            {projects.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={x.id === p?.id}
                className={x.id === p?.id ? "on" : ""}
                onClick={() => {
                  setSel(x.id);
                  setFloor(GROUND);
                  focus(x.id);
                }}
              >
                {x.name}
                {x.tasks.some((t) => !t.done) && (
                  <span>
                    {x.tasks.filter((t) => !t.done).length}
                    <span className="sr-only"> to do</span>
                  </span>
                )}
              </button>
            ))}
          </div>

          {p ? (
            <div className="play-project">
              <div className="play-meta">
                <span>
                  {done} lived in · {p.tasks.length - done} still empty
                </span>
                <button type="button" className="link" onClick={() => deleteProject(p.id)} disabled={p.tasks.length > 0} title={p.tasks.length ? "Delete its tasks first — just like the app" : "Take down this building"}>
                  Delete project
                </button>
              </div>
              <form className="play-add" onSubmit={addTask}>
                <input value={title} maxLength={40} placeholder="Add a task…" aria-label="New task" onChange={(e) => setTitle(e.target.value)} />
                <select value={floor} aria-label="Floor" onChange={(e) => setFloor(e.target.value)}>
                  {p.floors.map((f, i) => (
                    <option key={f} value={f}>
                      {i === 0 ? f : `Floor: ${f}`}
                    </option>
                  ))}
                  <option value="__new">+ New floor…</option>
                </select>
                {floor === "__new" && <input value={newFloor} maxLength={20} placeholder="Floor name" aria-label="New floor" onChange={(e) => setNewFloor(e.target.value)} autoFocus />}
                <button type="submit" className="btn btn-ghost btn-sm" disabled={!title.trim()}>
                  Add
                </button>
              </form>
              {p.tasks.length === 0 && <p className="play-empty">An empty lot with a crane. Add a task and the first floor goes up.</p>}
              {p.floors.map((f) => {
                const list = p.tasks.filter((t) => t.floor === f);
                if (!list.length) return null;
                return (
                  <div key={f} className="play-floor">
                    <p className="play-floor-name">{f}</p>
                    <ul>
                      {list.map((t) => (
                        <li key={t.id} className={t.done ? "done" : ""}>
                          <button type="button" className="play-check" aria-pressed={t.done} aria-label={t.done ? `Mark “${t.title}” not done` : `Finish “${t.title}”`} onClick={() => toggle(t.id)}>
                            <Check />
                          </button>
                          <span>{t.title}</span>
                          <button type="button" className="play-x" aria-label={`Remove “${t.title}”`} onClick={() => remove(t.id)}>
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="play-empty">Start a project above — a building goes up on the edge of town.</p>
          )}
          <p className="play-note">This is a demo on this page; the app keeps your real tasks privately on your Mac.</p>
        </div>
      </div>
    </section>
  );
}
