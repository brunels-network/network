import Dry from "json-dry";
import React from "react";
import { render, cleanup, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

/* eslint-disable no-unused-vars */
import BioOverlay from "./BioOverlay";
// This is required to create the social object
import Social from "../model/Social";
/* eslint-enable no-unused-vars */
import graphData from "../socialNetwork.json";

import Popover from "./Popover";

afterEach(cleanup);

describe("Popover", () => {
  const social = Dry.parse(graphData);
  const name = "William Patterson";
  const node = social.getPeople().getByName(name).getNode();
  const shipID = social.getProjects().getIDs()[0];

  test("Close button works", () => {
    let toggleFn = jest.fn();
    let clearPopupsFn = jest.fn();

    render(
      <Popover
        social={social}
        node={node}
        togglePopover={toggleFn}
        selectedShipID={shipID}
        clearPopups={clearPopupsFn}
      />
    );

    const closeButton = screen.queryByText("x").closest("button");

    fireEvent.click(closeButton);

    expect(clearPopupsFn).toHaveBeenCalled();
  });

  test("All text rendered correctly", () => {
    let toggleFn = jest.fn();
    let clearPopupsFn = jest.fn();

    render(
      <Popover
        social={social}
        node={node}
        togglePopover={toggleFn}
        selectedShipID={shipID}
        clearPopups={clearPopupsFn}
      />
    );

    expect(screen.queryByText(name)).toBeTruthy();
    expect(screen.queryByText(/Number of connections/)).toBeTruthy();
    expect(screen.queryByText(/Bristol Ship-builder/)).toBeTruthy();
    expect(screen.queryByText(/Read more/)).toBeTruthy();
    expect(screen.queryByText(/Sources/)).toBeTruthy();
  });

  test("Sources button clicks", () => {
    let toggleFn = jest.fn();
    let clearPopupsFn = jest.fn();

    render(
      <Popover
        social={social}
        node={node}
        togglePopover={toggleFn}
        selectedShipID={shipID}
        clearPopups={clearPopupsFn}
      />
    );

    expect(screen.queryByText(name)).toBeTruthy();
    expect(screen.queryByText(/Number of connections/)).toBeTruthy();
    expect(screen.queryByText(/Bristol Ship-builder/)).toBeTruthy();
    expect(screen.queryByText(/Read more/)).toBeTruthy();
    expect(screen.queryByText(/Sources/)).toBeTruthy();
  });

  test("Clicking read more opens overlay", () => {
    let toggleFn = jest.fn();
    let clearPopupsFn = jest.fn();

    render(
      <Popover
        social={social}
        node={node}
        togglePopover={toggleFn}
        selectedShipID={shipID}
        clearPopups={clearPopupsFn}
      />
    );

    const readMoreButton = screen.queryByText("Read more").closest("button");

    expect(screen.queryByTestId("bioOverlay")).toBeFalsy();

    fireEvent.click(readMoreButton);

    expect(screen.queryByTestId("bioOverlay")).toBeTruthy();
  });

  test("Clicking source button", () => {
    let toggleFn = jest.fn();
    let clearPopupsFn = jest.fn();

    render(
      <Popover
        social={social}
        node={node}
        togglePopover={toggleFn}
        selectedShipID={shipID}
        clearPopups={clearPopupsFn}
      />
    );

    const sourceButton = screen.queryByText("RAIL 1149/60").closest("button");

    expect(screen.queryByTestId("sourceOverlay")).toBeFalsy();

    fireEvent.click(sourceButton);

    expect(screen.queryByTestId("sourceOverlay")).toBeTruthy();
  });
});
