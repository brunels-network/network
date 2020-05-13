import PropTypes from "prop-types";
import React from "react";
import DefaultButton from "./DefaultButton";

import logo from "../images/ssgb_logo.png";

import styles from "./AnalysisPanel.module.css";

class AnalysisPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ship: "SS Great Western" };
  }

  render() {
    return (
      <div className={styles.wholePanel}>
        <div className={styles.verticalSpaceTitle}></div>
        <div className={styles.titleText}>Analysis</div>
        <div className={styles.verticalSpace}></div>
        <button
          className={styles.button}
          onClick={() => {
            this.props.toggleFilterPanel();
            this.props.togglePanel();
          }}
        >
          Filters
        </button>
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
  toggleFilterPanel: PropTypes.func.isRequired,
  toggleTimeLinePanel: PropTypes.func.isRequired,
  toggleWobble: PropTypes.func.isRequired,
  togglePanel: PropTypes.func.isRequired,
};

export default AnalysisPanel;
