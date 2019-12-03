
import Dry from "json-dry";

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

Dry.registerClass(Note);

export default Note;
