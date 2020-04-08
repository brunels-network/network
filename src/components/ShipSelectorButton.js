import React from "react";

import styles from "./ShipSelectorButton.module.css";

function ShipSelectorButton(props) {
  return (
    <button
      href="#"
      className={styles.button}
      onClick={props.onClick}
      style={props.style}
    >
      {props.children}
    </button>
  );
}

export default ShipSelectorButton;
