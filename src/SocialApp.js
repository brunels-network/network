// package imports
import React from "react";
import Dry from "json-dry";

// Brunel components
import ForceGraph from "./components/ForceGraph";
import ShipSelector from "./components/ShipSelector";
import TextButton from "./components/TextButton";

// Brunel model
import Social from "./model/Social";

// Data for import
import graphData from "./socialNetwork.json";
import positionGroups from "./data/positionGroups.json";

// Styling for the app
import styles from "./SocialApp.module.css";

import {
  score_by_connections,
  score_by_influence
} from "./model/ScoringFunctions";

class SocialApp extends React.Component {
  constructor(props) {
    super(props);

    this.resetAllFilters = this.resetAllFilters.bind(this);

    // Load in the Dried graph data from JSON
    let social = Dry.parse(graphData);

    if (!(social instanceof Social)) {
      console.error("Could not parse!");
      social = new Social();
    }

    this.state = {
      social: social,
      highlighted_item: null,
      selected_item: null,
      indirectConnectionsVisible: false,
      unconnectedNodesVisible: false,
      commercialFiltered: false,
      engineersFiltered: false,
      spiralOrder: "Influence",
      commericalNodeFilter: [],
      engineerNodeFilter: [],
      connectedNodes: null,
      selectedShip: null,
      selectedShipID: null,
    };

    // TODO - work out a cleaner way of doing this
    // Is set in ShipSelector correctly
    const ssGW = social.getProjects().getByName("SS Great Western");
    this.state.selectedShip = ssGW.getName();
    this.state.selectedShipID = ssGW.getID();

    this.spiralOrders = Object.freeze({
      "Connections": score_by_connections,
      "Influence": score_by_influence
    });

    // Find the investors and engineers for easy filtering
    // This requires the
    this.findInvestorsAndEngineers();

    // Find the unconnected nodes for filtering
    this.findConnectedNodes();

    // Hide the unconnected nodes
    this.state.social.toggleFilter(
      this.state.connectedNodes[this.state.selectedShipID]);
    this.state.social.setScoringFunction(
      this.spiralOrders[this.state.spiralOrder]);
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

  slotSetAnchor(item) {
    let social = this.state.social;

    if (social.setAnchor(item)) {
      this.setState({ social: social });
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

    // This should be updated to properly count the number of unconnected nodes per ship
    const shipIDs = this.state.social.getProjects().projects();

    for (const shipID of Object.values(shipIDs)) {
      let connected = [];
      let unconnected = [];

      const people = this.state.social.getPeople(false).getNodes();

      for (const p of people) {
        if (this.hasConnections(p)) {
          connected.push(p.id);
        } else {
          unconnected.push(p.id);
        }
      }

      const businesses = this.state.social.getBusinesses(false).getNodes();

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

  toggleUnconnectedNodesVisible() {
    this.slotToggleFilter(this.state.connectedNodes[this.state.selectedShipID]);
    this.setState({
      unconnectedNodesVisible:
        !this.state.unconnectedNodesVisible
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
          spiralOrder: order
        });
      }
    } else {
      console.error("Invalid spiral order, valid orders are ",
        Object.keys(this.spiralOrders));
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
    } else {
      this.resetFiltersNotShip();
      // If we have unconnected nodes as part of this filter set, get rid of them
      const nodesToFilter = this.state.engineerNodeFilter.filter(
        (v) => !this.state.unconnectedNodes[this.state.selectedShipID].includes(v)
      );
      this.slotToggleFilter(nodesToFilter);
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
    } else {
      this.resetFiltersNotShip();
      // If we have unconnected nodes as part of this filter set, get rid of them
      const nodesToFilter = this.state.commericalNodeFilter.filter(
        (v) => !this.state.unconnectedNodes[this.state.selectedShipID].includes(v)
      );
      this.slotToggleFilter(nodesToFilter);
    }

    this.setState({ commercialFiltered: !this.state.commercialFiltered });
  }

  toggleindirectConnectionsVisible() {
    this.setState({
      indirectConnectionsVisible:
        !this.state.indirectConnectionsVisible
    });
  }

  resetAll() {
    window.location.reload(true);
  }

  render() {
    return (
      <div>
        <div className={styles.spiralTypeButtonContainer}>
          <TextButton fontSize="1.8vh" textColor="#f1f1f1" hoverColor="#f1f1f1" padding="2px 2px 2px 2px">
            Spiral Order
          </TextButton>
          <TextButton
            fontSize="2.7vh"
            textColor="#f1f1f1"
            hoverColor="#9CB6A4"
            padding="2px 2px 2px 2px"
            onClick={() => this.toggleSpiralOrder()}
          >
            {this.state.spiralOrder}
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

        <div className={styles.bottomContainer}>
          <ShipSelector projects={this.state.social.getProjects()} shipFilter={(item) => this.slotSetShip(item)} />
        </div>

        {/* The social graph itself */}
        <div className={styles.mainContainer}>
          <div className={styles.graphContainer}>
            <ForceGraph
              social={this.state.social}
              selected={this.state.selected_item}
              highlighted={this.state.highlighted_item}
              emitClicked={(id) => this.slotSelected(id)}
              selectedShipID={this.state.selectedShipID}
              indirectConnectionsVisible={this.state.indirectConnectionsVisible}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SocialApp;
