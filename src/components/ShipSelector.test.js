import React from "react";
import Dry from "json-dry";
import { render, cleanup, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import ShipSelector from "./ShipSelector";
// This is required to create the social object
/* eslint-disable no-unused-vars */
import Social from "../model/Social";
/* eslint-enable no-unused-vars */
import graphData from "../socialNetwork.json";

afterEach(cleanup);

describe("ShipSelector", () => {
  const social = Dry.parse(graphData);
  const projects = social.getProjects();

  it("Check overlay and search bar are rendered", () => {
    const shipFilterFn = jest.fn();

    render(<ShipSelector projects={projects} shipFilter={shipFilterFn} />);

    expect(screen.getByText("SS Great Western")).toBeTruthy();
    expect(screen.getByText("SS Great Britain")).toBeTruthy();
    expect(screen.getByText("SS Great Eastern")).toBeTruthy();
  });

  it("Clicking ship calls filter function", () => {
    const shipFilterFn = jest.fn();

    render(<ShipSelector projects={projects} shipFilter={shipFilterFn} />);

    fireEvent.click(screen.getByText("SS Great Britain").closest("button"));

    expect(shipFilterFn).toHaveBeenCalled();

    expect(screen).toMatchSnapshot();
  });
});
