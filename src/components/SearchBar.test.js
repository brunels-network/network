import React from "react";
import Dry from "json-dry";

// Brunel model
import Social from "../model/Social";

// import react-testing methods
import { render, cleanup, fireEvent, waitFor, getByText, screen, getByTestId } from "@testing-library/react";

// add custom jest matchers from jest-dom
import "@testing-library/jest-dom/extend-expect";
// the component to test
import SearchBar from "./SearchBar";
import graph_data from "../dataWeights.json";

afterEach(cleanup);

describe("SearchBar", () => {
  it("should render", () => {
    const { container } = render(<SearchBar emitSelected={jest.fn()} social={jest.fn()} />);
    expect(container.firstChild).toBeTruthy();
  });

  // Load in the Dried graph data from JSON
  let social = Dry.parse(graph_data);

  it("this input should should find entity", () => {
    render(<SearchBar emitSelected={jest.fn()} emitResults={jest.fn()} social={social} />);

    fireEvent.change(screen.getByTestId("searchInput"), {
      target: { value: "Falkner" },
    });

    const searchResults = screen.getAllByTestId(/searchResult/i);
    expect(searchResults).toBeTruthy();
    expect(searchResults.length).toBe(2);
  });

  it("this input should should not find entity", () => {
    render(<SearchBar emitSelected={jest.fn()} emitResults={jest.fn()} social={social} />);

    fireEvent.change(screen.getByTestId("searchInput"), {
      target: { value: "QWERTY" },
    });

    const searchResults = screen.queryByText(/searchResult/i);
    expect(searchResults).toBeNull();
    // expect(searchResults.length).toBe(0);
  });
});

// test("test analysis buttons opens panel", () => {
//   function handleClick() {
//       console.log("Done");
//   }

//   const {getByText} = render(<)
// });
