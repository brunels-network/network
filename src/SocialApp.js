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
import BioOverlay from "./components/BioOverlay";
import ShipOverlay from "./components/ShipOverlay";
import SlidingPanel from "./components/SlidingPanel";
import MainMenu from "./components/MainMenu";
import WarningOverlay from "./components/WarningOverlay";
import Timeout from "./components/Timeout";
import WelcomePage from "./components/WelcomePage";

import HBox from "./components/HBox";
import VBox from "./components/VBox";
import BigBox from "./components/BigBox";

// Brunel model
import Social from "./model/Social";

// Data for import
import graphData from "./socialNetwork.json";
import positionGroups from "./data/positionGroups.json";
import imageData from "./images.json";

import gw_text from "./gw_text.md";
import gb_text from "./gb_text.md";
import ge_text from "./ge_text.md";
import help_text from "./help_text.md";

// Styling for the app
import styles from "./SocialApp.module.css";

import { score_by_connections, score_by_influence } from "./model/ScoringFunctions";

import { size_by_connections, size_by_influence } from "./model/SizingFunctions";
import last from "lodash/last";

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
      filterNCEngineers: true,
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
      searchIncludeBios: true,
      searchHighlightLinks: false,
      menuVisible: false,
      height: 0,
      width: 0,
      warningVisible: true,
      showWelcomePage: true
    };

    Object.keys(imageData).forEach((key) => {
      social.setImage(key, imageData[key][0], imageData[key][1]);
    });

    const ssGW = social.getProjects().getByName("SS Great Western");
    this.state.selectedShip = ssGW.getName();
    this.state.selectedShipID = ssGW.getID();

    const ssGB = social.getProjects().getByName("SS Great Britain");
    const ssGE = social.getProjects().getByName("SS Great Eastern");

    fetch(gw_text)
      .then(r => r.text())
      .then(text => {
        social.setProjectText(ssGW, text)
    });

    fetch(gb_text)
      .then(r => r.text())
      .then(text => {
        social.setProjectText(ssGB, text)
    });

    fetch(ge_text)
      .then(r => r.text())
      .then(text => {
        social.setProjectText(ssGE, text)
    });

    fetch(help_text)
      .then(r => r.text())
      .then(text => {
        social.setHelpText(text)
    });

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

  slotShowWelcome(){
    this.setState({showWelcomePage: true});
  }

  slotCloseWelcome(){
    this.setState({showWelcomePage: false});
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

    social.setDefaultImage(social.getImage(item));

    if (this.state.searchText && this.state.searchText.length > 0) {
      if (this.state.searchWasItem) {
        social.selectSearchMatching(this.state.searchText, false, true);
      } else {
        social.selectSearchMatching(
          this.state.searchText,
          this.state.searchIncludeBios,
          this.state.searchHighlightLinks
        );
      }
    }

    this.setState({ selectedShip: item.getName(), selectedShipID: item.getID() });
    this.setState({ social: social });
  }

  slotClearFilters() {
    let social = this.state.social;
    social.resetAllFilters();
    social.setFilter("project", this.state.selectedShipID);

    social.filterUnconnectedNodes(true);
    social.filterNonContributingEngineers(true);

    if (this.state.searchText && this.state.searchText.length > 0) {
      if (this.state.searchWasItem) {
        social.selectSearchMatching(this.state.searchText, false, true);
      } else {
        social.selectSearchMatching(
          this.state.searchText,
          this.state.searchIncludeBios,
          this.state.searchHighlightLinks
        );
      }
    }

    this.setState({
      social: social,
      engineersFiltered: false,
      commercialFiltered: false,
      filterUnconnectedNodes: true,
      filterNCEngineers: true,
    });
  }

  toggleEngCommFilter() {
    if (this.state.engineersFiltered) {
      this.slotToggleFilterCommercial();
    } else if (this.state.commercialFiltered) {
      this.slotToggleFilterCommercial();
    } else {
      this.slotToggleFilterEngineer();
    }
  }

  slotToggleNonContributingEngineers() {
    let social = this.state.social;

    social.resetAllFilters();
    social.setFilter("project", this.state.selectedShipID);

    if (this.state.engineersFiltered) {
      social.toggleFilter(this.state.engineerNodeFilter);
    } else if (this.state.commercialFiltered) {
      social.toggleFilter(this.state.commercialNodeFilter);
    }

    social.filterUnconnectedNodes(this.state.filterUnconnectedNodes);
    social.filterNonContributingEngineers(!this.state.filterNCEngineers);

    if (this.state.searchText && this.state.searchText.length > 0) {
      if (this.state.searchWasItem) {
        social.selectSearchMatching(this.state.searchText, false, true);
      } else {
        social.selectSearchMatching(
          this.state.searchText,
          this.state.searchIncludeBios,
          this.state.searchHighlightLinks
        );
      }
    }

    this.setState({
      social: social,
      filterNCEngineers: !this.state.filterNCEngineers,
    });
  }

  slotToggleUnconnectedNodes() {
    let social = this.state.social;

    social.resetAllFilters();
    social.setFilter("project", this.state.selectedShipID);

    if (this.state.engineersFiltered) {
      social.toggleFilter(this.state.engineerNodeFilter);
    } else if (this.state.commercialFiltered) {
      social.toggleFilter(this.state.commercialNodeFilter);
    }

    social.filterUnconnectedNodes(!this.state.filterUnconnectedNodes);
    social.filterNonContributingEngineers(this.state.filterNCEngineers);

    if (this.state.searchText && this.state.searchText.length > 0) {
      if (this.state.searchWasItem) {
        social.selectSearchMatching(this.state.searchText, false, true);
      } else {
        social.selectSearchMatching(
          this.state.searchText,
          this.state.searchIncludeBios,
          this.state.searchHighlightLinks,
        );
      }
    }

    this.setState({
      social: social,
      filterUnconnectedNodes: !this.state.filterUnconnectedNodes,
    });
  }

  slotToggleFilterEngineer() {
    let social = this.state.social;

    social.resetAllFilters();
    social.setFilter("project", this.state.selectedShipID);

    if (!this.state.engineersFiltered) {
      social.toggleFilter(this.state.engineerNodeFilter);
    }

    social.filterUnconnectedNodes(this.state.filterUnconnectedNodes);
    social.filterNonContributingEngineers(this.state.filterNCEngineers);

    if (this.state.searchText && this.state.searchText.length > 0) {
      if (this.state.searchWasItem) {
        social.selectSearchMatching(this.state.searchText, false, true);
      } else {
        social.selectSearchMatching(
          this.state.searchText,
          this.state.searchIncludeBios,
          this.state.searchHighlightLinks
        );
      }
    }

    this.setState({
      social: social,
      engineersFiltered: !this.state.engineersFiltered,
      commercialFiltered: false,componentDidMount() {
        setInterval(
          () => this.setState({ date: new Date() }),
          1000
        );
      }
    });
  }

  slotToggleFilterCommercial() {
    let social = this.state.social;

    social.resetAllFilters();
    social.setFilter("project", this.state.selectedShipID);

    if (!this.state.commercialFiltered) {
      social.toggleFilter(this.state.commercialNodeFilter);
    }

    social.filterUnconnectedNodes(this.state.filterUnconnectedNodes);
    social.filterNonContributingEngineers(this.state.filterNCEngineers);

    if (this.state.searchText && this.state.searchText.length > 0) {
      if (this.state.searchWasItem) {
        social.selectSearchMatching(this.state.searchText, false, true);
      } else {
        social.selectSearchMatching(
          this.state.searchText,
          this.state.searchIncludeBios,
          this.state.searchHighlightLinks
        );
      }
    }

    this.setState({
      social: social,
      commercialFiltered: !this.state.commercialFiltered,
      engineersFiltered: false,
    });
  }

  slotClicked(id) {
    let social = this.state.social;

    if (!id) {
      let last_search = this.state.cachedSearch;

      if (last_search === "") {
        social.clearSelections();
        social.clearHighlights();
        this.setState({
          social: social,
          searchText: "",
          cachedSearch: "",
          searchWasItem: false,
        });
      } else {
        this.performSearch(this.state.cachedSearch, this.state.searchIncludeBios, this.state.searchHighlightLinks);
      }
    } else {
      let item = social.get(id);

      social.setSelected(id, true, true);
      this.setState({
        social: social,
        searchText: item.getName(),
        searchWasItem: true,
      });
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
      searchWasItem: false,
      cachedSearch: text,
    });
  }

  slotCloseWarning() {
    this.setState({ warningVisible: false });
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
    if (this.state.searchWasItem) {
    } else {
      this.performSearch(this.state.searchText, toggled, this.state.searchHighlightLinks);
    }
  }

  slotSearchHighlightToggled(toggled) {
    if (this.state.searchWasItem) {
    } else {
      this.performSearch(this.state.searchText, this.state.searchIncludeBios, toggled);
    }
  }

  toggleOverlay() {
    this.setState({ isOverlayOpen: !this.state.isOverlayOpen });
  }

  resetAll() {
    window.location.reload(true);
  }

  render() {

    const timeout = 30;

    if (this.state.showWelcomePage){
      return <WelcomePage emitCloseWelcome={()=>{this.slotCloseWelcome()}}
                          timeout={timeout}
                          emitReload={()=>{this.resetAll()}}/>
    }

    let menu = (
      <TextButton
        onClick={() => {
          this.slotShowMenu();
        }}
      >
        Options
      </TextButton>
    );

    let search = (
      <SearchBar
        emitUpdate={(text) => {
          this.slotUpdateSearch(text);
        }}
        emitSearchHighlightToggled={(toggled) => {
          this.slotSearchHighlightToggled(toggled);
        }}
        searchText={this.state.searchText}
        searchHighlightToggled={this.state.searchHighlightLinks}
        searchHighlightAvailable={!this.state.searchWasItem}
      />
    );

    let help = (
      <TextButton
        onClick={() => {
          this.setOverlay(
            <HowDoIOverlay
              social={this.state.social}
              close={() => {
                this.closeOverlay();
              }}
            />
          );
        }}
      >
        Info
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

    let spiral_button = (
      <LabelButton
        label="Spiral Order"
        button={this.state.spiralOrder}
        onClick={() => {
          this.toggleSpiralOrder();
        }}
      />
    );

    let ship_button = (
      <ShipSelector
        projects={this.state.social.getProjects()}
        emitSetShip={(item) => this.slotSetShip(item)}
        emitShowShip={(item) => this.slotShowShip(item)}
      />
    );

    let size_button = (
      <LabelButton
        label="Node Size"
        button={this.state.nodeSize}
        onClick={() => {
          this.toggleNodeSize();
        }}
      />
    );

    let filter_text = "None";

    if (this.state.commercialFiltered) {
      filter_text = "Commercial";
    } else if (this.state.engineersFiltered) {
      filter_text = "Engineers";
    }

    let filter_button = (
      <LabelButton
        label="Filter"
        button={filter_text}
        onClick={() => {
          this.toggleEngCommFilter();
        }}
      />
    );

    let unconnected_button = (
      <LabelButton
        label="Unconnected"
        button={this.state.filterUnconnectedNodes ? "Invisible" : "Visible"}
        onClick={() => {
          this.slotToggleUnconnectedNodes();
        }}
      />
    );

    let noncontrib_button = (
      <LabelButton
        label="Non-contributers"
        button={this.state.filterNCEngineers ? "Invisible" : "Visible"}
        onClick={() => {
          this.slotToggleNonContributingEngineers();
        }}
      />
    );

    let search_text = this.state.searchIncludeBios ? "Biographies" : "Names";

    let toggle_search = () => {
      this.slotSearchBiosToggled(!this.state.searchIncludeBios);
    };

    let search_button = (
      <LabelButton
        label="Search"
        button={search_text}
        onClick={toggle_search}
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

    let left_side = null;
    let right_side = null;

    if (this.state.width > 900) {
      left_side = (
        <HBox>
          {spiral_button}
          {filter_button}
          {search_button}
        </HBox>
      );

      right_side = (
        <HBox>
          {unconnected_button}
          {noncontrib_button}
          {size_button}
        </HBox>
      );
    } else if (this.state.width > 700) {
      left_side = (
        <HBox>
          {spiral_button}
          {filter_button}
        </HBox>
      );

      right_side = (
        <HBox>
          {noncontrib_button}
          {size_button}
        </HBox>
      );
    } else if (this.state.width > 550) {
      left_side = spiral_button;
      right_side = size_button;
    }

    let mainmenu = (
      <SlidingPanel isOpen={this.state.menuVisible}
        position="left" height="100%" width="25%">
        <MainMenu
          close={() => {
            this.slotCloseMenu();
          }}
          spiralOrder={this.state.spiralOrder}
          filterText={filter_text}
          sizeText={this.state.nodeSize}
          searchText={search_text}

          unconnectedNodesVisible={!this.state.filterUnconnectedNodes}
          ncEngineersVisible={!this.state.filterNCEngineers}
          engineersFiltered={this.state.engineersFiltered}
          commercialFiltered={this.state.commercialFiltered}
          searchHighlight={this.state.searchHighlightLinks}
          searchBios={this.state.searchIncludeBios}
          emitReload={() => {
            this.resetAll();
          }}
          emitToggleSpiralOrder={() => this.toggleSpiralOrder()}
          emitToggleFilter={() => this.toggleEngCommFilter()}
          emitToggleNodeSize={() => this.toggleNodeSize()}
          emitToggleSearch={toggle_search}

          emitToggleFilterCommercial={() => this.slotToggleFilterCommercial()}
          emitToggleFilterEngineering={() => this.slotToggleFilterEngineer()}
          emitToggleUnconnectedNodesVisible={() => this.slotToggleUnconnectedNodes()}
          emitToggleNCEngineersVisible={() => this.slotToggleNonContributingEngineers()}
          emitSearchHighlightToggled={() => this.slotSearchHighlightToggled(!this.state.searchHighlightLinks)}
          emitSearchBiosToggled={() => this.slotSearchBiosToggled(!this.state.searchIncludeBios)}
        />
      </SlidingPanel>
    );

    // make sure that we don't have too many nodes...
    let nnodes = this.state.social.getGraph().nodes.length;

    let warning_popover = null;

    if (this.state.warningVisible && nnodes > 50) {
      warning_popover = (
        <Overlay useBackground={false} toggleOverlay={() => { this.slotCloseWarning() }}>
        <WarningOverlay close={() => { this.slotCloseWarning() }}>
            As you can see, this is a busy network. Using filters will allow you
            to examine the network more closely.
        </WarningOverlay>
          </Overlay>
      );
    }

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
              {left_side}
              <BigBox>{ship_button}</BigBox>
              {right_side}
            </HBox>
          </VBox>
        </div>
        {overlay}
        {warning_popover}
        <Timeout last_interaction_time={new Date()}
                 timeout={timeout}
                 emitReload={()=>{this.resetAll()}}/>
      </div>
    );
  }
}

export default SocialApp;
