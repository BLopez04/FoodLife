// src/main.jsx
import React from "react";
import ReactDOMClient from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import MyApp from "./MyApp";
import "../scss/style.scss";


const container = document.getElementById("root");

// Create a root
const root = ReactDOMClient.createRoot(container);

// Initial render:
root.render( <BrowserRouter> <MyApp /> </BrowserRouter>);