
import Dry from 'json-dry';
import lodash from 'lodash';

import People from './People';
import Businesses from './Businesses';
import Messages from './Messages';
import Positions from './Positions';
import Affiliations from './Affiliations';
import Sources from './Sources';
import Notes from './Notes';
import Projects from './Projects';
import DateRange from './DateRange';

import { ValueError } from './Errors';

/*const fast_physics = {
  enabled: true,
  barnesHut: {
    gravitationalConstant: -50,
    centralGravity: 0.0,
    springLength: 50,
    springConstant: 0.02,
    damping: 0.2,
    avoidOverlap: 0.5
  },
  maxVelocity: 30,
  minVelocity: 0.2,
  solver: 'barnesHut',
  stabilization: {
    enabled: true,
    iterations: 100,
    updateInterval: 10,
    onlyDynamicEdges: false,
    fit: true
  },
  timestep: 0.5,
  adaptiveTimestep: true
};

const slow_physics = {...fast_physics};
slow_physics.timestep = 0.1;*/

const fast_physics = {
  enabled: true,
  timestep: 0.5,
};

const slow_physics = {...fast_physics};
slow_physics.timestep = 0.1;


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
                        node_filters:null,
                        edge_filters:null,
                        people:null,
                        businesses:null,
                        messages:null};
    this.state.network = null;
    this.state.window = new DateRange();

    this._isASocialObject = true;
  }

  static clone(item){
    let c = new Social();
    c.state = lodash.cloneDeep(item.state);
    return c;
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

    if (!(this.state.projects instanceof Projects)){
      state.projects = new Projects();
    }
    else {
      state.projects = this.state.projects;
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
                        node_filters:null,
                        edge_filters:null,
                        people:null,
                        businesses: null,
                        messages:null};
  }

  getNodeFilters(){
    if (!this.state.cache.node_filters){
      this.state.cache.node_filters = [];

      // must do time first, as this can affect all of the other filters!
      let window = this.getWindow();

      if (window.hasStart() || window.hasEnd()){
        this.state.cache.node_filters.push((item)=>{
          try{
            return item.filterWindow(window);
          }
          catch(error){
            console.log(`ERROR ${error}: ${item}`);
            return item;
          }
        });
      }

      let node_filter = this.state.filter.node;

      if (node_filter) {
        let id = node_filter.getID();
        let connections = this.getMessages().getConnectionsTo(node_filter);
        node_filter = {};
        node_filter[id] = 1;
        for (let connection in connections) {
          let node = connections[connection];
          node_filter[node.getID()] = 1;
        }

        this.state.cache.node_filters.push((item)=>{
          if (item.getID() in node_filter){
            return item;
          }
          else{
            return null;
          }
        });
      }

      let group_filter = this.state.filter.group;

      if (group_filter){
        if (group_filter.getID){
          group_filter = group_filter.getID();
        }

        this.state.cache.node_filters.push((item)=>{
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
    }

    return this.state.cache.node_filters;
  }

  getEdgeFilters(){
    if (!this.state.cache.edge_filters){
      this.state.cache.edge_filters = [];

      // must do time first, as this can affect all of the other filters!
      let window = this.getWindow();

      if (window.hasStart() || window.hasEnd()){
        this.state.cache.edge_filters.push((item)=>{
          try{
            return item.filterWindow(window);
          }
          catch(error){
            console.log(`ERROR ${error}: ${item}`);
            return item;
          }
        });
      }
    }

    return this.state.cache.edge_filters;
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

    this.state.window = window;
    this.clearCache();
    return true;
  }

  getPeople() {
    if (!this.state.cache.people){
      this.state.cache.people =
            this.state.people.filter(this.getNodeFilters());
    }

    return this.state.cache.people;
  }

  getBusinesses() {
    if (!this.state.cache.businesses){
      this.state.cache.businesses =
            this.state.businesses.filter(this.getNodeFilters());
    }

    return this.state.cache.businesses;
  }

  getMessages() {
    if (!this.state.cache.messages){
      this.state.cache.messages =
            this.state.messages.filter(this.getEdgeFilters());
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

  getProjects() {
    return this.state.projects;
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

    let network = this.getNetwork();

    if (network){
      //make sure that the screen updates gracefully
      network.setOptions({physics: false});

      setTimeout(()=>{network.setOptions({physics: slow_physics})}, 250);
      setTimeout(()=>{network.setOptions({physics: fast_physics})}, 500);
    }

    this.state.cache.graph = {"nodes": nodes, "edges": edges};
    return this.state.cache.graph;
  }

  setNetwork(network){
    this.state.network = network;
  }

  getNetwork(){
    return this.state.network;
  }

  add(item){
    if (!item){
      return;
    }

    let added = false;

    Object.keys(this.state).forEach((key, index)=>{
      if (!added){
        let group = this.state[key];
        if (group && group.canAdd){
          if (group.canAdd(item)){
            group.add(item);
            added = true;
          }
        }
      }
    });

    if (!added){
      throw new ValueError(
          `Do not know how to add ${item} to this Social group`);
    }
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
    else if (id[0] === "J") {
      return this.getProjects().get(id);
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
