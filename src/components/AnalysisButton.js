import React from "react";
import PropTypes from "prop-types";

import styles from "./AnalysisButton.module.css";

class AnalysisButon extends React.Component {
  render() {
    return (
      <button data-testid="AnalysisButton" className={styles.button} onClick={this.props.togglePanel}>
        Analysis
      </button>
    );
  }
}

AnalysisButon.propTypes = {
  togglePanel: PropTypes.func.isRequired,
};

export default AnalysisButon;
