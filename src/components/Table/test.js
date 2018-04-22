import React from "react";
import ReactDOM, { render } from "react-dom";
import { Table } from "./index";
import renderer from "react-test-renderer";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

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

  it("shows two elements in list", () => {
    const element = shallow(<Table {...props} />);

    expect(element.find(".table-row").length).toBe(2);
  });
});
