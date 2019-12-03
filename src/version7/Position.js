
import Dry from "json-dry";

function setState(val, def=null){
  if (val){
    return val;
  } else {
    return def;
  }
}

class Position {
  constructor(props){
    this.state = {
      name: null,
      id: null,
      sources: [],
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
      this.state.sources = setState(state.sources, []);
      this.state.notes = setState(state.notes, {})
    }
  }

  _updateHooks(hook){
    this._getHook = hook;
  }

  toString(){
    return `Position(${this.getName()})`;
  }

  getName(){
    return this.state.name;
  }

  toDry(){
    return {value: this.state};
  }
};

Position.unDry = function(value){
  return new Position(value);
}

Dry.registerClass(Position);

export default Position;
