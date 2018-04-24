import React, { Component } from "react";
import Button from "../Button";
import PropTypes from "prop-types";
import { sortBy } from "lodash";
import classNames from "classnames";

export const largeColumn = {
  width: "40%"
};

export const midColumn = {
  width: "30%"
};

export const smallColumn = {
  width: "10%"
};

//Table Component
class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortKey: "NONE",
      isSortReverse: false
    };
    this.onSort = this.onSort.bind(this);
  }
  onSort = sortKey => {
    const isSortReverse =
      this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
    console.log("sort key-->", this.state.sortKey, isSortReverse);
  };
  render() {
    const { list, onDismiss } = this.props;
    const { onSort, sortKey, isSortReverse } = this.state;
    const sortedList = sortBy(list, `${sortKey}`);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;

    const Sort = ({ activeSortKey, sortKey, onSort, children }) => {
      const sortClass = classNames("button-inline", {
        "button-active": sortKey === activeSortKey
      });
      return (
        <Button onClick={() => onSort(sortKey)} className={sortClass}>
          {children}
        </Button>
      );
    };

    return (
      <div className="table">
        <div className="table-header">
          <span style={{ width: "40%" }}>
            <Sort
              sortKey={"title"}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              {" "}
              Title{" "}
            </Sort>
          </span>
          <span style={{ width: "30%" }}>
            <Sort
              sortKey={"author"}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              {" "}
              Author{" "}
            </Sort>
          </span>
          <span style={{ width: "10%" }}>
            <Sort
              sortKey={"num_comments"}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              {" "}
              Comments{" "}
            </Sort>
          </span>
          <span style={{ width: "10%" }}>
            <Sort
              sortKey={"points"}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              {" "}
              Points{" "}
            </Sort>
          </span>
          <span style={{ width: "10%" }}>Archive</span>
        </div>
        {reverseSortedList.map(item => (
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
  }
}

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

export default Table;
