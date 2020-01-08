
import Dry from 'json-dry';
import lodash from 'lodash';

import People from './People';
import Businesses from './Businesses';
import Connections from './Connections';
import Positions from './Positions';
import Affiliations from './Affiliations';
import Sources from './Sources';
import Notes from './Notes';
import Projects from './Projects';
import Biographies from './Biographies';
import DateRange from './DateRange';

import { ValueError } from './Errors';

const fast_physics = {
  enabled: true,
  timestep: 0.5,
};

const slow_physics = {...fast_physics};
slow_physics.timestep = 0.1;

function _filtersNodes(filter){
  let yes = false;

  Object.keys(filter).forEach((key, value)=>{
    if (yes){
      return;
    }
    else if (key[0] === "P" || key[0] === "B"){
      yes = true;
      return;
    }
  });

  return yes;
}

function _filtersGroups(filter){
  let yes = false;

  Object.keys(filter).forEach((key, value)=>{
    if (yes){
      return;
    }
    else if (key[0] !== "P" || key[0] !== "B" || key[0] !== "J"){
      yes = true;
    }
  });
}

function _filtersProjects(filter){
  let yes = false;

  Object.keys(filter).forEach((key, value)=>{
    if (yes){
      return;
    }
    else if (key[0] === "J"){
      yes = true;
    }
  });

  return yes;
}

class Social {
  constructor(props) {
    if (props){
      this.state = props;
    }
    else{
      this.state = {};
    }

    this.state.anchor = null;
    this.state.filter = {};
    this.state.cache = {graph:null,
                        projectTimeLine:null,
                        itemTimeLine:null,
                        node_filters:null,
                        edge_filters:null,
                        people:null,
                        businesses:null,
                        connections:null};
    this.state.network = null;
    this.state.window = new DateRange();
    this._rebuilding = 0;

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

    if (!(this.state.connections instanceof Connections)) {
      state.connections = new Connections();
    } else {
      state.connections = this.state.connections;
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

    if (!(this.state.biographies instanceof Biographies)){
      state.biographies = new Biographies();
    }
    else{
      state.biographies = this.state.biographies;
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
                        businesses:null,
                        connections:null};
    this._rebuilding = 0;
  }

  getNodeFilters(){
    if (this.state.cache.node_filters){
      return this.state.cache.node_filters;
    }

    this._rebuilding += 1;
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

    const filter = this.state.filter;

    if (_filtersProjects(filter)){
      this.state.cache.node_filters.push((item)=>{
        return item.filterProject(filter);
      });
    }

    if (_filtersNodes(filter)) {
      let connections = this.getConnectionsTo(filter);
      let node_filter = {...filter};

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

    if (_filtersGroups(filter)){
      this.state.cache.node_filters.push((item)=>{
        try{
          if (item.inGroup(filter)){
            return item;
          }
          else{
            return null;
          }
        }
        catch(error){
          console.log(`Filter error: ${error}`);
          return item;
        }
      });
    }

    this._rebuilding -= 1;
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

      const filter = this.state.filter;

      if (_filtersProjects(filter)){
        this.state.cache.edge_filters.push((item)=>{
          try{
            return item.filterProject(filter);
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
      console.log("REBUILD PEOPLE");
      this._rebuilding += 1;
      this.state.cache.people =
            this.state.people.filter(this.getNodeFilters());
      this._rebuilding -= 1;
    }

    return this.state.cache.people;
  }

  getBusinesses() {
    if (!this.state.cache.businesses){
      console.log("REBUILD BUSINESSES");
      this._rebuilding += 1;
      this.state.cache.businesses =
            this.state.businesses.filter(this.getNodeFilters());
      this._rebuilding -= 1;
    }

    return this.state.cache.businesses;
  }

  getConnections() {
    if (!this.state.cache.connections){
      console.log("REBUILD CONNECTIONS");
      this._rebuilding += 1;
      this.state.cache.connections =
            this.state.connections.filter(this.getEdgeFilters());
      this._rebuilding -=1;
    }

    return this.state.cache.connections;
  }

  getBiographies(){
    return this.state.biographies;
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
    return this.getConnections().getConnectionsTo(item);
  }

  getAnchor() {
    return this.state.anchor;
  }

  getFilter() {
    return {...this.state.filter};
  }

  getFilterText(){
    const filter = [];

    Object.keys(this.state.filter).forEach((key, item)=>{
      filter.push(this.get(key));
    });

    if (filter.length > 0){
      return filter.join(" and ");
    }
    else{
      return null;
    }
  }

  isFiltered(item){
    if (item.getID){
      item = item.getID();
    }

    return item in this.state.filter;
  }

  resetFilters(){
    this.state.filter = {};
    this.clearCache();
  }

  setAnchor(anchor) {
    if (anchor) {
      anchor = this.getPeople().find(anchor);
    }

    this.state.anchor = anchor;
    this.clearCache();
  }

  toggleFilter(item){
    if (item.getID){
      item = item.getID();
    }

    if (item in this.state.filter){
      delete this.state.filter[item];
    }
    else{
      this.state.filter[item] = 1;
    }

    this.clearCache();
  }

  getProjectTimeLine(){
    if (this.state.cache.projectTimeLine !== null){
      return this.state.cache.projectTimeLine;
    }

    let items = this.getProjects().getTimeLine();

    this.state.cache.projectTimeLine = items;

    return this.state.cache.projectTimeLine;
  }

  getItemTimeLine(){
    if (this.state.cache.itemTimeLine !== null){
      return this.state.cache.itemTimeLine;
    }

    let items = this.getPeople().getTimeLine();

    let projects = this.getProjects().getTimeLine();

    projects.forEach((item)=>{
      item.type = "background";
      items.push(item);
    });

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
    let edges = this.getConnections().getEdges();

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
    if (id.getID){
      id = id.getID();
    }

    if (id[0] === "C") {
      if (this._rebuilding){
        return this.state.connections.get(id);
      }
      else{
        return this.getConnections().get(id);
      }
    }
    else if (id[0] === "P") {
      if (this._rebuilding){
        return this.state.people.get(id);
      }
      else{
        return this.getPeople().get(id);
      }
    }
    else if (id[0] === "B") {
      if (this._rebuilding){
        return this.state.businesses.get(id);
      }
      else{
        return this.getBusinesses().get(id);
      }
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
