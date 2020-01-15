
import React from 'react';

import styles from './ResponsiveList.module.css';

function ResponsiveList(props){
  return <div className={styles.list}>
           {props.children}
         </div>;
}

function ResponsiveListItem(props){
  return <div className={styles.item} key={props.key}>
           {props.children}
         </div>;
}

export {ResponsiveListItem,
        ResponsiveList,
        ResponsiveList as default};
