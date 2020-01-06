
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
    let project = null;

    if (item.length){
      i = item[1];
      name = item[1];
      project = item[0];
      item = item[1]
    }

    if (item.getName) {
      name = item.getName();
    }
    else if (item.getID) {
      name = item.getID();
    }

    if (project){
      return (<li key={name+project.getName()}>
        <button href="#" onClick={() => { emitClicked(i);}}
          className={styles.button}>
          {name}</button> :&nbsp;
          for project {project.getName()}</li>);
    }
    else{
      return (<li key={name+project.getName()}>
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
