import React from "react";
import PropTypes from "prop-types";

import DefaultButton from "./DefaultButton";

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

    // TODO - rework this ?
    // We want them in chronological order
    

    let output = projects.values().map((item) => {
      return (
        <DefaultButton
          key={item.getName()}
          style={{ position: "relative", maxWidth: "80%" }}
          onClick={() => this.setFilter(item)}
        >
          {item.getName()}
        </DefaultButton>
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
