
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
    let daterange = null;

    if (item.length){
      i = item[0];
      name = item[0];
      daterange = item[1];
      item = item[0]
    }

    if (item.getName) {
      name = item.getName();
    }
    else if (item.getID) {
      name = item.getID();
    }

    if (daterange){
      return (<li key={name}>
        <button href="#" onClick={() => { emitClicked(i);}}
          className={styles.button}>
          {name}</button> :&nbsp;
          from {daterange.getStartString()} to&nbsp;
               {daterange.getEndString()}</li>);
    }
    else{
      return (<li key={name}>
        <button href="#" onClick={() => { emitClicked(i);}}
          className={styles.button}>
          {name}</button></li>);
    }
  });

  if (title){
    return (<div>{title}<br /><ul className={styles.list}>{listitems}</ul></div>);
  }
  else{
    return (<ul className={styles.list}>{listitems}</ul>);
  }
}

export default GroupsList;
