
import Dry from "json-dry";
import lodash from 'lodash';

function setState(val, def=null){
  if (val){
    return val;
  } else {
    return def;
  }
}

class Affiliation {
  constructor(props){
    this.state = {
      name: null,
      id: null,
      sources: [],
      notes: {},
    };

    this.setState(props);

    this._getHook = null;
    this._isAAffiliationObject = true;
  }

  static clone(item){
    let c = new Affiliation();
    c._getHook = item._getHook;
    c.state = lodash.cloneDeep(item.state);
  }

  getName(){
    return this.state.name;
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
    return `Affiliation(${this.getName()})`;
  }

  toDry(){
    return {value: this.state};
  }
};

Affiliation.unDry = function(value){
  return new Affiliation(value);
}

Dry.registerClass("Affiliation", Affiliation);

export default Affiliation;
