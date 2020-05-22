import React from "react";
import ForceGraphD3 from "./d3/ForceGraph.d3.js";
import styles from "./ForceGraph.module.css";

import BioPopover from "./BioPopover";

import lodash from "lodash";

class ForceGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popoverVisible: false,
      currentNode: null,
    };

    // We want to add to the props so we need to clone the props
    // that are passed in as that object is read-only
    let tempProps = lodash.cloneDeep(props);

    this.updateSize = this.updateSize.bind(this);
    this.emitPopProps = this.emitPopProps.bind(this);
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

  emitPopProps(node) {
    this.setState({ currentNode: node, popoverVisible: !this.state.popoverVisible });
  }

  render() {
    let s = this.graph.className();

    let popover;
    if (this.state.popoverVisible) {
      popover = <BioPopover node={this.state.currentNode} />;
    } else {
      popover = null;
    }

    return (
      <div ref={(el) => (this.container = el)} style={{ width: "100%", height: "100%" }}>
        <div id={s} className={s}>
          {popover}
        </div>
      </div>
    );
  }
}

export default ForceGraph;
