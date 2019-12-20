
import Dry from 'json-dry';
import lodash from 'lodash';

import DateRange from './DateRange';

function setState(val, def=null){
  if (val){
    return val;
  } else {
    return def;
  }
}

function _filterWindow(values, window){
  if (!values){
    return values;
  }

  let ret = null;

  Object.keys(values).forEach((key, index)=>{
    let dates = values[key];

    let intersect = window.intersect(dates);

    if (!intersect){
      if (!ret){ ret = {...values}}
      delete ret[key];
    }
  });

  if (ret){
    return ret;
  }
  else{
    return values;
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
      group = group.getID();
    }

    return (group in this.state.affiliations);
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

    let affiliations = _filterWindow(this.state.affiliations, window);

    if (affiliations !== this.state.affiliations){
      let business = new Business();
      business.state = {...this.state};
      business.state.affiliations = affiliations;
      business._getHook = this._getHook;
      return business;
    }
    else{
      return this;
    }
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
