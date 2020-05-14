import PropTypes from "prop-types";
import React from "react";

import styles from "./TextButton.module.css";

class TextButton extends React.Component {
  render() {
    textColour = this.props.textColour;
    hoverColour = this.props.hoverColour;

    return (
      <button
        className={styles.button}
        style={{ color: this.props.textColour, hoverColour: this.props.hoverColour }}
        onClick={() => {
          this.props.onClick();
        }}
      >
        {this.props.children}
      </button>
    );
  }
}
