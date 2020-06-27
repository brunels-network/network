import PropTypes from "prop-types";
import React from "react";

import TextButton from "./TextButton";
import styles from "./AnalysisPanel.module.css";

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
    let physicsText = this.props.physicsEnabled ? "Disable " : "Enable ";

    let filterEngineersText = this.props.engineersFiltered ? "Remove engineer filter" : "Filter by engineers";
    let filterInvestorsText = this.props.investorsFiltered ? "Remove investor filter" : "Filter by investors";

    return (
      <div ref={this.setWrapperRef} className={styles.wholePanel}>
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
          fontSize="2.4vh"
          padding={buttonPadding}
          onClick={() => {
            this.props.filterInvestorNodes();
            // this.props.togglePanel();
          }}
        >
          {filterInvestorsText}
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
          fontSize="2.4vh"
          padding={buttonPadding}
          onClick={() => {
            this.props.togglePhysicsEnabled();
            // this.props.togglePanel();
          }}
        >
          {physicsText + "physics"}
        </TextButton>

        <TextButton
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
            this.props.saveAsImage();
          }}
        >
          Save as image
        </TextButton>
        <div className={styles.verticalSpace}></div>
        <TextButton
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
  toggleOptionsOverlay: PropTypes.func,
  togglePanel: PropTypes.func,
  toggleSearchOverlay: PropTypes.func,
  toggleUnconnectedNodesVisible: PropTypes.func.isRequired,
  closeOverlay: PropTypes.func.isRequired,
  toggleindirectConnectionsVisible: PropTypes.func.isRequired,
  indirectConnectionsVisible: PropTypes.bool.isRequired,
  filterEngineeringNodes: PropTypes.func.isRequired,
  filterInvestorNodes: PropTypes.func.isRequired,
  engineersFiltered: PropTypes.bool.isRequired,
  investorsFiltered: PropTypes.bool.isRequired,
  saveAsImage: PropTypes.func.isRequired,
  unconnectedNodesVisible: PropTypes.bool.isRequired,
  physicsEnabled: PropTypes.bool.isRequired,
  togglePhysicsEnabled: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired,
};

export default AnalysisPanel;
