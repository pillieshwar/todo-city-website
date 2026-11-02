import { useEffect, useState } from "react";
import { SITE } from "../site";
import { AppleIcon, Logo } from "./Icons";

/** The top bar: glass once you scroll, with a thin progress line under it. */
export function Nav({ home = true, page }: { home?: boolean; page?: "city" }) {
  // On other pages, the section links lead back to the home page.
  const at = (hash: string) => (home ? hash : `/${hash}`);
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
        <a href={home ? "#top" : "/"} className="brand" aria-label="TodoCity home">
          <Logo />
          <span>TodoCity</span>
        </a>
        <nav id="nav-links" className={open ? "nav-links open" : "nav-links"} aria-label="Sections">
          <a href={at("#features")} onClick={() => setOpen(false)}>
            Features
          </a>
          <a href="/city" className={page === "city" ? "on" : undefined} aria-current={page === "city" ? "page" : undefined} onClick={() => setOpen(false)}>
            Your city
          </a>
          <a href={home ? "#faq" : "/faq"} onClick={() => setOpen(false)}>
            FAQ
          </a>
          <a href="/docs" onClick={() => setOpen(false)}>
            Docs
          </a>
        </nav>
        <a className="btn btn-primary btn-sm nav-dl" href={SITE.download}>
          <AppleIcon /> Download<span className="nav-dl-more"> for Mac</span>
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
