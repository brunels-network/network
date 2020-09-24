
import React from "react";
import PropTypes from "prop-types";

import styles from "./SearchBar.module.css";


class SearchBar extends React.Component {

  constructor(props) {
    super(props);
  }

  onChangeHandler(event) {
    let text = event.target.value;

    if (this.props.emitUpdate) {
      this.props.emitUpdate(text);
    }
  }

  onSubmitHandler(event) {
    event.preventDefault();
  }

  render() {
    let search_text = "";

    if (this.props.searchText) {
      search_text = this.props.searchText;
    }

    return (
      <form className={styles.form}
        onSubmit={(e) => this.onSubmitHandler(e)} >
        <input className={styles.input} type="search"
          onChange={(e) => this.onChangeHandler(e)}
          value={search_text}
          placeholder="Search..." />
      </form>);
  }
}

SearchBar.propTypes = {
  emitUpdate: PropTypes.func.isRequired,
  searchText: PropTypes.string,
};



export default SearchBar;
