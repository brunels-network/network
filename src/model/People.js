import Dry from "json-dry";
import { v4 as uuidv4 } from "uuid";
import lodash from "lodash";

import Person from "./Person";
import { KeyError, MissingError } from "./Errors";

function _generate_person_uid() {
  let uid = uuidv4();
  return "P" + uid.substring(uid.length - 7);
}

class People {
  constructor(props) {
    this.state = {
      registry: {},
    };

    this._names = {};
    this._isAPeopleObject = true;
    this.load(props);
  }

  _updateHooks(hook) {
    this._getHook = hook;
    for (let key in this.state.registry) {
      this.state.registry[key]._updateHooks(hook);
    }
  }

  static clone(item) {
    let c = new People();
    c.state = lodash.cloneDeep(item.state);
    c._names = lodash.cloneDeep(item._names);
    c._getHook = item._getHook;
    return c;
  }

  values() {
    let names = Object.keys(this._names);
    names.sort();

    let output = [];

    names.forEach((key) => {
      output.push(this.get(this._names[key]));
    });

    return output;
  }

  canAdd(item) {
    return item instanceof Person || item._isAPersonObject;
  }

  add(person) {
    if (!this.canAdd(person)) {
      return null;
    }

    let existing = null;

    try {
      existing = this.getByName(person.getName());
    } catch (error) {
      console.error(error);
    }

    if (existing) {
      existing = existing.merge(person);
      this.state.registry[existing.getID()] = existing;
      return existing;
    }

    person = Person.clone(person);

    let id = person.getID();

    if (id) {
      if (id in this.state.registry) {
        throw new KeyError(`Duplicate Person ID ${person}`);
      }

      person._updateHooks(this._getHook);
      this.state.registry[id] = person;
    } else {
      let uid = _generate_person_uid();

      while (uid in this.state.registry) {
        uid = _generate_person_uid();
      }

      person.state.id = uid;
    }

    person._updateHooks(this._getHook);
    this._names[person.getName()] = person.getID();
    this.state.registry[person.getID()] = person;

    return person;
  }

  getByName(name) {
    let id = this._names[name];

    if (id) {
      return this.get(id);
    } else {
      throw new MissingError(`No Person with name ${name}`);
    }
  }

  find(name) {
    if (name instanceof Person || name._isAPersonObject) {
      return this.get(name.getID());
    }

    name = name.trim().toLowerCase();

    let results = [];

    Object.keys(this._names).forEach((key) => {
      if (key.toLowerCase().indexOf(name) !== -1) {
        results.push(this.get(this._names[key]));
      }
    });

    if (results.length === 1) {
      return results[0];
    } else if (results.length > 1) {
      return results;
    }

    // let keys = Object.keys(this._names).join("', '");

    // throw new MissingError(`No Person matches '${name}. Available People are '${keys}'`);
  }

  filter(funcs = []) {
    if (funcs.length === 0) {
      return this;
    }

    let registry = {};
    let names = {};

    Object.keys(this.state.registry).forEach((key) => {
      let person = this.state.registry[key];

      if (person) {
        for (let i = 0; i < funcs.length; ++i) {
          person = funcs[i](person);
          if (!person) {
            break;
          }
        }

        if (person) {
          registry[key] = person;
          names[person.getName()] = key;
        }
      }
    });

    let people = new People();
    people.state.registry = registry;
    people._names = names;
    people._updateHooks(this._getHook);

    return people;
  }

  getTimeLine() {
    let items = [];

    Object.keys(this.state.registry).forEach((key) => {
      let person = this.state.registry[key];
      if (person) {
        let timeline = person.getTimeLine();
        if (timeline) {
          items.push(timeline);
        }
      }
    });

    return items;
  }

  getNodes({ anchor = null } = {}) {
    let nodes = [];

    if (anchor.getID) {
      anchor = anchor.getID();
    }

    Object.keys(this.state.registry).forEach((key) => {
      let person = this.state.registry[key];

      if (person) {
        let node = null;
        if (key === anchor) {
          node = person.getNode({ is_anchor: true });
        } else {
          node = person.getNode();
        }

        if (node) {
          nodes.push(node);
        }
      }
    });

    return nodes;
  }

  getRegistry() {
    // Returns the registry of people
    // key: value - uid: person
    return this.state.registry;
  }

  get(id) {
    let person = this.state.registry[id];

    if (!person) {
      throw new MissingError(`No Person with ID ${id}`);
    }

    return person;
  }

  load(data) {
    if (data) {
      if (data.array) {
        data = data.array;
      }
      data.forEach((element) => {
        let person = Person.load(element);
        this.add(person);
      });
    }
  }

  toDry() {
    return { value: this.state };
  }
}

People.unDry = function (value) {
  let people = new People();
  people.state = value;
  people._names = {};

  Object.keys(value.registry).forEach((key) => {
    let v = value.registry[key];
    people._names[v.getName()] = key;
  });

  return people;
};

Dry.registerClass("People", People);

export default People;
