
import React from "react";
import PropTypes from "prop-types";

import VBox from "./VBox";

import styles from "./ShipButton.module.css";


function ShipButton(props) {
    return (
        <VBox>
            <button
                href="#" className={styles.button}
                onClick={() => props.setShip(props.ship)}>
                {props.ship.getName()}
            </button>
            <button
                href="#" className={styles.info_button}
                onClick={() => { console.log("SHOW INFO") }}>
                View Info
            </button>
        </VBox>
        );
}

ShipButton.propTypes = {
    ship: PropTypes.any,
    setShip: PropTypes.func,
  };


export default ShipButton;
