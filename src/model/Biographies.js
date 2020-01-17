
import Dry from 'json-dry';
import lodash from 'lodash';


class Biographies{
  constructor(){
    this.state = {
      bios: {}
    };

    this._getHook = null;
    this._isABiographiesObject = true;
  }

  _updateHooks(hook){
    this._getHook = hook;
  }

  static clone(item){
    let c = new Biographies();
    c.state = lodash.cloneDeep(item.state);
    c._getHook = item._getHook;
    return c;
  }

  get(node){
    if (!node){
      return null;
    }
    else if (node.getID){
      node = node.getID();
    }

    return this.state.bios[node];
  }

  getNode(id){
    if (this._getHook){
      return this._getHook(id);
    }
    else{
      return id;
    }
  }

  search(text){
    if (!text){
      return null;
    }

    text = text.trim().toLowerCase();

    let results = [];

    Object.keys(this.state.bios).forEach((key, index)=>{
      if (this.state.bios[key].toLowerCase().indexOf(text) !== -1){
        results.push(this.getNode(key));
      }
    });

    if (results.length === 1){
      return results[0];
    }
    else if (results.length > 1){
      return results;
    }
    else{
      return null;
    }
  }

  add(node, biography){
    if (!node || !biography){
      return null;
    }
    else if (node.getID){
      node = node.getID();
    }

    let bio = this.state.bios[node];

    if (bio){
      console.log(`There is already a bio for ${this.getNode(node)}`);
      biography = `${bio}\n${biography}`;
    }

    this.state.bios[node] = biography;
  }
}

Biographies.unDry = function(value){
  let bios = new Biographies();
  bios.state = value;
  return bios;
}

Dry.registerClass("Biographies", Biographies);

export default Biographies;
