
import React from "react";
import PropTypes from "prop-types";

import styles from "./SearchBar.module.css";


class SearchBar extends React.Component {

  constructor(props) {
    super(props);

    this.state = { text: null };
  }

  onChangeHandler(event) {
    let text = event.target.value;

    if (this.props.emitUpdate) {
      this.props.emitUpdate(text);
    }

    this.setState({ text: text });
  }

  onSubmitHandler(event) {
    event.preventDefault();

    if (this.props.emitUpdate) {
      this.props.emitUpdate(this.state.text);
    }
  }

  render() {
    return (
      <form className={styles.form}
        onSubmit={(e) => this.onSubmitHandler(e)} >
        <input className={styles.input} type="search"
          onChange={(e) => this.onChangeHandler(e)}
          placeholder="Search..."/>
      </form>);
  }
}

SearchBar.propTypes = {
  emitUpdate: PropTypes.func.isRequired,
};



export default SearchBar;
