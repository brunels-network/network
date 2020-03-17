
import Dry from 'json-dry';
import { v4 as uuidv4 } from 'uuid';
import lodash from 'lodash';

import Project from './Project';
import { KeyError, MissingError } from './Errors';

function _generate_project_uid(){
  let uid = uuidv4();
  return "J" + uid.substring(uid.length-7);
}

class Projects {
  constructor(props){
    this.state = {
      registry: {},
    };

    this._names = {};
    this._isAProjectsObject = true;
  };

  _updateHooks(hook){
    this._getHook = hook;
    for (let key in this.state.registry){
      this.state.registry[key]._updateHooks(hook);
    }
  }

  static clone(item){
    let c = new Projects();
    c.state = lodash.cloneDeep(item.state);
    c._names = lodash.cloneDeep(item._names);
    c._getHook = item._getHook;
    return c;
  }

  values(){
    let names = Object.keys(this._names);
    names.sort();

    let output = [];

    names.forEach((key, index)=>{
      output.push(this.get(this._names[key]));
    });

    return output;
  }

  canAdd(item){
    return (item instanceof Project) || item._isAProjectObject;
  }

  add(project){
    if (!this.canAdd(project)){ return null;}

    let existing = null;

    try{
      existing = this.getByName(project.getName());
    }
    catch(error){}

    if (existing){
      existing = existing.merge(project);
      this.state.registry[existing.getID()] = existing;
      return existing;
    }

    project = Project.clone(project);

    let id = project.getID();

    if (id){
      if (id in this.state.registry){
        throw new KeyError(`Duplicate Project ID ${project}`);
      }

      project._updateHooks(this._getHook);
      this.state.registry[id] = project;
    }
    else{
      let uid = _generate_project_uid();

      while (uid in this.state.registry){
        uid = _generate_project_uid();
      }

      project.state.id = uid;
    }

    project._updateHooks(this._getHook);
    this._names[project.getName()] = project.getID();
    this.state.registry[project.getID()] = project;

    return project;
  }

  getByName(name){
    let id = this._names[name];

    if (id){
      return this.get(id);
    }
    else{
      throw MissingError(`No project with name ${name}`);
    }
  }

  find(name){
    if (name instanceof Project || name._isAProjectObject){
      return this.get(name.getID());
    }

    name = name.trim().toLowerCase();

    let results = [];

    Object.keys(this._names).forEach((key, index) => {
      if (key.toLowerCase().indexOf(name) !== -1){
        results.push(this.get(this._names[key]));
      }
    });

    if (results.length === 1){
      return results[0];
    }
    else if (results.length > 1){
      return results;
    }

    let keys = Object.keys(this._names).join("', '");

    throw MissingError(`No project matches '${name}. Available projects ` +
                       `are '${keys}'`);
  }

  get(id){
    let project = this.state.registry[id];

    if (!project){
      throw new MissingError(`No Project with ID ${id}`);
    }

    return project;
  }

  getTimeLine(){
    let items = [];

    Object.keys(this.state.registry).forEach((key, index)=>{
      let project = this.state.registry[key];
      if (project){
        let timeline = project.getTimeLine();
        if (timeline){
          items.push(timeline);
        }
      }
    });

    return items;
  }

  toDry(){
    return {value: this.state};
  }
};

Projects.unDry = function(value){
  let projects = new Projects();
  projects.state = value;
  projects._names = {}

  Object.keys(value.registry).forEach((key, index) => {
    let v = value.registry[key];
    projects._names[v.getName()] = key;
  });

  return projects;
}

Dry.registerClass("Projects", Projects);

export default Projects;
