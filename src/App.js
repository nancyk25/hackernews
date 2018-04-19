import React, { Component } from "react";
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
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      page: 0,
      searchTerm: DEFAULT_QUERY
    };
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  fetchSearchTopStories(searchTerm, page) {
    let url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`;
    fetch(url)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result, page))
      .catch(error => error);
    // let url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`;
    console.log("after fetch", url);
  }

  setSearchTopStories(result) {
    //get page and hits from the results
    const { page } = this.state;
    const { hits } = result;
    //check if there are old hits by checking page number
    const oldHits = page !== 0 ? this.state.result.hits : [];
    //merge the hits
    const updatedHits = [...oldHits, ...hits];
    console.log("updates", updatedHits);
    //update the state of result
    this.setState({ result: { hits: updatedHits } });
    // console.log("result.page", this.state.page)
  }

  //fetch JSON DATA then set it as result state if not catch error
  componentDidMount() {
    const { searchTerm } = this.state;
    const { page } = this.state;
    this.fetchSearchTopStories(searchTerm, page);
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: { ...this.state.result, hits: updatedHits }
    });
    console.log("updatedhits", updatedHits);
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  onPaginatedSearch(event) {
    const { searchTerm, page } = this.state;
    this.setState({ page: this.state.page + 1 });
    console.log("paginated page state--->", page);
    this.fetchSearchTopStories(searchTerm, page);
  }

  render() {
    const { searchTerm, result, page } = this.state;
    //default to page 0 when there is no result and result page yet
    // const page = (result && page) || 0;

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
        {result && <Table list={result.hits} onDismiss={this.onDismiss} />}
        <div className="interactions">
          <Button onClick={() => this.onPaginatedSearch()}> More </Button>
        </div>
      </div>
    );
  }
}

export default App;
