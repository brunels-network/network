import PropTypes from "prop-types";
import React from "react";
import { CSSTransition } from "react-transition-group";

import styles from "./SlidingPanel.module.css";
import SlideFromLeft from "./transitions/SlideFromLeft.module.css";
import SlideFromRight from "./transitions/SlideFromRight.module.css";
import SlideFromBottom from "./transitions/SlideFromBottom.module.css";
import SlideFromTop from "./transitions/SlideFromTop.module.css";

class SlidingPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      position: "right",
      defaultSize: "40%",
      minSize: "300px",
      maxSize: null,
    };
  }

  render() {
    let container = styles.rightContainer;
    let transition = SlideFromRight;

    let size = this.props.size;

    let horiz_size = { width: size };
    let vert_size = { height: size };

    if (!size) {
      horiz_size = { width: this.state.defaultSize, minSize: this.state.minSize };
      vert_size = { height: this.state.defaultSize, minSize: this.state.minSize };
    }

    if (this.props.maxSize) {
      horiz_size.maxWidth = this.props.maxSize;
      vert_size.maxHeight = this.props.maxSize;
    }

    let style = horiz_size;
    // Get the passed in position
    let position = this.props.position;

    if (position === "right") {
      container = styles.rightContainer;
      transition = SlideFromRight;
    } else if (position === "bottom") {
      container = styles.bottomContainer;
      transition = SlideFromBottom;
      style = vert_size;
    } else if (position === "top") {
      container = styles.topContainer;
      transition = SlideFromTop;
      style = vert_size;
    } else if (position === "left") {
      container = styles.leftContainer;
      transition = SlideFromLeft;
    }

    container = `${container} ${styles.container}`;

    return (
      <CSSTransition in={this.props.isOpen} timeout={200} classNames={transition} unmountOnExit>
        <div className={container} style={style}>
          {this.props.children}
        </div>
      </CSSTransition>
    );
  }
}

SlidingPanel.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  isOpen: PropTypes.bool,
  maxSize: PropTypes.string,
  minSize: PropTypes.string,
  position: PropTypes.string,
  size: PropTypes.string,
};

export default SlidingPanel;
