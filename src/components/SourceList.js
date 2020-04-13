import PropTypes from "prop-types";
import React from "react";

import DateRangeButton from "./DateRangeButton";
import DateRange from "../model/DateRange";
import DefaultButton from "./DefaultButton";

import { ResponsiveList, ResponsiveListItem } from "./ResponsiveList";

import styles from "./SourceList.module.css";

function _null_function() {}

function SourceList(props) {
  let social = props.social;
  let sources = props.sources;
  let emitSelected = props.emitSelected;
  let title = props.title;

  if (!social || !sources) {
    return null;
  }

  if (!emitSelected) {
    emitSelected = _null_function;
  }

  let output = Object.keys(sources).map((key) => {
    let source = social.get(key);
    let daterange = DateRange.mergeAll(sources[key]);

    if (daterange) {
      return (
        <ResponsiveListItem key={source.getName()}>
          <DefaultButton
            onClick={() => {
              emitSelected(source);
            }}
            style={{ width: "50%" }}
          >
            {source.getName()}
          </DefaultButton>
          <DateRangeButton style={{ width: "40%" }} value={daterange} emitSelected={emitSelected} />
        </ResponsiveListItem>
      );
    } else {
      return (
        <ResponsiveListItem key={source.getName()}>
          <DefaultButton
            onClick={() => {
              emitSelected(source);
            }}
          >
            {source.getName()}
          </DefaultButton>
        </ResponsiveListItem>
      );
    }
  });

  if (!output || output.length === 0) {
    return null;
  }

  if (title) {
    return (
      <div className={styles.container}>
        <div className={styles.title}>{title}</div>
        <div className={styles.body}>
          <ResponsiveList>{output}</ResponsiveList>
        </div>
      </div>
    );
  } else {
    return <ResponsiveList>{output}</ResponsiveList>;
  }
}

SourceList.propTypes = {
  emitSelected: PropTypes.func.isRequired,
  social: PropTypes.func.isRequired,
  sources: PropTypes.object.isRequired,
  title: PropTypes.string
}

export default SourceList;
