import React from "react";

import { render, cleanup, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import SocialApp from "./SocialApp";

afterEach(cleanup);

describe("SocialApp", () => {
  test("should render", () => {
    const { container } = render(<SocialApp />);
    expect(container.firstChild).toBeTruthy();
  });

  test("click on analysis opens panel", () => {
    render(<SocialApp />);

    const analysisButton = screen.queryByText("Analysis").closest("button");

    let analyisPanel = screen.queryByTestId("AnalysisPanel");

    expect(analyisPanel).toBeNull();

    fireEvent.click(analysisButton);

    analyisPanel = screen.queryByTestId("AnalysisPanel");

    expect(analyisPanel).toBeTruthy();

    // Check we find the buttons in the analysis panel
    expect(screen.queryByText("Search")).toBeTruthy();
    expect(screen.queryByText("Close")).toBeTruthy();
    expect(screen.queryByText("Filter by engineers")).toBeTruthy();
    expect(screen.queryByText("Filter by investors")).toBeTruthy();
    expect(screen.queryByText("Show indirect connections")).toBeTruthy();
    expect(screen.queryByText("Show unconnected nodes")).toBeTruthy();
    expect(screen.queryByText("Enable physics")).toBeTruthy();
  });

  test("Ship selection buttons change ship title", () => {
    render(<SocialApp />);

    expect(screen.queryByTestId("shipTitle").textContent).toMatch("SS Great Western");

    const gbButton = screen.queryByText("SS Great Britain").closest("button");

    fireEvent.click(gbButton);

    expect(screen.queryByTestId("shipTitle").textContent).toMatch("SS Great Britain");
  });

  test("Reset button resets window", () => {
    render(<SocialApp />);

    let resetButton = screen.queryByText("Reset").closest("button");

    const { reload } = window.location;

    Object.defineProperty(window.location, "reload", {
      configurable: true,
    });

    window.location.reload = jest.fn();

    fireEvent.click(resetButton);

    expect(window.location.reload).toHaveBeenCalledTimes(1);

    window.location.reload = reload;
  });
});
