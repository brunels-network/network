
import PropTypes from "prop-types";
import React from "react";

import styles from "./TextButton.module.css";


class TextButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    let onClick = null;

    if (this.props.onClick) {
      onClick = this.props.onClick;
    } else {
      onClick = () => null;
    }

    return (
      <button className={styles.button} onClick={onClick}>
        {this.props.children}
      </button>
    );
  }
}

TextButton.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
};

export default TextButton;
