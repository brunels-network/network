
import React from 'react';

import styles from './DateRangeButton.module.css';

function _null_function(date){};

function DateRangeButton(props){
  let d = props.value;

  if (!d){
    return null;
  }

  console.log(d);

  if (!(d._isARoughDateObject || d._isADateRangeObject)){
    return null;
  }

  if (d.isNull()){
    return null;
  }

  let emitSelected = props.emitSelected;

  if (!emitSelected){
    emitSelected = _null_function;
  }

  let s = d.toSimpleString();

  if (d._isARoughDateObject){
    d = d.toDateRange();
  }

  return <button href="#" onClick={()=>{emitSelected(d)}}
                 className={styles.button}>
           {s}
         </button>;
}

export default DateRangeButton;
