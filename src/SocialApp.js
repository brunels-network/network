// package imports
import React from "react";
import Dry from "json-dry";

// Brunel components
import AboutOverlay from "./components/AboutOverlay";
import AnalysisPanel from "./components/AnalysisPanel";
import ForceGraph from "./components/ForceGraph";
import HowDoIOverlay from "./components/HowDoIOverlay";
import TimeLineBox from "./components/TimeLineBox";
import FilterBox from "./components/FilterBox";
import SlidingPanel from "./components/SlidingPanel";
import ShipSelector from "./components/ShipSelector";
import ShipTitle from "./components/ShipTitle";
import SearchOverlay from "./components/SearchOverlay";
import TextButton from "./components/TextButton";
import Overlay from "./components/Overlay";

// Brunel model
import Social from "./model/Social";

// Data for import
import graphData from "./socialNetwork.json";
import positionGroups from "./data/positionGroups.json";

// Styling for the app
import styles from "./SocialApp.module.css";
import DateRange from "./model/DateRange";

class SocialApp extends React.Component {
  constructor(props) {
    super(props);

    this.togglePhysicsEnabled = this.togglePhysicsEnabled.bind(this);
    this.resetAllFilters = this.resetAllFilters.bind(this);
    this.setOverlay = this.setOverlay.bind(this);
    this.toggleOverlay = this.toggleOverlay.bind(this);
    this.closeOverlay = this.closeOverlay.bind(this);

    // Load in the Dried graph data from JSON
    let social = Dry.parse(graphData);

    if (!(social instanceof Social)) {
      console.error("Could not parse!");
      social = new Social();
    }

    // Special cases for Brunel project...
    social.setAnchor("Brunel");
    social.setMaxWindow(new DateRange({ start: "1800-01-01", end: "1860-12-31" }));

    this.state = {
      social: social,
      highlighted_item: null,
      selected_item: null,
      overlayItem: null,
      isInfoPanelOpen: false,
      isTimeLinePanelOpen: false,
      isFilterPanelOpen: false,
      isHamburgerMenuOpen: false,
      isSearchOverlayOpen: false,
      indirectConnectionsVisible: false,
      unconnectedNodesVisible: false,
      commercialFiltered: false,
      engineersFiltered: false,
      GravitySimulation: true,
      simulationType: "Gravity",
      commericalNodeFilter: [],
      engineerNodeFilter: [],
      connectedNodes: null,
      timeline: new TimeLineBox(),
      isOverlayOpen: false,
      isAnalysisOpen: false,
      physicsEnabled: false,
      selectedShip: null,
      selectedShipID: null,
    };

    // TODO - work out a cleaner way of doing this
    // Is set in ShipSelector correctly
    const ssGW = social.getProjects().getByName("SS Great Western");
    this.state.selectedShip = ssGW.getName();
    this.state.selectedShipID = ssGW.getID();

    this.simulationTypes = Object.freeze({ Gravity: 1, Filtered: 1, Structured: 1 });

    // Find the investors and engineers for easy filtering
    // This requires the
    this.findInvestorsAndEngineers();
    // Find the unconnected nodes for filtering
    this.findConnectedNodes();

    // Hide the unconnected nodes
    this.state.social.toggleFilter(this.state.connectedNodes);
    this.state.unconnectedNodesVisible = false;

    this.socialGraph = null;
  }

  resetAllFilters() {
    // This resets all filters including the ship filter
    let social = this.state.social;
    social.resetAllFilters();
    this.setState({
      social: social,
      engineersFiltered: false,
      commercialFiltered: false,
      unconnectedNodesVisible: !this.state.unconnectedNodesVisible,
    });
  }

  resetFiltersNotShip() {
    // This resets all filters except the ship filter
    let social = this.state.social;
    social.resetFiltersNotShip();
    this.setState({
      social: social,
      engineersFiltered: false,
      commercialFiltered: false,
      unconnectedNodesVisible: !this.state.unconnectedNodesVisible,
    });
  }

  closePanels() {
    this.setState({
      isInfoPanelOpen: false,
      isTimeLinePanelOpen: false,
      isHamburgerMenuOpen: false,
      isFilterPanelOpen: false,
      isAnalysisOpen: false,
      highlighted_item: null,
    });
  }

  closeOverlay() {
    this.setState({
      isOverlayOpen: false,
      overlayItem: null,
    });
  }

  showInfo(item) {
    if (item._isAProjectObject) {
      this.setState({
        overlayItem: item,
        isOverlayOpen: true,
      });
    } else {
      this.setState({
        selected_item: item,
        isInfoPanelOpen: true,
      });
    }
  }

