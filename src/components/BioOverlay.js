import PropTypes from "prop-types";
import React from "react";

import styles from "./BioOverlay.module.css";

class BioOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isVisible: false };
  }

  render() {
    // const sources = this.props.sources;
    const person = this.props.person;

    return <div className={styles.body}>{person.getName()}</div>;
  }
}

BioOverlay.propTypes = {
  sources: PropTypes.object.isRequired,
  sourceIDs: PropTypes.array.isRequired,
  toggleOverlay: PropTypes.func.isRequired,
  person: PropTypes.object.isRequired,
};

export default BioOverlay;
