import React from "react";
import PropTypes from "prop-types";

import styles from "./ShipTitle.module.css";

function ShipTitle(props) {
  if (props.name == null) {
    return null;
  } else {
    return <button className={styles.shipTitle}>{props.name}</button>;
  }
}

ShipTitle.propTypes = {
  shipTitle: PropTypes.string,
  style: PropTypes.string,
};

export default ShipTitle;
