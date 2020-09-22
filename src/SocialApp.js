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
      filterUnconnectedNodes: true,
      commercialFiltered: false,
      engineersFiltered: false,
      spiralOrder: "Influence",
      nodeSize: "Influence",
      commercialNodeFilter: [],
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

    this.state.social.setScoringFunction(this.spiralOrders[this.state.spiralOrder]);

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
    let social = this.state.social;
    social.resetAllFilters();
    social.setFilter("project", this.state.selectedShipID)

    social.filterUnconnectedNodes(true);

    if (this.state.searchText.length > 0) {
      social.selectSearchMatching(this.state.searchText,
        this.state.searchIncludeBios,
        this.state.searchHighlightLinks);
    }

    this.setState({
      social: social,
      engineersFiltered: false,
      commercialFiltered: false,
      filterUnconnectedNodes: true,
    });
  }

  slotToggleUnconnectedNodes() {
    let social = this.state.social;

    social.resetAllFilters();
    social.setFilter("project", this.state.selectedShipID)

    if (this.state.engineersFiltered) {
      social.toggleFilter(this.state.engineerNodeFilter);
    }
    else if (this.state.commercialFiltered) {
      social.toggleFilter(this.state.commercialNodeFilter);
    }

    social.filterUnconnectedNodes(!this.state.filterUnconnectedNodes);

    if (this.state.searchText.length > 0) {
      social.selectSearchMatching(this.state.searchText,
        this.state.searchIncludeBios,
        this.state.searchHighlightLinks);
    }

    this.setState({
      social: social,
      filterUnconnectedNodes: !this.state.filterUnconnectedNodes
    });
  }

  slotToggleFilterEngineer() {
    let social = this.state.social;

    social.resetAllFilters();
    social.setFilter("project", this.state.selectedShipID)

    if (!this.state.engineersFiltered) {
      social.toggleFilter(this.state.engineerNodeFilter);
    }

    social.filterUnconnectedNodes(this.state.filterUnconnectedNodes);

    if (this.state.searchText.length > 0) {
      social.selectSearchMatching(this.state.searchText,
        this.state.searchIncludeBios,
        this.state.searchHighlightLinks);
    }

    this.setState({
      social: social,
      engineersFiltered: !this.state.engineersFiltered,
      commercialFiltered: false});
  }

  slotToggleFilterCommercial() {
    let social = this.state.social;

    social.resetAllFilters();
    social.setFilter("project", this.state.selectedShipID)

    if (!this.state.commercialFiltered) {
      social.toggleFilter(this.state.commercialNodeFilter);
    }

    social.filterUnconnectedNodes(this.state.filterUnconnectedNodes);

    if (this.state.searchText.length > 0) {
      social.selectSearchMatching(this.state.searchText,
        this.state.searchIncludeBios,
        this.state.searchHighlightLinks);
    }

    this.setState({
      social: social,
      commercialFiltered: !this.state.commercialFiltered,
      engineersFiltered: false});
  }

  slotClicked(id) {
    let social = this.state.social;

    if (!id) {
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
    // Add nodes to the commercial or engineering groups. This
    // creates filters that filter positions that we've matched
    // as benig "engineer" or "commercial"
    let commercialNodeFilter = this.state.commercialNodeFilter;
    let engineerNodeFilter = this.state.engineerNodeFilter;

    const social = this.state.social;

    let positions = social.getPositions(false).items();

    Object.keys(positions).forEach((name) => {
      // Trim any extra characters or whitespace from the position string
      const namedPosition = name
        .toLowerCase()
        .replace(/\s/g, "")
        .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");

      // Here we need to check if they've already been saved to stop double counting
      if (positionGroups["commercial"]["members"].includes(namedPosition)) {
        const positionID = positions[name];
        if (!commercialNodeFilter.includes(positionID)) {
          commercialNodeFilter.push(positionID);
        }
      }

      if (positionGroups["engineering"]["members"].includes(namedPosition)) {
        const positionID = positions[name];
        if (!engineerNodeFilter.includes(positionID)) {
          engineerNodeFilter.push(positionID);
        }
      }
    });
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
        width="20%"
      >
        <MainMenu
          close={() => { this.slotCloseMenu() }}
          unconnectedNodesVisible = {!this.state.filterUnconnectedNodes}
          engineersFiltered = {this.state.engineersFiltered}
          commercialFiltered = {this.state.commercialFiltered}
          emitResetFilters = {()=>{this.slotClearFilters()}}
          emitToggleFilterCommercial = {()=>this.slotToggleFilterCommercial()}
          emitToggleFilterEngineering = {()=>this.slotToggleFilterEngineer()}
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
