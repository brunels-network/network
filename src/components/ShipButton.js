
import React from "react";
import PropTypes from "prop-types";

import VBox from "./VBox";

import styles from "./ShipButton.module.css";


function ShipButton(props) {
    return (
        <VBox>
            <button
                href="#" className={styles.button}
                onClick={() => props.emitSetShip(props.ship)}>
                {props.ship.getName()}
            </button>
            <button
                href="#" className={styles.info_button}
                onClick={() => { props.emitShowShip(props.ship) }}>
                View Info
            </button>
        </VBox>
        );
}

ShipButton.propTypes = {
    ship: PropTypes.any.isRequired,
    emitSetShip: PropTypes.func.isRequired,
    emitShowShip: PropTypes.func.isRequired,
  };


export default ShipButton;
