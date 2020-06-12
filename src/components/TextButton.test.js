import React from "react";

// import react-testing methods
import { render, cleanup, fireEvent, waitFor, screen, getByTestId } from "@testing-library/react";

// add custom jest matchers from jest-dom
import "@testing-library/jest-dom/extend-expect";

// the component to test
import TextButton from "./TextButton";
import { clean } from "gh-pages";

afterEach(cleanup);

test("takes snapshot", () => {
  const { asFragment } = render(<TextButton>Some text</TextButton>);

  expect(asFragment(<TextButton>Some text</TextButton>)).toMatchSnapshot();
});
