
import Dry from 'json-dry';
import uuidv4 from 'uuid';

import Note from "./Note";
import { KeyError, MissingError } from './Errors';

function _generate_note_uid(){
  let uid = uuidv4();
  return "N" + uid.substring(uid.length-7);
}

class Notes {
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

  add(note){
    if (!(note instanceof Note)){ return;}

    let id = note.getID();

    if (id){
      if (id in this.state.registry){
        throw KeyError(`Duplicate Note ID ${note}`);
      }

      this.state.registry[id] = note;
    }
    else{
      let uid = _generate_note_uid();

      while (uid in this.state.registry){
        uid = _generate_note_uid();
      }

      note.state.id = uid;
      this.state.registry[uid] = note;
    }
  }

  get(id){
    let note = this.state.registry[id];

    if (note === null){
      throw MissingError(`No Note with ID ${id}`);
    }

    return note;
  }

  toDry(){
    return {value: this.state.registry};
  }
};

Notes.unDry = function(value){
  let notes = new Notes();
  notes.state.registry = value;
  return notes;
}

Dry.registerClass("Notes", Notes);

export default Notes;
