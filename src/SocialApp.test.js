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

    const analysisButton = screen.getByTestId("AnalysisButton");

    let analyisPanel = screen.queryByTestId("AnalysisPanel");

    expect(analyisPanel).toBeNull();

    fireEvent.click(analysisButton);

    analyisPanel = screen.queryByTestId("AnalysisPanel");

    expect(analyisPanel).toBeTruthy();

    // Check we find the buttons in the analysis panel
    expect(screen.queryByText("Search")).toBeTruthy();
    expect(screen.queryByText("Close")).toBeTruthy();
    expect(screen.queryByText("Options")).toBeTruthy();
  });

  test("click on hamburger opens menu", () => {
    render(<SocialApp />);

    const hamburgerButton = screen.queryByTestId("hamburgerButton");

    expect(screen.queryByTestId("BrunelMenu")).toBeNull();
    expect(screen.queryByText("About")).toBeFalsy();
    expect(screen.queryByText("Source")).toBeFalsy();

    fireEvent.click(hamburgerButton);

    expect(screen.queryByTestId("BrunelMenu")).toBeTruthy();

    expect(screen.queryByText("About")).toBeTruthy();
    expect(screen.queryByText("Source")).toBeTruthy();
  });

  test("Ship selection buttons change ship title", () => {
    render(<SocialApp />);

    expect(screen.queryByTestId("shipTitle").textContent).toMatch("SS Great Western");

    const gbButton = screen.queryByText("SS Great Britain").closest("button");

    fireEvent.click(gbButton);

    expect(screen.queryByTestId("shipTitle").textContent).toMatch("SS Great Britain");
  });

  test("SS Great Eastern button disabled", () => {
    render(<SocialApp />);

    expect(screen.queryByText("SS Great Eastern").closest("button")).toBeDisabled();
  });
});
