import PropTypes from "prop-types";
import React from "react";

import Popover from "./Popover";
import ForceGraphD3 from "./d3/ForceGraph.d3.js";

import lodash from "lodash";

import styles from "./ForceGraph.module.css";


class ForceGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popoversVisible: false,
      popups: {},
    };

    this.updateSize = this.updateSize.bind(this);
    this.emitPopProps = this.emitPopProps.bind(this);
    this.clearPopups = this.clearPopups.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);

    this.containerRef = React.createRef();

    this.graph = new ForceGraphD3(this, props);
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateSize);
    this.updateSize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateSize);
  }

  componentDidUpdate() {
    this.graph.draw();
  }

  updateSize() {
    const containerRect = this.containerRef.current.getBoundingClientRect();

    if (this.containerRef && this.graph) {
      let width = Math.floor(0.99 * containerRect.width);
      let height = Math.floor(0.99 * containerRect.height);
      console.log(`${width}x${height}`);

      this.graph.update({
        width: width,
        height: height
      });
      this.graph.drawFromScratch();
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
            emitSetCenter={this.props.emitSetCenter}
          />
        );
        popups.push(p);
      }
    }

    return (
      <div ref={this.containerRef} className={styles.container}>
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
  indirectConnectionsVisible: PropTypes.bool.isRequired,
  emitSetCenter: PropTypes.func.isRequired,
};

export default ForceGraph;
