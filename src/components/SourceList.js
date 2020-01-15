
import React from 'react';

import DateRangeButton from './DateRangeButton';
import DateRange from '../model/DateRange';

import styles from './SourceList.module.css';

function _null_function(item){}

function SourceList(props){
  let social = props.social;
  let sources = props.sources;
  let emitSelected = props.emitSelected;
  let title = props.title;

  if (!social || !sources){
    return null;
  }

  if (!emitSelected){
    emitSelected = _null_function;
  }

  let output = Object.keys(sources).map((key, index)=>{
    let source = social.get(key);
    let daterange = DateRange.mergeAll(sources[key]);

    if (daterange){
      return <li key={source.getName()}>
               <button href="#" onClick={()=>{emitSelected(source)}}
                       className={styles.button}>
                 {source.getName()}
               </button> : <DateRangeButton value={daterange}
                                            emitSelected={emitSelected}/>
             </li>;
    }
    else{
      return <li key={source.getName()}>
               <button href="#" onClick={()=>{emitSelected(source)}}
                       className={styles.button}>
                 {source.getName()}
               </button>
             </li>;
    }
  });

  if (!output || output.length === 0){
    return null;
  }

  if (title){
    return <div className={styles.container}>
             <div className={styles.title}>{title}</div>
             <div className={styles.body}>
               <ul className={styles.list}>
                 {output}
               </ul>
             </div>
           </div>;
  }
  else{
    return <div className={styles.container}>
             <div className={styles.body}>
               <ul className={styles.list}>
                 {output}
               </ul>
             </div>
           </div>;
  }
}

export default SourceList;
