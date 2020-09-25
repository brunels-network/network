
import React from "react";
import PropTypes from "prop-types";

import HBox from "./HBox";
import BigBox from "./BigBox";

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
    let link_button = null;

    if (search_text) {
      clear_button = (
        <div className={styles.clearButton}
             onClick={()=>{this.props.emitUpdate("")}}
        >
          &nbsp;X&nbsp;
        </div>);

      let highlight = this.props.searchHighlightToggled;

      let link_style = styles.linkButton;

      if (highlight) {
        link_style = styles.linkButtonHighlighted;
      }

      link_button = (
        <div className={link_style}
             onClick={()=>{this.props.emitSearchHighlightToggled(!highlight)}}
        >
          &nbsp;✺&nbsp;
        </div>);
    }

    return (
      <form className={styles.form}
        onSubmit={(e) => this.onSubmitHandler(e)} >
        <HBox>
          <BigBox>
            <input key="input" className={styles.input} type="search"
              onChange={(e) => this.onChangeHandler(e)}
              value={search_text}
              placeholder="Search..." />
          </BigBox>
          {link_button}
          {clear_button}
        </HBox>
      </form>);
  }
}

SearchBar.propTypes = {
  searchHighlightToggled: PropTypes.bool.isRequired,
  emitUpdate: PropTypes.func.isRequired,
  emitSearchHighlightToggled: PropTypes.func.isRequired,
  searchText: PropTypes.string,
};



export default SearchBar;
