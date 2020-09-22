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

class Position {
  constructor(props) {
    this.state = {
      name: null,
      id: null,
      sources: [],
      notes: [],
    };

    this.setState(props);

    this._getHook = null;
    this._isAPositionObject = true;
  }

  static clone(item) {
    let c = new Position();
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

      this.state.canonical = Position.makeCanonical(this.state.name);

      if (!this.state.name){
        throw new ValueError("You cannot have an Position without a name");
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
    return `Position(${this.getName()})`;
  }

  getName() {
    return this.state.name;
  }

  getCanonical() {
    return this.state.canonical;
  }

  toDry() {
    return { value: this.state };
  }
}

Position.unDry = function (value) {
  return new Position(value);
};

Dry.registerClass("Position", Position);

export default Position;
