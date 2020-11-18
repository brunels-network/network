import PropTypes from "prop-types";
import React from "react";

import styles from "./WarningOverlay.module.css";

function WarningOverlay(props) {
  return (
    <div className={styles.container} onClick={props.close}>
      <div className={styles.content}>
        {props.children}
      </div>
    </div>
  );
}

WarningOverlay.propTypes = {
  close: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
};

export default WarningOverlay;
