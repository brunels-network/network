import React from "react";

import { render, cleanup, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import AboutOverlay from "./AboutOverlay";

afterEach(cleanup);

describe("SocialApp", () => {
  test("close button works", () => {
    const closeFn = jest.fn();

    render(<AboutOverlay close={closeFn} />);

    const closebutton = screen.queryByText("x");

    fireEvent.click(closebutton);

    expect(closeFn).toHaveBeenCalled();
  });

  test("all text appears correctly", () => {
    render(<AboutOverlay close={jest.fn()} />);

    expect(
      screen.queryAllByText(
        /Brunel's Network is a visual representation of the network of people involved in the conception/
      )
    ).toBeTruthy();

    expect(screen.queryAllByText(/This project seeks to evaluate the relationships between/)).toBeTruthy();

    expect(
      screen.queryAllByText(/The baseline network was derived from material held in the Brunel Institute/)
    ).toBeTruthy();

    expect(screen.queryAllByText(/The sources used in this project are highly variegated/)).toBeTruthy();
  });
});
