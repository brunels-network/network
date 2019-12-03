
import Dry from 'json-dry';
import uuidv4 from 'uuid';

import Position from "./Position";
import { KeyError, MissingError } from './Errors';

function _generate_position_uid(){
  let uid = uuidv4();
  return "Q" + uid.substring(uid.length-7);
}

class Positions {
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

  add(position){
    if (!(position instanceof Position)){ return;}

    let id = position.getID();

    if (id){
      if (id in this.state.registry){
        throw KeyError(`Duplicate Position ID ${position}`);
      }

      this.state.registry[id] = position;
    }
    else{
      let uid = _generate_position_uid();

      while (uid in this.state.registry){
        uid = _generate_position_uid();
      }

      position.state.id = uid;
      this.state.registry[uid] = position;
    }
  }

  get(id){
    let position = this.state.registry[id];

    if (position === null){
      throw MissingError(`No Position with ID ${id}`);
    }

    return position;
  }

  toDry(){
    return {value: this.state.registry};
  }
};

Positions.unDry = function(value){
  let positions = new Positions();
  positions.state = value;
  return positions;
}

Dry.registerClass(Positions);

export default Positions;
