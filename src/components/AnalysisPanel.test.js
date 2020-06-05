import React from "react";

// import react-testing methods
import { render, cleanup, fireEvent, waitFor, getByText, screen, getByTestId } from "@testing-library/react";

// add custom jest matchers from jest-dom
import "@testing-library/jest-dom/extend-expect";
// the component to test
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
    expect(screen.getByText("Filters")).toBeTruthy();
    expect(screen.getByText("Options")).toBeTruthy();
    expect(screen.getByText("Close")).toBeTruthy();
  });
});

// test("test analysis buttons opens panel", () => {
//   function handleClick() {
//       console.log("Done");
//   }

//   const {getByText} = render(<)
// });
