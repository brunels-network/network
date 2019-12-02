
import Dry from "json-dry";

function setState(val, def=null){
  if (val){
    return val;
  } else {
    return def;
  }
}

class Source {
  constructor(props){
    this.state = {
      name: null,
      id: null,
      notes: {},
    };

    this.setState(props);

    this._getHook = null;
  }

  getID(){
    return this.state.id;
  }

  setState(state){
    if (state){
      this.state.name = setState(state.name);
      this.state.id = setState(state.id);
      this.state.notes = setState(state.notes, {})
    }
  }

  _updateHook(hook){
    this._getHook = hook;
  }

  toString(){
    return `Source(${this.getName()})`;
  }

  getName(){
    return this.state.name;
  }

  toDry(){
    return {value: this.state};
  }
};

Source.unDry = function(value){
  return new Source(value);
}

Dry.registerClass(Source);

export default Source;
