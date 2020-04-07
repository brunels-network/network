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
          />
        </div>
      );
    } else {
      return <div>No data to display!!!</div>;
    }
  }
}

export default SocialGraph;
