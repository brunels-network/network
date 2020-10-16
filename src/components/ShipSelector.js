import React from "react";
import PropTypes from "prop-types";

import HBox from "./HBox";

import styles from "./ShipSelector.module.css";
import { startsWith } from "lodash";

function ShipButton(props) {
  let name = props.ship.getName();

  name = name.replace("SS ", "");

  let style = styles.ship_button;
  let func = props.emitSetShip;

  if (props.selected) {
    style = styles.ship_button_selected;
    func = props.emitShowShip;
  }

  return (
    <button
      className={style}
      href="#"
      onClick={()=>{func(props.ship)}}
    >
      {name}
    </button>);
}

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
      current: ssGW,
    }

    // We want the graph to start with the GW selected
    this.props.emitSetShip(ssGW);
  }

  slotSetShip(ship) {
    this.setState({ current: ship });
    this.props.emitSetShip(ship);
  }

  render() {

    let buttons = [];

    this.state.ships.forEach((ship) => {
      buttons.push(
        <ShipButton
          key={ship}
          ship={ship}
          emitSetShip={(s) => { this.slotSetShip(s) }}
          emitShowShip={this.props.emitShowShip}
          selected={ship === this.state.current}
        />);
    });


    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <HBox>
            {buttons}
          </HBox>
        </div>
      </div>
    );
  }
}

ShipButton.propTypes = {
  ship: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  emitSetShip: PropTypes.func.isRequired,
  emitShowShip: PropTypes.func.isRequired,
};

ShipSelector.propTypes = {
  projects: PropTypes.object.isRequired,
  emitSetShip: PropTypes.func.isRequired,
  emitShowShip: PropTypes.func.isRequired,
};

export default ShipSelector;
