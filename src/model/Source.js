
import Dry from "json-dry";
import lodash from 'lodash';

import RoughDate from './RoughDate';

import {ValueError} from './Errors';

function setState(val, def=null){
  if (val){
    return val;
  } else {
    return def;
  }
}

class Source {
  constructor(props){
    this.state = {
      name: null,
      id: null,
      date: null,
      description: null,
      notes: [],
    };

    this.setState(props);

    this._getHook = null;
    this._isASourceObject = true;
  }

  static clone(item){
    let c = new Source();
    c._getHook = item._getHook;
    c.state = lodash.cloneDeep(item.state);
    return c;
  }

  getID(){
    return this.state.id;
  }

  getDate(){
    return this.state.date;
  }

  updateDate(date, force=false){
    if (!(date instanceof RoughDate || date._isARoughDateObject)){
      date = new RoughDate(date);
    }

    if (date.isNull()){
      return false;
    }

    if (this.getDate().isNull()){
      this.state.date = date;
      return true;
    }

    if (RoughDate.ne(this.getDate(), date)){
      if (force){
        this.state.date = this.getDate().merge(date);
        return true;
      }
      else{
        console.log(`Disagreement of date for ${this}: ` +
                    `${this.getDate()} vs ${date}`);
      }
    }

    return false;
  }

  setState(state){
    if (state){
      this.state.name = setState(state.name);
      this.state.id = setState(state.id);
      this.state.notes = setState(state.notes, []);
      this.state.sources = setState(state.sources, []);
      this.state.date = setState(state.date, new RoughDate());

      if (!this.state.name){
        throw ValueError("You cannot have an Source without a name");
      }
    }
  }

  _updateHooks(hook){
    this._getHook = hook;
  }

  merge(other){
    return this;
  }

  toString(){
    return `Source(${this.getName()})`;
  }

  getName(){
    return this.state.name;
  }

  toDry(){
    return {value: this.state};
  }
};

Source.unDry = function(value){
  return new Source(value);
}

Dry.registerClass("Source", Source);

export default Source;
