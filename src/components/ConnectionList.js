
import React from 'react';

import DefaultButton from './DefaultButton';
import CheckBox from './CheckBox';

import {ResponsiveList, ResponsiveListItem} from './ResponsiveList';

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
      <ResponsiveListItem key={name}>
        <DefaultButton onClick={()=>{emitSelected(i);}}
                       style={{width:"70%"}}>
          {name}
        </DefaultButton>
        <CheckBox onChange={(event)=>{emitToggleFilter(i);}}
                  checked={is_filtered}
                  style={{width:"20%"}}/>
      </ResponsiveListItem>);
  });

  if (title){
    return (<div className={styles.connections}>
              <div className={styles.title}>{title}</div>
              <ResponsiveList>{listitems}</ResponsiveList>
            </div>);
  }
  else{
    return (<div className={styles.connections}>
              <ResponsiveList>{listitems}</ResponsiveList>
            </div>);
  }
}

export default ConnectionList;
