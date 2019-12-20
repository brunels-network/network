
import Dry from 'json-dry';
import uuidv4 from 'uuid';
import vis from 'vis-network';
import lodash from 'lodash';

import Person from './Person';

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
    this._isAPeopleObject = true;

    this.load(props);
  };

  _updateHooks(hook){
    this._getHook = hook;
    for (let key in this.state.registry){
      this.state.registry[key]._updateHooks(hook);
    }
  }

  static clone(item){
    let c = new People();
    c.state = lodash.cloneDeep(item.state);
    c._getHook = item._getHook;
    return c;
  }

  canAdd(item){
    return (item instanceof Person) || item._isAPersonObject;
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
    if (!this.canAdd(person)){ return;}

    person = Person.clone(person);

    let id = person.getID();

    if (id){
      if (id in this.state.registry){
        throw new KeyError(`Duplicate Person ID ${person}`);
      }

      person._updateHooks(this._getHook);
      this.state.registry[id] = person;
    }
    else{
      let uid = _generate_person_uid();

      while (uid in this.state.registry){
        uid = _generate_person_uid();
      }

      person.state.id = uid;
      person._updateHooks(this._getHook);
      this.state.registry[uid] = person;
    }
  }

  filter(funcs = []){
    if (funcs.length === 0){
      return this;
    }

    let registry = {};

    Object.keys(this.state.registry).forEach((key, index)=>{
      let person = this.state.registry[key];

      if (person){
        for (let i=0; i<funcs.length; ++i){
          person = funcs[i](person);
          if (!person){
            break;
          }
        }

        if (person){
          registry[key] = person;
        }
      }
    });

    let people = new People();
    people.state.registry = registry;
    people._updateHooks(this._getHook);

    return people;
  }

  getTimeLine(){
    let items = [];

    Object.keys(this.state.registry).forEach((key, index)=>{
      let person = this.state.registry[key];
      if (person){
        let timeline = person.getTimeLine();
        if (timeline){
          items.push(timeline);
        }
      }
    });

    return items;
  }

  getNodes({anchor=null} = {}){
    let nodes = new vis.DataSet();

    Object.keys(this.state.registry).forEach((key, index)=>{
      let person = this.state.registry[key];

      if (person){
        let node = null;
        if (key === anchor){
          node = person.getNode({is_anchor:true});
        }
        else{
          node = person.getNode();
        }

        if (node){
          nodes.add(node);
        }
      }
    });

    return nodes;
  }

  get(id){
    let person = this.state.registry[id];

    if (person === null){
      throw new MissingError(`No Person with ID ${id}`);
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
