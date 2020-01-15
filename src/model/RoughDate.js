
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

    /*if (val.toISOString){
      val = val.toISOString();
    }*/

    let date = moment(val);

    if (!date.isValid()){
      console.log(`Invalid Date ${val}`);
      throw new ValueError(`Invalid Date ${val}`);
    }

    return date;
  }
  else {
    if (!def){
      return null;
    }
    else{
      return _toDate(def);
    }
  }
}

// NOTE FOR FUTURE - moment(x) < moment(y) === true
//            even though moment(x).toDate() < moment(y).toDate() === false
//   MOMENT COMPARISONS ARE BROKEN!

function _get_min(d1, d2){
  if (d1){
    if (d2){
      if (d1.toDate() < d2.toDate()){
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
      if (d1.toDate() > d2.toDate()){
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

class RoughDate{
  constructor(state){
    this.state = {
      start: null,
      end: null,
      raw: null,
    };

    this.setState(state);

    this._isARoughDateObject = true;
  }

  setState(state){
    if (!state || state === "null" || state === null){
      this.state = {start:null};
      return;
    }
    else if (state._isARoughDateObject){
      this.state = {...state.state};
      return;
    }
    else if (state._isADateRangeObject){
      this.state = state.toDate();
      return;
    }
    else if (state._isAMomentObject){
      this.state = {start: _toDate(state)};
      return;
    }
    else if (state.toISOString){
      this.state = {start:_toDate(state)};
      return;
    }
    else if (state.hasOwnProperty("value")){
      this.state = {start:state.value};
      return;
    }
    else if (typeof(state) === "string"){
      this.state = {start:_toDate(state), raw:state};
      return;
    }

    let start = _toDate(state.start);
    let end = _toDate(state.end);

    if (!start){
      this.state = {start: null};
      return;
    }

    this.state.start = start;
    this.state.end = end;
    this.state.raw = state.raw;

    if (this.isNull()){
      console.log("NULL RoughDate?");
      console.log(state);
    }
  }

  static clone(item){
    let d = new RoughDate();
    d.state = lodash.cloneDeep(item.state);
    return d;
  }

  static max(d1, d2){
    return new RoughDate(_get_max(d1.getLatest(), d2.getLatest()));
  }

  static min(d1, d2){
    return new RoughDate(_get_min(d1.getEarliest(), d2.getEarliest()));
  }

  static delta(d1, d2){
    return d1.getLatestDate() - d2.getEarliestDate();
  }

  static getDelta(d1, d2){
    return RoughDate.delta(d1, d2);
  }

  static eq(item, other){
    if (item._isARoughDateObject && other._isARoughDateObject){
      return item.getEarliestString() === other.getEarliestString() &&
             item.getLatestString() === other.getLatestString();
    }
    else{
      return false;
    }
  }

  static lt(d1, d2){
    if (d1.isNull() || d2.isNull()){
      return false;
    }
    else{
      return d1.getEarliestDate() < d2.getEarliestDate();
    }
  }

  static gt(d1, d2){
    if (d1.isNull() || d2.isNull()){
      return false;
    }
    else {
      return d1.getEarliestDate() > d2.getEarliestDate();
    }
  }

  static le(d1, d2){
    return RoughDate.eq(d1, d2) || RoughDate.lt(d1, d2);
  }

  static ge(d1, d2){
    return RoughDate.eq(d1, d2) || RoughDate.gt(d1, d2);
  }

  static ne(d1, d2){
    return !(RoughDate.eq(d1, d2));
  }

  add(delta){
    if (this.state.start){
      this.state.start.add(delta);
    }

    if (this.state.end){
      this.state.end.add(delta);
    }

    this.state.raw = null;
  }

  sub(delta){
    this.add(-delta);
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

  toSimpleString(){
    if (this.isNull()){
      return "unknown";
    }
    else if (this.isFuzzy()){
      let s = this.state.start.toDate();
      let e = this.state.end.toDate();

      console.log(`${s.getMonth()} ${e.getMonth()} ${s.getDate()} ${e.getDate()}`);

      if (s.getMonth() === 0 && e.getMonth() === 11 &&
          s.getDate() === 1 && e.getDate() === 31){
        //the dates span full years
        if (s.getFullYear() === e.getFullYear()){
          return s.getFullYear();
        }
        else{
          return `${s.getFullYear()}-${e.getFullYear()}`;
        }
      }
      else{
        return `${s.getDate()}/${s.getMonth()+1}/${s.getFullYear()}-${e.getDate()}/${e.getMonth()+1}/${e.getFullYear()}`;
      }
    }
    else{
      return this.state.start.format("LL");
    }
  }

  getEarliest(){
    let state = {"start": this.state.start};
    let r = new RoughDate();
    r.state = state;
    return r;
  }

  getLatest(){
    if (this.state.end){
      let state = {"start": this.state.end};
      let r = new RoughDate();
      r.state = state;
      return r;
    }
    else{
      return this.getEarliest();
    }
  }

  getEarliestDate(){
    let d = this.getEarliest();

    if (d){
      return d.toDate();
    }
    else{
      return null;
    }
  }

  getLatestDate(){
    let d = this.getLatest();

    if (d){
      return d.toDate();
    }
    else{
      return null;
    }
  }

  getEarliestString(){
    let d = this.getEarliest();

    if (d){
      return d.toDate().toISOString();
    }
    else{
      return null;
    }
  }

  getLatestString(){
    let d = this.getLatest();

    if (d){
      return d.toDate().toISOString();
    }
    else{
      return null;
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

  toDateRange(){
    if (this.isNull()){
      return new DateRange();
    }
    else if (this.isFuzzy()){
      return new DateRange({start:this.getEarliest(), end:this.getLatest()});
    }
    else{
      return new DateRange({both:this.getEarliest()});
    }
  }

  toDate(){
    let m = this.toMoment();

    if (m){
      try{
        return m.toDate();
      }
      catch(error){
        console.log(`STRANGE ERROR ${error}`);
        console.log(`m = ${m}`);
        console.log(m);
        return null;
      }
    }
    else{
      return null;
    }
  }

  toMoment(){
    if (this.isNull()){
      return null;
    }
    else if (this.isExact()){
      return this.state.start;
    }
    else{
      throw ValueError(
        `Cannot extract a single date from an inexact date ${this}`);
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

    let date = new RoughDate();
    date.state = state;

    return date;
  }
}

RoughDate.unDry = function(value){
  return new RoughDate(value);
}

Dry.registerClass("Date", RoughDate);

export default RoughDate;
