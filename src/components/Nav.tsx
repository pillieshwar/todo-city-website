import { useEffect, useState } from "react";
import { SITE } from "../site";
import { AppleIcon, Logo } from "./Icons";

const LINKS = [
  ["#story", "Story"],
  ["#city", "Your city"],
  ["#features", "Features"],
  ["#privacy", "Privacy"],
] as const;

/** The top bar: glass once you scroll, with a thin progress line under it. */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setScrolled(window.scrollY > 24);
        setProgress(max > 0 ? window.scrollY / max : 0);
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  // Escape closes the phone menu.
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open]);
  return (
    <header className={scrolled ? "nav scrolled" : "nav"}>
      <div className="nav-inner">
        <a href="#top" className="brand" aria-label="Todo City home">
          <Logo />
          <span>Todo City</span>
        </a>
        <nav id="nav-links" className={open ? "nav-links open" : "nav-links"} aria-label="Sections">
          {LINKS.map(([href, text]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {text}
            </a>
          ))}
          <a href="#faq" onClick={() => setOpen(false)}>
            FAQ
          </a>
          <a className="nav-gh" href={SITE.repo} target="_blank" rel="noreferrer">
            GitHub<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </nav>
        <a className="btn btn-primary btn-sm nav-dl" href={SITE.download} aria-label="Download Todo City for Mac">
          <AppleIcon /> Download
        </a>
        <button type="button" className="nav-menu" aria-label="Menu" aria-controls="nav-links" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span />
          <span />
        </button>
      </div>
      <div className="nav-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden />
    </header>
  );
}
