import React from "react";
import PropTypes from "prop-types";

import TextButton from "./TextButton";

import styles from "./Popover.module.css";

import tempImage from "../images/Great_Western_maiden_voyage.jpg";
import OverlayWrapper from "./OverlayWrapper";

// The detection of outside clicks in this class taken from
// https://stackoverflow.com/a/42234988

class Popover extends React.Component {
  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.toggleSourceOverlay = this.toggleSourceOverlay.bind(this);
    this.toggleBioOverlay = this.toggleBioOverlay.bind(this);

    this.toggleOverlay = this.toggleOverlay.bind(this);

    this.state = { isOverlayOpen: false };
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
      this.props.clearPopups();
    }
  }

  toggleOverlay() {
    this.setState({ isOverlayOpen: !this.state.isOverlayOpen });
    this.props.clearPopups();
  }

  toggleSourceOverlay() {
    this.setState({ isOverlayOpen: true, isSourceOverlayOpen: true, isBioOverlayOpen: false });
  }

  toggleBioOverlay() {
    this.setState({ isOverlayOpen: true, isSourceOverlayOpen: false, isBioOverlayOpen: true });
  }

  truncate(str, max = 10) {
    const array = str.trim().split(" ");

    let ellipsis;
    if (array.length > max) {
      ellipsis = "...";
      //   this.setState({ readMoreEnabled: true });
    } else {
      ellipsis = "";
    }

    return array.slice(0, max).join(" ") + ellipsis;
  }

  render() {
    const node = this.props.node;
    const selectedShipID = this.props.selectedShipID;

    const name = node.label;
    const social = this.props.social;
    const socialSources = social.getSources();

    let readMoreButton = (
      <TextButton
        textColor="#9B1C31"
        hoverColor="#808080"
        fontSize="1.5vh"
        padding="0px 2px 2px 2px"
        fontFamily="Playfair Display Medium"
        onClick={this.toggleBioOverlay}
      >
        Read more
      </TextButton>
    );

    const buttonStrings = [];

    let nodeType = node["type"];

    let entity;
    if (nodeType === "person") {
      entity = this.props.social.getPeople().get(node.id);
    } else if (nodeType === "business") {
      entity = this.props.social.getBusinesses().get(node.id);
    } else {
      throw new TypeError("Incorrect type or no type on node");
    }

    const sourceIDs = entity.getSources()[selectedShipID];

    let sourceButtonText = "";
    if (!sourceIDs) {
      console.error("Cannot find sources for this project : ", selectedShipID, "\n Sources : ", socialSources);
    } else {
      for (const id of sourceIDs) {
        buttonStrings.push(socialSources.get(id).getName());
      }
    }

    sourceButtonText = buttonStrings.join(", ");

    // Get biography for node
    let bio = social.getBiographies().getByID(node.id);
    bio = bio.replace(name + ".  ", "");

    bio = this.truncate(bio, 40);

    // Get the location of the click within the viewport so we can open the popover
    // in the correct location
    const innerWidth = window.innerWidth; // px
    const innerHeight = window.innerHeight; // px

    const popoverHeightVH = 30; // vh
    const popoverWidthVW = 15; // vw

    const popoverHeight = innerHeight * (popoverHeightVH / 100); // px
    const popoverWidth = innerWidth * (popoverWidthVW / 100); // px

    let left;
    if (node.x > innerWidth - popoverWidth) {
      left = node.x - 20 - popoverWidth + "px";
    } else {
      left = node.x + 10 + "px";
    }

    let top;
    if (node.y > innerHeight - popoverHeight) {
      top = node.y - 10 - popoverHeight + "px";
    } else {
      top = node.y + "px";
    }

    return (
      <div ref={this.setWrapperRef}>
        <div
          className={styles.popOver}
          style={{ top: top, left: left, height: popoverHeightVH + "vh", width: popoverWidthVW + "vw" }}
        >
          <div className={styles.closeButton}>
            <button onClick={this.props.clearPopups} style={{ background: "none", border: "none", fontSize: "2vh" }}>
              x
            </button>
          </div>
          <div className={styles.header}>{name}</div>
          <div className={styles.bioSection}>{bio}</div>
          <div className={styles.readMore}>{readMoreButton}</div>
          <div className={styles.sourceHeader}>Sources</div>
          <div className={styles.sourceSection}>
            <TextButton
              textColor="black"
              hoverColor="#808080"
              fontSize="1.5vh"
              padding="0px 4px 4px 4px"
              onClick={this.toggleSourceOverlay}
            >
              {sourceButtonText}
            </TextButton>
            <div className={styles.edgeCount}>Number of connections: {node["edge_count"]["selectedShipID"]}</div>
          </div>
        </div>
        <OverlayWrapper
          isBioOverlayOpen={this.state.isBioOverlayOpen}
          isOverlayOpen={this.state.isOverlayOpen}
          isSourceOverlayOpen={this.state.isSourceOverlayOpen}
          toggleOverlay={this.toggleOverlay}
          toggleBioOverlay={this.toggleBioOverlay}
          toggleSourceOverlay={this.toggleSourceOverlay}
          node={node}
          social={social}
          entity={entity}
          sourceButtonText={sourceButtonText}
          sourceIDs={sourceIDs}
        />
      </div>
    );
  }
}

Popover.propTypes = {
  social: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
  togglePopover: PropTypes.func.isRequired,
  selectedShipID: PropTypes.string,
  clearPopups: PropTypes.func.isRequired,
};

export default Popover;
