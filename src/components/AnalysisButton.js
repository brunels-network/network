import React from "react";
import PropTypes from "prop-types";

import styles from "./AnalysisButton.module.css";

class AnalysisButton extends React.Component {
  render() {
    return (
      <button data-testid="AnalysisButton" className={styles.button} onClick={this.props.togglePanel}>
        Analysis
      </button>
    );
  }
}

AnalysisButton.propTypes = {
  togglePanel: PropTypes.func.isRequired,
};

export default AnalysisButton;
