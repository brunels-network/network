
import PropTypes from "prop-types";
import React from "react";

import styles from "./ToggleButton.module.css";


class ToggleButton extends React.Component {

  render() {

    let emitToggled = null;

    if (this.props.emitToggled) {
      emitToggled = this.props.emitToggled;
    } else {
      emitToggled = () => null;
    }

    let toggled = this.props.toggled;

    if (toggled) {
      return (
        <div className={styles.toggled}
          onClick={() => { emitToggled(false) }} >
          {this.props.children}
        </div>);
    }
    else {
      return (
        <div className={styles.untoggled}
          onClick={() => { emitToggled(true) }} >
          {this.props.children}
        </div>);
    }
  }
}

ToggleButton.propTypes = {
  children: PropTypes.any.isRequired,
  emitToggled: PropTypes.func.isRequired,
  toggled: PropTypes.bool.isRequired,
};

export default ToggleButton;
