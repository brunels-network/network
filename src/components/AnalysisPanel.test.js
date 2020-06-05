import React from "react";

import { render, cleanup, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import AnalysisPanel from "./AnalysisPanel";

afterEach(cleanup);

describe("AnalysisPanel", () => {
  it("should render", () => {
    const { container } = render(
      <AnalysisPanel
        toggleSearchOverlay={jest.fn()}
        toggleFilterPanel={jest.fn()}
        toggleTimeLinePanel={jest.fn()}
        togglePanel={jest.fn()}
        toggleOptionsOverlay={jest.fn()}
      />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("should render all buttons", () => {
    render(
      <AnalysisPanel
        toggleSearchOverlay={jest.fn()}
        toggleFilterPanel={jest.fn()}
        toggleTimeLinePanel={jest.fn()}
        togglePanel={jest.fn()}
        toggleOptionsOverlay={jest.fn()}
      />
    );

    expect(screen.getByText("Analysis")).toBeTruthy();

    const searchButton = screen.getAllByText("Search");
    const filtersButton = screen.getAllByText("Filters");
    const optionsButton = screen.getAllByText("Options");
    const closeButton = screen.getAllByText("Close");

    expect(searchButton).toBeTruthy();
    expect(filtersButton).toBeTruthy();
    expect(optionsButton).toBeTruthy();
    expect(closeButton).toBeTruthy();

    expect(searchButton.length).toBe(1);
    expect(filtersButton.length).toBe(1);
    expect(optionsButton.length).toBe(1);
    expect(closeButton.length).toBe(1);
  });

  it("all buttons are clickable", () => {
    const clickFn = jest.fn();

    render(
      <AnalysisPanel
        toggleSearchOverlay={clickFn}
        toggleFilterPanel={clickFn}
        toggleTimeLinePanel={clickFn}
        togglePanel={clickFn}
        toggleOptionsOverlay={clickFn}
      />
    );

    const searchButton = screen.getByText("Search");
    const filtersButton = screen.getByText("Filters");
    const optionsButton = screen.getByText("Options");
    const closeButton = screen.getByText("Close");

    fireEvent.click(searchButton);
    fireEvent.click(filtersButton);
    fireEvent.click(optionsButton);
    fireEvent.click(closeButton);

    expect(clickFn).toHaveBeenCalled();
  });
});
