import React from "react";
import ReactDOM, { render } from "react-dom";
import Button from "./index";
import renderer from "react-test-renderer";

describe("Button", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Button>Give me more</Button>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test("has a valid snapshot"),
    () => {
      const tree = renderer.create(<Button>Give me more.</Button>).toJSON();
      expect(tree).toMatchSnapshot;
      ReactDOM.unmountComponentAtNode(div);
    };
});
