
import Dry from 'json-dry';
import uuidv4 from 'uuid';

import Source from "./Source";
import { KeyError, MissingError } from './Errors';

function _generate_source_uid(){
  let uid = uuidv4();
  return "S" + uid.substring(uid.length-7);
}

class Sources {
  constructor(props){
    this.state = {
      registry: {},
    };
  };

  _updateHooks(hook){
    this._getHook = hook;
    for (let key in this.state.registry){
      this.state.registry[key]._updateHooks(hook);
    }
  }

  add(source){
    if (!(source instanceof Source)){ return;}

    let id = source.getID();

    if (id){
      if (id in this.state.registry){
        throw KeyError(`Duplicate Source ID ${source}`);
      }

      this.state.registry[id] = source;
    }
    else{
      let uid = _generate_source_uid();

      while (uid in this.state.registry){
        uid = _generate_source_uid();
      }

      source.state.id = uid;
      this.state.registry[uid] = source;
    }
  }

  get(id){
    let source = this.state.registry[id];

    if (source === null){
      throw MissingError(`No Source with ID ${id}`);
    }

    return source;
  }

  toDry(){
    return {value: this.state.registry};
  }
};

Sources.unDry = function(value){
  let sources = new Sources();
  sources.state.registry = value;
  return sources;
}

Dry.registerClass(Sources);

export default Sources;
