import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { SeoLandingPage } from "./SeoLandingPage";

const page = document.documentElement.dataset.seoPage;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SeoLandingPage page={page} />
  </StrictMode>
);
