import PropTypes from "prop-types";
import React from "react";

import TextButton from "./TextButton";
import VBox from "./VBox";
import moment from "moment";

import styles from "./MainMenu.module.css";

const saveSvgAsPng = require("save-svg-as-png");

class MainMenu extends React.Component {
  constructor(props) {
    super(props);

    this.wrapperRef = React.createRef();
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.close();
      event.stopPropagation();
    }
  }

  render() {
    let unconnectedNodesText = this.props.unconnectedNodesVisible ? "Hide" : "Show";
    let ncEngineersText = this.props.ncEngineersVisible ? "Hide" : "Show";
    let filterEngineersText = this.props.engineersFiltered ? "Remove engineer filter" : "Filter by engineers";
    let filterCommercialText = this.props.commercialFiltered ? "Remove commercial filter" : "Filter by commercial";

    return (
      <div data-testid="AnalysisPanel" ref={this.setWrapperRef} className={styles.panel}>
        <VBox>
          <div className={styles.titleText}>Menu</div>
          <TextButton
            onClick={() => {
              this.props.emitToggleFilterEngineering();
            }}
          >
            {filterEngineersText}
          </TextButton>
          <TextButton
            onClick={() => {
              this.props.emitToggleFilterCommercial();
            }}
          >
            {filterCommercialText}
          </TextButton>
          <TextButton
            onClick={() => {
              this.props.emitToggleUnconnectedNodesVisible();
            }}
          >
            {unconnectedNodesText + " unconnected nodes"}
          </TextButton>
          <TextButton
            onClick={() => {
              this.props.emitToggleNCEngineersVisible();
            }}
          >
            {ncEngineersText + " non-contributing engineers"}
          </TextButton>
          <TextButton
            onClick={() => {
              this.props.emitResetFilters();
            }}
          >
            Reset filters
          </TextButton>

          <TextButton
            onClick={() => {
              const imageOptions = {
                scale: 1,
                encoderOptions: 1,
                backgroundColor: "#222222",
              };

              const filename = "BrunelsNetwork-" + moment().format("YYYYMMDD-hhmmss") + ".png";

              saveSvgAsPng.saveSvgAsPng(document.getElementById("svg-viz"), filename, imageOptions);
            }}
          >
            Save as image
          </TextButton>
          <TextButton
            onClick={() => {
              this.props.close();
            }}
          >
            Close
          </TextButton>
        </VBox>
      </div>
    );
  }
}

MainMenu.propTypes = {
  close: PropTypes.func.isRequired,
  unconnectedNodesVisible: PropTypes.bool.isRequired,
  ncEngineersVisible: PropTypes.bool.isRequired,
  engineersFiltered: PropTypes.bool.isRequired,
  commercialFiltered: PropTypes.bool.isRequired,
  emitResetFilters: PropTypes.func.isRequired,
  emitToggleFilterCommercial: PropTypes.func.isRequired,
  emitToggleFilterEngineering: PropTypes.func.isRequired,
  emitToggleUnconnectedNodesVisible: PropTypes.func.isRequired,
  emitToggleNCEngineersVisible: PropTypes.func.isRequired,
};

export default MainMenu;
