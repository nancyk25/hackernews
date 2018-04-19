import React, { Component } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";

const DEFAULT_QUERY = "redux";
const DEFAULT_HPP = "20";
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

const largeColumn = {
  width: "40%"
};

const midColumn = {
  width: "30%"
};

const smallColumn = {
  width: "10%"
};

//Search Component - Functional Stateless/Container Components in es6
const Search = ({ value, onChange, onSubmit, children }) => (
  <form onSubmit={onSubmit}>
    {children}
    <input type="text" value={value} onChange={onChange} />
    <button type="submit">{children}</button>
  </form>
);

//Reusable button component
class Button extends Component {
  render() {
    const { onClick, className = "", children } = this.props;
    return (
      <button
        onClick={onClick}
        className={className}
        children={children}
        type="button"
      >
        {children}
      </button>
    );
  }
}

//Table Component
const Table = ({ list, onDismiss }) => (
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

class App extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY,
      error: null
    };
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  //prevent fetching when a result if available in the cache
  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    let url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`;
    axios(url)
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({ error }));
    // let url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`;
    console.log("after fetch", url);
  }

  setSearchTopStories(result) {
    //get page and hits from the results
    console.log("RESULTS---->", result);

    // const { page } = this.state;
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    //store each result by search key
    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];
    console.log("old hits--->", oldHits);
    //merge the old hits and new hits
    const updatedHits = [...oldHits, ...hits];
    console.log("updates", updatedHits);
    //update the state of result
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  //fetch JSON DATA then set it as result state if not catch error
  componentDidMount() {
    this._isMounted = true;
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.results[searchKey].hits.filter(isNotId);
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
    console.log("updatedhits", updatedHits);
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }

  // onPaginatedSearch(event) {
  //   // this.setState({ page: this.state.page + 1 });
  //   const { searchTerm, page } = this.state;
  //   console.log("paginated page state--->", page);
  //   this.fetchSearchTopStories(searchTerm, page + 1);
  // }

  render() {
    const { searchTerm, results, searchKey, error } = this.state;
    //default to page 0 when there is no result and result page yet
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;

    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];

    //display error message:
    if (error) {
      return <p> Something went wrong. </p>;
    }

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search here!
          </Search>
        </div>
        {error ? (
          <div className="interactions">
            <p> Something went wrong. </p>
          </div>
        ) : (
          <Table list={list} onDismiss={this.onDismiss} />
        )}
        <div className="interactions">
          <Button
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            {" "}
            More{" "}
          </Button>
        </div>
      </div>
    );
  }
}

export default App;
