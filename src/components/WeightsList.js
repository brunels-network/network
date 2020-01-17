
import React from 'react';

import DefaultButton from './DefaultButton';
import CheckBox from './CheckBox';

import styles from './WeightsList.module.css';

function null_function(item){}

function WeightsList({weights, title=null, emitSelected=null_function,
                      emitToggleFilter=null_function, social=null,
                      type=null}) {

  if (!weights) {
    return null;
  }

  let projects = [];

  Object.keys(weights).forEach((key, _i)=>{
    let project = social.get(key);
    let is_filtered = social.isFiltered(project);

    let weight = weights[key];

    projects.push(
      <div className={styles.project} key={project.getName()}>
        <div className={styles.projectHeader}>
          <DefaultButton style={{width:"75%"}}
                         onClick={()=>{emitSelected(project);}}>
            {project.getName()}
          </DefaultButton>
          <CheckBox onChange={(event)=>{emitToggleFilter(project);}}
                    style={{width:"20%"}}
                    checked={is_filtered}/>
        </div>
        <div className={styles.projectBody}>
         Weight = {weight}, Type = {type}
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

export default WeightsList;
