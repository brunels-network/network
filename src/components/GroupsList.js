
import React from 'react';

import styles from './GroupsList.module.css';

function null_function(item){}

function GroupsList({groups, title=null, emitSelected=null_function,
                     emitToggleFilter=null_function, social=null}) {

  if (!groups) {
    return null;
  }

  let projects = [];

  Object.keys(groups).forEach((key, _i)=>{
    let items = [];

    for (let index in groups[key]){
      let group = social.get(groups[key][index]);
      let is_filtered = social.isFiltered(group);

      items.push(<li key={group.getName()}>
                  <button href="#" className={styles.button}
                    onClick={()=>{emitSelected(group);}}>
                    {group.getName()}
                  </button> :&nbsp;
                  <input type="checkbox"
                        className={styles.checkbox}
                        onClick={()=>{emitToggleFilter(group);}}
                        checked={is_filtered}
                    >
                  </input>
                 </li>);
    }

    let project = social.get(key);
    let is_filtered = social.isFiltered(project);

    projects.push(
      <div className={styles.project}>
        <div className={styles.projectHeader}>
          <button href="#" className={styles.projectButton}
                  onClick={()=>{emitSelected(project);}}>
            {project.getName()}
          </button> :&nbsp;
          <input type="checkbox"
            className={styles.checkbox}
            onClick={()=>{emitToggleFilter(project);}}
            checked={is_filtered}
          >
          </input>
        </div>
        <div clasName={styles.projectBody}>
          <ul>
            {items}
          </ul>
        </div>
      </div>
    );
  });

  if (title){
    return (<div>
              <div className={styles.title}>{title}</div>
              {projects}
            </div>);
  }
  else {
    return projects;
  }
}

export default GroupsList;
