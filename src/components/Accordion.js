
import React from 'react';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';

import styles from './Accordion.module.css';

function BAccordion(props){
  return <Accordion className={styles.accordion}
                    allowMultipleExpanded={props.allowMultipleExpanded}
                    allowZeroExpanded={props.allowZeroExpanded}>
           {props.children}
         </Accordion>;
}

function BAccordionItem(props){
  return <AccordionItem className={styles.accordionItem}
                        style={props.style}
                        uuid={props.uuid}>
           {props.children}
         </AccordionItem>;
}

function BAccordionTitle(props){
  return <AccordionItemHeading style={props.style}>
           <AccordionItemButton className={styles.accordionButton}>
             {props.children}
           </AccordionItemButton>
         </AccordionItemHeading>;
}

function BAccordionPanel(props){
  return <AccordionItemPanel style={props.style}>
           {props.children}
         </AccordionItemPanel>;
}

export {BAccordion as Accordion,
        BAccordionItem as AccordionItem,
        BAccordionTitle as AccordionTitle,
        BAccordionPanel as AccordionPanel,
        BAccordion as default};
