
import React from 'react';
import CSSTransition from 'react-transition-group';

import styles from './SlidingPanel.module.css'

function SlidingPanel({children, isOpen, title, from, width,
                       onRequestClose, }){

  let classname = styles.panel;
  let dirclass = styles.closePanel;

  if (isOpen){
    dirclass = styles.panelView;
  }

  return (<div className={`${classname} ${dirclass}`}
          >
            <div className={styles.panelTitle}>
              <button className={styles.closeButton}
                      onClick={onRequestClose}>
               X
              </button> | This is panel {title}
            </div>
              <div className={styles.panelChild}>
                {children}
              </div>
            </div>);
}

export default SlidingPanel;
