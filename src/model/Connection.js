import Dry from "json-dry";
import lodash from "lodash";

import DateRange from "./DateRange";

import get_id from "./get_id";

import { ValueError } from "./Errors";

function setState(val, def = null) {
  if (val) {
    return val;
  } else {
    return def;
  }
}

function _mergeSources(state, other, key) {
  state = state[key];
  other = other[key];

  Object.keys(other).forEach((key) => {
    if (!(key in state)) {
      state[key] = other[key];
    } else {
      for (let item in other[key]) {
        if (!(item in state[key])) {
          state[key].push(item);
        }
      }
    }
  });
}

class Connection {
  constructor(props) {
    this.state = {
      id: null,
      n0: null,
      n1: null,
      shared: null,
      type: null,
      duration: null,
      affiliations: null,
      correspondances: null,
      projects: null,
      notes: null,
      is_highlighted: false,
    };

    this.setState(props);
    this._getHook = null;
    this._isAConnectionObject = true;
  }

  static clone(item) {
    let c = new Connection();
    c._getHook = item._getHook;
    c.state = lodash.cloneDeep(item.state);
    return c;
  }

  _updateHooks(hook) {
    this._getHook = hook;
  }

  getID() {
    return this.state.id;
  }

  getName() {
    let n0 = this.state.n0;
    let n1 = this.state.n1;

    if (n0 <= n1) {
      return `${n0}<=>${n1}`;
    } else {
      return `${n1}<=>${n0}`;
    }
  }

  getNode0() {
    if (this._getHook) {
      return this._getHook(this.state.n0);
    } else {
      return this.state.n0;
    }
  }

  getNode1() {
    if (this._getHook) {
      return this._getHook(this.state.n1);
    } else {
      return this.state.n1;
    }
  }

  getNode0ID() {
    return this.state.n0;
  }

  getNode1ID() {
    return this.state.n1;
  }

  areNodesVisible(n) {
    return n[this.state.n0] && n[this.state.n1];
  }

  getNode0Name() {
    let node0 = this.getNode0();

    try {
      return node0.getName();
    } catch (error) {
      return node0;
    }
  }

  getNode1Name() {
    let node1 = this.getNode1();

    try {
      return node1.getName();
    } catch (error) {
      return node1;
    }
  }

  getDuration() {
    return this.state.duration;
  }

  getAffiliationSources() {
    //console.log(this.state.affiliations);
    return this.state.affiliations;
  }

  getCorrespondanceSources() {
    //console.log(this.state.correspondances);
    return this.state.correspondances;
  }

  filterSource(source) {
    if (source.getID) {
      let id = source.getID();
      source = {};
      source[id] = 1;
    }

    let nsources = Object.keys(source).length;

    let seen = {};

    Object.keys(source).forEach((key) => {
      if (this.state.affiliations[key] || this.state.correspondances[key]) {
        seen[key] = 1;
      }
    });

    if (Object.keys(seen).length !== nsources) {
      return null;
    } else {
      return this;
    }
  }

  filterProject(project) {
    // Filter this connection by project ID
    if (project.getID) {
      let id = project.getID();
      project = {};
      project[id] = 1;
    }

    let nProjects = Object.keys(project).length;

    let seen = {};

    Object.keys(this.state.projects).forEach((key) => {
      if (key in project) {
        seen[key] = 1;
      }
    });

    if (Object.keys(seen).length !== nProjects) {
      return null;
    } else {
      return this;
    }
  }

  filterWindow(window) {
    if (!window) {
      return this;
    } else if (!window._isADateRangeObject) {
      window = new DateRange(window);
    }

    if (!window) {
      return this;
    }

    let duration = this.getDuration();

    if (!duration) {
      return this;
    }

    let intersect = window.intersect(duration);

    if (!intersect) {
      return null;
    } else {
      return this;
    }
  }

  setState(state) {
    if (state) {
      this.state.id = setState(state.id);
      this.state.n0 = setState(state.n0);
      this.state.n1 = setState(state.n1);
      this.state.shared = setState(state.shared, []);
      this.state.type = setState(state.type);
      this.state.duration = setState(state.duration);
      this.state.affiliations = setState(state.affiliations, {});
      // note that correspondences is a typo from the python!
      this.state.correspondances = setState(state.correspondences, {});
      this.state.notes = setState(state.notes, []);
      this.state.weights = setState(state.weights, {});
      this.state.projects = setState(state.projects, {});

      if (!this.state.n0 || !this.state.n1) {
        throw new ValueError(`Invalid connection ${this}`);
      }
    }
  }

  merge(other) {
    if (!this._getHook) {
      if (other._getHook) {
        return other.merge(this);
      }
    }

    let state = lodash.cloneDeep(this.state);

    Object.keys(other.state.shared).forEach((key) => {
      if (!(key in state.shared)) {
        state.shared[key] = other.state.shared[key];
      }
    });

    Object.keys(other.state.notes).forEach((key) => {
      if (!(key in state.notes)) {
        state.notes[key] = other.state.notes[key];
      }
    });

    _mergeSources(state, other.state, "affiliations");
    _mergeSources(state, other.state, "correspondances");

    state.duration = state.duration.merge(other.state.duration);

    let c = new Connection();
    c.state = state;
    c._getHook = this._getHook;

    return c;
  }

  toString() {
    return `Connection(${this.getNode0Name()}<=>${this.getNode1Name()})`;
  }

  getColorFromType() {
    switch (this.state.type) {
      case "direct":
        return "rgb(180,150,150)";
      case "indirect":
        return "rgb(180,180,180)";
      default:
        return "orange";
    }
  }

  getType() {
    return this.state.type;
  }

  getWeights() {
    return this.state.weights;
  }

  getWeight() {
    let weight = 1.0;

    Object.keys(this.state.weights).forEach((key) => {
      weight += this.state.weights[key];
    });

    return weight;
  }

  getWeightFromType() {
    let weight = this.getWeight();

    switch (this.state.type) {
      case "direct":
        return 1.0 * weight;
      case "indirect":
        return 0.5 * weight;
      default:
        console.log(`Unknown type? ${this.state.type}`);
        return 0.5 * weight;
    }
  }

  setHighlighted(val) {
    if (val) {
      this.state.is_highlighted = true;
    }
    else {
      this.state.is_highlighted = false;
    }
  }

  getHighlighted() {
    return this.state.is_highlighted;
  }

  toEdge() {
    let color = this.getColorFromType();
    // let weight = this.getWeightFromType();
    let weight = this.getWeight();

    let edge = {
      id: this.getID(),
      source: get_id(this.state.n0),
      target: get_id(this.state.n1),
      value: weight,
      type: this.state.type,
      color: color,
      highlighted: this.getHighlighted(),
    };

    return edge;
  }

  toDry() {
    return { value: this.state };
  }
}

Connection.unDry = function (value) {
  return new Connection(value);
};

Connection.load = function (data) {
  return new Connection({ name: data.name });
};

Dry.registerClass("Connection", Connection);

export default Connection;
