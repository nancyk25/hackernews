import React, { Component } from "react";
import axios from "axios";
import { sortBy } from "lodash";

import {
  DEFAULT_QUERY,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP
} from "../../constants";
import "./App.css";
import Button from "../Button";
import Search from "../Search";
import { Table } from "../Table";
import { Loader, Dimmer, Segment } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

class App extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
      sortKey: "NONE"
    };
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    this.setState({ sortKey });
  }

  //prevent fetching when a result if available in the cache
  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    let url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`;
    this.setState({ isLoading: true });
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
      },
      isLoading: false
    });
    console.log("this is the state", this.state);
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

  render() {
    const { searchTerm, results, searchKey, error, isLoading } = this.state;
    //default to page 0 when there is no result and result page yet
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;

    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];

    //display error message:
    if (error) {
      return <p> Something went wrong. </p>;
    }
    const Loading = () => (
      <div>
        <Dimmer active inverted>
          <Loader> Loading! </Loader>
        </Dimmer>
      </div>
    );
    //HOC conditional rendering based on isLoading prop
    const withLoading = Component => ({ isLoading, ...rest }) =>
      isLoading ? <Loading /> : <Component {...rest} />;
    const ButtonWithLoading = withLoading(Button);

    const SORTS = {
      NONE: list => list,
      TITLE: list => sortBy(list, "title"),
      AUTHOR: list => sortBy(list, "author"),
      COMMENTS: list => sortBy(list, "num_comments").reverse(),
      POINTS: list => sortBy(list, "points").reverse()
    };

    const Sort = ({ sortKey, onSort, children }) => (
      <Button onClick={() => onSort(sortKey)} className="button-inline">
        {children}
      </Button>
    );

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
          <Table
            list={list}
            SORTS={SORTS}
            Sort={Sort}
            onSort={this.onSort}
            onDismiss={this.onDismiss}
          />
        )}
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

export default App;
