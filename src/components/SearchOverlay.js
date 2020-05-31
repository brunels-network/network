import PropTypes from "prop-types";
import React from "react";

import SearchBar from "./SearchBar";
import Overlay from "./Overlay";

import styles from "./SearchOverlay.module.css";

class SearchOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.emitResults = this.emitResults.bind(this);
    this.state = { haveResults: false };
  }

  emitResults() {
    this.setState({ haveResults: false });
  }

  render() {
    const placeholderText = "Search...";

    return (
      <Overlay toggleOverlay={this.props.toggleSearchOverlay}>
        <div className={styles.container}>
          <SearchBar
            social={this.props.social}
            emitSelected={this.props.emitSelected}
            emitHighlighted={this.props.emitHighlighted}
            emitClicked={this.props.slotClicked}
            emitResults={this.emitResults}
            placeholder={placeholderText}
          ></SearchBar>
        </div>
      </Overlay>
    );
  }
}

SearchOverlay.propTypes = {
  toggleSearchOverlay: PropTypes.func.isRequired,
  emitHighlighted: PropTypes.func.isRequired,
  emitSelected: PropTypes.func.isRequired,
  slotClicked: PropTypes.func.isRequired,
  social: PropTypes.object.isRequired,
};

export default SearchOverlay;
