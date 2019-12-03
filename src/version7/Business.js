
import Dry from "json-dry";

function setState(val, def=null){
  if (val){
    return val;
  } else {
    return def;
  }
}

class Business {
  constructor(props){
    this.state = {
      name: null,
      id: null,
      projects: {},
      sources: [],
      affiliations: {},
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
      this.state.affiliations = setState(state.affiliations, {});
      this.state.projects = setState(state.projects, {});
      this.state.sources = setState(state.sources, []);
      this.state.notes = setState(state.notes, {})
    }
  }

  _updateHook(hook){
    this._getHook = hook;
  }

  toString(){
    return `Business(${this.getName()})`;
  }

  getName(){
    return this.state.name;
  }

  getAffiliations(){
    let result = [];

    for (let [key, value] in Object.entries(this.state.affiliations)){
      result.push( [this._getHook(key), value] );
    }

    return result;
  }

  getNode(){
    return {id: this.getID(), text: this.getName()};
  }

  toDry(){
    return {value: this.state};
  }
};

Business.unDry = function(value){
  return new Business(value);
}

Dry.registerClass(Business);

export default Business;
