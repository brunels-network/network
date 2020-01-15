
import React from 'react';

import styles from './DefaultButton.module.css';

function DefaultButton(props){
  return <button href="#" className={styles.button}
                 onClick={props.onClick}
                 style={props.style}>
          {props.children}
         </button>;
}

export default DefaultButton;
