
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
      name: null,
      id: null,
      positions: {},     //should be a dictionary of positions...
      affiliations: {},  //should be a list of dated affiliation IDs
      projects: {},      //should be a list of dated project IDs
      sources: [],       //should be a list of source IDs
      dob: null,         // date of birth
      dod: null,         // date of death
      gender: null,
    };

    this.setState(props);
  }

  getID(){
    return this.state.id;
  }

  setState(state){
    if (state){
      this.state.name = setState(state.name);
      this.state.id = setState(state.id);
      this.state.positions = setState(state.positions, {});
      this.state.affiliations = setState(state.affiliations, {});
      this.state.projects = setState(state.projects, {});
      this.state.sources = setState(state.sources, []);
      this.state.dob = setState(state.dob);
      this.state.dod = setState(state.dod);
      this.state.gender = setState(state.gender);
    }
  }

  toString(){
    return `Person(name=${this.state.name} state=${this.state})`;
  }

  toDry(){
    return {value: this.state};
  }
};

Person.unDry = function(value){
  return new Person(value);
}

Person.load = function(data){
  return new Person({name: data.name});
}

Dry.registerClass(Person);

export default Person;
