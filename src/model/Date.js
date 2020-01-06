
import Dry from 'json-dry';
import moment from 'moment';
import lodash from 'lodash';

import {ValueError} from './Errors';

function _toDate(val, def=null){
  if (val){
    if (val._isAMomentObject){
      return val;
    }

    let date = moment(val);
    if (!date.isValid()){
      console.log(`Invalid Date ${val}`);
      throw new ValueError(`Invalid Date ${val}`);
    }

    return date;
  } else {
    if (!def){
      return null;
    }
    else{
      return _toDate(def);
    }
  }
}

class Date{
  constructor(state){
    this.state = {
      start: null,
      end: null,
      raw: null,
    };

    this.setState(state);

    this._isADateObject = true;
  }

  setState(state){
    if (!state || state === "null" || state === null){
      this.state.start = null;
      this.state.end = null;
      this.state.raw = null;
      return;
    }
    else if (state._isADateObject){
      this.state = {...state.state};
      return;
    }
    else if (state.hasOwnProperty("value")){
      this.setState(state.value);
      return;
    }

    let start = _toDate(state.start);
    let end = _toDate(state.end);

    if (!start){
      this.setState(new Date());
      return;
    }

    this.state.start = start;
    this.state.end = end;
    this.state.raw = state.raw;
  }
}

Date.unDry = function(value){
  return new Date(value);
}

Dry.registerClass("Date", Date);

export default Date;
