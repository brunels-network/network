import Dry from "json-dry";
import lodash from "lodash";

import DateRange from "./DateRange";
import { ValueError } from "./Errors";

function setState(val, def = null) {
  if (val) {
    return val;
  } else {
    return def;
  }
}

class Project {
  constructor(props) {
    this.state = {
      name: null,
      id: null,
      url: null,
      duration: new DateRange(),
      description: null,
      notes: {},
    };

    this.setState(props);

    this._getHook = null;
    this._isAProjectObject = true;
  }

  static clone(item) {
    let c = new Project();
    c._getHook = item._getHook;
    c.state = lodash.cloneDeep(item.state);
    return c;
  }

  getID() {
    return this.state.id;
  }

  setState(state) {
    if (state) {
      this.state.name = setState(state.name);
      this.state.id = setState(state.id);
      this.state.notes = setState(state.notes, {});
      this.state.url = setState(state.url, null);
      this.state.duration = new DateRange({ value: state.duration });

      if (!this.state.name) {
        throw new ValueError("You cannot have a Project without a name");
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
    return `Project(${this.getName()})`;
  }

  getName() {
    return this.state.name;
  }

  getURL() {
    return this.state.url;
  }

  getDuration() {
    return this.state.duration;
  }

  getDescription() {
    return this.state.description;
  }

  getTimeLine() {
    const duration = this.getDuration();

    if (duration && duration.hasBounds()) {
      return {
        start: duration.getEarliestStart().toDate(),
        end: duration.getLatestEnd().toDate(),
        id: this.getID(),
        content: this.getName(),
      };
    } else {
      return null;
    }
  }

  getNewTimeLine() {
    const duration = this.getDuration();

    if (duration && duration.hasBounds()) {
      return {
        start_time: duration.getEarliestStart().toMoment(),
        end_time: duration.getLatestEnd().toMoment(),
        project_id: this.getID(),
        title: this.getName(),
      };
    } else {
      return null;
    }
  }

  toDry() {
    return { value: this.state };
  }
}

Project.unDry = function (value) {
  return new Project(value);
};

Dry.registerClass("Project", Project);

export default Project;
