
import React from 'react';

import styles from './ConnectionList.module.css';

function null_function(item){}

function ConnectionList({connections, title, emitSelected=null_function,
                         emitToggleFilter=null_function,
                         social=null}) {
  if (!connections || connections.length === 0) {
    return null;
  }

  const listitems = connections.map((item) => {
    let i = item;
    let name = item.getName();

    let is_filtered = false;

    if (social){
      is_filtered = social.isFiltered(item);
    }

    return (
      <li key={name}>
        <button href="#" className={styles.button}
          onClick={()=>{emitSelected(i);}}>
          {name}
        </button> :&nbsp;
        <input type="checkbox"
               className={styles.checkbox}
               onClick={()=>{emitToggleFilter(i);}}
               checked={is_filtered}
          >
        </input>
      </li>);
  });

  if (title){
    return (<div>{title}<br /><ul className={styles.list}>{listitems}</ul></div>);
  }
  else{
    return (<ul className={styles.list}>{listitems}</ul>);
  }
}


export default ConnectionList;