  slotSetShip(item) {
    if (!item._isAProjectObject) {
      console.error("Cannot set item that is not a project.");
      return;
    }

    this.setState({ selectedShip: item.getName(), selectedShipID: item.getID() });
    this.slotToggleFilter(item);
  }

  slotSetFilterbyID(id, name) {
    // this.resetAllFilterss();
    this.setState({ selectedShip: name, selectedShipID: id });
    this.slotToggleFilter(id);
  }

  slotToggleProjectFilter(project) {
    let social = this.state.social;
    social.toggleProjectFilter(project);

    this.setState({ social: social });
  }

  slotToggleFilter(item) {
    if (!item) {
      return;
    }

    let social = this.state.social;

    // This feels clunky, is there a cleaner way of doing this?
    // Currently we only want one ship selectable at a time
    if (item._isAProjectObject) {
      social.clearProjectFilter();
    }

    social.toggleFilter(item);

    this.setState({ social: social });
  }

  slotSetFilters(...args) {
    let social = this.state.social;
    social.setFilters(...args);
    this.setState({ social: social });
  }

  slotClearFilters(...args) {
    let social = this.state.social;
    social.clearFilters(...args);
    this.setState({ social: social });
  }

  slotHighlighted(id) {
    if (!id) {
      return;
    }

    if (id._isADateRangeObject) {
      return;
    }

    this.setState({ highlighted_item: id });
  }

  slotSelected(id) {
    if (!id) {
      this.closePanels();
      return;
    }

    if (id._isADateRangeObject) {
      let social = this.state.social;
      if (social.setWindow(id)) {
        this.setState({ social: social });
      }
      return;
    }

    const social = this.state.social;
    const item = social.get(id);
    this.showInfo(item);
  }

  slotWindowChanged(window) {
    let social = this.state.social;

    if (social.setWindow(window)) {
      this.setState({ social: social });
    }
  }

  gotConnections(entity) {
    const shipID = this.state.selectedShipID;

    try {
      if (entity["edge_count"][shipID] > 0) {
        return true;
      } else {
        return false;
      }
      // We might not have an edge count for this ship
    } catch (error) {
      return false;
    }
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
    let connectedNodes = [];
    let unconnectedNodes = [];

    const people = this.state.social.getPeople(false).getNodes("noanchor");

    for (const p of people) {
      if (this.gotConnections(p)) {
        connectedNodes.push(p.id);
      } else {
        unconnectedNodes.push(p.id);
      }
    }

    const businesses = this.state.social.getBusinesses(false).getNodes("noanchor");

    for (const b of businesses) {
      if (this.gotConnections(b)) {
        connectedNodes.push(b.id);
      } else {
        unconnectedNodes.push(b.id);
      }
    }

    // This function only called from within ctor so need to set directly here
    /* eslint-disable react/no-direct-mutation-state */
    this.state.connectedNodes = connectedNodes;
    this.state.unconnectedNodes = unconnectedNodes;
    /* eslint-enable react/no-direct-mutation-state */
  }

  toggleUnconnectedNodesVisible() {
    this.slotToggleFilter(this.state.connectedNodes);
    this.setState({ unconnectedNodesVisible: !this.state.unconnectedNodesVisible });
  }

  toggleSimulationType() {
    const simType = this.state.simulationType;

    if (simType === "Gravity") {
      this.setSimulationType("Structured");
    } else if (simType === "Structured" || simType === "Filtered") {
      this.setSimulationType("Gravity");
    }
  }

  setSimulationType(simType) {
    if (simType in this.simulationTypes) {
      this.setState({ simulationType: simType });
    } else {
      console.error("Invalid simulaiton type, valid types are ", Object.keys(this.simulationTypes));
    }
  }

  // If unconnected nodes are enabled add them to the filter, if they're not remove them
  filterEngineeringNodes() {
    if (this.state.commercialFiltered) {
      this.filterCommercialNodes();
    }

    if (this.state.engineersFiltered) {
      this.resetFiltersNotShip();
      this.toggleUnconnectedNodesVisible();
      this.setSimulationType("Gravity");
    } else {
      this.resetFiltersNotShip();
      // If we have unconnected nodes as part of this filter set, get rid of them
      const nodesToFilter = this.state.engineerNodeFilter.filter((v) => !this.state.unconnectedNodes.includes(v));
      this.slotToggleFilter(nodesToFilter);
      this.setSimulationType("Filtered");
    }

    this.setState({ engineersFiltered: !this.state.engineersFiltered });
  }

