import Dry from "json-dry";
import { v4 as uuidv4 } from "uuid";
import lodash from "lodash";

import Position from "./Position";
import { KeyError, MissingError } from "./Errors";

function _generate_position_uid() {
  let uid = uuidv4();
  return "Q" + uid.substring(uid.length - 7);
}

class Positions {
  constructor() {
    this.state = {
      registry: {},
    };

    this._names = {};
    this._isAPositionsObject = true;
  }

  _updateHooks(hook) {
    this._getHook = hook;
    for (let key in this.state.registry) {
      this.state.registry[key]._updateHooks(hook);
    }
  }

  static clone(item) {
    let c = new Positions();
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

  items() {
    return this._names;
  }

  canAdd(item) {
    return item instanceof Position || item._isAPositionObject;
  }

  add(position) {
    if (!this.canAdd(position)) {
      return null;
    }

    let existing = null;

    try {
      existing = this.getByName(position.getName());
    } catch (error) {
      console.error(error);
    }

    if (existing) {
      existing = existing.merge(position);
      this.state.registry[existing.getID()] = existing;
      return existing;
    }

    position = Position.clone(position);

    let id = position.getID();

    if (id) {
      if (id in this.state.registry) {
        throw new KeyError(`Duplicate Position ID ${position}`);
      }

      position._updateHooks(this._getHook);
      this.state.registry[id] = position;
    } else {
      let uid = _generate_position_uid();

      while (uid in this.state.registry) {
        uid = _generate_position_uid();
      }

      position.state.id = uid;
    }

    position._updateHooks(this._getHook);
    this._names[position.getName()] = position.getID();
    this.state.registry[position.getID()] = position;

    return position;
  }

  getByName(name) {
    let id = this._names[name];

    if (id) {
      return this.get(id);
    } else {
      throw new MissingError(`No position with name ${name}`);
    }
  }

  getNameByID(id) {
    return this.get(id).getName();
  }

  find(name) {
    if (name instanceof Position || name._isApositionObject) {
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

    let keys = Object.keys(this._names).join("', '");

    throw new MissingError(`No position matches '${name}. Available Positions are '${keys}'`);
  }

  get(id) {
    let position = this.state.registry[id];

    if (!position) {
      throw new MissingError(`No Position with ID ${id}`);
    }

    return position;
  }

  toDry() {
    return { value: this.state };
  }
}

Positions.unDry = function (value) {
  let positions = new Positions();
  positions.state = value;
  positions._names = {};

  Object.keys(value.registry).forEach((key) => {
    let v = value.registry[key];
    positions._names[v.getName()] = key;
  });

  return positions;
};

Dry.registerClass("Positions", Positions);

export default Positions;
