import React from "react";
import PropTypes from "prop-types";

import styles from "./CheckBox.module.css";

function CheckBox(props) {
  return (
    <label className={styles.checkBox} style={props.style}>
      <input data-testid="checkbox" type="checkbox" checked={props.checked} onChange={props.onChange} />
      <span className={styles.checkMark} />
    </label>
  );
}

CheckBox.propTypes = {
  style: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

export default CheckBox;
