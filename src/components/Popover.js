import React from "react";
import PropTypes from "prop-types";

import TextButton from "./TextButton";

import VBox from "./VBox";
import HBox from "./HBox";
import BigBox from "./BigBox";

import styles from "./Popover.module.css";

function Popover(props) {
  const node = props.node;

  const name = node.label;
  const social = props.social;

  let readMoreButton = null;

  if (props.emitReadMore) {
    readMoreButton = (
      <TextButton
        onClick={() => {
          props.clearPopup();
          props.emitReadMore(node.id);
        }}
      >
        Read more
      </TextButton>
    );
  }

  let centerButton = null;

  if (props.emitSetCenter) {
    if (social.isAnchor(node.id)) {
      centerButton = (
        <TextButton
          onClick={() => {
            props.clearPopup();
            props.emitSetCenter(null);
          }}
        >
          Clear center
        </TextButton>
      );
    }
    else {
      centerButton = (
        <TextButton
          onClick={() => {
            props.clearPopup();
            props.emitSetCenter(node.id);
          }}
        >
          Make center
        </TextButton>
      );
    }
  }

  // Get biography for node
  let bio = social.getBiographies().getByID(node.id);

  if (!bio) {
    bio = "No biography found.";
  } else {
    bio = bio.replace(name + ".  ", "");
  }

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
    <div
      className={styles.popOver}
      style={{
        top: top, left: left,
        height: popoverHeightVH + "vh", width: popoverWidthVW + "vw"
        }}
    >
      <div className={styles.closeButton}>
        <button onClick={props.clearPopup}
          style={{ background: "none", border: "none", fontSize: "2vh" }}>
              x
        </button>
      </div>
      <VBox>
        <div className={styles.header}>{name}</div>
        <BigBox>
          <div className={styles.bioSection}>{bio}</div>
        </BigBox>
        <HBox>
          {readMoreButton}
          {centerButton}
        </HBox>
      </VBox>
    </div>
  );
}

Popover.propTypes = {
  social: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
  clearPopup: PropTypes.func.isRequired,
  emitSetCenter: PropTypes.func.isRequired,
  emitReadMore: PropTypes.func.isRequired,
};

export default Popover;
