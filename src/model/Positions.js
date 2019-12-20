
import Dry from 'json-dry';
import uuidv4 from 'uuid';
import lodash from 'lodash';

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

    this._isAPositionsObject = true;
  };

  _updateHooks(hook){
    this._getHook = hook;
    for (let key in this.state.registry){
      this.state.registry[key]._updateHooks(hook);
    }
  }

  static clone(item){
    let c = new Positions();
    c.state = lodash.cloneDeep(item.state);
    c._getHook = item._getHook;
    return c;
  }

  canAdd(item){
    return (item instanceof Position) || item._isAPositionObject;
  }

  add(position){
    if (!this.canAdd(position)){ return;}

    position = Position.clone(position);

    let id = position.getID();

    if (id){
      if (id in this.state.registry){
        throw KeyError(`Duplicate Position ID ${position}`);
      }

      position._updateHooks(this._getHook);
      this.state.registry[id] = position;
    }
    else{
      let uid = _generate_position_uid();

      while (uid in this.state.registry){
        uid = _generate_position_uid();
      }

      position.state.id = uid;
      position._updateHooks(this._getHook);
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

Dry.registerClass("Positions", Positions);

export default Positions;
