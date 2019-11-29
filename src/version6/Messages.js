
import Dry from 'json-dry';
import uuidv4 from 'uuid';

import Message from "./Message";
import { KeyError, MissingError } from './Errors';

function _generate_message_uid(){
  let uid = uuidv4();
  return uid.substring(uid.length-8);
}

class Messages {
  constructor(props){
    this.state = {
      registry: {},
    };

    this.load(props);
  };

  add(message){
    if (!(message instanceof Message)){ return;}

    let id = message.getID();

    if (id){
      if (id in this.state.registry){
        throw KeyError(`Duplicate Message ID ${message}`);
      }

      this.state.registry[id] = message;
    }
    else{
      let uid = _generate_message_uid();

      while (uid in this.state.registry){
        uid = _generate_message_uid();
      }

      message.state.id = uid;
      this.state.registry[uid] = message;
    }
  }

  get(id){
    let message = this.state.registry[id];

    if (message === null){
      throw MissingError(`No Message with ID ${id}`);
    }

    return message;
  }

  load(data, people=null){
    if (data){
      if (data.array){ data = data.array; }
      data.forEach(element => {
        let message = Message.load(element, people);
        this.add(message);
      });
    }
  }

  toDry(){
    return {value: this.state.registry};
  }
};

Messages.unDry = function(value){
  let messages = new Messages();
  messages.state.registry = value;
  return messages;
}

Dry.registerClass(Messages);

export default Messages;
