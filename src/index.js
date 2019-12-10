
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import ReactDOM from "react-dom";

import Menu from './version8/components/StyledApp';

// need this to ensure that Vis network renders correctly
import 'vis-network/dist/vis-network.min.css';
import './index.css';

const GraphLoader = [
  React.lazy(() => import('./version1/GraphLoader')),
  React.lazy(() => import('./version2/GraphLoader')),
  React.lazy(() => import('./version3/GraphLoader')),
  React.lazy(() => import('./version4/GraphLoader')),
  React.lazy(() => import('./version5/GraphLoader')),
  React.lazy(() => import('./version6/SocialApp')),
  React.lazy(() => import('./version7/SocialApp')),
  React.lazy(() => import('./version8/SocialApp')),
];

function App(props){
  let num_versions = GraphLoader.length;

  return (<Menu />);
/*    <Router>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/" component={GraphLoader[num_versions-1]}/>
          </Switch>
        </Suspense>
      </div>
    </Router>
  );*/
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
