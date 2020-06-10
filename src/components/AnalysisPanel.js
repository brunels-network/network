import PropTypes from "prop-types";
import React from "react";
import { CSSTransition } from "react-transition-group";

import TextButton from "./TextButton";
import styles from "./AnalysisPanel.module.css";

import optionsTransitions from "./transitions/optionsTransitions.module.css";

class AnalysisPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = { optionsOpen: false };
  }

  toggleOptions() {
    this.setState({ optionsOpen: !this.state.optionsOpen });
  }
  render() {
    const buttonPadding = "1vh 1vw 1vh 1vw";

    let indirectConnectionsText = this.props.indirectConnectionsVisible ? "Hide" : "Show";

    let unconnectedNodesText = this.props.hideUnconnectedNodes ? "Show" : "Hide";

    let optionsButtons = null;
    if (this.state.optionsOpen) {
      optionsButtons = (
        <div className={styles.optionButtons}>
          <TextButton
            fontSize="2.1vh"
            padding={buttonPadding}
            onClick={() => {
              this.props.toggleindirectConnectionsVisible();
              // this.props.togglePanel();
            }}
          >
            {indirectConnectionsText + " indirect connections"}
          </TextButton>
          <TextButton
            fontSize="2.1vh"
            padding={buttonPadding}
            onClick={() => {
              this.props.toggleUnconnectedNodesVisible();
              // this.props.togglePanel();
            }}
          >
            {unconnectedNodesText + " unconnected nodes"}
          </TextButton>
        </div>
      );
    }

    return (
      <div className={styles.wholePanel}>
        <div className={styles.verticalSpaceTitle}></div>
        <div className={styles.titleText}>Analysis</div>
        <div className={styles.verticalSpace}></div>
        <TextButton
          padding={buttonPadding}
          onClick={() => {
            this.props.togglePanel();
          }}
        >
          About
        </TextButton>
        <TextButton
          fontSize="2.4vh"
          padding={buttonPadding}
          onClick={() => {
            this.props.togglePanel();
          }}
        >
          Filter by Engineers
        </TextButton>
        <TextButton
          fontSize="2.4vh"
          padding={buttonPadding}
          onClick={() => {
            this.props.togglePanel();
          }}
        >
          Filter by Investors
        </TextButton>

        <TextButton
          padding={buttonPadding}
          onClick={() => {
            this.props.toggleSearchOverlay();
            this.props.togglePanel();
          }}
        >
          Search
        </TextButton>
        <TextButton
          padding={buttonPadding}
          onClick={() => {
            this.props.toggleFilterPanel();
            this.props.togglePanel();
          }}
        >
          Filters
        </TextButton>
        {/* // Remove timeline for now */}
        {/* <TextButton
          padding={buttonPadding}
          onClick={() => {
            this.props.toggleTimeLinePanel();
            this.props.togglePanel();
          }}
        >
          Timeline
        </TextButton> */}
        <TextButton
          padding={buttonPadding}
          className={styles.button}
          onClick={() => {
            this.toggleOptions();
          }}
        >
          Options
        </TextButton>
        <CSSTransition in={this.state.optionsOpen} timeout={300} classNames={optionsTransitions} unmountOnExit>
          <div>{optionsButtons}</div>
        </CSSTransition>
        <div className={styles.verticalSpace}></div>
        <TextButton
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
  toggleindirectConnectionsVisible: PropTypes.func.isRequired,
  indirectConnectionsVisible: PropTypes.bool.isRequired,
  hideUnconnectedNodes: PropTypes.bool.isRequired,
};

export default AnalysisPanel;
