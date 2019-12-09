
import React from 'react';

import styles from './GroupsList.module.css';

function GroupsList(props) {
  const groups = props.groups;
  const title = props.title;
  const emitClicked = props.emitClicked;
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

    if (emitClicked) {
      return (<li key={name}>
        <button href="#" onClick={() => { emitClicked(i); }}
          class={styles.button}>
          {name}</button></li>);
    }
    else {
      return (<li key={name}>{name}</li>);
    }
  });

  return (<div>{title}<br /><ul>{listitems}</ul></div>);
}

export default GroupsList;
