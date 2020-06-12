// import React from "react";

// import { render, cleanup, fireEvent, screen } from "@testing-library/react";
// import "@testing-library/jest-dom/extend-expect";

// import ForceGraph from "./ForceGraph";

// import Dry from "json-dry";
// import Social from "../model/Social";
// import graphData from "../dataWeights.json";

// afterEach(cleanup);

// describe("ForceGraph", () => {
//   // Load in the Dried graph data from JSON
//   const social = Dry.parse(graphData);

//   it("popups render correctly", () => {
//     const ssGWid = social.getProjects().getByName("SS Great Western").getID();

//     render(
//       <ForceGraph
//         social={social}
//         selectedShipID={ssGWid}
//         indirectConnectionsVisible={true}
//         physicsEnabled={true}
//         hideUnconnectedNodes={true}
//       />
//     );

//     const claxton = screen.queryByText(/Claxton/);
//     console.log(claxton);
//   });
// });
