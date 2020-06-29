import React from "react";
import Dry from "json-dry";
import { render, cleanup, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import SearchOverlay from "./SearchOverlay";

// This is required to create the social object
import Social from "../model/Social";
import graphData from "../socialNetwork.json";

afterEach(cleanup);

describe("SearchOverlay", () => {
  const social = Dry.parse(graphData);
  const shipID = social.getProjects().getIDs()[0];

  it("Check overlay and search bar are rendered", () => {
    const toggleSearchOverlayFn = jest.fn();
    const emitHighlightedFn = jest.fn();
    const emitSelectedFn = jest.fn();
    const emitClickedFn = jest.fn();

    render(
      <SearchOverlay
        toggleSearchOverlay={toggleSearchOverlayFn}
        emitHighlighted={emitHighlightedFn}
        emitSelected={emitSelectedFn}
        emitClicked={emitClickedFn}
        social={social}
        selectedShipID={shipID}
      />
    );

    expect(screen.queryByTestId("searchInput")).toBeTruthy();
    expect(screen.queryByTestId("overlay")).toBeTruthy();
  });

  it("Search bar functions correctly - input results in button render", () => {
    const toggleSearchOverlayFn = jest.fn();
    const emitHighlightedFn = jest.fn();
    const emitSelectedFn = jest.fn();
    const emitClickedFn = jest.fn();

    render(
      <SearchOverlay
        toggleSearchOverlay={toggleSearchOverlayFn}
        emitHighlighted={emitHighlightedFn}
        emitSelected={emitSelectedFn}
        emitClicked={emitClickedFn}
        social={social}
        selectedShipID={shipID}
      />
    );

    fireEvent.change(screen.getByTestId("searchInput"), {
      target: { value: "Falkner" },
    });

    const searchResults = screen.getAllByTestId(/searchResult/i);
    expect(searchResults).toBeTruthy();
    expect(searchResults.length).toBe(2);
  });

  it("To match the snapshot", () => {
    const toggleSearchOverlayFn = jest.fn();
    const emitHighlightedFn = jest.fn();
    const emitSelectedFn = jest.fn();
    const emitClickedFn = jest.fn();

    render(
      <SearchOverlay
        toggleSearchOverlay={toggleSearchOverlayFn}
        emitHighlighted={emitHighlightedFn}
        emitSelected={emitSelectedFn}
        emitClicked={emitClickedFn}
        social={social}
        selectedShipID={shipID}
      />
    );

    expect(screen).toMatchSnapshot();
  });
});
