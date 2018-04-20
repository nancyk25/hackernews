import React, { Component } from "react";
import Button from "../Button";

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
export const Table = ({ list, onDismiss }) => (
  <div className="table">
    {list.map(item => (
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
