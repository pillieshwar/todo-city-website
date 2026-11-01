import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

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
} else {
  void import("./pages/routes").then(({ routeFor }) => {
    const r = routeFor(path);
    if (r) root.render(<StrictMode>{r.element()}</StrictMode>);
  });
}
