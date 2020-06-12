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
        hideUnconnectedNodes={true}
        physicsEnabled={true}
        togglePhysicsEnabled={togglePhysicsFn}
      />
    );

    fireEvent.click(screen.queryByText("Search"));
    fireEvent.click(screen.queryByText("Close"));
    fireEvent.click(screen.queryByText("About"));
    fireEvent.click(screen.queryByText(/engineer/i));
    fireEvent.click(screen.queryByText(/investor/i));
    fireEvent.click(screen.queryByText(/physics/i));

    expect(setOverlayFn).toHaveBeenCalled();
    expect(togglePanelFn).toHaveBeenCalled();
    expect(filterEngineeringNodesFn).toHaveBeenCalled();
    expect(filterInvestorNodesFn).toHaveBeenCalled();
    expect(togglePhysicsFn).toHaveBeenCalled();
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
      />
    );

    screen.queryByText("Hide indirect connections");
    screen.queryByText("Show unconnected nodes");
    screen.queryByText("Disable physics");
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
        indirectConnectionsVisible={true}
        filterEngineeringNodes={jest.fn()}
        filterInvestorNodes={jest.fn()}
        hideUnconnectedNodes={true}
        physicsEnabled={true}
        togglePhysicsEnabled={jest.fn()}
      />
    );

    screen.queryByText("Show indirect connections");
    screen.queryByText("Hide unconnected nodes");
    screen.queryByText("Enable physics");
  });
});
