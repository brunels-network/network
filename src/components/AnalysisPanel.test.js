import React from "react";

import { render, cleanup, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import AnalysisPanel from "./AnalysisPanel";

afterEach(cleanup);

describe("AnalysisPanel", () => {
  it("all buttons are clickable", () => {
    const setOverlayFn = jest.fn();
    const togglePanelFn = jest.fn();
    const toggleSearchOverlayFn = jest.fn();
    const toggleUnconnectedNodesVisibleFn = jest.fn();
    const closeOverlayFn = jest.fn();
    const toggleindirectConnectionsVisibleFn = jest.fn();

    const filterEngineeringNodesFn = jest.fn();
    const filterInvestorNodesFn = jest.fn();
    const togglePhysicsFn = jest.fn();
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
        filterInvestorNodes={filterInvestorNodesFn}
        physicsEnabled={true}
        togglePhysicsEnabled={togglePhysicsFn}
        unconnectedNodesVisible={false}
        engineersFiltered={false}
        investorsFiltered={false}
        resetFilters={resetFiltersFn}
      />
    );

    fireEvent.click(screen.queryByText("Search"));
    fireEvent.click(screen.queryByText("Close"));
    fireEvent.click(screen.queryByText("What is Brunel's Network?"));
    fireEvent.click(screen.queryByText(/engineer/i));
    fireEvent.click(screen.queryByText(/investor/i));
    fireEvent.click(screen.queryByText(/physics/i));
    fireEvent.click(screen.queryByText("Reset filters"));

    expect(screen.queryByText("What is Brunel's Network?")).toBeTruthy();
    expect(screen.queryByText("Search")).toBeTruthy();

    expect(setOverlayFn).toHaveBeenCalled();
    expect(togglePanelFn).toHaveBeenCalled();
    expect(filterEngineeringNodesFn).toHaveBeenCalled();
    expect(filterInvestorNodesFn).toHaveBeenCalled();
    expect(togglePhysicsFn).toHaveBeenCalled();
    expect(resetFiltersFn).toHaveBeenCalled();
  });

  it("props change text button rendering all true", () => {
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
        filterInvestorNodes={jest.fn()}
        hideUnconnectedNodes={true}
        physicsEnabled={true}
        togglePhysicsEnabled={jest.fn()}
        unconnectedNodesVisible={true}
        engineersFiltered={true}
        investorsFiltered={true}
        resetFilters={jest.fn()}
      />
    );

    expect(screen.queryByText("Hide indirect connections")).toBeTruthy();
    expect(screen.queryByText("Hide unconnected nodes")).toBeTruthy();
    expect(screen.queryByText("Disable physics")).toBeTruthy();
    expect(screen.queryByText("Remove engineer filter")).toBeTruthy();
    expect(screen.queryByText("Remove investor filter")).toBeTruthy();
  });

  it("props change text button rendering all false", () => {
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
        filterInvestorNodes={jest.fn()}
        hideUnconnectedNodes={true}
        physicsEnabled={true}
        togglePhysicsEnabled={jest.fn()}
        unconnectedNodesVisible={false}
        engineersFiltered={false}
        investorsFiltered={false}
        resetFilters={jest.fn()}
      />
    );

    expect(screen.queryByText("Show indirect connections")).toBeTruthy();
    expect(screen.queryByText("Show unconnected nodes")).toBeTruthy();
    expect(screen.queryByText("Disable physics")).toBeTruthy();
    expect(screen.queryByText("Filter by engineers")).toBeTruthy();
    expect(screen.queryByText("Filter by investors")).toBeTruthy();
  });
});
