import Dry from "json-dry";
import { v4 as uuidv4 } from "uuid";
import lodash from "lodash";

import Source from "./Source";
import { KeyError, MissingError } from "./Errors";

function _generate_source_uid() {
  let uid = uuidv4();
  return "S" + uid.substring(uid.length - 7);
}

class Sources {
  constructor() {
    this.state = {
      registry: {},
    };

    this._names = {};
    this._isASourcesObject = true;
  }

  _updateHooks(hook) {
    this._getHook = hook;
    for (let key in this.state.registry) {
      this.state.registry[key]._updateHooks(hook);
    }
  }

  static clone(item) {
    let c = new Sources();
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
    return item instanceof Source || item._isASourceObject;
  }

  add(source) {
    if (!this.canAdd(source)) {
      return null;
    }

    let existing = null;

    try {
      existing = this.getByName(source.getName());
    } catch (error) {
        console.error(error);
    }

    if (existing) {
      existing = existing.merge(source);
      this.state.registry[existing.getID()] = existing;
      return existing;
    }

    source = Source.clone(source);

    let id = source.getID();

    if (id) {
      if (id in this.state.registry) {
        throw new KeyError(`Duplicate Source ID ${source}`);
      }

      source._updateHooks(this._getHook);
      this.state.registry[id] = source;
    } else {
      let uid = _generate_source_uid();

      while (uid in this.state.registry) {
        uid = _generate_source_uid();
      }

      source.state.id = uid;
    }

    source._updateHooks(this._getHook);
    this._names[source.getName()] = source.getID();
    this.state.registry[source.getID()] = source;

    return source;
  }

  getByName(name) {
    let id = this._names[name];

    if (id) {
      return this.get(id);
    } else {
      throw new MissingError(`No source with name ${name}`);
    }
  }

  search(name) {
    if (name instanceof Source || name._isASourceObject) {
      name = name.getName();
    }

    name = name.trim().toLowerCase();

    let results = [];

    Object.keys(this.state.registry).forEach((key) => {
      let item = this.state.registry[key];

      let description = item.getDescription();

      if (!description) {
        description = "";
      }

      try {
        if (item.getName().toLowerCase().indexOf(name) !== -1) {
          results.push(item);
        } else if (description.toLowerCase().indexOf(name) !== -1) {
          results.push(item);
        }
      } catch (error) {
        console.log(error);
      }
    });

    if (results.length === 1) {
      return results[0];
    } else if (results.length > 1) {
      return results;
    } else {
      return null;
    }
  }

  find(name) {
    if (name instanceof Source || name._isASourceObject) {
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

    throw new MissingError(`No source matches '${name}. Available sources are '${keys}'`);
  }

  get(id) {
    let source = this.state.registry[id];

    if (!source) {
      throw new MissingError(`No Source with ID ${id}`);
    }

    return source;
  }

  toDry() {
    return { value: this.state };
  }
}

Sources.unDry = function (value) {
  let sources = new Sources();
  sources.state = value;
  sources._names = {};

  Object.keys(value.registry).forEach((key) => {
    let v = value.registry[key];
    sources._names[v.getName()] = key;
  });

  return sources;
};

Dry.registerClass("Sources", Sources);

export default Sources;
