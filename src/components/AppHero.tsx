import { SITE } from "../site";
import { AppDemo } from "./AppDemo";
import { AppleIcon } from "./Icons";

/** The opening: what TodoCity is in one line, and the app itself to try. */
export function AppHero() {
  return (
    <section className="try" id="top" aria-labelledby="try-title">
      <div className="try-copy">
        <h1 id="try-title">
          Press ⌘C twice. <em>It's a task.</em>
        </h1>
        <p className="lede">A to-do app for Mac. Copy any email, message or web page twice, and an AI on your Mac writes the task and its date.</p>
        <div className="hero-ctas">
          <a className="btn btn-primary btn-lg" href={SITE.download}>
            <AppleIcon /> Download for Mac
          </a>
          <a className="btn btn-ghost btn-lg" href="#try-it">
            Try it below
          </a>
        </div>
        <p className="hero-fine">Free · macOS 11 or later · No account</p>
      </div>
      <div id="try-it">
        <AppDemo />
      </div>
    </section>
  );
}
