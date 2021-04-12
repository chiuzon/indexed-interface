import ReactDOM from "react-dom";
import React from "react";
import { BackTop } from "antd";
import { App } from "./_app/App";

ReactDOM.render(
  <React.StrictMode>
    <BackTop />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
