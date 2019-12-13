
import Dry from 'json-dry';

function setState(val, def=null){
    if (val){
      return val;
    } else {
      return def;
    }
  }

class DateRange{
  constructor(value){
    this.state = {
      start: null,
      end: null
    }

    this.setState(value);
  }

  getStart(){
    return this.state.start;
  }

  getEnd(){
    return this.state.end;
  }

  getStartString(){
    if (this.state.start){
      return this.state.start.toDateString();
    }
    else{
      return "unknown";
    }
  }

  getEndString(){
    if (this.state.end){
      return this.state.end.toDateString();
    }
    else{
      return "unknown";
    }
  }

  setState(state){
    if (state){
      if (state === "null"){ return; }

      if (state.both){
        this.state.start = new Date(state.both);
        this.state.end = this.state.start;
      }
      else{
        this.state.start = setState(new Date(state.start));
        this.state.end = setState(new Date(state.end));
      }
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
