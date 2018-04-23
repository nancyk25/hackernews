import React from "react";
import Button from "../Button";
import PropTypes from "prop-types";
import { sortBy } from "lodash";

export const largeColumn = {
  width: "40%"
};

export const midColumn = {
  width: "30%"
};

export const smallColumn = {
  width: "10%"
};

// const SORTS = {
//   NONE: list => list,
//   TITLE: list => sortBy(list, "title"),
//   AUTHOR: list => sortBy(list, "author"),
//   COMMENTS: list => sortBy(list, "num_comments").reverse(),
//   POINTS: list => sortBy(list, "points").reverse()
// };

//Table Component
export const Table = ({ Sort, SORTS, onSort, list, sortKey, onDismiss }) => (
  <div className="table">
    <div className="table-header">
      <span style={{ width: "40%" }}>
        <Sort sortKey={"TITLE"} onSort={onSort}>
          {" "}
          Title{" "}
        </Sort>
      </span>
      <span style={{ width: "30%" }}>
        <Sort sortKey={"AUTHOR"} onSort={onSort}>
          {" "}
          Author{" "}
        </Sort>
      </span>
      <span style={{ width: "10%" }}>
        <Sort sortKey={"COMMENTS"} onSort={onSort}>
          {" "}
          Comments{" "}
        </Sort>
      </span>
      <span style={{ width: "10%" }}>
        <Sort sortKey={"POINTS"} onSort={onSort}>
          {" "}
          Points{" "}
        </Sort>
      </span>
      <span style={{ width: "10%" }}>Archive</span>
    </div>
    {SORTS[sortKey](list).map(item => (
      <div className="table-row" key={item.objectID}>
        <span style={largeColumn}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={midColumn}>{item.author}</span>
        <span style={smallColumn}>{item.num_comments}</span>
        <span style={smallColumn}>{item.points}</span>
        <span style={smallColumn}>
          <Button
            className="button-inline"
            onClick={() => onDismiss(item.objectID)}
          >
            Dismiss!
          </Button>
        </span>
      </div>
    ))}
  </div>
);

Table.propTypes = {
  list: PropTypes.arrayOf(
    //define content of array more explicitly
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number
    })
  ).isRequired,
  onDismiss: PropTypes.func
};
