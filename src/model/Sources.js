
import Dry from 'json-dry';
import uuidv4 from 'uuid';
import lodash from 'lodash';

import Source from './Source';

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

    this._isASourcesObject = true;
  };

  _updateHooks(hook){
    this._getHook = hook;
    for (let key in this.state.registry){
      this.state.registry[key]._updateHooks(hook);
    }
  }

  static clone(item){
    let c = new Sources();
    c.state = lodash.cloneDeep(item.state);
    c._getHook = item._getHook;
    return c;
  }

  canAdd(item){
    return (item instanceof Source) || item._isASourceObject;
  }

  add(source){
    if (!this.canAdd(source)){ return;}

    source = Source.clone(source);

    let id = source.getID();

    if (id){
      if (id in this.state.registry){
        throw new KeyError(`Duplicate Source ID ${source}`);
      }

      source._updateHooks(this._getHook);
      this.state.registry[id] = source;
    }
    else{
      let uid = _generate_source_uid();

      while (uid in this.state.registry){
        uid = _generate_source_uid();
      }

      source.state.id = uid;
      source._updateHooks(this._getHook);
      this.state.registry[uid] = source;
    }
  }

  get(id){
    let source = this.state.registry[id];

    if (source === null){
      throw new MissingError(`No Source with ID ${id}`);
    }

    return source;
  }

  toDry(){
    return {value: this.state.registry};
  }
};

Sources.unDry = function(value){
  let sources = new Sources();
  sources.state = value;
  return sources;
}

Dry.registerClass("Sources", Sources);

export default Sources;
