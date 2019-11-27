
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import ReactDOM from "react-dom";

const GraphLoader1 = lazy(() => import('./version1/GraphLoader'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={GraphLoader1}/>
        <Route exact path="/v1" component={GraphLoader1}/>
      </Switch>
    </Suspense>
  </Router>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

