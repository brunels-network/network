import PropTypes from "prop-types";
import React from "react";
import ForceGraph from "./ForceGraph";

class SocialGraph extends React.Component {
  getGraph() {
    const social = this.props.social;

    if (social) {
      return social.getGraph();
    }
    return null;
  }

  getNetwork() {
    const social = this.props.social;

    if (social) {
      return social.getNetwork();
    }
    return null;
  }

  render() {
    if (this.props.social) {
      return (
        <div style={{ width: "100%", height: "100%" }}>
          <ForceGraph
            social={this.props.social}
            signalClicked={this.props.emitClicked}
            highlighted={this.props.highlighted}
            selected={this.props.selected}
            wobble={this.props.wobble}
          />
        </div>
      );
    } else {
      return <div>No data to display!!!</div>;
    }
  }
}

SocialGraph.propTypes = {
  emitClicked: PropTypes.func.isRequired,
  highlighted: PropTypes.func,
  selected: PropTypes.func,
  social: PropTypes.object.isRequired,
  wobble: PropTypes.bool.isRequired
}

export default SocialGraph;
