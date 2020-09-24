
import React from "react";
import PropTypes from "prop-types";

import VBox from "./VBox";

import styles from "./LabelButton.module.css";


function LabelButton(props) {

    let onClick = null;

    if (props.onClick) {
      onClick = props.onClick;
    } else {
      onClick = () => { console.log("NULL");};
    }

    return (
        <VBox>
            <button
              className={styles.label}
              onClick={onClick}
            >
              {props.label}
            </button>
            <button
              className={styles.button}
              onClick={onClick}
            >
              {props.button}
            </button>
        </VBox>
    );
}


LabelButton.propTypes = {
    button: PropTypes.any,
    label: PropTypes.any,
    onClick: PropTypes.func
  };

export default LabelButton;
