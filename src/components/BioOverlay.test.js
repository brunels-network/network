import React from "react";
import Dry from "json-dry";
import { render, cleanup, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import BioOverlay from "./BioOverlay";

// This is required to create the social object
/* eslint-disable no-unused-vars */
import Social from "../model/Social";
/* eslint-enable no-unused-vars */

import graphData from "../socialNetwork.json";

afterEach(cleanup);

describe("BioOverlay", () => {
  const toggleOverlayFn = jest.fn();
  const toggleSourceOverlayFn = jest.fn();
  const testString = "This is a test";

  let social = Dry.parse(graphData);
  const name = "Christopher Claxton";
  const person = social.getPeople().getByName(name);

  it("Test text renders correctly", () => {
    render(
      <BioOverlay
        social={social}
        person={person}
        toggleOverlay={toggleOverlayFn}
        toggleSourceOverlay={toggleSourceOverlayFn}
        sourceButtonText={testString}
      />
    );

    expect(screen.queryByText(testString)).toBeTruthy();
    expect(screen.queryByText(name)).toBeTruthy();
    expect(screen.queryByText(/Claxtons father was a Caribbean merchant/)).toBeTruthy();
  });

  it("Contains an image", () => {
    render(
      <BioOverlay
        social={social}
        person={person}
        toggleOverlay={toggleOverlayFn}
        toggleSourceOverlay={toggleSourceOverlayFn}
        sourceButtonText={testString}
      />
    );

    expect(screen.queryAllByTestId("bioImage")).toBeTruthy();
  });

  it("Buttons click props correctly", () => {
    render(
      <BioOverlay
        social={social}
        person={person}
        toggleOverlay={toggleOverlayFn}
        toggleSourceOverlay={toggleSourceOverlayFn}
        sourceButtonText={testString}
      />
    );

    const closeButton = screen.queryByText("x").closest("button");
    const sourceButton = screen.queryByText(testString).closest("button");

    fireEvent.click(closeButton);
    fireEvent.click(sourceButton);

    expect(toggleSourceOverlayFn).toHaveBeenCalled();
    expect(toggleOverlayFn).toHaveBeenCalled();
  });
});
