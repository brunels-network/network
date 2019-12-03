
import Dry from "json-dry";

function setState(val, def=null){
  if (val){
    return val;
  } else {
    return def;
  }
}

class Person {
  constructor(props){
    this.state = {
      titles: [],
      firstnames: [],
      surnames: [],
      suffixes: [],
      id: null,
      positions: {},
      affiliations: {},
      projects: {},
      sources: [],
      scores: {},
      alive: null,
      gender: null,
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
      this.state.titles = setState(state.titles);
      this.state.firstnames = setState(state.firstnames);
      this.state.surnames = setState(state.surnames);
      this.state.suffixes = setState(state.suffixes);
      this.state.id = setState(state.id);
      this.state.positions = setState(state.positions, {});
      this.state.affiliations = setState(state.affiliations, {});
      this.state.projects = setState(state.projects, {});
      this.state.sources = setState(state.sources, []);
      this.state.alive = setState(state.alive);
      this.state.gender = setState(state.gender);
      this.state.scores = setState(state.scores, {});
      this.state.notes = setState(state.notes, {})
    }
  }

  _updateHook(hook){
    this._getHook = hook;
  }

  toString(){
    return `Person(${this.getName()})`;
  }

  getFirstName(){
    if (this.state.firstnames){
      return this.state.firstnames.join(" ");
    }
    else{
      return null;
    }
  }

  getTitle(){
    if (this.state.titles){
      return this.state.titles.join(" ");
    }
    else{
      return null;
    }
  }

  getSurname(){
    if (this.state.surnames){
      return this.state.surnames.join(" ");
    }
    else{
      return null;
    }
  }

  getSuffix(){
    if (this.state.suffixes){
      return this.state.suffixes.join(" ");
    }
    else{
      return null;
    }
  }

  getName(){
    var parts = [];

    let part = this.getTitle();
    if (part){
      parts.push(part);
    }

    part = this.getFirstName();
    if (part){
      parts.push(part);
    }

    part = this.getSurname();
    if (part){
      parts.push(part);
    }

    part = this.getSuffix();
    if (part){
      parts.push(part);
    }

    if (parts.length > 0){
       return parts.join(" ");
    }
    else{
      return "null";
    }
  }

  getPositions(){
    let result = [];

    for (let [key, value] in Object.entries(this.state.positions)){
      result.push( [this._getHook(key), value] );
    }

    return result;
  }

  getAffiliations(){
    let result = [];

    for (let [key, value] in Object.entries(this.state.affiliations)){
      result.push( [this._getHook(key), value] );
    }

    return result;
  }

  getScores(){
    return this.state.scores;
  }

  getBorn(){
    if (this.state.alive){
      return this.state.alive.getStart();
    }
    else{
      return null;
    }
  }

  getDied(){
    if (this.state.alive){
      return this.state.alive.getEnd();
    }
    else{
      return null;
    }
  }

  getNode(is_anchor=false){
    let node = {id: this.getID(),
                label: this.getName(),
                title: this.getName(),
                shape: "dot",
               };

    let weight = 10.0;

    if (this.state.scores){
      weight = this.state.scores.weight;
      if (!weight){
        weight = 10.0;
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

Person.unDry = function(value){
  return new Person(value);
}

Dry.registerClass(Person);

export default Person;
