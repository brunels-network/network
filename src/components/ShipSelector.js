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
    this.props.shipFilter(ssGW);

    this.state = { lastShip: ssGW.getName() };
  }

  setFilter(item) {
    const shipName = item.getName();

    if (shipName === this.state.lastShip) {
      return;
    }

    this.setState({ lastShip: shipName });
    this.props.shipFilter(item);
  }

  render() {
    let projects = this.props.projects;

    let output = projects.values().map((item) => {
      return (<ShipButton
                key={item.getName()}
                ship={item}
                setShip={(item) => { this.setFilter(item) }}/>
      );
    });

    return (
      <HBox>{output}</HBox>
    );
  }
}

ShipSelector.propTypes = {
  projects: PropTypes.object.isRequired,
  shipFilter: PropTypes.func.isRequired,
};

export default ShipSelector;
