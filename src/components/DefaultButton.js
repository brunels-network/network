import React from "react";
import PropTypes from "prop-types"

import styles from "./DefaultButton.module.css";

function DefaultButton(props) {
  return (
    <button href="#" className={styles.button} onClick={props.onClick} style={props.style}>
      {props.children}
    </button>
  );
}

DefaultButton.propTypes = {
    onClick: PropTypes.func,
    style: PropTypes.string,
    children: PropTypes.string
}

export default DefaultButton;
