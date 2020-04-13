import Dry from "json-dry";
import lodash from "lodash";

import { ValueError } from "./Errors";

function setState(val, def = null) {
  if (val) {
    return val;
  } else {
    return def;
  }
}

class Affiliation {
  constructor(props) {
    this.state = {
      name: null,
      id: null,
      sources: [],
      notes: [],
    };

    this.setState(props);

    this._getHook = null;
    this._isAAffiliationObject = true;
  }

  static clone(item) {
    let c = new Affiliation();
    c._getHook = item._getHook;
    c.state = lodash.cloneDeep(item.state);
    return c;
  }

  getID() {
    return this.state.id;
  }

  static makeCanonical(name) {
    if (!name) {
      return null;
    } else {
      return name.trim().toLowerCase();
    }
  }

  setState(state) {
    if (state) {
      this.state.name = setState(state.name);
      this.state.id = setState(state.id);
      this.state.notes = setState(state.notes, []);
      this.state.sources = setState(state.sources, []);

      this.state.canonical = Affiliation.makeCanonical(this.state.name);

      if (!this.state.name) {
        throw ValueError("You cannot have an Affiliation without a name");
      }
    }
  }

  _updateHooks(hook) {
    this._getHook = hook;
  }

  merge() {
    return this;
  }

  toString() {
    return `Affiliation(${this.getName()})`;
  }

  getName() {
    return this.state.name;
  }

  toDry() {
    return { value: this.state };
  }
}

Affiliation.unDry = function (value) {
  return new Affiliation(value);
};

Dry.registerClass("Affiliation", Affiliation);

export default Affiliation;
