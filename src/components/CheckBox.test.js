import React from "react";
import { render, cleanup, fireEvent, screen, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import Checkbox from "./CheckBox";

afterEach(cleanup);

describe("Checkbox", () => {
  it("Toggle function", () => {
    const toggleFn = jest.fn();

    render(<Checkbox checked={false} onChange={toggleFn} />);

    let checkbox = screen.getByTestId("checkbox");

    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);

    // TODO - come back to this

    // console.log(checkbox);
  });
});
