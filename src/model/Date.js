
import Dry from 'json-dry';
import moment from 'moment';
import lodash from 'lodash';

import DateRange from './DateRange';

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

function _get_min(d1, d2){
  if (d1){
    if (d2){
      if (d1 < d2){
        return d1;
      }
      else{
        return d2;
      }
    }
    else{
      return d1;
    }
  }
  else{
    return d2;
  }
}

function _get_max(d1, d2){
  if (d1){
    if (d2){
      if (d1 > d2){
        return d1;
      }
      else{
        return d2;
      }
    }
    else{
      return d1;
    }
  }
  else{
    return d2;
  }
}

function _merge_raw(s1, s2){
  if (!s1){
    return s2;
  }
  else if (!s2){
    return s1;
  }

  return `${s1} + ${s2}`;
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

  isNull(){
    if (this.state.start){
      return false;
    }
    else{
      return true;
    }
  }

  isFuzzy(){
    if (this.state.end){
      return true;
    }
    else{
      return false;
    }
  }

  isExact(){
    return !(this.isNull() || this.isFuzzy());
  }

  toString(){
    if (this.isNull()){
      return "Date:unknown";
    }
    else if (this.isFuzzy()){
      return `~${this.state.start.format("LL")}-${this.state.end.format("LL")}`;
    }
    else{
      return this.state.start.format("LL");
    }
  }

  getEarliest(){
    return this.state.start;
  }

  getLatest(){
    if (this.state.end){
      return this.state.end;
    }
    else{
      return this.state.start;
    }
  }

  toRange(){
    if (this.isNull()){
      return new DateRange();
    }
    else if (this.isExact()){
      return new DateRange({both:this.state.start});
    }
    else{
      return new DateRange({start:this.state.start, end:this.state.end});
    }
  }

  getRaw(){
    return this.state.raw;
  }

  getStart(){
    return this.state.start;
  }

  getEnd(){
    if (this.state.end){
      return this.state.end;
    }
    else {
      return this.state.start;
    }
  }

  merge(other){
    let state = {start: _get_min(this.getStart(), other.getStart()),
                 end: _get_max(this.getEnd(), other.getEnd()),
                 raw: _merge_raw(this.getRaw(), other.getRaw())};

    let date = new Date();
    date.state = state;

    return date;
  }
}

Date.unDry = function(value){
  return new Date(value);
}

Dry.registerClass("Date", Date);

export default Date;
