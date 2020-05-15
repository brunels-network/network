/** @jsx jsx */
import PropTypes from "prop-types";
import React from "react";

import { jsx } from "@emotion/core";

import styles from "./TextButton.module.css";

class TextButton extends React.Component {
  constructor(props) {
    super(props);

    this.defaultCSS = {
      background: "none",
      border: "none",
      fontFamily: "Playfair Display SC",
      color: "#f1f1f1",
      cursor: "pointer",
      /* Responsive text size */
      fontSize: "calc(12px + (26 - 14) * ((100vw - 300px) / (1600 - 300)))",
      padding: "8px 8px 8px 32px",
      textAlign: "left",
      "&:hover": { color: "red" },
    };
  }
  render() {
    const css = this.defaultCSS;

    if (this.props.textColor) {
      css["color"] = this.props.textColor;
    }

    if (this.props.hoverColor) {
      css["&:hover"]["color"] = this.props.hoverColor;
    }

    if (this.props.fontSize) {
      css["fontSize"] = "calc(" + this.props.fontSize + "+ (26 - 14) * ((100vw - 300px) / (1600 - 300)))";
    }

    return (
      <button
        className={styles.button}
        css={css}
        onClick={() => {
          this.props.onClick();
        }}
      >
        {this.props.children}
      </button>
    );
  }
}

TextButton.propTypes = {
  children: PropTypes.any,
  hoverColor: PropTypes.string,
  textColor: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object,
};

export default TextButton;
