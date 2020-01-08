
import Dry from "json-dry";
import lodash from 'lodash';

import {ValueError} from './Errors';

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
      notes: [],
    };

    this.setState(props);

    this._getHook = null;
    this._isABusinessObject = true;
  }

  static clone(item){
    let c = new Business();
    c._getHook = item._getHook;
    c.state = lodash.cloneDeep(item.state);
    return c;
  }

  isNode(){
    return true;
  }

  inGroup(group){
    if (group.getID){
      let ids = {}
      ids[group.getID()] = 1;
      group = ids;
    }

    let in_group = false;

    Object.keys(this.state.affiliations).forEach((key, _i)=>{
      if (in_group){
        return;
      }

      for (let index in this.state.affiliations[key]){
        if (this.state.affiliations[key][index] in group){
          in_group = true;
          return;
        }
      }
    });

    return in_group;
  }

  getID(){
    return this.state.id;
  }

  filterWindow(window){
    return this;
  }

  setState(state){
    if (state){
      this.state.name = setState(state.name);
      this.state.id = setState(state.id);
      this.state.projects = setState(state.projects, {});
      this.state.affiliations = setState(state.affiliations, {});
      this.state.scores = setState(state.scores, {});
      this.state.sources = setState(state.sources, []);
      this.state.notes = setState(state.notes, []);

      if (!this.state.name){
        throw ValueError("You cannot have an Business without a name");
      }
    }
  }

  _updateHooks(hook){
    this._getHook = hook;
  }

  merge(other){
    return this;
  }

  toString(){
    return `Business(${this.getName()})`;
  }

  getName(){
    return this.state.name;
  }

  getAffiliations(){
    return this.state.affiliations;
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

    let keys = [];

    if (keys.length > 0){
      node["group"] = keys.sort().join(":");
    }
    else{
      node["group"] = "unknown";
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
