import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";

// renders React Component "Root" into the DOM element with ID "root"
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

// allows for live updating
if (module.hot !== undefined) {
  module.hot.accept();
}
