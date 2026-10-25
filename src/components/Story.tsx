import { useEffect, useMemo, useRef, useState } from "react";
import { bigCity, seeded, type Layout } from "../city/layout";
import type { CityEngine } from "../city/engine";
import { CityCanvas } from "./CityCanvas";

/** A quieter city for the story: most homes still empty, so you can watch them fill. */
function storyCity(): Layout {
  const l = bigCity(13);
  const rnd = seeded(2);
  for (const lot of l.lots) {
    const homes = lot.kind === "tower" ? lot.floors.flatMap((f) => f.homes) : lot.kind === "houses" ? lot.homes : [];
    for (const h of homes) {
      h.lit = rnd() < 0.18;
      h.readying = false;
      h.late = !h.lit && rnd() < 0.015;
    }
  }
  return l;
}

const CHAPTERS: { kicker: string; title: string; text: string; points?: string[] }[] = [
  {
    kicker: "Chapter 1",
    title: "Welcome, Mayor.",
    text: "Your city starts quiet and dark. Your job is to fill it with people — and the only way anyone moves in is when you get something done.",
  },
  {
    kicker: "Chapter 2",
    title: "Every project is a building.",
    text: "Start a project and an apartment building goes up. Its sections are floors you name — “1st Floor: Travel”, “2nd Floor: Program” — and tasks on no floor live on the ground floor.",
    points: ["The older the project, the closer to downtown it stands.", "A floor with more homes is wider; buildings narrow as they rise."],
  },
  {
    kicker: "Chapter 3",
    title: "Every task is a home.",
    text: "A new task is an empty home with a dark window. Finish it, someone moves in, and the lights come on — and they stay on for good.",
  },
  {
    kicker: "Chapter 4",
    title: "Sub-tasks get a home ready.",
    text: "Paint the walls, fix the boiler, hand over the keys. Tick sub-tasks off and the window glows behind the curtains. An amber window blinking? Something's overdue — someone's waiting at the door.",
  },
  {
    kicker: "Chapter 5",
    title: "Houses, plots and billboards.",
    text: "Tasks that belong to no project are little houses at the edge of town, their porch lights on once they're done. Today's timed tasks go up on the rooftop “Moving in today” billboard.",
  },
  {
    kicker: "Chapter 6",
    title: "Your population is everything you've done.",
    text: "Trucks circle buildings still going up. A rooftop light switches on when every home is lived in. Luxury cars come to your tallest tower. Look over the skyline at night: every lit window is something you finished.",
  },
];

/** The story, told as you scroll, with the city beside it. */
export function Story() {
  const layout = useMemo(storyCity, []);
  const engine = useRef<CityEngine | null>(null);
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  // Which chapter is in the middle of the screen.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const r of refs.current) if (r) io.observe(r);
    return () => io.disconnect();
  }, []);

  // Each chapter moves the camera and changes something in the city.
  const towers = useMemo(() => layout.lots.filter((l) => l.kind === "tower" && !l.planned), [layout]);
  const houses = useMemo(() => layout.lots.find((l) => l.kind === "houses"), [layout]);
  useEffect(() => {
    const e = engine.current;
    if (!e) return;
    const main = towers.find((t) => t.id === "0,0") ?? towers[0];
    const c = main ? e.lotCenter(main.id) : null;
    switch (active) {
      case 0:
        e.goHome(1600);
        break;
      case 1:
        if (c) e.flyTo(c, 13, 0.95, 0.7);
        break;
      case 2:
        if (c && main) {
          e.flyTo([c[0], c[1] * 0.8, c[2]], 7.5, 1.05, 0.95);
          window.setTimeout(() => e.lightSome(main.id, 6), 700);
        }
        break;
      case 3: {
        const other = towers.find((t) => t.id === "1,0") ?? towers[1];
        const oc = other ? e.lotCenter(other.id) : null;
        if (oc && other) {
          e.flyTo([oc[0], oc[1] * 0.8, oc[2]], 7.5, 1.05, 0.45);
          window.setTimeout(() => e.glowSome(other.id, 8), 700);
        }
        break;
      }
      case 4: {
        const hc = houses ? e.lotCenter(houses.id) : null;
        if (hc && houses) {
          e.flyTo(hc, 8, 0.9, 0.8);
          window.setTimeout(() => e.lightSome(houses.id, 3), 800);
        }
        break;
      }
      case 5:
        e.goHome(1800);
        window.setTimeout(() => e.lightAll(), 900);
        break;
    }
  }, [active, towers, houses]);

  return (
    <section className="story" id="story" aria-label="The story">
      <div className="story-intro">
        <p className="eyebrow">The story</p>
        <h2>
          A to-do list you can <em>see</em> getting done.
        </h2>
        <p className="lede">Most to-do apps forget everything you finish. Todo City builds a city out of it.</p>
      </div>
      <div className="story-grid">
        <div className="story-stage">
          <div className="story-sticky">
            <CityCanvas layout={layout} className="story-city" options={{ interactive: false }} onEngine={(e) => (engine.current = e)} />
            <div className="story-steps" aria-hidden>
              {CHAPTERS.map((c, i) => (
                <span key={c.title} className={i === active ? "on" : i < active ? "done" : ""} />
              ))}
            </div>
          </div>
        </div>
        <div className="story-chapters">
          {CHAPTERS.map((c, i) => (
            <article key={c.title} ref={(el) => {
                refs.current[i] = el;
              }} data-i={i} className={i === active ? "chapter on" : "chapter"}>
              <p className="chapter-kicker">{c.kicker}</p>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              {c.points && (
                <ul>
                  {c.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
