import Dry from "json-dry";
import { v4 as uuidv4 } from "uuid";
import lodash from "lodash";

import Note from "./Note";
import { KeyError, MissingError } from "./Errors";

function _generate_note_uid() {
  let uid = uuidv4();
  return "N" + uid.substring(uid.length - 7);
}

class Notes {
  constructor() {
    this.state = {
      registry: {},
    };

    this._names = {};
    this._isANotesObject = true;
  }

  _updateHooks(hook) {
    this._getHook = hook;
    for (let key in this.state.registry) {
      this.state.registry[key]._updateHooks(hook);
    }
  }

  static clone(item) {
    let c = new Notes();
    c.state = lodash.cloneDeep(item.state);
    c._names = lodash.cloneDeep(item._names);
    c._getHook = item._getHook;
    return c;
  }

  canAdd(item) {
    return item instanceof Note || item._isANoteObject;
  }

  add(note) {
    if (!this.canAdd(note)) {
      return null;
    }

    let existing = null;

    try {
      existing = this.getByName(note.getName());
    } catch (error) {
      console.error(error);
    }

    if (existing) {
      existing = existing.merge(note);
      this.state.registry[existing.getID()] = existing;
      return existing;
    }

    note = note.clone(Note);

    let id = note.getID();

    if (id) {
      if (id in this.state.registry) {
        throw new KeyError(`Duplicate Note ID ${note}`);
      }

      note._updateHooks(this._getHook);
      this.state.registry[id] = Note;
    } else {
      let uid = _generate_note_uid();

      while (uid in this.state.registry) {
        uid = _generate_note_uid();
      }

      note.state.id = uid;
    }

    note._updateHooks(this._getHook);
    this._names[note.getName()] = note.getID();
    this.state.registry[note.getID()] = note;

    return note;
  }

  getByName(name) {
    let id = this._names[name];

    if (id) {
      return this.get(id);
    } else {
      throw MissingError(`No Note with name ${name}`);
    }
  }

  find(name) {
    if (name instanceof Note || name._isANoteObject) {
      return this.get(name.getID());
    }

    name = name.trim().toLowerCase();

    let results = [];

    Object.keys(this._names).forEach((key) => {
      if (key.toLowerCase().indexOf(name) !== -1) {
        results.push(this.get(this._names[key]));
      }
    });

    if (results.length === 1) {
      return results[0];
    } else if (results.length > 1) {
      return results;
    }

    let keys = Object.keys(this._names).join("', '");

    throw MissingError(`No Note matches '${name}. Available Notes are '${keys}'`);
  }

  get(id) {
    let Note = this.state.registry[id];

    if (!Note) {
      throw new MissingError(`No Note with ID ${id}`);
    }

    return Note;
  }

  toDry() {
    return { value: this.state };
  }
}

Notes.unDry = function (value) {
  let notes = new Notes();
  notes.state = value;
  notes._names = {};

  Object.keys(value.registry).forEach((key) => {
    let v = value.registry[key];
    notes._names[v.getName()] = key;
  });

  return notes;
};

Dry.registerClass("Notes", Notes);

export default Notes;
