
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
    let parts = [];

    [this.getTitle, this.getFirstName,
     this.getSurname, this.getSuffix].map((part)=>{
      let p = part();
      if (p){
        parts.append(p);
      }

      return null;
     });

     return parts.join(" ");
  }

  getPositions(){
    let result = [];

    for (let [key, value] in Object.entries(this.state.positions)){
      result.append( [this._getHook(key), value] );
    }

    return result;
  }

  getAffiliations(){
    let result = [];

    for (let [key, value] in Object.entries(this.state.affiliations)){
      result.append( [this._getHook(key), value] );
    }

    return result;
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

  toDry(){
    return {value: this.state};
  }
};

Person.unDry = function(value){
  console.log("Person.unDry");
  return new Person(value);
}

Person.load = function(data){
  return new Person({name: data.name});
}

Dry.registerClass(Person);

export default Person;
