// package imports
import React from "react";
import Dry from "json-dry";

// Brunel components
import ForceGraph from "./components/ForceGraph";
import ShipSelector from "./components/ShipSelector";
import TextButton from "./components/TextButton";
import LabelButton from "./components/LabelButton";
import HowDoIOverlay from "./components/HowDoIOverlay";
import Overlay from "./components/Overlay";
import SearchBar from "./components/SearchBar";
import ToggleButton from "./components/ToggleButton";
import BioOverlay from "./components/BioOverlay";
import ShipOverlay from "./components/ShipOverlay";
import SlidingPanel from "./components/SlidingPanel";
import MainMenu from "./components/MainMenu";

import HBox from "./components/HBox";
import VBox from "./components/VBox";
import BigBox from "./components/BigBox";

// Brunel model
import Social from "./model/Social";

// Data for import
import graphData from "./socialNetwork.json";
import positionGroups from "./data/positionGroups.json";

// Styling for the app
import styles from "./SocialApp.module.css";

import { score_by_connections, score_by_influence } from "./model/ScoringFunctions";

import { size_by_connections, size_by_influence } from "./model/SizingFunctions";
import { faSearchLocation } from "@fortawesome/free-solid-svg-icons";

class SocialApp extends React.Component {
  constructor(props) {
    super(props);

    // Load in the Dried graph data from JSON
    let social = Dry.parse(graphData);

    if (!(social instanceof Social)) {
      console.error("Could not parse!");
      social = new Social();
    }

    this.updateSize = this.updateSize.bind(this);

    this.state = {
      social: social,
      highlighted_item: null,
      selected_item: null,
      indirectConnectionsVisible: false,
      unconnectedNodesVisible: false,
      commercialFiltered: false,
      engineersFiltered: false,
      spiralOrder: "Influence",
      nodeSize: "Influence",
      commericalNodeFilter: [],
      engineerNodeFilter: [],
      connectedNodes: null,
      selectedShip: null,
      selectedShipID: null,
      isOverlayOpen: false,
      searchText: "",
      searchIncludeBios: false,
      searchHighlightLinks: true,
      menuVisible: false,
      height: 0,
      width: 0,
    };

    const ssGW = social.getProjects().getByName("SS Great Western");
    this.state.selectedShip = ssGW.getName();
    this.state.selectedShipID = ssGW.getID();

    // make sure that we start showing only the Great Western
    this.state.social.toggleFilter(ssGW);

    this.spiralOrders = Object.freeze({
      Connections: score_by_connections,
      Influence: score_by_influence,
    });

    this.nodeSizes = Object.freeze({
      Influence: size_by_influence,
      Connections: size_by_connections,
    });

    this.state.social.setSizingFunction(size_by_influence);

    // Find the investors and engineers for easy filtering
    // This requires the
    this.findInvestorsAndEngineers();

    // Find the unconnected nodes for filtering
    this.findConnectedNodes();

    // Hide the unconnected nodes
    this.state.social.toggleFilter(this.state.connectedNodes[this.state.selectedShipID]);
    this.state.social.setScoringFunction(this.spiralOrders[this.state.spiralOrder]);
    this.state.unconnectedNodesVisible = false;

    this.socialGraph = null;
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateSize);
    this.updateSize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateSize);
  }

  updateSize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    console.log(`WINDOW ${this.state.width}x${this.state.height}`);
  }

  slotSetAnchor(item) {
    let social = this.state.social;

    if (social.setAnchor(item)) {
      this.setState({ social: social });
    }
  }

  slotReadMore(item) {
    this.setOverlay(
      <BioOverlay
        close={() => {
          this.closeOverlay();
        }}
        social={this.state.social}
        person={item}
      />
    );
  }

  slotShowShip(item) {
    this.setOverlay(
      <ShipOverlay
        close={() => {
          this.closeOverlay();
        }}
        social={this.state.social}
        ship={item}
      />
    );
  }

  slotSetShip(item) {
    if (!item._isAProjectObject) {
      console.error("Cannot set item that is not a project.");
      return;
    }

    let social = this.state.social;
    social.setFilter("project", item);

    if (this.state.searchText.length > 0) {
      social.selectSearchMatching(this.state.searchText,
        this.state.searchIncludeBios,
        this.state.searchHighlightLinks);
    }

    this.setState({ selectedShip: item.getName(), selectedShipID: item.getID() });
    this.setState({ social: social });
  }

  slotClearFilters() {
    // This resets all filters including the ship filter
    let social = this.state.social;
    social.resetAllFilters();
    social.setFilter("project", this.state.selectedShipID)

    if (this.state.searchText.length > 0) {
      social.selectSearchMatching(this.state.searchText,
        this.state.searchIncludeBios,
        this.state.searchHighlightLinks);
    }

    this.setState({
      social: social,
      engineersFiltered: false,
      commercialFiltered: false,
      unconnectedNodesVisible: false,
      indirectConnectionsVisible: false,
    });
  }

  slotToggleUnconnectedNodes() {
    this.slotToggleFilter(this.state.connectedNodes[this.state.selectedShipID]);
    this.setState({
      unconnectedNodesVisible: !this.state.unconnectedNodesVisible,
    });
  }

  // If unconnected nodes are enabled add them to the filter, if they're not remove them
  slotToggleFilterEngineer() {
    this.slotClearFilters();

    if (!this.state.engineersFiltered) {
      this.slotToggleFilter(this.state.engineersFiltered);
    }

    this.setState({
      engineersFiltered: !this.state.engineersFiltered,
      commercialFiltered: false});
  }

  slotToggleFilterCommercial() {
    this.slotClearFilters();

    if (!this.state.commercialFiltered) {
      this.slotToggleFilter(this.state.commercialFiltered);
    }

    this.setState({
      commercialFiltered: !this.state.commercialFiltered,
      engineersFiltered: false});
  }

  slotToggleIndirectConnections() {
    this.setState({
      indirectConnectionsVisible: !this.state.indirectConnectionsVisible,
    });
  }

  slotToggleFilter(item) {
    if (!item) {
      return;
    }
    // This feels clunky, is there a cleaner way of doing this?
    // Currently we only want one ship selectable at a time
    else if (item._isAProjectObject) {
      // we don't toggle ship filters
      return;
    }

    let social = this.state.social;

    social.toggleFilter(item);

    if (this.state.searchText.length > 0) {
      social.selectSearchMatching(this.state.searchText,
        this.state.searchIncludeBios,
        this.state.searchHighlightLinks);
    }

    this.setState({ social: social });
  }

  slotClicked(id) {
    let social = this.state.social;

    if (!id) {
      console.log("NULL CLICKED");
      social.clearSelections();
      social.clearHighlights();
      this.setState({ social: social });
    } else if (social.isSelected(id)) {
      console.log(`POP UP THE SHORT BIO FOR ${id}`);
    } else {
      social.setSelected(id, true, true);
      this.setState({ social: social });
    }
  }

  slotWindowChanged(window) {
    let social = this.state.social;

    if (social.setWindow(window)) {
      this.setState({ social: social });
    }
  }

  hasConnections(entity) {
    return this.state.social.getConnections().gotConnections(entity.id);
  }

  findInvestorsAndEngineers() {
    // Creates a list of the IDs of all the nodes that belong to the commercial
    // side of the projects
    const people = this.state.social.getPeople(false).getRegistry();
    const businesses = this.state.social.getBusinesses(false).getRegistry();

    this.findAndGroupNodes(people);
    this.findAndGroupNodes(businesses);
  }

  findAndGroupNodes(entities) {
    // Add nodes to the commercial or engineering groups
    let commericalNodeFilter = this.state.commericalNodeFilter;
    let engineerNodeFilter = this.state.engineerNodeFilter;

    const social = this.state.social;

    for (const [id, entity] of Object.entries(entities)) {
      // Should do this for each ship
      for (const shipID of social.getProjects().getIDs()) {
        // Lookup named position, here we'll only use the first position
        // As each person may not have a role in every ship catch the error here
        let positionID;
        try {
          positionID = entity.getPosition(shipID)[0];
        } catch (error) {
          continue;
        }

        // Trim any extra characters or whitespace from the position string
        const namedPosition = social
          .getPositions()
          .getNameByID(positionID)
          .toLowerCase()
          .replace(/\s/g, "")
          .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");

        // Here we need to check if they've already been saved to stop double counting
        if (positionGroups["commercial"]["members"].includes(namedPosition)) {
          if (!commericalNodeFilter.includes(id)) {
            commericalNodeFilter.push(id);
          }
        }

        if (positionGroups["engineering"]["members"].includes(namedPosition)) {
          if (!engineerNodeFilter.includes(id)) {
            engineerNodeFilter.push(id);
          }
        }
      }
    }
  }

  findConnectedNodes() {
    // Loop through and find the connected nodes and create a list of them
    let connectedNodes = {};
    let unconnectedNodes = {};

    let social = this.state.social;

    // This should be updated to properly count the number of unconnected nodes per ship
    const shipIDs = this.state.social.getProjects().projects();

    for (const shipID of Object.values(shipIDs)) {
      // we must filter connections for each ship individually
      social.setFilter("project", shipID);

      let connected = [];
      let unconnected = [];

      const people = this.state.social.getPeople(true).getNodes();

      for (const p of people) {
        if (this.hasConnections(p)) {
          connected.push(p.id);
        } else {
          unconnected.push(p.id);
        }
      }

      const businesses = this.state.social.getBusinesses(true).getNodes();

      for (const b of businesses) {
        if (this.hasConnections(b)) {
          connected.push(b.id);
        } else {
          unconnected.push(b.id);
        }
      }

      connectedNodes[shipID] = connected;
      unconnectedNodes[shipID] = unconnected;
    }

    // This function only called from within ctor so need to set directly here
    /* eslint-disable react/no-direct-mutation-state */
    this.state.connectedNodes = connectedNodes;
    this.state.unconnectedNodes = unconnectedNodes;
    /* eslint-enable react/no-direct-mutation-state */
  }

  toggleSpiralOrder() {
    const order = this.state.spiralOrder;

    if (order === "Influence") {
      this.setSpiralOrder("Connections");
    } else if (order === "Connections") {
      this.setSpiralOrder("Influence");
    }
  }

  setSpiralOrder(order) {
    if (order in this.spiralOrders) {
      if (this.state.spiralOrder !== order) {
        let social = this.state.social;
        social.setScoringFunction(this.spiralOrders[order]);
        this.setState({
          social: social,
          spiralOrder: order,
        });
      }
    } else {
      console.error("Invalid spiral order, valid orders are ", Object.keys(this.spiralOrders));
    }
  }

  toggleNodeSize() {
    const size = this.state.nodeSize;

    if (size === "Influence") {
      this.setNodeSize("Connections");
    } else if (size === "Connections") {
      this.setNodeSize("Influence");
    }
  }

  setNodeSize(size) {
    if (size in this.nodeSizes) {
      if (this.state.nodeSize !== size) {
        let social = this.state.social;
        social.setSizingFunction(this.nodeSizes[size]);
        this.setState({
          social: social,
          nodeSize: size,
        });
      }
    } else {
      console.error("Invalid sizing function, valid functions are ", Object.keys(this.nodeSizes));
    }
  }

  setOverlay(item) {
    this.setState({
      overlayItem: item,
      isOverlayOpen: true,
    });
  }

  closeOverlay() {
    this.setState({
      isOverlayOpen: false,
      overlayItem: null,
    });
  }

  performSearch(text, include_bios, highlight_links) {
    let social = this.state.social;

    social.selectSearchMatching(text, include_bios, highlight_links);

    this.setState({
      social: social,
      searchIncludeBios: include_bios,
      searchHighlightLinks: highlight_links,
      searchText: text,
    });
  }

  slotShowMenu() {
    this.setState({ menuVisible: true });
  }

  slotCloseMenu() {
    this.setState({ menuVisible: false });
  }

  slotUpdateSearch(text) {
    this.performSearch(text, this.state.searchIncludeBios, this.state.searchHighlightLinks);
  }

  slotSearchBiosToggled(toggled) {
    this.performSearch(this.state.searchText, toggled, this.state.searchHighlightLinks);
  }

  slotSearchHighlightToggled(toggled) {
    this.performSearch(this.state.searchText, this.state.searchIncludeBios, toggled);
  }

  toggleOverlay() {
    this.setState({ isOverlayOpen: !this.state.isOverlayOpen });
  }

  resetAll() {
    window.location.reload(true);
  }

  render() {
    console.log("RENDER");

    let menu = <TextButton onClick={()=>{this.slotShowMenu()}}>Menu</TextButton>;

    let search = (
      <HBox>
        <BigBox>
          <SearchBar
            emitUpdate={(text) => {
              this.slotUpdateSearch(text);
            }}
          />
        </BigBox>
        <ToggleButton emitToggled={(v) => this.slotSearchBiosToggled(v)} toggled={this.state.searchIncludeBios}>
          BIOS
        </ToggleButton>
        <ToggleButton emitToggled={(v) => this.slotSearchHighlightToggled(v)} toggled={this.state.searchHighlightLinks}>
          LINKS
        </ToggleButton>
      </HBox>
    );

    let help = (
      <TextButton
        onClick={() => {
          this.setOverlay(
            <HowDoIOverlay
              close={() => {
                this.closeOverlay();
              }}
            />
          );
        }}
      >
        Help
      </TextButton>
    );

    let graph = (
      <ForceGraph
        social={this.state.social}
        selected={this.state.selected_item}
        highlighted={this.state.highlighted_item}
        signalClicked={(id) => this.slotClicked(id)}
        indirectConnectionsVisible={this.state.indirectConnectionsVisible}
        emitSetCenter={(id) => {
          this.slotSetAnchor(id);
        }}
        emitReadMore={(id) => {
          this.slotReadMore(id);
        }}
      />
    );

    let spiral = (
      <LabelButton
        label="Spiral Order"
        button={this.state.spiralOrder}
        onClick={() => {
          this.toggleSpiralOrder();
        }}
      />
    );

    let ship = (
      <ShipSelector
        projects={this.state.social.getProjects()}
        emitSetShip={(item) => this.slotSetShip(item)}
        emitShowShip={(item) => this.slotShowShip(item)}
      />
    );

    let size = (
      <LabelButton
        label="Node Size"
        button={this.state.nodeSize}
        onClick={() => {
          this.toggleNodeSize();
        }}
      />
    );

    let overlay = null;
    if (this.state.isOverlayOpen) {
      overlay = (
        <Overlay
          toggleOverlay={() => {
            this.toggleOverlay();
          }}
        >
          {this.state.overlayItem}
        </Overlay>
      );
    }

    let mainmenu = (
      <SlidingPanel
        isOpen={this.state.menuVisible}
        position="left"
        height="100%"
        width="50%"
      >
        <MainMenu
          close={() => { this.slotCloseMenu() }}
          indirectConnectionsVisible = {this.state.indirectConnectionsVisible}
          unconnectedNodesVisible = {this.state.unconnectedNodesVisible}
          engineersFiltered = {this.state.engineersFiltered}
          commercialFiltered = {this.state.commercialFiltered}
          emitResetFilters = {()=>{this.slotClearFilters()}}
          emitToggleFilterCommercial = {()=>this.slotToggleFilterCommercial()}
          emitToggleFilterEngineering = {()=>this.slotToggleFilterEngineer()}
          emitToggleIndirectConnectionsVisible = {()=>this.slotToggleIndirectConnections()}
          emitToggleUnconnectedNodesVisible = {()=>this.slotToggleUnconnectedNodes()}
        />
      </SlidingPanel>
    );

    return (
      <div>
        {mainmenu}
        <div className={styles.ui_main}>
          <VBox>
            <HBox>
              {menu}
              <BigBox>{search}</BigBox>
              {help}
            </HBox>

            <BigBox>
              <div className={styles.fullscreen}>{graph}</div>
            </BigBox>

            <HBox>
              {spiral}
              <BigBox>{ship}</BigBox>
              {size}
            </HBox>
          </VBox>
        </div>

        {overlay}
      </div>
    );
  }
}

export default SocialApp;
