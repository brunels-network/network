import React from "react";

import { render, cleanup, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import AnalysisButton from "./AnalysisButton";

afterEach(cleanup);

describe("AnalysisButton", () => {
  it("close function clicks", () => {
    const toggleFn = jest.fn();

    render(<AnalysisButton togglePanel={toggleFn} />);

    const button = screen.queryByText("Analysis").closest("button");

    fireEvent.click(button);

    expect(toggleFn).toHaveBeenCalled();
  });
});
