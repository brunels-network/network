import React from "react";

// import react-testing methods
import { render, cleanup, fireEvent, screen } from "@testing-library/react";

// add custom jest matchers from jest-dom
import "@testing-library/jest-dom/extend-expect";

// the component to test
import TextButton from "./TextButton";

afterEach(cleanup);

describe("TextButton", () => {
  it("Renders and is clickable", () => {
    const testFn = jest.fn();
    const testString = "Some test text";

    render(<TextButton onClick={testFn}>{testString}</TextButton>);

    expect(screen.queryByText(testString)).toBeInTheDocument();

    fireEvent.click(screen.queryByText(testString).closest("button"));

    expect(testFn).toHaveBeenCalled();
  });
});
