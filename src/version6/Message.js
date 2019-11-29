
import Dry from "json-dry";

function setState(val, def=null){
  if (val){
    return val;
  } else {
    return def;
  }
}

class Message {
  constructor(props){
    this.state = {
      name: null,
      id: null,
      date: null,
      sender: null,     // should be a Person ID
      receiver: null,   // should be a Person ID
    };

    this.setState(props);
  }

  getID(){
    return this.state.id;
  }

  setState(state){
    if (state){
      this.state.name = setState(state.name);
      this.state.id = setState(state.id);
      this.state.date = setState(state.date);
      this.state.sender = setState(state.sender);
      this.state.receiver = setState(state.receiver);
    }
  }

  toString(){
    return `Message(name=${this.state.name} ` +
           `${this.state.sender}=>${this.state.receiver})`;
  }

  toDry(){
    return {value: this.state};
  }
};

Message.unDry = function(value){
  return new Message(value);
}

Message.load = function(data, people=null){
  return new Message({name: data.name});
}

Dry.registerClass(Message);

export default Message;
