
import Dry from 'json-dry';
import uuidv4 from 'uuid';
import vis from "vis-network";

import Person from "./Person";
import { KeyError, MissingError } from './Errors';

function _generate_person_uid(){
  let uid = uuidv4();
  return "P" + uid.substring(uid.length-7);
}

class People {
  constructor(props){
    this.state = {
      registry: {},
    };

    this._getHook = null;

    this.load(props);
  };

  _updateHooks(hook){
    this._getHook = hook;
    for (let key in this.state.registry){
      this.state.registry[key]._updateHooks(hook);
    }
  }

  find(name){
    for (let key in this.state.registry){
      let person = this.state.registry[key];
      if (person.getName().search(name) !== -1){
        return key;
      }
    }

    return null;
  }

  add(person){
    if (!(person instanceof Person)){ return;}

    let id = person.getID();

    if (id){
      if (id in this.state.registry){
        throw KeyError(`Duplicate Person ID ${person}`);
      }

      this.state.registry[id] = person;
    }
    else{
      let uid = _generate_person_uid();

      while (uid in this.state.registry){
        uid = _generate_person_uid();
      }

      person.state.id = uid;
      this.state.registry[uid] = person;
    }
  }

  getNodes({anchor=null, group_filter=null, node_filter=null} = {}){
    let nodes = new vis.DataSet();

    if (group_filter){
      group_filter = group_filter.getID();
    }

    for (let person in this.state.registry){
      let p = this.state.registry[person];
      if (person === anchor){
        nodes.add(p.getNode({is_anchor:true}));
      }
      else if (node_filter){
        if (p.getID() in node_filter){
          if (group_filter){
            if (p.inGroup(group_filter)){
              nodes.add(p.getNode());
            }
          }
          else{
            nodes.add(p.getNode());
          }
        }
      }
      else if (group_filter){
        if (p.inGroup(group_filter)){
          nodes.add(p.getNode());
        }
      }
      else{
        nodes.add(p.getNode());
      }
    }

    return nodes;
  }

  get(id){
    let person = this.state.registry[id];

    if (person === null){
      throw MissingError(`No Person with ID ${id}`);
    }

    return person;
  }

  load(data){
    if (data){
      if (data.array){ data = data.array; }
      data.forEach(element => {
        let person = Person.load(element);
        this.add(person);
      });
    }
  }

  toDry(){
    return {value: this.state};
  }
};

People.unDry = function(value){
  let people = new People();
  people.state = value;
  return people;
}

Dry.registerClass("People", People);

export default People;
