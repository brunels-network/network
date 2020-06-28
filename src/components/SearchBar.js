import PropTypes from "prop-types";
import React from "react";
import Spinner from "react-spinkit";

import TextButton from "./TextButton";

import styles from "./SearchBar.module.css";

// This class is heavily inspired by react-search-field
// from https://github.com/nutboltu/react-search-field

function _null_function() {}

function SearchResults(props) {
  let results = props.results;

  if (!results) {
    return null;
  }

  let items = [];

  results.forEach((item, index) => {
    items.push(
      <li data-testid={"searchResult" + index} key={"searchResult" + index}>
        {item}
      </li>
    );
  });

  return <ul>{items}</ul>;
}

SearchResults.propTypes = {
  results: PropTypes.any,
};

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      suggestions: null,
      searching: null,
      results: null,
    };
  }

  componentDidUpdate(nextProps) {
    if (this.props.searchText !== nextProps.searchText) {
      this.setState({
        value: nextProps.searchText,
      });
    }
  }

  setResults(results) {
    this.props.emitResults();
    this.setState({ searching: null, suggestions: null, results: results });
  }

  setSuggestions(suggestions) {
    this.props.emitResults();
    this.setState({ searching: null, suggestions: suggestions, results: null });
  }

  createButton(item, index) {
    const name = item.getName();
    return (
      <TextButton
        key={name.concat("_", index)}
        textColor="#f1f1f1"
        hoverColor="#111"
        fontSize="2vh"
        onClick={() => {
          this.props.emitSelected(item);
        }}
      >
        {name}
      </TextButton>
    );
  }

  startSuggestion(text) {
    let social = this.props.social;
    if (!social) {
      return;
    }

    let items = null;

    try {
      items = social.find(text);
    } catch (error) {
      items = null;
    }

    let emitSelected = this.props.emitSelected;

    if (!emitSelected) {
      emitSelected = _null_function;
    }

    if (items) {
      let results = items.map((item, index) => {
        return this.createButton(item, index);
      });

      this.setSuggestions(results);
    } else {
      this.setSuggestions(null);
    }
  }

  startSearch(text) {
    let social = this.props.social;

    if (!social) {
      this.setResults([<div key="noresults">No results!</div>]);
      return;
    }

    let items = null;

    try {
      items = social.find(text);
    } catch (error) {
      //   console.warn(error);
      items = null;
    }

    let emitSelected = this.props.emitSelected;

    if (!emitSelected) {
      emitSelected = _null_function;
    }

    if (items) {
      let results = items.map((item, index) => {
        return this.createButton(item, index);
      });

      this.setResults(results);
    } else {
      this.setResults([<div key="rnoresults">Really no results!</div>]);
    }
  }

  searchFor(text) {
    if (text && text.length > 0) {
      this.setState({ searching: text, suggestions: null, results: null });

      setTimeout(() => {
        this.startSearch(text);
      }, 10);
    } else {
      this.setState({ suggestions: null, searching: null, results: null });
    }
  }

  autocomplete(text) {
    if (text && text.length > 0) {
      this.startSuggestion(text);
    } else {
      this.setState({ suggestions: null, searching: null, results: null });
    }
  }

  isSearching() {
    return this.state.searching !== null;
  }

  isSuggesting() {
    return this.state.suggestions !== null;
  }

  hasResults() {
    return this.state.results !== null;
  }

  stopSearch() {
    this.setState({ searching: null, suggestions: null, results: null });
  }

  onChange(event) {
    if (this.isSearching()) {
      return;
    }

    this.setState({ value: event.target.value });
    this.autocomplete(event.target.value);
  }

  onEnter(event) {
    if (this.isSearching() || this.isEmpty()) {
      return;
    }

    const enterKey = 13;
    const isEnterPressed = event.which === enterKey || event.keyCode === enterKey;

    if (isEnterPressed) {
      this.searchFor(event.target.value);
    }
  }

  onSearch() {
    if (this.isSearching() || this.isEmpty()) {
      return;
    }

    this.searchFor(this.state.value);
  }

  isEmpty() {
    return !(this.state.value && this.state.value.length > 0);
  }

  isSearchingComponent() {
    return (
      <div className={styles.searchContainer}>
        <div className={styles.resultContainer}>
          <div className={styles.searchPending}>
            <div>Searching for &quot;{this.state.searching}&quot;...</div>
            <div style={{ display: "inline-block" }}>
              <Spinner name="ball-grid-pulse" color="green" fadeIn="none" />
            </div>
          </div>
          <div
            className={styles.closeResultButton}
            onClick={() => {
              this.stopSearch();
            }}
          >
            X
          </div>
        </div>
      </div>
    );
  }

  isSuggestingComponent() {
    return (
      <div className={styles.searchContainer}>
        <div className={styles.resultContainer}>
          <div className={styles.searchResult}>
            <SearchResults results={this.state.suggestions} />
          </div>
          <div
            className={styles.closeResultButton}
            onClick={() => {
              this.setState({ suggestions: null });
            }}
          >
            X
          </div>
        </div>
      </div>
    );
  }

  resultsComponent() {
    return (
      <div className={styles.searchContainer}>
        <div className={styles.resultContainer}>
          <div className={styles.searchResult}>
            <SearchResults results={this.state.results} />
          </div>
          <div
            className={styles.closeResultButton}
            onClick={() => {
              this.setState({ results: null });
            }}
          >
            X
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className={styles.searchContainer}>
          <input
            data-testid="searchInput"
            className={styles.searchBox}
            onChange={(event) => {
              this.onChange(event);
            }}
            onKeyPress={(event) => {
              this.onEnter(event);
            }}
            placeholder={this.props.placeholder}
            type="text"
            value={this.state.value}
          />
        </div>
        {this.isSearching() ? this.isSearchingComponent() : null}
        {this.isSuggesting() ? this.isSuggestingComponent() : null}
        {this.hasResults() ? this.resultsComponent() : null}
      </div>
    );
  }
}

// TODO - finish this
SearchBar.propTypes = {
  emitSelected: PropTypes.func.isRequired,
  emitResults: PropTypes.func.isRequired,
  social: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  searchText: PropTypes.string,
};

export default SearchBar;
