import Dry from "json-dry";
import lodash from "lodash";

import DateRange from "./DateRange";

import fixedNodes from "../data/fixedNodes.json";

import { ValueError } from "./Errors";

function setState(val, def = null) {
  if (val) {
    return val;
  } else {
    return def;
  }
}

function _filterWindow(values, window) {
  if (!values) {
    return values;
  }

  let ret = null;

  Object.keys(values).forEach((key) => {
    let dates = values[key];

    let intersect = window.intersect(dates);

    if (!intersect) {
      if (!ret) {
        ret = { ...values };
      }
      delete ret[key];
    }
  });

  if (ret) {
    return ret;
  } else {
    return values;
  }
}

function _filterProject(values, project) {
  if (!values) {
    return values;
  }

  let ret = null;

  Object.keys(values).forEach((key) => {
    if (!(key in project)) {
      if (!ret) {
        ret = { ...values };
      }
      delete ret[key];
    }
  });

  if (ret) {
    return ret;
  } else {
    return values;
  }
}

class Person {
  constructor(props) {
    this.state = {
      name: null,
      titles: [],
      firstnames: [],
      surnames: [],
      suffixes: [],
      id: null,
      positions: {},
      affiliations: {},
      projects: {},
      sources: {},
      alive: null,
      gender: null,
      notes: [],
      orig_name: null,
      weight: {},
      edge_count: {},
    };

    this.setState(props);

    this._getHook = null;
    this._isAPersonObject = true;
  }

  static clone(item) {
    let c = new Person();
    c._getHook = item._getHook;
    c.state = lodash.cloneDeep(item.state);
    return c;
  }

  isNode() {
    return true;
  }

  inGroup(group) {
    if (group.getID) {
      let ids = {};
      ids[group.getID()] = 1;
      group = ids;
    }

    let seen = {};

    Object.keys(this.state.affiliations).forEach((key) => {
      for (let index in this.state.affiliations[key]) {
        if (this.state.affiliations[key][index] in group) {
          seen[this.state.affiliations[key][index]] = 1;
        }
      }
    });

    Object.keys(this.state.positions).forEach((key) => {
      for (let index in this.state.positions[key]) {
        if (this.state.positions[key][index] in group) {
          seen[this.state.positions[key][index]] = 1;
        }
      }
    });

    return Object.keys(seen).length === Object.keys(group).length;
  }

  getID() {
    return this.state.id;
  }

  filterSource(source) {
    if (source.getID) {
      let id = source.getID();
      source = {};
      source[id] = 1;
    }

    let nsources = Object.keys(source).length;

    let seen = {};

    Object.keys(this.state.sources).forEach((key) => {
      let s = this.state.sources[key];

      Object.keys(source).forEach((source_id) => {
        if (s.includes(source_id)) {
          seen[source_id] = 1;
        }
      });
    });

    if (Object.keys(seen).length !== nsources) {
      return null;
    } else {
      return this;
    }
  }

