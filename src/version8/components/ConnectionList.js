
import React from 'react';

import styles from './ConnectionList.module.css';

function null_function(item){}

function ConnectionList({connections, title, emitClicked=null_function}) {
  if (!connections || connections.length === 0) {
    return null;
  }

  const listitems = connections.map((item) => {
    let i = item;
    let name = item.getName();

    return (<li key={name}>
      <button href="#" className={styles.button}
        onClick={() => { emitClicked(i); }}>
        {name}</button></li>);
  });

  if (title){
    return (<div>{title}<br /><ul className={styles.list}>{listitems}</ul></div>);
  }
  else{
    return (<ul className={styles.list}>{listitems}</ul>);
  }
}


export default ConnectionList;
