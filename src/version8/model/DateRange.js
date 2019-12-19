
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
      throw ValueError(`Invalid Date ${val}`);
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

function _clean(val){
  if (val === null || val._isADateRangeObject || val._isAMomentObject){
    return val;
  }
  else if (val.hasOwnProperty("start") || val.hasOwnProperty("end") ||
           val.hasOwnProperty("both") || val.hasOwnProperty("value")){
    return new DateRange(val);
  }
  else{
    return _toDate(val);
  }
}

function _minDate(date1, date2){
  if (date1 === null || date2 === null){
    return null;
  }
  else if (date1 <= date2){
    return date1;
  }
  else{
    return date2;
  }
}

function _maxDate(date1, date2){
  if (date1 === null || date2 === null){
    return null;
  }
  else if (date1 >= date2){
    return date1;
  }
  else{
    return date2;
  }
}

class DateRange{
  constructor(state){
    this.state = {
      start: null,
      end: null
    }

    this.setState(state);
    this._isADateRangeObject = true;
  }

  toString(){
    if (this.hasBounds()){
      if (this.isInstant()){
        return `DateRange(${this.getStartString()})`;
      }
      else{
        return `DateRange(${this.getStartString()} to ${this.getEndString()})`;
      }
    }
    else{
      return "DateRange::unbounded";
    }
  }

  hasBounds(){
    return this.state.start !== null || this.state.end !== null;
  }

  hasEnd(){
    return this.state.end !== null;
  }

  hasStart(){
    return this.state.start !== null;
  }

  isInstant(){
    return this.state.start !== null && this.state.start === this.state.end;
  }

  contains(date){
    date = _clean(date);

    if (!date){
      return true;
    }
    else if (date._isADateRangeObject){
      const my_start = this.getStart();
      const other_start = date.getStart();

      if (my_start && other_start){
        if (my_start > other_start){ return false;}
      }
      else if (other_start){
        return false;
      }

      const my_end = this.getEnd();
      const other_end = date.getEnd();

      if (my_end && other_end){
        if (my_end < other_end){ return false;}
      }
      else if (my_end){
        return false;
      }

      return true;
    }
    else if (date._isAMomentObject){
      const start = this.getStart();
      const end = this.getEnd();

      if (start && date < start){
        return false;
      }
      else if (end && date > end){
        return false;
      }
      else{
        return true;
      }
    }
    else {
      throw ValueError(`Invalid Date ${date}`);
    }
  }

  intersect(other){
    other = _clean(other);

    if (!other){
      return this;
    }
    else if (!(other._isADateRangeObject)){
      other = new DateRange({value:other});
    }

    if (!other.hasBounds()){
      return this;
    }

    const start = _maxDate(this.getStart(), other.getStart());

    if (!this.contains(start)){
      return null;
    }

    const end = _minDate(this.getEnd(), other.getEnd());

    if (!this.contains(end)){
      return null;
    }

    if (start === end){
      return new DateRange({both:start});
    }
    else{
      return new DateRange({start:start, end:end});
    }
  }

  union(other){
    other = _clean(other);
    if (!other){
      return this;
    }
    else if (!(other._isADateRangeObject)){
      other = new DateRange({value:other});
    }

    const start = _minDate(this.getStart(), other.getStart());
    const end = _maxDate(this.getEnd(), other.getEnd());

    if (start === end){
      return new DateRange({both:start});
    }
    else{
      return new DateRange({start:start, end:end});
    }
  }

  shiftEarlier(delta=null){
    let state = lodash.cloneDeep(this.state);

    if (delta === null){
      if (state.start !== null && state.end !== null){
        delta = -(state.end - state.start);     //milliseconds
      }
      else{
        delta = -3600000;     //milliseconds
      }
    }

    if (state.start){
      state.start.add(delta, "ms");
    }

    if (state.end){
      state.end.add(delta, "ms");
    }

    return new DateRange(state);
  }

  shiftLater(delta=null){
    let state = lodash.cloneDeep(this.state);

    if (delta === null){
      if (state.start !== null && state.end !== null){
        delta = state.end - state.start;     //milliseconds
      }
      else{
        delta = 3600000;     //milliseconds
      }
    }

    if (state.start){
      state.start.add(delta, "ms");
    }

    if (state.end){
      state.end.add(delta, "ms");
    }

    return new DateRange(state);
  }

  getStart(){
    return this.state.start;
  }

  getEnd(){
    return this.state.end;
  }

  getStartDate(){
    if (this.state.start){
      return this.state.start.toDate();
    }
    else{
      return null;
    }
  }

  getEndDate(){
    if (this.state.end){
      return this.state.end.toDate();
    }
    else{
      return null;
    }
  }

  getStartString(){
    if (this.state.start){
      return this.state.start.format("LL");
    }
    else{
      return "unbounded";
    }
  }

  getEndString(){
    if (this.state.end){
      return this.state.end.format("LL");
    }
    else{
      return "unbounded";
    }
  }

  setState(state){
    if (state){
      if (state === "null" || state === null){
        this.state = {"start":null, "end":null};
        return;
      }
      else if (state._isADateRangeObject){
        this.state = {...state.state};
      }
      else if (state.hasOwnProperty("value")){
        this.setState(state.value);
        return;
      }
      else if (state.hasOwnProperty("both")){
        this.state.start = _toDate(state.both);
        this.state.end = this.state.start;
      }
      else {
        let start = _toDate(state.start);
        let end = _toDate(state.end);

        if (start !== null && end !== null){
          if (start > end){
            let tmp = start;
            start = end;
            end = tmp;
          }
        }

        this.state.start = start;
        this.state.end = end;
      }
    }
    else{
      this.state.start = null;
      this.state.end = null;
    }
  }

  toDry(){
    return this.state;
  }
}

DateRange.unDry = function(value){
  return new DateRange(value);
}

Dry.registerClass("DateRange", DateRange);

export default DateRange;
