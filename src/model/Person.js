import Dry from "json-dry";
import lodash from "lodash";

import DateRange from "./DateRange";

import positionGroups from "../data/positionGroups.json";

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
      highlighted: {},
      alive: null,
      gender: null,
      notes: [],
      orig_name: null,
      weight: {},
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

  inGroup(group, match_and=true) {
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

    if (match_and) {
      return Object.keys(seen).length === Object.keys(group).length;
    }
    else {
      return Object.keys(seen).length > 0;
    }
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
    let new_projects = {};

    Object.keys(this.state.projects).forEach((key) => {
      if (key in project) {
        seen[key] = 1;
        new_projects[key] = this.state.projects[key];
      }
    });

    if (Object.keys(seen).length !== nprojects) {
      return null;
    }

    let affiliations = _filterProject(this.state.affiliations, project);
    let positions = _filterProject(this.state.positions, project);
    let sources = _filterProject(this.state.sources, project);
    let weight = _filterProject(this.state.weight, project);

    if (affiliations !== this.state.affiliations || positions !== this.state.positions ||
      weight !== this.state.weight || sources !== this.state.sources) {
      let person = new Person();
      person.state = { ...this.state };
      person.state.affiliations = affiliations;
      person.state.positions = positions;
      person.state.sources = sources;
      person.state.weight = weight;
      person.state.projects = new_projects;
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
      this.state.is_highlighted = false;
      this.state.is_selected = false;

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

  getWeight(project_id = null) {
    if (project_id === null) {
      // return the first project weight
      project_id = Object.keys(this.state.weight)[0];
    }

    return this.state.weight[project_id];
  }

  getProjectID() {
    // return the first matching project ID
    return Object.keys(this.state.projects)[0];
  }

  getProjectWeight(projectKey) {
    const weight = this.state.weight[projectKey];

    if (!weight) {
      console.error("No weight for " + this.getName() + this.getID() + " for project with key " + projectKey);
      return 1;
    }

    return weight;
  }

  setSelected(val) {
    if (val) {
      this.state.is_selected = true;
    }
    else {
      this.state.is_selected = false;
    }
  }

  getSelected() {
    return this.state.is_selected;
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


  getWeight(project_id = null) {
    if (project_id === null) {
      // return the first project weight
      project_id = Object.keys(this.state.weight)[0];
    }

    return this.state.weight[project_id];
  }

  isEngineer(project_id = null) {
    if (project_id === null) {
      project_id = Object.keys(this.state.positions)[0];
    }

    const positions = this.state.positions[project_id];

    for (let i = 0; i < positions.length; ++i){
      const position = this._getHook(positions[i]);
      const name = position.getCanonical().toLowerCase()
                           .replace(/\s/g, "")
                           .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
      if (positionGroups["engineering"]["members"].includes(name)) {
        return true;
      }
    }

    return false;
  }

  isNonContributingEngineer(project_id = null) {
    if (project_id === null) {
      // return this status with the first project
      project_id = Object.keys(this.state.positions)[0];
    }

    const positions = this.state.positions[project_id];

    for (let i = 0; i < positions.length; ++i){
      const position = this._getHook(positions[i]);
      const name = position.getCanonical();
      if (name.includes("non-cont")) {
        return true;
      }
    }

    return false;
  }

  getNode() {
    let node = {
      id: this.getID(),
      label: this.getName(),
      title: this.getName(),
      shape: "circle",
      weight: this.getWeight(),
      type: "person",
      highlighted: this.getHighlighted(),
      selected: this.getSelected(),
      project: this.getProjectID(),
      is_nc_engineer: this.isNonContributingEngineer(),
      is_engineer: this.isEngineer(),
    };

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
