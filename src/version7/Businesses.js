
import Dry from 'json-dry';
import uuidv4 from 'uuid';

import Business from "./Business";
import { KeyError, MissingError } from './Errors';

function _generate_business_uid(){
  let uid = uuidv4();
  return "B" + uid.substring(uid.length-7);
}

class Businesses {
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

  add(business){
    if (!(business instanceof Business)){ return;}

    let id = business.getID();

    if (id){
      if (id in this.state.registry){
        throw KeyError(`Duplicate Business ID ${Business}`);
      }

      this.state.registry[id] = business;
    }
    else{
      let uid = _generate_business_uid();

      while (uid in this.state.registry){
        uid = _generate_business_uid();
      }

      business.state.id = uid;
      this.state.registry[uid] = business;
    }
  }

  get(id){
    let business = this.state.registry[id];

    if (business === null){
      throw MissingError(`No Business with ID ${id}`);
    }

    return business;
  }

  toDry(){
    return {value: this.state.registry};
  }
};

Businesses.unDry = function(value){
  let businesses = new Businesses();
  businesses.state.registry = value;
  return businesses;
}

Dry.registerClass(Businesses);

export default Businesses;
