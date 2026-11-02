import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
// The docs styles ship with the site CSS, so prerendered docs pages look right before any script runs.
import "./docs-site/docs.css";

// The home page, the city page and the guide pages load separately, and
// three.js loads only where a 3D city is shown.
const path = window.location.pathname.replace(/\/+$/, "") || "/";
const root = createRoot(document.getElementById("root")!);
if (path === "/") {
  void import("./App").then(({ App }) =>
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    ),
  );
} else if (path === "/city") {
  void import("./CityPage").then(({ CityPage }) =>
    root.render(
      <StrictMode>
        <CityPage />
      </StrictMode>,
    ),
  );
} else if (path === "/docs" || path.startsWith("/docs/")) {
  // The docs: their own frame, sidebar and search.
  void import("./docs-site/client").then(({ mountDocs }) => mountDocs(root, path));
} else {
  void import("./pages/routes").then(({ routeFor }) => {
    const r = routeFor(path);
    if (r) root.render(<StrictMode>{r.element()}</StrictMode>);
    // Any other address is the prerendered "Let's find that page" (404.html); it gets its search and menu here.
    else if (document.querySelector(".dx")) void import("./docs-site/client").then(({ mountDocs }) => mountDocs(root, path));
  });
}
