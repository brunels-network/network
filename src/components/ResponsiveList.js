import React from "react";
import PropTypes from "prop-types";
import styles from "./ResponsiveList.module.css";

function ResponsiveList(props) {
  return <div className={styles.list}>{props.children}</div>;
}

ResponsiveList.propTypes = {
  children: PropTypes.elementType.isRequired,
};

function ResponsiveListItem(props) {
  return (
    <div className={styles.item} key={props.key}>
      {props.children}
    </div>
  );
}

ResponsiveListItem.propTypes = {
  key: PropTypes.string.isRequired,
  children: PropTypes.elementType.isRequired,
};

export { ResponsiveListItem, ResponsiveList, ResponsiveList as default };
