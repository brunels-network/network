import React from "react";
import PropTypes from "prop-types";

import BioOverlay from "./BioOverlay";
import Overlay from "./Overlay";

class OverlayWrapper extends React.Component {
  render() {
    const sourceButtonText = this.props.sourceButtonText;
    const socialSources = this.props.social.getSources();

    if (!this.props.sourceIDs) {
      return null;
    }

    let overlay = null;
    if (this.props.isOverlayOpen && this.props.isBioOverlayOpen) {
      overlay = (
        <Overlay toggleOverlay={this.props.toggleOverlay}>
          <BioOverlay
            sources={socialSources}
            person={this.props.entity}
            social={this.props.social}
            toggleOverlay={this.props.toggleOverlay}
            toggleSourceOverlay={this.props.toggleSourceOverlay}
            sourceButtonText={sourceButtonText}
          />
        </Overlay>
      );
    }

    return overlay;
  }
}

OverlayWrapper.propTypes = {
  entity: PropTypes.object.isRequired,
  isBioOverlayOpen: PropTypes.bool.isRequired,
  isOverlayOpen: PropTypes.bool.isRequired,
  isSourceOverlayOpen: PropTypes.bool.isRequired,
  social: PropTypes.object.isRequired,
  sourceButtonText: PropTypes.string.isRequired,
  sourceIDs: PropTypes.array.isRequired,
  toggleBioOverlay: PropTypes.func.isRequired,
  toggleOverlay: PropTypes.func.isRequired,
  toggleSourceOverlay: PropTypes.func.isRequired,
};

export default OverlayWrapper;
