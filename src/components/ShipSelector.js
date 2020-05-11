import React from "react";
import PropTypes from "prop-types";

import styles from "./ShipSelector.module.css";

class ShipSelector extends React.Component {
  constructor(props) {
    super(props);

    const projects = this.props.projects;

    // We want the graph to start with the GW selected
    const ssGW = projects.getByName("SS Great Western");
    this.props.shipFilter(ssGW);

    this.state = { lastShip: "SS Great Western" };
  }

  setFilter(item) {
    const shipName = item.getName();

    if (shipName === this.state.lastShip) {
      this.props.resetFilters();
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
