
import Dry from 'json-dry';
import uuidv4 from 'uuid';
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
    c._getHook = item._getHook;
    return c;
  }

  canAdd(item){
    return (item instanceof Project) || item._isAProjectObject;
  }

  add(project){
    if (!this.canAdd(project)){ return;}

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
      project._updateHooks(this._getHook);
      this.state.registry[uid] = project;
    }
  }

  get(id){
    let project = this.state.registry[id];

    if (project === null){
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
    return {value: this.state.registry};
  }
};

Projects.unDry = function(value){
  let projects = new Projects();
  projects.state = value;
  return projects;
}

Dry.registerClass("Projects", Projects);

export default Projects;
