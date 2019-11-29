
import Dry from 'json-dry';
import uuidv4 from 'uuid';

import Person from "./Person";
import { KeyError, MissingError } from './Errors';

function _generate_person_uid(){
  let uid = uuidv4();
  return uid.substring(uid.length-8);
}

class People {
  constructor(props){
    this.state = {
      registry: {},
    };
  };

  add(person){
    if (!(person instanceof Person)){ return;}

    let id = person.getID();

    if (id){
      if (id in this.state.registry){
        throw KeyError(`Duplicate Person ID ${person}`);
      }

      this.state.registry[person.id] = person;
    }
    else{
      let uid = _generate_person_uid();

      while (uid in this.state.registry){
        uid = _generate_person_uid();
      }

      person.state.id = uid;
      this.state.registry[person.state.id] = person;
    }
  }

  get(id){
    let person = this.state.registry[id];

    if (person === null){
      throw MissingError(`No Person with ID ${id}`);
    }

    return person;
  }

  toDry(){
    return {value: this.state.registry};
  }
};

People.unDry = function(value){
  let people = new People();
  people.state.registry = value;
  return people;
}

Dry.registerClass(People);

export default People;
