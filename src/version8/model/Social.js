
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
    this.state.filter = {node:null, group:null};
    this.state.cache = {graph:null,
                        projectTimeLine:null,
                        itemTimeLine:null,
                        filters:null,
                        people:null,
                        businesses:null,
                        messages:null};
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
    this.state.cache = {graph:null,
                        projectTimeLine:null,
                        itemTimeLine:null,
                        filters:null,
                        people:null,
                        businesses: null,
                        messages:null};
  }

  getFilters(){
    if (!this.state.cache.filters){
      this.state.cache.filters = [];

      let node_filter = this.state.filter.node;

      if (node_filter) {
        let id = node_filter.getID();
        let connections = this.state.messages.getConnectionsTo(node_filter);
        node_filter = {};
        node_filter[id] = 1;
        for (let connection in connections) {
          let node = connections[connection];
          node_filter[node.getID()] = 1;
        }

        this.state.cache.filters.push((item)=>{
          console.log(`NODE ${item.getID()}`);
          console.log(node_filter);
          if (item.getID() in node_filter){
            console.log("FOUND");
            return item;
          }
          else{
            console.log("NOT FOUND");
            return null;
          }
        });
      }

      let group_filter = this.state.filter.group;

      if (group_filter){
        this.state.cache.filters.push((item)=>{
          try{
            if (item.inGroup(group_filter)){
              return item;
            }
            else{
              return null;
            }
          }
          catch(error){
            return item;
          }
        });
      }

      let window = this.getWindow();

      if (window.hasStart() || window.hasEnd()){
        this.state.cache.filters.push((item)=>{
          try{
            return item.filterWindow(window);
          }
          catch(error){
            return item;
          }
        });
      }
    }

    return this.state.cache.filters;
  }

  getWindow(){
    return this.state.window;
  }

  setWindow(window){
    if (!window._isADateRangeObject){
      window = new DateRange(window);
    }

    if (window === this.state.window){
      return false;
    }

    console.log(`social.setWindow(${window})`);
    this.state.window = window;
    this.clearCache();
    return true;
  }

  getPeople() {
    if (!this.state.cache.people){
      this.state.cache.people = this.state.people.filter(this.getFilters());
    }

    return this.state.cache.people;
  }

  getBusinesses() {
    if (!this.state.cache.businesses){
      this.state.cache.businesses = this.state.businesses.filter(this.getFilters());
    }

    return this.state.cache.businesses;
  }

  getMessages() {
    if (!this.state.cache.messages){
      this.state.cache.messages = this.state.messages.filter(this.getFilters());
    }

    return this.state.cache.messages;
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
    this.clearCache();
  }

  setAnchor(anchor) {
    if (anchor) {
      anchor = this.getPeople().find(anchor);
    }

    this.state.anchor = anchor;
    this.clearCache();
  }

  toggleNodeFilter(item) {
    if (this.state.filter.node === item) {
      this.state.filter.node = null;
    }
    else{
      this.state.filter.node = item;
    }

    this.clearCache();
  }

  toggleGroupFilter(item){
    if (this.state.filter.group === item){
      this.state.filter.group = null;
    }
    else{
      this.state.filter.group = item;
    }

    this.clearCache();
  }

  getProjectTimeLine(){
    if (this.state.cache.projectTimeLine !== null){
      return this.state.cache.projectTimeLine;
    }

    let items = [];

    this.state.cache.projectTimeLine = items;

    return this.state.cache.projectTimeLine;
  }

  getItemTimeLine(){
    if (this.state.cache.itemTimeLine !== null){
      return this.state.cache.itemTimeLine;
    }

    let people = this.getPeople();

    let items = people.getTimeLine();

    this.state.cache.itemTimeLine = items;

    return this.state.cache.itemTimeLine;
  }

  getGraph() {
    if (this.state.cache.graph !== null){
      return this.state.cache.graph;
    }

    const anchor = this.state.anchor;
    let nodes = this.getPeople().getNodes({anchor: anchor});
    nodes.add(this.getBusinesses().getNodes().get());
    let edges = this.getMessages().getEdges();

    this.state.cache.graph = {"nodes": nodes, "edges": edges};
    return this.state.cache.graph;
  }

  setNetwork(network){
    this.state.network = network;
  }

  getNetwork(){
    return this.state.network;
  }

  get(id) {
    if (id[0] === "M") {
      return this.getMessages().get(id);
    }
    else if (id[0] === "P") {
      return this.getPeople().get(id);
    }
    else if (id[0] === "B") {
      return this.getBusinesses().get(id);
    }
    else if (id[0] === "Q") {
      return this.getPositions().get(id);
    }
    else if (id[0] === "A") {
      return this.getAffiliations().get(id);
    }
    else if (id[0] === "S") {
      return this.getSources().get(id);
    }
    else if (id[0] === "N") {
      return this.getNotes().get(id);
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
