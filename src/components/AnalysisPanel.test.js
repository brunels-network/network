import React from "react";

import { render, cleanup, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import AnalysisPanel from "./AnalysisPanel";

afterEach(cleanup);

describe("AnalysisPanel", () => {
  test("all buttons are clickable", () => {
    const setOverlayFn = jest.fn();
    const togglePanelFn = jest.fn();
    const toggleSearchOverlayFn = jest.fn();
    const toggleUnconnectedNodesVisibleFn = jest.fn();
    const closeOverlayFn = jest.fn();
    const toggleindirectConnectionsVisibleFn = jest.fn();

    const filterEngineeringNodesFn = jest.fn();
    const filterCommercialNodesFn = jest.fn();
    const resetFiltersFn = jest.fn();

    render(
      <AnalysisPanel
        setOverlay={setOverlayFn}
        togglePanel={togglePanelFn}
        toggleSearchOverlay={toggleSearchOverlayFn}
        toggleUnconnectedNodesVisible={toggleUnconnectedNodesVisibleFn}
        closeOverlay={closeOverlayFn}
        toggleindirectConnectionsVisible={toggleindirectConnectionsVisibleFn}
        indirectConnectionsVisible={true}
        filterEngineeringNodes={filterEngineeringNodesFn}
        filterCommercialNodes={filterCommercialNodesFn}
        unconnectedNodesVisible={false}
        engineersFiltered={false}
        investorsFiltered={false}
        resetFilters={resetFiltersFn}
      />
    );

    fireEvent.click(screen.queryByText("Search").closest("button"));
    fireEvent.click(screen.queryByText("Close").closest("button"));
    fireEvent.click(screen.queryByText(/engineer/i).closest("button"));
    fireEvent.click(screen.queryByText(/investor/i).closest("button"));
    fireEvent.click(screen.queryByText("Reset filters").closest("button"));

    expect(screen.queryByText("Search")).toBeTruthy();

    expect(togglePanelFn).toHaveBeenCalled();
    expect(filterEngineeringNodesFn).toHaveBeenCalled();
    expect(filterCommercialNodesFn).toHaveBeenCalled();
    expect(resetFiltersFn).toHaveBeenCalled();
  });

  test("props change text button rendering all true", () => {
    render(
      <AnalysisPanel
        setOverlay={jest.fn()}
        togglePanel={jest.fn()}
        toggleSearchOverlay={jest.fn()}
        toggleUnconnectedNodesVisible={jest.fn()}
        closeOverlay={jest.fn()}
        toggleindirectConnectionsVisible={jest.fn()}
        indirectConnectionsVisible={true}
        filterEngineeringNodes={jest.fn()}
        filterCommercialNodes={jest.fn()}
        hideUnconnectedNodes={true}
        unconnectedNodesVisible={true}
        engineersFiltered={true}
        investorsFiltered={true}
        resetFilters={jest.fn()}
      />
    );

    expect(screen.queryByText("Hide indirect connections")).toBeTruthy();
    expect(screen.queryByText("Hide unconnected nodes")).toBeTruthy();
    expect(screen.queryByText("Remove engineer filter")).toBeTruthy();
    expect(screen.queryByText("Remove investor filter")).toBeTruthy();
  });

  test("props change text button rendering all false", () => {
    render(
      <AnalysisPanel
        setOverlay={jest.fn()}
        togglePanel={jest.fn()}
        toggleSearchOverlay={jest.fn()}
        toggleUnconnectedNodesVisible={jest.fn()}
        closeOverlay={jest.fn()}
        toggleindirectConnectionsVisible={jest.fn()}
        indirectConnectionsVisible={false}
        filterEngineeringNodes={jest.fn()}
        filterCommercialNodes={jest.fn()}
        hideUnconnectedNodes={true}
        unconnectedNodesVisible={false}
        engineersFiltered={false}
        investorsFiltered={false}
        resetFilters={jest.fn()}
      />
    );

    expect(screen.queryByText("Show indirect connections")).toBeTruthy();
    expect(screen.queryByText("Show unconnected nodes")).toBeTruthy();
    expect(screen.queryByText("Filter by engineers")).toBeTruthy();
    expect(screen.queryByText("Filter by investors")).toBeTruthy();
  });
});
