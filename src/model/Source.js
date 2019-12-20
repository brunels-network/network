
import Dry from "json-dry";
import lodash from 'lodash';

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
    this._isASourceObject = true;
  }

  static clone(item){
    let c = new Source();
    c._getHook = item._getHook;
    c.state = lodash.cloneDeep(item.state);
    return c;
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

  _updateHooks(hook){
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

Dry.registerClass("Source", Source);

export default Source;
