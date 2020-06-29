import React from "react";

import { render, cleanup, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import Overlay from "./Overlay";
import TextButton from "./TextButton";

afterEach(cleanup);

describe("Overlay Item", () => {
  it("Text on overlay renders", () => {
    const toggleOverlayFn = jest.fn();
    const testString = "This is a test";
    render(
      <Overlay toggleOverlay={toggleOverlayFn} useBackground={true}>
        <TextButton>{testString}</TextButton>
      </Overlay>
    );

    expect(screen.queryAllByText(testString)).toBeTruthy();
  });

  it("No background matches snapshot", () => {
    const toggleOverlayFn = jest.fn();
    const testString = "This is a test";
    const { asFragment } = render(
      <Overlay toggleOverlay={toggleOverlayFn} useBackground={false}>
        <TextButton>{testString}</TextButton>
      </Overlay>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("With background matches snapshot", () => {
    const toggleOverlayFn = jest.fn();
    const testString = "This is a test";
    const { asFragment } = render(
      <Overlay toggleOverlay={toggleOverlayFn} useBackground={true}>
        <TextButton>{testString}</TextButton>
      </Overlay>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
