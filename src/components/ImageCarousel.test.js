import React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import ImageCarousel from "./ImageCarousel";

afterEach(cleanup);

describe("ImageCarousel", () => {
  it("Images are within page", () => {
    render(
      <ImageCarousel>
        <img src={require("../images/RHowlett_IKB.jpg")} alt="Test Image 1" />
        <img src={require("../images/A_Specimen_by_William_Caslon.jpg")} alt="Test Image 2" />
      </ImageCarousel>
    );

    expect(screen.getByAltText("Test Image 1")).toBeTruthy();
    expect(screen.getByAltText("Test Image 2")).toBeTruthy();
  });
});
