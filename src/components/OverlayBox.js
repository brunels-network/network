import React from "react";
import Spinner from "react-spinkit";
import PropTypes from "prop-types";

import styles from "./OverlayBox.module.css";

class OverlayBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  hideSpinner() {
    this.setState({
      loading: false,
    });
  }

  render() {
    let item = this.props.item;
    let url = null;

    if (item && item.getURL) {
      url = item.getURL();
    }

    if (!url) {
      return (
        <div className={styles.container}>
          <div className={styles.centerContainer}>
            {item}
            <div>
              <button className={styles.button} onClick={this.props.emitClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <div className={styles.url}>{url}</div>
        {this.state.loading ? (
          <div className={styles.centerContainer}>
            <div>Loading page...</div>
            <div>
              <Spinner name="ball-grid-pulse" color="#003366" fadeIn="none" />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

OverlayBox.propTypes = {
  item: PropTypes.elementType,
  emitClose: PropTypes.func.isRequired,
};
export default OverlayBox;
