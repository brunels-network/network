
import Dry from 'json-dry';
import uuidv4 from 'uuid';

import Affiliation from "./Affiliation";
import { KeyError, MissingError } from './Errors';

function _generate_affiliation_uid(){
  let uid = uuidv4();
  return "A" + uid.substring(uid.length-7);
}

class Affiliations {
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

  add(affiliation){
    if (!(affiliation instanceof Affiliation)){ return;}

    let id = affiliation.getID();

    if (id){
      if (id in this.state.registry){
        throw KeyError(`Duplicate Affiliation ID ${affiliation}`);
      }

      this.state.registry[id] = affiliation;
    }
    else{
      let uid = _generate_affiliation_uid();

      while (uid in this.state.registry){
        uid = _generate_affiliation_uid();
      }

      affiliation.state.id = uid;
      this.state.registry[uid] = affiliation;
    }
  }

  get(id){
    let affiliation = this.state.registry[id];

    if (affiliation === null){
      throw MissingError(`No Affiliation with ID ${id}`);
    }

    return affiliation;
  }

  toDry(){
    return {value: this.state.registry};
  }
};

Affiliations.unDry = function(value){
  let affiliations = new Affiliations();
  affiliations.state.registry = value;
  return affiliations;
}

Dry.registerClass(Affiliations);

export default Affiliations;
