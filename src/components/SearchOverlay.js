import PropTypes from "prop-types";
import React from "react";

import SearchBar from "./SearchBar";
import Overlay from "./Overlay";

import styles from "./SearchOverlay.module.css";
import OverlayWrapper from "./OverlayWrapper";

class SearchOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.emitResults = this.emitResults.bind(this);
    this.state = {
      isOverlayOpen: true,
      isBioOverlayOpen: true,
      isSourceOverlayOpen: false,
      haveResults: false,
      selectedEntity: null,
    };

    this.toggleSourceOverlay = this.toggleSourceOverlay.bind(this);
    this.toggleBioOverlay = this.toggleBioOverlay.bind(this);
    this.emitSelected = this.emitSelected.bind(this);

    this.toggleOverlay = this.toggleOverlay.bind(this);
  }

  emitResults() {
    this.setState({ haveResults: true });
  }

  emitSelected(item) {
    this.setState({ selectedEntity: item });
  }

  toggleOverlay() {
    this.setState({ isOverlayOpen: !this.state.isOverlayOpen });
  }

  toggleSourceOverlay() {
    this.setState({ isOverlayOpen: true, isSourceOverlayOpen: true, isBioOverlayOpen: false });
  }

  toggleBioOverlay() {
    this.setState({ isOverlayOpen: true, isSourceOverlayOpen: false, isBioOverlayOpen: true });
  }

  render() {
    // let searchStyle = this.state.haveResults ? styles.resultsContainer : styles.smallContainer;

    const placeholderText = "Search...";
    const socialSources = this.props.social.getSources();

    // TODO - rework these classes, code duplication with Popover.js here
    const selectedShipID = this.props.selectedShipID;

    let infoOverlay = null;
    if (this.state.selectedEntity) {
      const entity = this.state.selectedEntity;

      // If we can't find it in the selected ship then get the sources for the other ship
      const sourceIDs = entity.getSources()[selectedShipID];

      let buttonStrings = [];
      let sourceButtonText = "";

      if (!sourceIDs) {
        console.error("Cannot find sources for this project : ", selectedShipID, "\n Sources : ", socialSources);
      } else {
        for (const id of sourceIDs) {
          buttonStrings.push(socialSources.get(id).getName());
        }
      }
      sourceButtonText = buttonStrings.join(", ");

      infoOverlay = (
        <OverlayWrapper
          entity={entity}
          isBioOverlayOpen={this.state.isBioOverlayOpen}
          isOverlayOpen={this.state.isOverlayOpen}
          isSourceOverlayOpen={this.state.isSourceOverlayOpen}
          social={this.props.social}
          sourceButtonText={sourceButtonText}
          sourceIDs={sourceIDs}
          toggleBioOverlay={this.toggleBioOverlay}
          toggleOverlay={this.toggleOverlay}
          toggleSourceOverlay={this.toggleSourceOverlay}
        />
      );
    }

    return (
      <Overlay toggleOverlay={this.props.toggleSearchOverlay}>
        <div className={styles.container}>
          <div className={styles.smallContainer}>
            <SearchBar
              social={this.props.social}
              emitHighlighted={this.props.emitHighlighted}
              emitClicked={this.props.emitClicked}
              emitResults={this.emitResults}
              emitSelected={this.emitSelected}
              placeholder={placeholderText}
            ></SearchBar>
          </div>
          {infoOverlay}
        </div>
      </Overlay>
    );
  }
}

SearchOverlay.propTypes = {
  toggleSearchOverlay: PropTypes.func.isRequired,
  emitHighlighted: PropTypes.func.isRequired,
  emitSelected: PropTypes.func.isRequired,
  emitClicked: PropTypes.func.isRequired,
  social: PropTypes.object.isRequired,
  selectedShipID: PropTypes.string.isRequired,
};

export default SearchOverlay;
