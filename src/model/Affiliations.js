
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

    this._names = {};
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
    return (item instanceof Affiliation) || item._isAAffiliationObject;
  }

  add(affiliation){
    if (!this.canAdd(affiliation)){ return null;}

    let existing = null;

    try{
      existing = this.getByName(affiliation.getName());
    }
    catch(error){}

    if (existing){
      existing = existing.merge(affiliation);
      this.state.registry[existing.getID()] = existing;
      return existing;
    }

    affiliation = Affiliation.clone(affiliation);

    let id = affiliation.getID();

    if (id){
      if (id in this.state.registry){
        throw new KeyError(`Duplicate Affiliation ID ${affiliation}`);
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
    }

    affiliation._updateHooks(this._getHook);
    this._names[affiliation.getName()] = affiliation.getID();
    this.state.registry[affiliation.getID()] = affiliation;

    return affiliation;
  }

  getByName(name){
    let id = this._names[name];

    if (id){
      return this.get(id);
    }
    else{
      throw MissingError(`No affiliation with name ${name}`);
    }
  }

  find(name){
    if (name instanceof Affiliation || name._isAAffiliationObject){
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

    throw MissingError(`No affiliation matches '${name}. Available Affiliations ` +
                       `are '${keys}'`);
  }

  get(id){
    let affiliation = this.state.registry[id];

    if (!affiliation){
      throw new MissingError(`No Affiliation with ID ${id}`);
    }

    return affiliation;
  }

  toDry(){
    return {value: this.state};
  }
};

Affiliations.unDry = function(value){
  let affiliations = new Affiliations();
  affiliations.state = value;
  affiliations._names = {}

  Object.keys(value.registry).forEach((key, index) => {
    let v = value.registry[key];
    affiliations._names[v.getName()] = key;
  });

  return affiliations;
}

Dry.registerClass("Affiliations", Affiliations);

export default Affiliations;
