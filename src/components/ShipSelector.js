import React from "react";
import PropTypes from "prop-types";

import styles from "./ShipSelector.module.css"

class ShipSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = { lastShip: "" };
  }

  setFilter(item) {
    // First check if the ship is the same as the last one clicked
    const shipName = item.getName();

    if (shipName === this.state.lastShip) {
      this.props.resetFilters();
      // Allows the ship to be selected again
      this.setState({ lastShip: "" });
      return;
    }

    this.setState({ lastShip: shipName });
    this.props.shipFilter(item);
  }

  render() {
    let projects = this.props.projects;

    let output = projects.values().map((item, index) => {
      return (
        <button href="#" key={index} className={styles.button} onClick={() => this.setFilter(item)}>
          {item.getName()}
        </button>
      );
    });

    return output;
  }
}

ShipSelector.propTypes = {
  projects: PropTypes.object.isRequired,
  resetFilters: PropTypes.func.isRequired,
  shipFilter: PropTypes.func.isRequired,
};

export default ShipSelector;
