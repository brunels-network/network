import React from "react";
import PropTypes from "prop-types";

import ShipButton from "./ShipButton";

import HBox from "./HBox";

import styles from "./ShipSelector.module.css";

class ShipSelector extends React.Component {
  constructor(props) {
    super(props);

    const projects = this.props.projects;

    // We want the graph to start with the GW selected
    const ssGW = projects.getByName("SS Great Western");
    this.props.emitSetShip(ssGW);

    this.state = { lastShip: ssGW.getName() };
  }

  setFilter(item) {
    const shipName = item.getName();

    if (shipName === this.state.lastShip) {
      return;
    }

    this.setState({ lastShip: shipName });
    this.props.emitSetShip(item);
  }

  render() {
    let projects = this.props.projects;

    let output = projects.values().map((item) => {
      return (
        <ShipButton
          key={item.getName()}
          ship={item}
          emitSetShip={(item) => { this.setFilter(item) }}
          emitShowShip={this.props.emitShowShip}
        />
      );
    });

    return (
      <HBox>{output}</HBox>
    );
  }
}

ShipSelector.propTypes = {
  projects: PropTypes.object.isRequired,
  emitSetShip: PropTypes.func.isRequired,
  emitShowShip: PropTypes.func.isRequired,
};

export default ShipSelector;
