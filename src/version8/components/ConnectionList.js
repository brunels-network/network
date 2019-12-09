
import React from 'react';

import styles from './ConnectionList.module.css';

function ConnectionList(props) {
  const connections = props.connections;
  const title = props.title;
  const emitClicked = props.emitClicked;
  if (!connections || connections.length === 0) {
    return null;
  }

  const listitems = connections.map((item) => {
    let i = item;
    let name = item.getName();

    if (emitClicked) {
      return (<li key={name}>
        <button href="#" class={styles.button}
          onClick={() => { emitClicked(i); }}>
          {name}</button></li>);
    }
    else {
      return (<li key={name}>{name}</li>);
    }
  });

  return (<div>{title}<br /><ul>{listitems}</ul></div>);
}


export default ConnectionList;
