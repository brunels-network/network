import React from "react";

import { render, cleanup, fireEvent, screen } from "@testing-library/react";
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

  it("With background selects correct background", () => {
    const toggleOverlayFn = jest.fn();
    const testString = "This is a test";
    render(
      <Overlay toggleOverlay={toggleOverlayFn} useBackground={false}>
        <TextButton>{testString}</TextButton>
      </Overlay>
    );

    expect(screen.queryByTestId("overlay")).toHaveStyle(`background: transparent`);
  });
});
