import PropTypes from "prop-types";
import React from "react";

import TextButton from "./TextButton";
import styles from "./AnalysisPanel.module.css";

import moment from "moment";
const saveSvgAsPng = require("save-svg-as-png");

class AnalysisPanel extends React.Component {
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
      this.props.togglePanel();
    }
  }

  render() {
    const buttonPadding = "1vh 1vw 1vh 1vw";

    let indirectConnectionsText = this.props.indirectConnectionsVisible ? "Hide" : "Show";
    let unconnectedNodesText = this.props.unconnectedNodesVisible ? "Hide" : "Show";

    let filterEngineersText = this.props.engineersFiltered ? "Remove engineer filter" : "Filter by engineers";
    let filterCommercialText = this.props.commercialFiltered ? "Remove commercial filter" : "Filter by commercial";

    return (
      <div data-testid="AnalysisPanel" ref={this.setWrapperRef} className={styles.wholePanel}>
        <div className={styles.verticalSpaceTitle}></div>
        <div className={styles.titleText}>Analysis</div>
        <div className={styles.verticalSpace}></div>
        <TextButton
          fontSize="2.4vh"
          padding={buttonPadding}
          onClick={() => {
            this.props.filterEngineeringNodes();
            // this.props.togglePanel();
          }}
        >
          {filterEngineersText}
        </TextButton>
        <TextButton
          data-testid="timelineButton"
          fontSize="2.4vh"
          padding={buttonPadding}
          onClick={() => {
            this.props.filterCommercialNodes();
            // this.props.togglePanel();
          }}
        >
          {filterCommercialText}
        </TextButton>
        <TextButton
          fontSize="2.4vh"
          padding={buttonPadding}
          onClick={() => {
            this.props.toggleindirectConnectionsVisible();
            // this.props.togglePanel();
          }}
        >
          {indirectConnectionsText + " indirect connections"}
        </TextButton>
        <TextButton
          fontSize="2.4vh"
          padding={buttonPadding}
          onClick={() => {
            this.props.toggleUnconnectedNodesVisible();
            // this.props.togglePanel();
          }}
        >
          {unconnectedNodesText + " unconnected nodes"}
        </TextButton>
        <TextButton
          data-testid="OptionsButton"
          fontSize="2.4vh"
          padding={buttonPadding}
          onClick={() => {
            this.props.resetFilters();
            // this.props.togglePanel();
          }}
        >
          Reset filters
        </TextButton>

        <TextButton
          fontSize="2.4vh"
          padding={buttonPadding}
          onClick={() => {
            this.props.toggleSearchOverlay();
            this.props.togglePanel();
          }}
        >
          Search
        </TextButton>
        <TextButton
          fontSize="2.4vh"
          padding={buttonPadding}
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
        <div className={styles.verticalSpace}></div>
        <TextButton
          data-testid="closeButton"
          fontSize="2.4vh"
          textColor="#222"
          hoverColor="white"
          padding={buttonPadding}
          onClick={() => {
            this.props.togglePanel();
          }}
        >
          Close
        </TextButton>
      </div>
    );
  }
}

AnalysisPanel.propTypes = {
  toggleFilterPanel: PropTypes.func,
  togglePanel: PropTypes.func,
  toggleSearchOverlay: PropTypes.func,
  toggleUnconnectedNodesVisible: PropTypes.func.isRequired,
  closeOverlay: PropTypes.func.isRequired,
  toggleindirectConnectionsVisible: PropTypes.func.isRequired,
  indirectConnectionsVisible: PropTypes.bool.isRequired,
  filterEngineeringNodes: PropTypes.func.isRequired,
  filterCommercialNodes: PropTypes.func.isRequired,
  engineersFiltered: PropTypes.bool.isRequired,
  commercialFiltered: PropTypes.bool.isRequired,
  unconnectedNodesVisible: PropTypes.bool.isRequired,
  resetFilters: PropTypes.func.isRequired,
};

export default AnalysisPanel;