  filterCommercialNodes() {
    if (this.state.engineersFiltered) {
      this.filterEngineeringNodes();
    }

    if (this.state.commercialFiltered) {
      this.resetFiltersNotShip();
      this.toggleUnconnectedNodesVisible();
      this.setSimulationType("Gravity");
    } else {
      this.resetFiltersNotShip();
      // If we have unconnected nodes as part of this filter set, get rid of them
      const nodesToFilter = this.state.commericalNodeFilter.filter((v) => !this.state.unconnectedNodes.includes(v));
      this.slotToggleFilter(nodesToFilter);
      this.setSimulationType("Filtered");
    }

    this.setState({ commercialFiltered: !this.state.commercialFiltered });
  }

  toggleInfoPanel() {
    this.setState({ isInfoPanelOpen: !this.state.isInfoPanelOpen });
  }

  toggleTimeLinePanel() {
    this.setState({
      isFilterPanelOpen: false,
      isTimeLinePanelOpen: !this.state.isTimeLinePanelOpen,
    });
  }

  toggleFilterPanel() {
    this.setState({
      isTimeLinePanelOpen: false,
      isFilterPanelOpen: !this.state.isFilterPanelOpen,
    });
  }

  toggleAnalysisPanel() {
    this.setState({ isAnalysisOpen: !this.state.isAnalysisOpen });
  }

  toggleSearchOverlay() {
    this.setState({ isSearchOverlayOpen: !this.state.isSearchOverlayOpen });
  }

  togglePhysicsEnabled() {
    this.setState({ physicsEnabled: !this.state.physicsEnabled });
  }

  toggleindirectConnectionsVisible() {
    this.setState({ indirectConnectionsVisible: !this.state.indirectConnectionsVisible });
  }

  setOverlay(item) {
    this.setState({
      overlayItem: item,
      isOverlayOpen: true,
    });
  }

  toggleOverlay() {
    this.setState({ isOverlayOpen: !this.state.isOverlayOpen });
  }

  resetAll() {
    window.location.reload(true);
  }

