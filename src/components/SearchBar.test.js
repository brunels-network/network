import React from "react";
import Dry from "json-dry";

/* eslint-disable no-unused-vars */
// Required to create the social object
import Social from "../model/Social";
/* eslint-enable no-unused-vars */

// import react-testing methods
import { render, cleanup, fireEvent, screen } from "@testing-library/react";

// add custom jest matchers from jest-dom
import "@testing-library/jest-dom/extend-expect";
// the component to test
import SearchBar from "./SearchBar";
import graphData from "../socialNetwork.json";

afterEach(cleanup);

describe("SearchBar", () => {
  // Load in the Dried graph data from JSON
  let social = Dry.parse(graphData);
  test("should render", () => {
    const { container } = render(
      <SearchBar
        emitHighlighted={jest.fn()}
        emitClicked={jest.fn()}
        emitResults={jest.fn()}
        emitSelected={jest.fn()}
        placeholder={"Test"}
        social={social}
      />
    );
    expect(container.firstChild).toBeTruthy();
  });

  test("this input should should find entity", () => {
    render(
      <SearchBar
        emitHighlighted={jest.fn()}
        emitClicked={jest.fn()}
        emitResults={jest.fn()}
        emitSelected={jest.fn()}
        placeholder={"Test"}
        social={social}
      />
    );

    fireEvent.change(screen.getByTestId("searchInput"), {
      target: { value: "Falkner" },
    });

    const searchResults = screen.getAllByTestId(/searchResult/i);
    expect(searchResults).toBeTruthy();
    expect(searchResults.length).toBe(2);
  });

  test("this input should should not find entity", () => {
    render(
      <SearchBar
        emitHighlighted={jest.fn()}
        emitClicked={jest.fn()}
        emitResults={jest.fn()}
        emitSelected={jest.fn()}
        placeholder={"Test"}
        social={social}
      />
    );

    fireEvent.change(screen.getByTestId("searchInput"), {
      target: { value: "QWERTY" },
    });

    const searchResults = screen.queryByText(/searchResult/i);
    expect(searchResults).toBeNull();
  });
});
