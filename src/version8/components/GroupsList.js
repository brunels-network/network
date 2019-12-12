
import React from 'react';

import styles from './GroupsList.module.css';

function null_function(item){}

function GroupsList({groups, title, emitClicked=null_function}) {

  if (!groups || groups.length === 0) {
    return null;
  }

  const listitems = groups.map((item) => {
    let i = item;
    let name = item;

    if (item.getName) {
      name = item.getName();
    }
    else if (item.getID) {
      name = item.getID();
    }

    return (<li key={name}>
      <button href="#" onClick={() => { emitClicked(i);}}
        className={styles.button}>
        {name}</button></li>);
  });

  if (title){
    return (<div>{title}<br /><ul className={styles.list}>{listitems}</ul></div>);
  }
  else{
    return (<ul className={styles.list}>{listitems}</ul>);
  }
}

export default GroupsList;
