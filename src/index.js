/* eslint-disable */
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import Spinner from "react-spinkit";

import "./reset.css";

import "vis-network/dist/vis-network.min.css";
import "./index.css";

const SocialApp = lazy(() => import("./SocialApp.js"));

function App(props) {
  return (
    <div>
      <Suspense
        fallback={
          <div className="brunel-center-container">
            <div>Loading application...</div>
            <div>
              <Spinner name="ball-grid-pulse" color="green" fadeIn="none" />
            </div>
          </div>
        }
      >
        <SocialApp />
      </Suspense>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
