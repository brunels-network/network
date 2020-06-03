import PropTypes from "prop-types";
import React from "react";

import Overlay from "./Overlay";

import styles from "./OptionsOverlay.module.css";

class OptionsOverlay extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Overlay toggleOverlay={this.props.toggleOptionsOverlay}>
        <div className={styles.optionsContainer}>
          <div className={styles.optionsHeader}>Graph options</div>
          <div className={styles.indirectTitle}>Show indirect connections</div>
          <div className={styles.indirectCheckbox}>
            <input
              name="indirectVisible"
              type="checkbox"
              checked={this.props.indirectLinksVisible}
              onChange={this.props.toggleIndirectLinksVisible}
            />
          </div>
          <div className={styles.physicsTitle}>Physics enabled</div>
          <div className={styles.physicsCheckbox}>
            <input
              name="physicsEnabled"
              type="checkbox"
              checked={this.props.physicsEnabled}
              onChange={this.props.togglePhysicsEnabled}
            />
          </div>
        </div>
      </Overlay>
    );
  }
}

OptionsOverlay.propTypes = {
  toggleOptionsOverlay: PropTypes.func.isRequired,
  toggleIndirectLinksVisible: PropTypes.func.isRequired,
  togglePhysicsEnabled: PropTypes.func.isRequired,
  indirectLinksVisible: PropTypes.bool.isRequired,
  physicsEnabled: PropTypes.bool.isRequired,
};

export default OptionsOverlay;
