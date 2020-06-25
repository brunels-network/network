import React from "react";
import Dry from "json-dry";

import { render, cleanup, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import ForceGraph from "./ForceGraph";

// This is required to create the social object
import Social from "../model/Social";
import graphData from "../socialNetwork.json";

afterEach(cleanup);

describe("ForceGraph", () => {
  const social = Dry.parse(graphData);
  const shipID = social.getProjects().getIDs()[0];

  it("all buttons are clickable", () => {
    render(
      <svg>
        <ForceGraph
          social={social}
          selectedShipID={shipID}
          indirectConnectionsVisible={false}
          physicsEnabled={false}
          hideUnconnectedNodes={true}
        />
      </svg>
    );

    console.log(screen.queryAllByText(/claxton/i));
  });
});
