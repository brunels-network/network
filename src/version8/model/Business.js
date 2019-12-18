
import Dry from 'json-dry';

import DateRange from './DateRange';

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
      scores: {},
      affiliations: {},
      notes: {},
    };

    this.setState(props);

    this._getHook = null;
  }

  isNode(){
    return true;
  }

  getID(){
    return this.state.id;
  }

  filterWindow(window){
    if (!window){
      return this;
    }
    else if (!(window._isADateRangeObject)){
      window = new DateRange(window);
    }

    return this;
  }

  setState(state){
    if (state){
      this.state.name = setState(state.name);
      this.state.id = setState(state.id);
      this.state.affiliations = setState(state.affiliations, {});
      this.state.projects = setState(state.projects, {});
      this.state.sources = setState(state.sources, []);
      this.state.scores = setState(state.scores, {});
      this.state.notes = setState(state.notes, {})
    }
  }

  _updateHooks(hook){
    this._getHook = hook;
  }

  toString(){
    return `Business(${this.getName()})`;
  }

  getName(){
    return this.state.name;
  }

  inGroup(group){
    return group in this.state.affiliations;
  }

  getAffiliations(){
    let result = [];

    for (let key in this.state.affiliations){
      let value = this.state.affiliations[key];
      if (this._getHook){
        result.push( [this._getHook(key), value] );
      }
      else{
        result.push( [key, value] );
      }
    }

    return result;
  }

  getScores(){
    return this.state.scores;
  }

  getNode(is_anchor=false){
    let node = {
      id: this.getID(),
      label: this.getName(),
      title: this.getName(),
      shape: "dot",
     };

    let weight = 1.0;

    if (this.state.scores){
      weight = this.state.scores.weight;
      if (!weight){
        weight = 1.0;
      }
    }

    if (weight < 5.0){
      weight = 5.0;
    }
    else if (weight > 20.0){
      weight = 20.0;
    }

    node["size"] = weight;

    let keys = Object.keys(this.state.affiliations);

    if (keys.length > 0){
      node["group"] = keys.sort().join(":");
    }

    if (is_anchor){
      node["shape"] = "star";
      node["physics"] = false;
      node["group"] = "anchor";
      node["size"] = 20.0;
    }

    return node;
  }

  toDry(){
    return {value: this.state};
  }
};

Business.unDry = function(value){
  return new Business(value);
}

Dry.registerClass("Business", Business);

export default Business;
