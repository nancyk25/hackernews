import React from "react";
import ReactDOM, { render } from "react-dom";
import { Search } from "./index";
import renderer from "react-test-renderer";

describe("Search", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Search> Search </Search>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test("has a valid snapshot"),
    () => {
      const tree = renderer.create(<Search> Search </Search>).toJSON();
      expect(tree).toMatchObject();
    };
});
