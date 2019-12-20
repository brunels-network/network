
import Dry from "json-dry";
import lodash from 'lodash';

function setState(val, def=null){
  if (val){
    return val;
  } else {
    return def;
  }
}

class Note {
  constructor(props){
    this.state = {
      text: null,
      id: null,
      sources: [],
    };

    this.setState(props);

    this._getHook = null;
    this._isANoteObject = true;
  }

  static clone(item){
    let c = new Note();
    c._getHook = item._getHook;
    c.state = lodash.cloneDeep(item.state);
  }

  getID(){
    return this.state.id;
  }

  setState(state){
    if (state){
      this.state.text = setState(state.text);
      this.state.id = setState(state.id);
      this.state.sources = setState(state.sources, []);
    }
  }

  _updateHooks(hook){
    this._getHook = hook;
  }

  toString(){
    return `Note(${this.getText()})`;
  }

  getText(){
    return this.state.text;
  }

  toDry(){
    return {value: this.state};
  }
};

Note.unDry = function(value){
  return new Note(value);
}

Dry.registerClass("Note", Note);

export default Note;