  render() {
    const selected = this.state.selected_item;
    const highlighted = this.state.highlighted_item;
    const social = this.state.social;
    let searchOverlay = null;

    if (this.state.isSearchOverlayOpen) {
      searchOverlay = (
        <SearchOverlay
          social={social}
          toggleSearchOverlay={() => this.toggleSearchOverlay()}
          emitSelected={(item) => {
            this.slotSelected(item);
          }}
          emitHighlighted={(item) => {
            this.slotHighlighted(item);
          }}
          emitClicked={(item) => {
            this.slotClicked(item);
          }}
          selectedShipID={this.state.selectedShipID}
        />
      );
    }

    let overlay = null;
    if (this.state.isOverlayOpen) {
      overlay = <Overlay toggleOverlay={this.toggleOverlay}>{this.state.overlayItem}</Overlay>;
    }

    let analysisButton = null;
    if (!this.state.isAnalysisOpen) {
      analysisButton = (
        <TextButton
          fontSize="4.5vh"
          textColor="#f1f1f1"
          hoverColor="#9CB6A4"
          onClick={() => this.toggleAnalysisPanel()}
        >
          Analysis
        </TextButton>
      );
    }

    return (
      <div>
        <div className={styles.whatIsButtonContainer}>
          <TextButton
            fontSize="3vh"
            hoverColor="#9CB6A4"
            padding="2px 2px 2px 2px"
            onClick={() => {
              this.setOverlay(<AboutOverlay close={this.closeOverlay} />);
            }}
          >
            What is Brunel&apos;s Network?
          </TextButton>
        </div>

        <div className={styles.howDoIButtonContainer}>
          <TextButton
            fontSize="3vh"
            hoverColor="#9CB6A4"
            padding="2px 2px 2px 2px"
            onClick={() => {
              this.setOverlay(<HowDoIOverlay close={this.closeOverlay} />);
            }}
          >
            How do I navigate the network?
          </TextButton>
        </div>

        <div className={styles.analysisButtonPanel}>{analysisButton}</div>

        <div className={styles.resetButtonContainer}>
          <TextButton fontSize="2.7vh" hoverColor="#9CB6A4" padding="2px 2px 2px 2px" onClick={() => this.resetAll()}>
            Reset
          </TextButton>
        </div>

        <div className={styles.simulationTypeButtonContainer}>
          <TextButton fontSize="1.8vh" textColor="#f1f1f1" hoverColor="#f1f1f1" padding="2px 2px 2px 2px">
            Simulation type
          </TextButton>
          <TextButton
            fontSize="2.7vh"
            textColor="#f1f1f1"
            hoverColor="#9CB6A4"
            padding="2px 2px 2px 2px"
            onClick={() => this.toggleSimulationType()}
          >
            {this.state.simulationType}
          </TextButton>
        </div>

        <div className={styles.commercialNodeLabel}>
          <TextButton
            fontSize="4.3vh"
            textColor="#B52222"
            hoverColor="#FFFFF0"
            padding="1px 1px 1px 1px"
            onClick={() => this.filterCommercialNodes()}
          >
            Commercial&#x25CF;
          </TextButton>
        </div>
        <div className={styles.engineeringNodeLabel}>
          <TextButton
            fontSize="4.3vh"
            textColor="#808080"
            hoverColor="#FFFFF0"
            padding="1px 1px 1px 1px"
            onClick={() => this.filterEngineeringNodes()}
          >
            Engineers&#x25CF;
          </TextButton>
        </div>

        <SlidingPanel isOpen={this.state.isTimeLinePanelOpen} position="bottom" height="15%">
          <span
            className={styles.closePanelButton}
            onClick={() => {
              this.setState({ isTimeLinePanelOpen: false });
            }}
          >
            X
          </span>
          <TimeLineBox
            selected={selected}
            projects={this.state.social.getProjects()}
            shipSelect={(item) => {
              this.slotSetFilter(item);
            }}
            resetFilters={this.resetAllFilters}
          />
        </SlidingPanel>

        {/* Filter on bottom of page */}
        <SlidingPanel isOpen={this.state.isFilterPanelOpen} position="bottom" height="25%">
          <span
            className={styles.closePanelButton}
            onClick={() => {
              this.setState({ isFilterPanelOpen: false });
            }}
          >
            X
          </span>
          <FilterBox
            social={social}
            emitToggleFilter={(item) => {
              this.slotToggleFilter(item);
            }}
            emitSelected={(item) => {
              this.slotSelected(item);
            }}
            emitHighlighted={(item) => {
              this.slotHighlighted(item);
            }}
            emitClearFilters={() => {
              this.resetAllFilters();
            }}
          />
        </SlidingPanel>

        <div className={styles.shipNameContainer}>
          <ShipTitle name={this.state.selectedShip} />
        </div>

        <div className={styles.bottomContainer}>
          <ShipSelector projects={this.state.social.getProjects()} shipFilter={(item) => this.slotSetShip(item)} />
        </div>
        <div className={styles.acknowledgeContainer}>
          Brunel&apos;s Network is a project by the Brunel Institute, a collaboration of the SS Great Britain Trust and
          University of Bristol.
        </div>

        {/* The social graph itself */}
        <div className={styles.mainContainer}>
          <div className={styles.graphContainer}>
            <ForceGraph
              social={this.state.social}
              selected={selected}
              highlighted={highlighted}
              emitClicked={(id) => this.slotSelected(id)}
              setOverlay={this.setOverlay}
              selectedShipID={this.state.selectedShipID}
              indirectConnectionsVisible={this.state.indirectConnectionsVisible}
              physicsEnabled={this.state.physicsEnabled}
              GravitySimulation={this.state.GravitySimulation}
              simulationType={this.state.simulationType}
            />
          </div>
        </div>

        <SlidingPanel isOpen={this.state.isAnalysisOpen} position="rightBottom" width="10%">
          <AnalysisPanel
            toggleSearchOverlay={() => this.toggleSearchOverlay()}
            toggleFilterPanel={() => this.toggleFilterPanel()}
            toggleTimeLinePanel={() => this.toggleTimeLinePanel()}
            togglePanel={() => this.toggleAnalysisPanel()}
            toggleUnconnectedNodesVisible={() => {
              this.toggleUnconnectedNodesVisible();
            }}
            toggleindirectConnectionsVisible={() => this.toggleindirectConnectionsVisible()}
            closeOverlay={() => this.closeOverlay()}
            commercialFiltered={this.state.commercialFiltered}
            engineersFiltered={this.state.engineersFiltered}
            filterEngineeringNodes={() => this.filterEngineeringNodes()}
            filterCommercialNodes={() => this.filterCommercialNodes()}
            physicsEnabled={this.state.physicsEnabled}
            togglePhysicsEnabled={this.togglePhysicsEnabled}
            indirectConnectionsVisible={this.state.indirectConnectionsVisible}
            unconnectedNodesVisible={this.state.unconnectedNodesVisible}
            resetFilters={() => this.resetFiltersNotShip()}
          />
        </SlidingPanel>
        {searchOverlay}
        {overlay}
      </div>
    );
  }
}

export default SocialApp;
