import Dry from "json-dry";
import { v4 as uuidv4 } from "uuid";
import lodash from "lodash";

import Connection from "./Connection";
import { KeyError, MissingError } from "./Errors";

function _generate_connection_uid() {
  let uid = uuidv4();
  return "C" + uid.substring(uid.length - 7);
}

class Connections {
  constructor() {
    this.state = {
      registry: {},
    };

    this._names = {};
    this._isAConnectionsObject = true;
  }

  _updateHooks(hook) {
    this._getHook = hook;
    for (let key in this.state.registry) {
      this.state.registry[key]._updateHooks(hook);
    }
  }

  static clone(item) {
    let c = new Connections();
    c.state = lodash.cloneDeep(item.state);
    c._names = lodash.cloneDeep(item._names);
    c._getHook = item._getHook;
    return c;
  }

  canAdd(item) {
    return item instanceof Connection || item._isAConnectionObject;
  }

  add(connection) {
    if (!this.canAdd(connection)) {
      return null;
    }

    let existing = null;

    try {
      existing = this.getByName(connection.getName());
    } catch (error) {
      console.error(error);
    }

    if (existing) {
      existing = existing.merge(connection);
      this.state.registry[existing.getID()] = existing;
      return existing;
    }

    connection = Connection.clone(connection);

    let id = connection.getID();

    if (id) {
      if (id in this.state.registry) {
        throw new KeyError(`Duplicate Connection ID ${connection}`);
      }
    } else {
      let uid = _generate_connection_uid();

      while (uid in this.state.registry) {
        uid = _generate_connection_uid();
      }

      connection.state.id = uid;
    }

    connection._updateHooks(this._getHook);
    this._names[connection.getName()] = connection.getID();
    this.state.registry[connection.getID()] = connection;

    return connection;
  }

  getByName(name) {
    let id = this._names[name];

    if (id) {
      return this.get(id);
    } else {
      throw new MissingError(`No connection with name ${name}`);
    }
  }

  find(name) {
    if (name instanceof Connection || name._isAConnectionObject) {
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
    } else {
      return results;
    }

    // let keys = Object.keys(this._names).join("', '");

    // throw new TypeError(`No connection matches '${name}. Available Connections are '${keys}'`);
  }

  gotConnections(id) {
    return !(this.find(id).length === 0);
  }

  get(id) {
    let connection = this.state.registry[id];

    if (!connection) {
      throw new MissingError(`No Connection with ID ${id}`);
    }

    return connection;
  }

  filter(funcs = []) {
    if (funcs.length === 0) {
      return this;
    }

    let registry = {};
    let names = {};

    Object.keys(this.state.registry).forEach((key) => {
      let connection = this.state.registry[key];

      if (connection) {
        for (let i = 0; i < funcs.length; ++i) {
          connection = funcs[i](connection);
          if (!connection) {
            break;
          }
        }

        if (connection) {
          registry[key] = connection;
          names[connection.getName()] = key;
        }
      }
    });

    let connections = new Connections();

    connections.state.registry = registry;
    connections._names = names;
    connections._updateHooks(this._getHook);

    return connections;
  }

  getConnectionsTo(item) {
    if (item.getID) {
      let id = item.getID();
      item = {};
      item[id] = 1;
    }

    let nnodes = Object.keys(item).length;

    let seen = {};

    function _add(id) {
      if (!(id in seen)) {
        seen[id] = 1;
      } else {
        seen[id] += 1;
      }
    }

    for (let key in this.state.registry) {
      let connection = this.state.registry[key];

      if (connection.getNode0ID() in item) {
        _add(connection.getNode1ID());
      } else if (connection.getNode1ID() in item) {
        _add(connection.getNode0ID());
      }
    }

    let connections = [];

    if (this._getHook) {
      Object.keys(seen).forEach((key) => {
        try {
          if (seen[key] === nnodes) {
            connections.push(this._getHook(key));
          }
        } catch (error) {
          console.error(error);
        }
      });
    } else {
      connections = Object.keys(seen);
    }

    return connections;
  }

  getEdges(ids = null) {
    let edges = [];

    if (ids) {
      Object.keys(this.state.registry).forEach((key) => {
        let connection = this.state.registry[key];
        if (connection.areNodesVisible(ids)) {
          edges.push(connection.toEdge());
        }
      });
    } else {
      Object.keys(this.state.registry).forEach((key) => {
        let connection = this.state.registry[key];
        edges.push(connection.toEdge());
      });
    }

    return edges;
  }

  toDry() {
    return { value: this.state };
  }
}

Connections.unDry = function (value) {
  let connections = new Connections();
  connections.state = value;
  connections._names = {};

  Object.keys(value.registry).forEach((key) => {
    let v = value.registry[key];
    connections._names[v.getName()] = key;
  });

  return connections;
};

Dry.registerClass("Connections", Connections);

export default Connections;
