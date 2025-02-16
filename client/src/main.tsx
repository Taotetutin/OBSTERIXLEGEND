import React from 'react';
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("React app mounting...");

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);
console.log("Root element found, rendering app...");

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);