
import Dry from 'json-dry';
import lodash from 'lodash';

import Date from './Date';
import {ValueError} from './Errors';

function _clean(val){
  if (!val || val._isADateRangeObject || val._isAMomentObject ||
              val._isADateObject){
    return val;
  }
  else if (val.hasOwnProperty("start") || val.hasOwnProperty("end") ||
           val.hasOwnProperty("both") || val.hasOwnProperty("value")){
    return new DateRange(val);
  }
  else{
    return new Date(val);
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

  static clone(item){
    let d = new DateRange();
    d.state = lodash.cloneDeep(item.state);
    return d;
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

  toDate(){
    if (this.hasStart()){
      if (this.hasEnd()){
        return this.getStart().merge(this.getEnd());
      }
      else{
        return this.getStart();
      }
    }
    else{
      return this.getEnd();
    }
  }

  contains(date){
    date = _clean(date);

    if (!date){
      return true;
    }
    else if (date._isADateRangeObject){
      const my_start = this.getEarliestStart();
      const other_start = date.getEarliestStart();

      if (my_start && other_start){
        if (Date.gt(my_start, other_start)){ return false;}
      }
      else if (other_start){
        return false;
      }

      const my_end = this.getLatestEnd();
      const other_end = date.getLatestEnd();

      if (my_end && other_end){
        if (Date.lt(my_end, other_end)){ return false;}
      }
      else if (my_end){
        return false;
      }

      return true;
    }
    else if (date._isADateObject){
      if (date.isExact()){
        return this.contains(date.toDate());
      }
      else{
        return this.contains(date.toRange());
      }
    }
    else if (date._isAMomentObject){
      const start = this.getEarliestStart();
      const end = this.getLatestEnd();

      if (start && date < start.toDate()){
        return false;
      }
      else if (end && date > end.toDate()){
        return false;
      }
      else{
        return true;
      }
    }
    else {
      throw new ValueError(`Invalid Date ${date}`);
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
    else if (!this.hasBounds()){
      return other;
    }

    const start = Date.max(this.getStart(), other.getStart());

    if (!this.contains(start)){
      return null;
    }

    const end = Date.min(this.getEnd(), other.getEnd());

    if (!this.contains(end)){
      return null;
    }

    if (Date.eq(start, end)){
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

    const start = Date.min(this.getStart(), other.getStart());
    const end = Date.max(this.getEnd(), other.getEnd());

    if (Date.eq(start, end)){
      return new DateRange({both:start});
    }
    else{
      return new DateRange({start:start, end:end});
    }
  }

  getDelta(){
    if (this.hasStart() && this.hasEnd()){
      return this.getLatestEnd().toDate() - this.getEarliestStart().toDate();
    }
    else{
      return null;
    }
  }

  zoomIn(scale=1){
    let state = lodash.cloneDeep(this.state);

    let delta = null;

    if (state.start !== null && state.end !== null){
      delta = this.getDelta() / (2.0+scale);
    }
    else{
      delta = 3600000;
    }

    if (state.start){
      state.start.add(delta, "ms");
    }

    if (state.end){
      state.end.add(-delta, "ms");
    }

    return new DateRange(state);
  }

  zoomOut(scale=1){
    let state = lodash.cloneDeep(this.state);

    let delta = null;

    if (state.start !== null && state.end !== null){
      delta = this.getDelta() * scale;
    }
    else{
      delta = 3600000;
    }

    if (state.start){
      state.start.add(-delta, "ms");
    }

    if (state.end){
      state.end.add(delta, "ms");
    }

    return new DateRange(state);
  }

  shiftEarlier(delta=null){
    let state = lodash.cloneDeep(this.state);

    if (delta === null){
      if (state.start !== null && state.end !== null){
        delta = -(this.delta());     //milliseconds
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
        delta = this.getDelta();     //milliseconds
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

  getEarliestStart(){
    if (this.hasStart()){
      return this.getStart().getEarliest();
    }
    else{
      return null;
    }
  }

  getLatestEnd(){
    if (this.hasEnd()){
      return this.getEnd().getLatest();
    }
    else{
      return null;
    }
  }

  getStartDate(){
    let e = this.getEarliestStart();
    if (e){
      return e.toDate();
    }
    else{
      return null;
    }
  }

  getEndDate(){
    let e = this.getLatestEnd();
    if (e){
      return e.toDate();
    }
    else{
      return null;
    }
  }

  getStartString(){
    if (this.state.start){
      return this.state.start.toString();
    }
    else{
      return "unbounded";
    }
  }

  getEndString(){
    if (this.state.end){
      return this.state.end.toString();
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
        this.state.start = new Date(state.both);
        this.state.end = this.state.start;
      }
      else if (typeof state === "string"){
        this.state.start = new Date(state);
        this.state.end = this.state.start;
      }
      else {
        let start = null;

        if (state.start){
          start = new Date(state.start);
        }

        let end = null;

        if (state.end){
          end = new Date(state.end);
        }

        if (start && end){
          if (Date.gt(start, end)){
            let tmp = start;
            start = end;
            end = tmp;
          }

          if (Date.lt(start, end)){
            let tmp = Date.min(start, end);
            end = Date.max(start, end);
            start = tmp;
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
