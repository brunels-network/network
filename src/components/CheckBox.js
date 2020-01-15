
import React from 'react';

import styles from './CheckBox.module.css';

function CheckBox(props){
  return <label className={styles.checkBox}>
           <input type="checkbox"
             checked={props.checked}
             onChange={props.onChange}/>
           <span className={styles.checkMark}/>
         </label>;
}

export default CheckBox;
