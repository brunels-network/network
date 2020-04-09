import React from "react";

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
      return;
    }

    this.state.lastShip = shipName;
    this.props.shipFilter(item);
  }

  render() {
    let projects = this.props.projects;

    let output = projects.values().map((item) => {
      return (
        <DefaultButton
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

export default ShipSelector;
