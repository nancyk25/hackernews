import React from "react";
import ReactDOM, { render } from "react-dom";
import { Table } from "./index";
import renderer from "react-test-renderer";

describe("Table", () => {
  const props = {
    list: [
      { title: "1", author: "1", num_comments: 1, points: 2, objectID: "y" },
      { title: "2", author: "2", num_comments: 1, points: 2, objectID: "z" }
    ]
  };

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Table {...props} />, div);
  });

  test("has a valid snapshot", () => {
    const tree = renderer.create(<Table {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
