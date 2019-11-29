
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
      labels: [],
      dob: null,    // date of birth
      dod: null,    // date of death
      gender: null,
    };

    this.setState(props);
  }

  setState(state){
    if (state){
      this.state.name = setState(state.name);
      this.state.id = setState(state.id);
      this.state.labels = setState(state.labels, []);
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

Person.unDry = function unDry(value){
  console.log(value);
  return new Person(value);
}

Dry.registerClass(Person);

export default Person;
