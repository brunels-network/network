
import React from 'react';

import styles from './GroupsList.module.css';
import Social from '../model/Social';

function null_function(item){}

function GroupsList({groups, title=null, emitClicked=null_function,
                     emitSelected=null_function, social=null}) {
  if (!groups || groups.length === 0) {
    return null;
  }

  let projects = [];

  Object.keys(groups).forEach((key, item)=>{
    console.log(key, item);
  });

  if (title){
    return (<div>
              <div className={styles.title}>{title}</div>
              {projects.join("\n")}
            </div>);
  }
  else {
    return projects.join("\n");
  }
}

export default GroupsList;
