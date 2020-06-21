import Dry from "json-dry";
import { v4 as uuidv4 } from "uuid";
import lodash from "lodash";

import Business from "./Business";
import { KeyError, MissingError } from "./Errors";

function _generate_business_uid() {
  let uid = uuidv4();
  return "B" + uid.substring(uid.length - 7);
}

class Businesses {
  constructor(props) {
    this.state = {
      registry: {},
    };

    this._names = {};
    this._isABusinessesObject = true;
    this.load(props);
  }

  _updateHooks(hook) {
    this._getHook = hook;
    for (let key in this.state.registry) {
      this.state.registry[key]._updateHooks(hook);
    }
  }

  static clone(item) {
    let c = new Businesses();
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
    return item instanceof Business || item._isABusinessObject;
  }

  add(business) {
    if (!this.canAdd(business)) {
      return null;
    }

    let existing = null;

    try {
      existing = this.getByName(business.getName());
    } catch (error) {
      console.error(error);
    }

    if (existing) {
      existing = existing.merge(business);
      this.state.registry[existing.getID()] = existing;
      return existing;
    }

    business = Business.clone(business);

    let id = business.getID();

    if (id) {
      if (id in this.state.registry) {
        throw new KeyError(`Duplicate Business ID ${business}`);
      }

      business._updateHooks(this._getHook);
      this.state.registry[id] = business;
    } else {
      let uid = _generate_business_uid();

      while (uid in this.state.registry) {
        uid = _generate_business_uid();
      }

      business.state.id = uid;
    }

    business._updateHooks(this._getHook);
    this._names[business.getName()] = business.getID();
    this.state.registry[business.getID()] = business;

    return business;
  }

  getByName(name) {
    let id = this._names[name];

    if (id) {
      return this.get(id);
    } else {
      throw new MissingError(`No Business with name ${name}`);
    }
  }

  find(name) {
    if (name instanceof Business || name._isABusinessObject) {
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

    // throw new MissingError(`No Business matches '${name}. Available Businesses are '${keys}'`);
  }

  filter(funcs = []) {
    if (funcs.length === 0) {
      return this;
    }

    let registry = {};
    let names = {};

    Object.keys(this.state.registry).forEach((key) => {
      let business = this.state.registry[key];

      if (business) {
        for (let i = 0; i < funcs.length; ++i) {
          business = funcs[i](business);
          if (!business) {
            break;
          }
        }

        if (business) {
          registry[key] = business;
          names[business.getName()] = key;
        }
      }
    });

    let businesses = new Businesses();
    businesses.state.registry = registry;
    businesses._names = names;
    businesses._updateHooks(this._getHook);

    return businesses;
  }

  getTimeLine() {
    let items = [];

    Object.keys(this.state.registry).forEach((key) => {
      let business = this.state.registry[key];
      if (business) {
        let timeline = business.getTimeLine();
        if (timeline) {
          items.push(timeline);
        }
      }
    });

    return items;
  }

  getNodes({ anchor = null } = {}) {
    let nodes = [];

    Object.keys(this.state.registry).forEach((key) => {
      let business = this.state.registry[key];

      if (business) {
        let node = null;
        if (key === anchor) {
          node = business.getNode({ is_anchor: true });
        } else {
          node = business.getNode();
        }

        if (node) {
          nodes.push(node);
        }
      }
    });

    return nodes;
  }

  get(id) {
    let business = this.state.registry[id];

    if (!business) {
      throw new MissingError(`No Business with ID ${id}`);
    }

    return business;
  }

  getRegistry() {
    // Returns the registry of people
    // key: value - uid: person
    return this.state.registry;
  }

  load(data) {
    if (data) {
      if (data.array) {
        data = data.array;
      }
      data.forEach((element) => {
        let business = Business.load(element);
        this.add(business);
      });
    }
  }

  toDry() {
    return { value: this.state };
  }
}

Businesses.unDry = function (value) {
  let businesses = new Businesses();
  businesses.state = value;
  businesses._names = {};

  Object.keys(value.registry).forEach((key) => {
    let v = value.registry[key];
    businesses._names[v.getName()] = key;
  });

  return businesses;
};

Dry.registerClass("Businesses", Businesses);

export default Businesses;
