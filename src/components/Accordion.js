import React from "react";
import PropTypes from "prop-types";

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

import styles from "./Accordion.module.css";

function BAccordion(props) {
  return (
    <Accordion
      className={styles.accordion}
      preExpanded={props.preExpanded}
      allowMultipleExpanded={props.allowMultipleExpanded}
      allowZeroExpanded={props.allowZeroExpanded}
    >
      {props.children}
    </Accordion>
  );
}

BAccordion.propTypes = {
  preExpanded: PropTypes.bool,
  allowMultipleExpanded: PropTypes.bool,
  allowZeroExpanded: PropTypes.bool,
  children: PropTypes.string,
};

function BAccordionItem(props) {
  return (
    <AccordionItem className={styles.accordionItem} style={props.style} uuid={props.uuid}>
      {props.children}
    </AccordionItem>
  );
}

BAccordionItem.propTypes = {
  style: PropTypes.string,
  uuid: PropTypes.string,
  children: PropTypes.string,
};

function BAccordionTitle(props) {
  return (
    <AccordionItemHeading style={props.style}>
      <AccordionItemButton className={styles.accordionButton}>{props.children}</AccordionItemButton>
    </AccordionItemHeading>
  );
}

BAccordionTitle.propTypes = {
  style: PropTypes.string,
  children: PropTypes.string,
};


function BAccordionPanel(props) {
  return <AccordionItemPanel style={props.style}>{props.children}</AccordionItemPanel>;
}

BAccordionPanel.propTypes = {
  style: PropTypes.string,
  children: PropTypes.string,
};

export {
  BAccordion as Accordion,
  BAccordionItem as AccordionItem,
  BAccordionTitle as AccordionTitle,
  BAccordionPanel as AccordionPanel,
  BAccordion as default,
};
