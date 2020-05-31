import PropTypes from "prop-types";
import React from "react";

import TextButton from "./TextButton";
import styles from "./AnalysisPanel.module.css";

class AnalysisPanel extends React.Component {
  render() {
    return (
      <div className={styles.wholePanel}>
        <div className={styles.verticalSpaceTitle}></div>
        <div className={styles.titleText}>Analysis</div>
        <div className={styles.verticalSpace}></div>
        <TextButton
          className={styles.button}
          onClick={() => {
            this.props.toggleSearchOverlay();
            this.props.togglePanel();
          }}
        >
          Search
        </TextButton>
        <TextButton
          className={styles.button}
          onClick={() => {
            this.props.toggleFilterPanel();
            this.props.togglePanel();
          }}
        >
          Filters
        </TextButton>
        <button
          className={styles.button}
          onClick={() => {
            this.props.toggleTimeLinePanel();
            this.props.togglePanel();
          }}
        >
          Timeline
        </button>
        <button
          className={styles.button}
          onClick={() => {
            this.props.toggleWobble();
          }}
        >
          Wobble
        </button>
        <div className={styles.verticalSpace}></div>
        <button
          className={styles.button}
          onClick={() => {
            this.props.togglePanel();
          }}
        >
          Close
        </button>
      </div>
    );
  }
}

AnalysisPanel.propTypes = {
  toggleSearchOverlay: PropTypes.func.isRequired,
  toggleFilterPanel: PropTypes.func.isRequired,
  toggleTimeLinePanel: PropTypes.func.isRequired,
  toggleWobble: PropTypes.func.isRequired,
  togglePanel: PropTypes.func.isRequired,
};

export default AnalysisPanel;
