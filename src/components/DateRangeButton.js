
import React from 'react';

import DefaultButton from './DefaultButton';

function _null_function(date){};

function DateRangeButton(props){
  let d = props.value;

  if (!d){
    return null;
  }

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

  return <DefaultButton onClick={()=>{emitSelected(d)}} style={props.style}>
           {s}
         </DefaultButton>;
}

export default DateRangeButton;
