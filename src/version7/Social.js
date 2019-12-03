
import Dry from 'json-dry';
import People from './People';
import Businesses from './Businesses';
import Messages from './Messages';
import Positions from './Positions';
import Affiliations from './Affiliations';
import Sources from './Sources';
import Notes from './Notes';
import DateRange from './DateRange';

class Social {
    constructor(props){
        this.state = props;
    }

    _updateHooks(){
        let getHook = (id)=>{return this.get(id);};

        let state = {};

        if (!(this.state.people instanceof People)){
           state.people = new People();
        }
        else{
            state.people = this.state.people;
        }

        if (!(this.state.businesses instanceof Businesses)){
            state.businesses = new Businesses();
        }
        else{
            state.businesses = this.state.businesses;
        }

        if (!(this.state.messages instanceof Messages)){
            state.messages = new Messages();
        }else{
            state.messages = this.state.messages;
        }

        if (!(this.state.positions instanceof Positions)){
            state.positions = new Positions();
        }
        else{
            state.positions = this.state.positions;
        }

        if (!(this.state.affiliations instanceof Affiliations)){
            state.affiliations = new Affiliations();
        }
        else{
            state.affiliations = this.state.affiliations;
        }

        if (!(this.state.sources instanceof Sources)){
            state.sources = new Sources();
        }
        else{
            state.sources = this.state.sources;
        }

        if (!(this.state.notes instanceof Notes)){
            state.notes = new Notes();
        }
        else{
            state.notes = this.state.notes;
        }

        this.state = state;

        for (let key in this.state){
          this.state[key]._updateHooks(getHook);
        }
    }

    getPeople(){
        return this.state.people;
    }

    getBusinesses(){
        return this.state.businesses;
    }

    getMessages(){
        return this.state.messages;
    }

    getAffiliations(){
        return this.state.affiliations;
    }

    getPositions(){
        return this.state.positions;
    }

    getSources(){
      return this.state.sources;
    }

    getNotes(){
      return this.state.notes;
    }

    getGraph(){
      let anchor = this.getPeople().find("Brunel");

      let nodes = this.getPeople().getNodes(anchor);
      nodes.add(this.getBusinesses().getNodes().get());

      let edges = this.getMessages().getEdges();

      return {"nodes": nodes, "edges": edges};
    }

    get(id){
        if (id[0] === "M"){
            return this.getMessages().get(id);
        }
        else if (id[0] === "P"){
            return this.getPeople().get(id);
        }
        else if (id[0] === "B"){
            return this.getBusinesses().get(id);
        }
        else if (id[0] === "Q"){
            return this.getPositions().get(id);
        }
        else if (id[0] === "A"){
            return this.getAffiliations().get(id);
        }
        else if (id[0] === "S"){
            return this.getSources().get(id);
        }
        else if (id[0] === "N"){
            return this.getNotes().get(id);
        }
        else {
            return id;
        }
    }

    toDry(){
        return {value: this.state};
    }
}

Social.unDry = function(value){
    let social = new Social();
    social.state = value;
    social._updateHooks();

    return social;
}

Dry.registerClass(Social);

export default Social;
