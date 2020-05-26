import React from "react";
import PropTypes from "prop-types";

import styles from "./BioPopover.module.css";

// The detection of outside clicks in this class taken from
// https://stackoverflow.com/a/42234988

class BioPopover extends React.Component {
  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.state = { isPopoverOpen: false, lastID: null };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.togglePopover(this.props.node);
    }
  }

  render() {
    // const isPopoverOpen = this.state.isPopoverOpen;
    const node = this.props.node;
    // The position of the popup
    const left = node.x + 10 + "px";
    const top = node.y - 10 + "px";

    return (
      <div ref={this.setWrapperRef}>
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
      </div>
    );
  }
}

BioPopover.propTypes = {
  node: PropTypes.object.isRequired,
  togglePopover: PropTypes.func.isRequired,
};

export default BioPopover;
