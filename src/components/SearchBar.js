
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

    let clear_button = null;

    if (search_text) {
      clear_button = (
        <div className={styles.clearButton}
             onClick={()=>{this.props.emitUpdate("")}}
        >
          &nbsp;X&nbsp;
        </div>);
    }

    return (
      <form className={styles.form}
        onSubmit={(e) => this.onSubmitHandler(e)} >
        <div className={styles.searchBar}>
          <input className={styles.input} type="search"
            onChange={(e) => this.onChangeHandler(e)}
            value={search_text}
            placeholder="Search..." />
          {clear_button}
        </div>
      </form>);
  }
}

SearchBar.propTypes = {
  emitUpdate: PropTypes.func.isRequired,
  searchText: PropTypes.string,
};



export default SearchBar;
