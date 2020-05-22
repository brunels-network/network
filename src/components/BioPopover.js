import React from "react";
import PropTypes from "prop-types";

import styles from "./BioPopover.module.css";

class BioPopover extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isPopoverOpen: false, lastID: null };
  }
  render() {
    // const isPopoverOpen = this.state.isPopoverOpen;
    const node = this.props.node;

    console.log(node.x, node.y);

    const left = node.x + 10 + "px";
    const top = node.y - 10 + "px";

    return (
      <div
        id="popover"
        className={styles.tooltipContainer}
        style={{
          top: top,
          left: left,
        }}
      >
        {node.label}
        <br />
      </div>
    );
  }
}

BioPopover.propTypes = {
  bio: PropTypes.any,
  location: PropTypes.any,
  node: PropTypes.any,
};

export default BioPopover;
