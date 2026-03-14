/*
Main entry point of the React application.

This file connects React with the HTML file (index.html).
It renders the main App component inside the root div.
*/
import React from "react";
import ReactDOM from "react-dom/client";

/* Import global styles */
import "./index.css";

/* Import App component */
import App from "./App.jsx";

/* Find root div in index.html */
const root = ReactDOM.createRoot(document.getElementById("root"));

/* Render App component */
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);