  filterProject(project) {
    if (project.getID) {
      let id = project.getID();
      project = {};
      project[id] = 1;
    }

    let nprojects = Object.keys(project).length;

    let seen = {};

    Object.keys(this.state.projects).forEach((key) => {
      if (key in project) {
        seen[key] = 1;
      }
    });

    if (Object.keys(seen).length !== nprojects) {
      return null;
    }

    let affiliations = _filterProject(this.state.affiliations, project);
    let positions = _filterProject(this.state.positions, project);

    if (affiliations !== this.state.affiliations || positions !== this.state.positions) {
      let person = new Person();
      person.state = { ...this.state };
      person.state.affiliations = affiliations;
      person.state.positions = positions;
      person._getHook = this._getHook;
      return person;
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

    window = window.intersect(this.getAlive());

    if (!window) {
      return null;
    }

    let affiliations = _filterWindow(this.state.affiliations, window);
    let positions = _filterWindow(this.state.positions, window);

    if (affiliations !== this.state.affiliations || positions !== this.state.positions) {
      let person = new Person();
      person.state = { ...this.state };
      person.state.affiliations = affiliations;
      person.state.positions = positions;
      person._getHook = this._getHook;
      return person;
    } else {
      return this;
    }
  }

  setState(state) {
    if (state) {
      this.state.titles = setState(state.titles, []);
      this.state.firstnames = setState(state.firstnames, []);
      this.state.surnames = setState(state.surnames, []);
      this.state.suffixes = setState(state.suffixes, []);
      this.state.id = setState(state.id);
      this.state.positions = setState(state.positions, {});
      this.state.affiliations = setState(state.affiliations, {});
      this.state.projects = setState(state.projects, {});
      this.state.sources = setState(state.sources, {});
      this.state.alive = setState(state.alive);
      this.state.gender = setState(state.gender);
      this.state.orig_name = setState(state.orig_name);
      this.state.notes = setState(state.notes, []);
      this.state.weight = setState(state.weight);
      this.state.edge_count = setState(state.edge_count);

      if (!this.state.orig_name || this.state.orig_name === "None") {
        throw new ValueError(`No name for ${this}`);
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
    return `Person(${this.getName()})`;
  }

  getAlive() {
    return this.state.alive;
  }

  getFirstName() {
    if (this.state.firstnames) {
      return this.state.firstnames.join(" ");
    } else {
      return null;
    }
  }

  getTitle() {
    if (this.state.titles) {
      return this.state.titles.join(" ");
    } else {
      return null;
    }
  }

  getSurname() {
    if (this.state.surnames) {
      return this.state.surnames.join(" ");
    } else {
      return null;
    }
  }

  getSuffix() {
    if (this.state.suffixes) {
      return this.state.suffixes.join(" ");
    } else {
      return null;
    }
  }

  getName() {
    var parts = [];

    let part = this.getTitle();
    if (part) {
      parts.push(part);
    }

    part = this.getFirstName();
    if (part) {
      parts.push(part);
    }

    part = this.getSurname();
    if (part) {
      parts.push(part);
    }

    part = this.getSuffix();
    if (part) {
      parts.push(part);
    }

    if (parts.length > 0) {
      return parts.join(" ");
    } else {
      return "null";
    }
  }

  getAffiliations() {
    return this.state.affiliations;
  }

  getSources() {
    return this.state.sources;
  }

  getPositions() {
    // Returns the positions object for each project
    return this.state.positions;
  }

  getPosition(projectID) {
    // Return the position for the associated projectID
    // Returns an array of position IDs
    return this.state.positions[projectID];
  }

  getScores() {
    return this.state.scores;
  }

  getBorn() {
    if (this.state.alive) {
      return this.state.alive.getStart();
    } else {
      return null;
    }
  }

  getDied() {
    if (this.state.alive) {
      return this.state.alive.getEnd();
    } else {
      return null;
    }
  }

  getTimeLine() {
    const alive = this.getAlive();

    if (!alive) {
      return null;
    } else {
      return {
        start: alive.getStart(),
        end: alive.getEnd(),
        id: this.getID(),
        content: this.getName(),
      };
    }
  }

  getWeight() {
    return this.state.weight;
  }

  getEdgeCount() {
    return this.state.edge_count;
  }

  getProjectWeight(projectKey) {
    const weight = this.state.weight[projectKey];

    if (!weight) {
      console.error("No weight for " + this.getName() + this.getID() + " for project with key " + projectKey);
      return 1;
    }

    return weight;
  }

  getNode(isAnchor = false) {
    let node = {
      id: this.getID(),
      label: this.getName(),
      title: this.getName(),
      fixed: false,
      shape: "circle",
    };

    const name = this.getName();

    node["weight"] = this.getWeight();
    node["type"] = "person";

    // Position will be used to set the colour used
    // for the node representing this person
    node["positions"] = this.getPositions();

    node["edge_count"] = this.getEdgeCount();

    let keys = Object.keys(this.state.projects);

    if (keys.length > 0) {
      node["group"] = keys.sort().join(":");
    } else {
      node["group"] = "unknown";
    }

    if (isAnchor) {
      node["shape"] = "rect";
      node["fixed"] = true;
      node["group"] = "anchor";
    }

    if (name in fixedNodes) {
      node["fixed"] = true;
      node["fixedLocation"] = fixedNodes[name];
    }

    return node;
  }

  toDry() {
    return { value: this.state };
  }
}

Person.unDry = function (value) {
  return new Person(value);
};

Dry.registerClass("Person", Person);

export default Person;
