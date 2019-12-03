
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

  setState(state){
    if (state){
      if (state === "null"){ return; }
      this.state.start = setState(state.start);
      this.state.end = setState(state.end);
    }
  }

  toDry(){
    return this.state;
  }
}

DateRange.unDry = function(value){
  return new DateRange(value);
}

Dry.registerClass(DateRange);

export default DateRange;
