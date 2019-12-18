
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
  constructor(props) {
    if (props){
      this.state = props;
    }
    else{
      this.state = {};
    }

    this.state.anchor = null;
    this.state.filter = {"node": null, "group": null};
    this.state.cache = null;
    this.state.network = null;
    this.state.window = new DateRange();
  }

  _updateHooks() {
    let getHook = (id) => { return this.get(id); };

    let state = { ...this.state };

    if (!(this.state.people instanceof People)) {
      state.people = new People();
    }
    else {
      state.people = this.state.people;
    }

    if (!(this.state.businesses instanceof Businesses)) {
      state.businesses = new Businesses();
    }
    else {
      state.businesses = this.state.businesses;
    }

    if (!(this.state.messages instanceof Messages)) {
      state.messages = new Messages();
    } else {
      state.messages = this.state.messages;
    }

    if (!(this.state.positions instanceof Positions)) {
      state.positions = new Positions();
    }
    else {
      state.positions = this.state.positions;
    }

    if (!(this.state.affiliations instanceof Affiliations)) {
      state.affiliations = new Affiliations();
    }
    else {
      state.affiliations = this.state.affiliations;
    }

    if (!(this.state.sources instanceof Sources)) {
      state.sources = new Sources();
    }
    else {
      state.sources = this.state.sources;
    }

    if (!(this.state.notes instanceof Notes)) {
      state.notes = new Notes();
    }
    else {
      state.notes = this.state.notes;
    }

    this.state = state;

    for (let key in this.state) {
      try{
        this.state[key]._updateHooks(getHook);
      }
      catch(error){}
    }
  }

  clearCache(){
    this.state.cache = null;
  }

  getWindow(){
    return this.state.window;
  }

  setWindow(window){
    console.log(`setWindow ${window}`);

    if (!window._isADateRangeObject){
      window = new DateRange(window);
    }

    console.log(`setWindow ${window}`);
    console.log(this.state.window);

    if (window === this.state.window){
      console.log("SAME!");
      return;
    }

    this.state.window = window;
    this.clearCache();
  }

  getPeople() {
    console.log(`getPeople ${this.getWindow()}`);
    return this.state.people.filterWindow(this.getWindow());
  }

  getBusinesses() {
    return this.state.businesses;
  }

  getMessages() {
    return this.state.messages;
  }

  getAffiliations() {
    return this.state.affiliations;
  }

  getPositions() {
    return this.state.positions;
  }

  getSources() {
    return this.state.sources;
  }

  getNotes() {
    return this.state.notes;
  }

  getConnectionsTo(item) {
    return this.getMessages().getConnectionsTo(item);
  }

  getAnchor() {
    return this.state.anchor;
  }

  getFilter() {
    return {...this.state.filter};
  }

  getNodeFilter(){
    return this.state.filter.node;
  }

  getGroupFilter(){
    return this.state.filter.group;
  }

  resetFilters(){
    this.state.filter = {node:null, group:null};
    this.state.cache = null;
  }

  setAnchor(anchor) {
    if (anchor) {
      anchor = this.getPeople().find(anchor);
    }

    this.state.anchor = anchor;
    this.state.cache = null;
  }

  toggleNodeFilter(item) {
    if (this.state.filter.node === item) {
      this.state.filter.node = null;
    }
    else{
      this.state.filter.node = item;
    }

    this.state.cache = null;
  }

  toggleGroupFilter(item){
    if (this.state.filter.group === item){
      this.state.filter.group = null;
    }
    else{
      this.state.filter.group = item;
    }

    this.state.cache = null;
  }

  getGraph() {
    if (this.state.cache !== null){
      return this.state.cache;
    }

    const anchor = this.state.anchor;
    let node_filter = this.state.filter.node;
    let group_filter = this.state.filter.group;

    if (node_filter) {
      let id = node_filter.getID();
      let connections = this.getConnectionsTo(node_filter);
      node_filter = {};
      node_filter[id] = 1;
      for (let connection in connections) {
        let node = connections[connection];
        node_filter[node.getID()] = 1;
      }
    }

    let nodes = this.getPeople().getNodes({
      anchor: anchor,
      node_filter: node_filter,
      group_filter: group_filter
    });
    nodes.add(this.getBusinesses().getNodes({
      group_filter: group_filter,
      node_filter: node_filter
    }).get());

    let edges = this.getMessages().getEdges();

    this.state.cache = {"nodes": nodes, "edges": edges};
    return this.state.cache;
  }

  setNetwork(network){
    this.state.network = network;
  }

  getNetwork(){
    return this.state.network;
  }

  get(id) {
    if (id[0] === "M") {
      return this.state.messages.get(id);
    }
    else if (id[0] === "P") {
      return this.state.people.get(id);
    }
    else if (id[0] === "B") {
      return this.state.businesses.get(id);
    }
    else if (id[0] === "Q") {
      return this.state.positions.get(id);
    }
    else if (id[0] === "A") {
      return this.state.affiliations.get(id);
    }
    else if (id[0] === "S") {
      return this.state.sources.get(id);
    }
    else if (id[0] === "N") {
      return this.state.notes.get(id);
    }
    else {
      return id;
    }
  }

  toDry() {
    return { value: this.state };
  }
}

Social.unDry = function (value) {
  let social = new Social(value);
  social._updateHooks();

  return social;
}

Dry.registerClass("Social", Social);

export default Social;
