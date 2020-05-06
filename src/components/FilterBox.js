import React from "react";
import PropTypes from "prop-types";

import { Accordion, AccordionItem, AccordionTitle, AccordionPanel } from "./Accordion";

import { ResponsiveList, ResponsiveListItem } from "./ResponsiveList";
import CheckBox from "./CheckBox";
import DefaultButton from "./DefaultButton";

import styles from "./FilterBox.module.css";

function null_function() {}

function filterList(items, props) {
  let social = props.social;

  let emitSelected = props.emitSelected;

  if (!emitSelected) {
    emitSelected = null_function;
  }

  let emitToggleFilter = props.emitToggleFilter;

  if (!emitToggleFilter) {
    emitToggleFilter = null_function;
  }

  let output = items.values().map((item) => {
    let is_filtered = social.isFiltered(item);

    return (
      <ResponsiveListItem key={item.getName()}>
        <DefaultButton
          style={{ position: "relative", maxWidth: "80%" }}
          onClick={() => {
            emitSelected(item);
          }}
        >
          {item.getName()}
        </DefaultButton>
        &nbsp;
        <CheckBox
          checked={is_filtered}
          onChange={() => {
            emitToggleFilter(item);
          }}
        />
      </ResponsiveListItem>
    );
  });

  return <ResponsiveList>{output}</ResponsiveList>;
}

filterList.propTypes = {
  social: PropTypes.object.isRequired,
  emitSelected: PropTypes.func,
  emitToggleFilter: PropTypes.func,
};

function FilterBox(props) {
  let social = props.social;

  if (!social) {
    return <div>No social to display!</div>;
  }

  let filter_text = social.getFilterText();

  if (!filter_text) {
    filter_text = "No filters";
  }

  let emitClearFilters = props.emitClearFilters;

  if (!emitClearFilters) {
    emitClearFilters = null_function;
  }

  let filter_info = (
    <AccordionItem uuid="filterinfo">
      <AccordionTitle>Current Filter</AccordionTitle>
      <AccordionPanel>
        <div className={styles.filterContainer}>
          <div className={styles.filterText}>{filter_text}</div>
          <div>
            <DefaultButton onClick={emitClearFilters}>Clear Filters</DefaultButton>
          </div>
        </div>
      </AccordionPanel>
    </AccordionItem>
  );

  let projects = filterList(social.getProjects(false), props);
  let sources = filterList(social.getSources(false), props);
  let positions = filterList(social.getPositions(false), props);
  let affiliations = filterList(social.getAffiliations(false), props);
  let people = filterList(social.getPeople(false), props);
  let businesses = filterList(social.getBusinesses(false), props);

  console.log(social.getPositions(false).values());

  return (
    <Accordion allowMultipleExpanded={false} allowZeroExpanded={true}>
      {filter_info}
      {/* 
      <AccordionItem uuid="projects">
        <AccordionTitle>Projects</AccordionTitle>
        <AccordionPanel>{projects}</AccordionPanel>
      </AccordionItem>

      <AccordionItem uuid="sources">
        <AccordionTitle>Sources</AccordionTitle>
        <AccordionPanel>{sources}</AccordionPanel>
      </AccordionItem>

      <AccordionItem uuid="people">
        <AccordionTitle>People</AccordionTitle>
        <AccordionPanel>{people}</AccordionPanel>
      </AccordionItem>

      <AccordionItem uuid="businesses">
        <AccordionTitle>Businesses</AccordionTitle>
        <AccordionPanel>{businesses}</AccordionPanel>
      </AccordionItem> */}

      <AccordionItem uuid="positions">
        <AccordionTitle>Positions</AccordionTitle>
        <AccordionPanel>{positions}</AccordionPanel>
      </AccordionItem>
      {/* 
      <AccordionItem uuid="affiliations">
        <AccordionTitle>Affiliations</AccordionTitle>
        <AccordionPanel>{affiliations}</AccordionPanel>
      </AccordionItem> */}
    </Accordion>
  );
}

FilterBox.propTypes = {
  social: PropTypes.object.isRequired,
  emitSelected: PropTypes.func,
  emitClearFilters: PropTypes.func,
};

export default FilterBox;
