
import Dry from 'json-dry';
import uuidv4 from 'uuid';
import lodash from 'lodash';

import Affiliation from './Affiliation';

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

    this._isAAffiliationsObject = true;
  };

  _updateHooks(hook){
    this._getHook = hook;
    for (let key in this.state.registry){
      this.state.registry[key]._updateHooks(hook);
    }
  }

  static clone(item){
    let c = new Affiliations();
    c.state = lodash.cloneDeep(item.state);
    c._getHook = item._getHook;
    return c;
  }

  canAdd(item){
    return (item instanceof Affiliations) || item._isAAffiliationObject;
  }

  add(affiliation){
    if (!this.canAdd(affiliation)){ return;}

    affiliation = Affiliation.clone(affiliation);

    let id = affiliation.getID();

    if (id){
      if (id in this.state.registry){
        throw KeyError(`Duplicate Affiliation ID ${affiliation}`);
      }

      affiliation._updateHooks(this._getHook);
      this.state.registry[id] = affiliation;
    }
    else{
      let uid = _generate_affiliation_uid();

      while (uid in this.state.registry){
        uid = _generate_affiliation_uid();
      }

      affiliation.state.id = uid;
      affiliation._updateHooks(this._getHook);
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
  affiliations.state = value;
  return affiliations;
}

Dry.registerClass("Affiliations", Affiliations);

export default Affiliations;
