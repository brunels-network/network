import React from "react";
import PropTypes from "prop-types";

import TextButton from "./TextButton";

import styles from "./Popoverlay.module.css";

class Popoverlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isVisible: false };
  }

  render() {
    // We want a big div that's mostly opaque
    // We want another that's smaller
    return (
      <div className={styles.overlay}>
        <div className={styles.container}>This is a test</div>
      </div>
    );
  }
}

export default Popoverlay;
