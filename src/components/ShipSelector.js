import React from "react";
import PropTypes from "prop-types";

import HBox from "./HBox";

import styles from "./ShipSelector.module.css";

class ShipSelector extends React.Component {
  constructor(props) {
    super(props);

    const projects = this.props.projects;

    /// There are three ships, get their IDs and put in chronological order
    const ssGW = projects.getByName("SS Great Western");
    const ssGB = projects.getByName("SS Great Britain");
    const ssGE = projects.getByName("SS Great Eastern");

    this.state = {
      ships: [ssGW, ssGB, ssGE ],
      current: 0
    }

    // We want the graph to start with the GW selected
    this.props.emitSetShip(ssGW);
  }

  slotNextShip() {
    let current = this.state.current;
    let ships = this.state.ships;

    if (current === ships.length - 1) {
      current = 0;
    }
    else {
      current += 1;
    }

    this.setState({ current: current });
    this.props.emitSetShip(ships[current]);
  }

  slotPreviousShip() {
    let current = this.state.current;
    let ships = this.state.ships;

    if (current === 0) {
      current = ships.length - 1;
    }
    else {
      current -= 1;
    }

    this.setState({ current: current });
    this.props.emitSetShip(ships[current]);
  }

  render() {

    let current = this.state.current;
    let ship = this.state.ships[current];

    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <HBox>
            <button
              className={styles.arrow_button}
              onClick={()=>{this.slotPreviousShip()}}>
             &laquo;&nbsp;
            </button>
            <button
              className={styles.ship_button}
              onClick={() => { this.props.emitShowShip(ship) }}>
              {ship.getName()}
            </button>
            <button
              className={styles.arrow_button}
              onClick={() => { this.slotNextShip() }}>
                &nbsp;&raquo;
            </button>
          </HBox>
        </div>
      </div>
    );
  }
}

ShipSelector.propTypes = {
  projects: PropTypes.object.isRequired,
  emitSetShip: PropTypes.func.isRequired,
  emitShowShip: PropTypes.func.isRequired,
};

export default ShipSelector;
