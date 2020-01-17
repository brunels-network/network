
import Dry from 'json-dry';
import lodash from 'lodash';

import DateRange from './DateRange';

import {ValueError} from './Errors';

function setState(val, def=null){
  if (val){
    return val;
  } else {
    return def;
  }
}

function _mergeSources(state, other, key){
  state = state[key];
  other = other[key]

  Object.keys(other).forEach((key, index) => {
    if (!(key in state)){
      state[key] = other[key];
    }
    else{
      for (let item in other[key]){
        if (!(item in state[key])){
          state[key].push(item);
        }
      }
    }
  });
}

class Connection {
  constructor(props){
    this.state = {
      id: null,
      n0: null,
      n1: null,
      shared: null,
      type: null,
      duration: null,
      affiliations: null,
      correspondances: null,
      projects: null,
      notes: null,
    };

    this.setState(props);
    this._getHook = null;
    this._isAConnectionObject = true;
  }

  static clone(item){
    let c = new Connection();
    c._getHook = item._getHook;
    c.state = lodash.cloneDeep(item.state);
    return c;
  }

  _updateHooks(hook){
    this._getHook = hook;
  }

  getID(){
    return this.state.id;
  }

  getName(){
    let n0 = this.state.n0;
    let n1 = this.state.n1;

    if (n0 <= n1){
      return `${n0}<=>${n1}`;
    }
    else{
      return `${n1}<=>${n0}`;
    }
  }

  getNode0(){
    if (this._getHook){
      return this._getHook(this.state.n0);
    }
    else {
      return this.state.n0;
    }
  }

  getNode1(){
    if (this._getHook){
      return this._getHook(this.state.n1);
    }
    else {
      return this.state.n1;
    }
  }

  getNode0ID(){
    return this.state.n0;
  }

  getNode1ID(){
    return this.state.n1;
  }

  getNode0Name(){
    let node0 = this.getNode0();

    try{
      return node0.getName();
    }
    catch(error){
      return node0;
    }
  }

  getNode1Name(){
    let node1 = this.getNode1();

    try{
      return node1.getName();
    }
    catch(error){
      return node1;
    }
  }

  getDuration(){
    return this.state.duration;
  }

  getAffiliationSources(){
    return this.state.affiliations;
  }

  getCorrespondanceSources(){
    return this.state.correspondances;
  }

  filterProject(project){
    if (project.getID){
      let id = project.getID();
      project = {};
      project[id] = 1;
    }

    let nprojects = Object.keys(project).length;

    let seen = {};

    Object.keys(this.state.projects).forEach((key, index)=>{
      if (key in project){
        seen[key] = 1;
      }
    });

    if (Object.keys(seen).length !== nprojects){
      return null;
    }
    else{
      return this;
    }
  }

  filterWindow(window){
    if (!window){
      return this;
    }
    else if (!(window._isADateRangeObject)){
      window = new DateRange(window);
    }

    if (!window){
      return this;
    }

    let duration = this.getDuration();

    if (!duration){
      return this;
    }

    let intersect = window.intersect(duration);

    if (!intersect){
      return null;
    }
    else{
      return this;
    }
  }

  setState(state){
    if (state){
      this.state.id = setState(state.id);
      this.state.n0 = setState(state.n0);
      this.state.n1 = setState(state.n1);
      this.state.shared = setState(state.shared, []);
      this.state.type = setState(state.type);
      this.state.duration = setState(state.duration);
      this.state.affiliations = setState(state.affiliations, {});
      this.state.correspondances = setState(state.correspondances, {});
      this.state.notes = setState(state.notes, []);
      this.state.projects = setState(state.projects, {});

      if (!this.state.n0 || !this.state.n1){
        throw new ValueError(`Invalid connection ${this}`);
      }
    }
  }

  merge(other){
    if (!this._getHook){
      if (other._getHook){
        return other.merge(this);
      }
    }

    let state = lodash.cloneDeep(this.state);

    Object.keys(other.state.shared).forEach((key, index) => {
      if (!(key in state.shared)){
        state.shared[key] = other.state.shared[key];
      }
    });

    Object.keys(other.state.notes).forEach((key, index) => {
      if (!(key in state.notes)){
        state.notes[key] = other.state.notes[key];
      }
    });

    _mergeSources(state, other.state, "affiliations");
    _mergeSources(state, other.state, "correspondances");

    state.duration = state.duration.merge(other.state.duration);

    let c = new Connection();
    c.state = state;
    c._getHook = this._getHook;

    return c;
  }

  toString(){
    return `Connection(${this.getNode0Name()}<=>${this.getNode1Name()})`;
  }

  getColorFromType(){
    switch(this.state.type){
      case "direct":
        return "rgb(250,200,200)";
      case "indirect":
        return "rgb(180,180,180)";
      default:
        console.log(`Unknown type? ${this.state.type}`);
        return "red";
    }
  }

  getWeightFromType(){
    switch(this.state.type){
      case "direct":
        return 1.0;
      case "indirect":
        return 0.5;
      default:
        console.log(`Unknown type? ${this.state.type}`);
        return 0.5;
    }
  }

  toEdge(){
    let color = this.getColorFromType();
    let weight = this.getWeightFromType();

    let edge = {
      id:this.getID(),
      from:this.state.n0,
      to:this.state.n1,
      value:weight,
      color:color,
      scaling:{min:0.5, max:1},
      arrows:{to:false, middle:false, from:false},
    };

    return edge;
  }

  toDry(){
    return {value: this.state};
  }
};

Connection.unDry = function(value){
  return new Connection(value);
}

Connection.load = function(data, people=null){
  return new Connection({name: data.name});
}

Dry.registerClass("Connection", Connection);

export default Connection;
