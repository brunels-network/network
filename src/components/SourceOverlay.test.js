import React from "react";
import Dry from "json-dry";
import { render, cleanup, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import SourceOverlay from "./SourceOverlay";
// This is required to create the social object
import Social from "../model/Social";

import graphData from "../socialNetwork.json";

afterEach(cleanup);

describe("SourceOverlay", () => {
  const social = Dry.parse(graphData);
  const sources = social.getSources();
  const name = "Christopher Claxton";
  const person = social.getPeople().getByName(name);

  const nSource = 10;

  const sourceIDs = [sources.values()[nSource]["state"]["id"]];
  const sourceName = sources.values()[nSource]["state"]["name"];

  it("Test text renders correctly", () => {
    const toggleOverlayFn = jest.fn();
    const toggleSourceOverlayFn = jest.fn();
    render(
      <SourceOverlay
        sources={sources}
        sourceIDs={sourceIDs}
        toggleOverlay={toggleOverlayFn}
        toggleBioOverlay={toggleSourceOverlayFn}
        person={person}
      />
    );

    expect(screen.queryByText(name)).toBeInTheDocument();
    expect(screen.queryByText(sourceName)).toBeInTheDocument();
  });

  it("Clicking biography button calls function", () => {
    const toggleOverlayFn = jest.fn();
    const toggleSourceOverlayFn = jest.fn();
    render(
      <SourceOverlay
        sources={sources}
        sourceIDs={sourceIDs}
        toggleOverlay={toggleOverlayFn}
        toggleBioOverlay={toggleSourceOverlayFn}
        person={person}
      />
    );

    fireEvent.click(screen.getByText("Open biography").closest("button"));

    expect(toggleSourceOverlayFn).toHaveBeenCalled();
  });

  it("Contains an image", () => {
    const toggleOverlayFn = jest.fn();
    const toggleSourceOverlayFn = jest.fn();
    render(
      <SourceOverlay
        sources={sources}
        sourceIDs={sourceIDs}
        toggleOverlay={toggleOverlayFn}
        toggleBioOverlay={toggleSourceOverlayFn}
        person={person}
      />
    );
    expect(screen.queryAllByTestId("sourceImage")).toBeTruthy();
  });
});
