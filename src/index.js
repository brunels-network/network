
import React, { Suspense, lazy } from 'react';

import ReactDOM from "react-dom";

import 'vis-network/dist/vis-network.min.css';
import './index.css';

const SocialApp = lazy(()=>import('./SocialApp'));

function App(props) {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SocialApp/>
      </Suspense>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);