import React from "react";
import PropTypes from "prop-types";

import TextButton from "./TextButton";

import VBox from "./VBox";
import HBox from "./HBox";
import BigBox from "./BigBox";

import styles from "./Popover.module.css";


function _truncate(str) {
  const array = str.trim().split(".");
  return array[0] + "...";
}


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
    bio = _truncate(bio);
  }

  // Get the location of the click within the viewport so we can open the popover
  // in the correct location
  const innerWidth = window.innerWidth; // px
  const innerHeight = window.innerHeight; // px

  const popoverHeight = 340;
  const popoverWidth = 400;

  let left;
  if (node.x > innerWidth - popoverWidth) {
    left = node.x - popoverWidth;
  } else {
    left = node.x;
  }

  if (left < 10) {
    left = 10;
  }

  left = left + "px";

  let top;
  if (node.y > innerHeight - popoverHeight) {
    top = node.y - popoverHeight + 50;

    if (top < 50) { top = 50; }
  } else {
    top = node.y;
  }

  if (innerHeight < 350) {
    top = 20;
  }
  else if (top > innerHeight - 50 - popoverHeight) {
    top = innerHeight - 50 - popoverHeight;
  }

  top = top + "px";

  return (
    <div
      className={styles.popOver}
      style={{
        top: top, left: left,
        width: popoverWidth + "px"
        }}
    >
      <VBox>
        <HBox>
          <BigBox><div className={styles.header}>{name}</div></BigBox>
          <div className={styles.closeButton}>
            <button onClick={props.clearPopup}
                    style={{ background: "none", border: "none" }}>
              x
            </button>
          </div>
        </HBox>
        <BigBox>
          <div className={styles.bio}>{bio}</div>
        </BigBox>
        <HBox>
          {readMoreButton}
          <div>&nbsp;</div>
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
