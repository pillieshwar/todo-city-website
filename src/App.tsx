import { AppHero } from "./components/AppHero";
import { Features, PrivacyRow, WorksWith } from "./components/Features";
import { Nav } from "./components/Nav";
import { Download, Faq, Footer } from "./components/Sections";

/** The home page: what TodoCity does, the app to try, and how to get it. The city has its own page (/city). */
export function App() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <AppHero />
        <Features />
        <WorksWith />
        <PrivacyRow />
        <Faq />
        <Download />
      </main>
      <Footer />
    </>
  );
}
