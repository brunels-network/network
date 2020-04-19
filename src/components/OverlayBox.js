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
              <Spinner name="ball-grid-pulse" color="green" fadeIn="none" />
            </div>
          </div>
        ) : null}
        <iframe
          src={url}
          title={url}
          width="100%"
          height="95%"
          onLoad={() => {
            this.hideSpinner();
          }}
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          sandbox="allow-scripts"
          position="absolute"
        />
      </div>
    );
  }
}

OverlayBox.propTypes = {
  item: PropTypes.elementType,
  emitClose: PropTypes.func.isRequired,
};
export default OverlayBox;
