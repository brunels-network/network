import PropTypes from "prop-types";
import React from "react";

import Popover from "./Popover";
import ForceGraphD3 from "./d3/ForceGraph.d3.js";

import lodash from "lodash";

class ForceGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popoversVisible: false,
      popups: {},
    };

    // We want to add to the props so we need to clone the props
    // that are passed in as that object is read-only
    let tempProps = lodash.cloneDeep(props);

    this.updateSize = this.updateSize.bind(this);
    this.emitPopProps = this.emitPopProps.bind(this);
    this.clearPopups = this.clearPopups.bind(this);

    // TODO - look up better way of doing this
    // Bring this into the class above it?
    // This feels very clunky
    tempProps["emitPopProps"] = this.emitPopProps;
    this.graph = new ForceGraphD3(tempProps);
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateSize);
    this.updateSize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateSize);
  }

  componentDidUpdate() {
    this.graph.update(this.props);
    this.graph.draw();
  }

  updateSize() {
    if (this.container && this.graph) {
      this.graph.update({
        width: this.container.offsetWidth,
        height: this.container.offsetHeight,
      });
      this.graph.draw();
    }
  }

  // Used for multiple popups
  updatePopupState(id, node) {
    this.setState((prevState) => {
      let popups = Object.assign({}, prevState.popups);
      popups[id] = node;
      return { popups: popups };
    });
  }

  emitPopProps(node) {
    // this.clearPopups();
    this.setState({ popups: { id: node } });

    // Keep code for multiple popups
    // if (this.state.popups[id]) {
    //   this.updatePopupState(id, false);
    // } else {
    //   this.updatePopupState(id, node);
    // }
  }

  clearPopups() {
    this.setState({ popups: {} });
  }

  render() {
    let s = this.graph.className();

    let popups = [];

    for (let [id, node] of Object.entries(this.state.popups)) {
      if (node !== false) {
        let p = (
          <Popover
            key={id}
            togglePopover={this.emitPopProps}
            node={node}
            social={this.props.social}
            selectedShipID={this.props.selectedShipID}
            clearPopups={this.clearPopups}
          />
        );
        popups.push(p);
      }
    }

    if (!this.props.physicsEnabled) {
      this.graph.slowPhysics();
    } else {
      this.graph.fastPhysics();
    }

    return (
      <div ref={(el) => (this.container = el)} style={{ width: "100%", height: "100%" }}>
        <div id={s} className={s}>
          {popups}
        </div>
      </div>
    );
  }
}

ForceGraph.propTypes = {
  social: PropTypes.object.isRequired,
  selectedShipID: PropTypes.string,
  indirectLinksVisible: PropTypes.bool.isRequired,
  physicsEnabled: PropTypes.bool.isRequired,
  unconnectedNodesVisible: PropTypes.bool.isRequired,
};

export default ForceGraph;
