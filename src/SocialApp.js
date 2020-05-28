// package imports
import React from "react";
import Dry from "json-dry";
import ReactModal from "react-modal";

// Brunel components
import AnalysisPanel from "./components/AnalysisPanel";
import AnalysisButton from "./components/AnalysisButton";
import SocialGraph from "./components/SocialGraph";
import InfoBox from "./components/InfoBox";
import TimeLineBox from "./components/TimeLineBox";
import FilterBox from "./components/FilterBox";
import SlidingPanel from "./components/SlidingPanel";
import OverlayBox from "./components/OverlayBox";
import SearchBar from "./components/SearchBar";
import BrunelMenu from "./components/BrunelMenu";
import ShipSelector from "./components/ShipSelector";
import ShipTitle from "./components/ShipTitle";

// Brunel model
import Social from "./model/Social";

// Data for import
import graph_data from "./dataWeights.json";

// Styling for the app
import styles from "./SocialApp.module.css";
import DateRange from "./model/DateRange";

class SocialApp extends React.Component {
  constructor(props) {
    super(props);

    this.toggleWobble = this.toggleWobble.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.setOverlay = this.setOverlay.bind(this);

    // Load in the Dried graph data from JSON
    let social = Dry.parse(graph_data);

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
      timeline: new TimeLineBox(),
      isOverlayOpen: false,
      isAnalysisOpen: false,
      wobbleEnabled: true,
      selectedShip: null,
      selectedShipID: null,
    };

    // TODO - work out a cleaner way of doing this
    // Is set in ShipSelector correctly
    const ssGW = social.getProjects().getByName("SS Great Western");
    this.state.selectedShip = ssGW.getName();
    this.state.selectedShipID = ssGW.getID();

    this.socialGraph = null;
  }

  resetFilters() {
    let social = this.state.social;
    social.resetFilters();
    this.setState({ social: social, selectedShip: null, selectedShipID: null });
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

  slotClearFilters() {
    this.resetFilters();
  }

  slotSetFilter(item) {
    this.resetFilters();
    this.slotToggleFilter(item);
    this.setState({ selectedShip: item.getName(), selectedShipID: item.getID() });
  }

  slotSetFilterbyID(id, name) {
    this.resetFilters();
    this.slotToggleFilter(id);
    this.setState({ selectedShip: name, selectedShipID: id });
  }

  slotToggleFilter(item) {
    if (!item) {
      return;
    }

    let social = this.state.social;
    social.toggleFilter(item);

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

  toggleWobble() {
    this.setState({ wobbleEnabled: !this.state.wobbleEnabled });
  }

  setOverlay(item) {
    this.setState({
      overlayItem: item,
      isOverlayOpen: true,
    });
  }

  resetAll() {
    console.log("Reset all");
    window.location.reload(true);
  }

  render() {
    const selected = this.state.selected_item;
    const highlighted = this.state.highlighted_item;
    const overlayItem = this.state.overlayItem;
    const social = this.state.social;

    // TODO - check if this is the correct way
    // Removed the movement for now
    let graphContainerClass = styles.graphContainerMenuClosed;
    //  this.state.isHamburgerMenuOpen
    //   ? styles.graphContainerMenuOpen
    //   : styles.graphContainerMenuClosed;

    // let sidebarClass = this.state.isHamburgerMenuOpen ? styles.sidebarVis : stules

    console.log(this.state.isHamburgerMenuOpen);

    return (
      <div>
        <ReactModal
          isOpen={this.state.isOverlayOpen}
          onRequestClose={() => {
            this.closeOverlay();
          }}
          contentLabel="Information overlay"
          className={styles.modal}
          overlayClassName={{
            base: styles.modalOverlay,
            afterOpen: styles.modalOverlayAfterOpen,
            beforeClose: styles.modalOverlayBeforeClose,
          }}
          closeTimeoutMS={200}
          appElement={document.getElementById("root")}
        >
          <div
            className={styles.closeOverlayButton}
            onClick={() => {
              this.closeOverlay();
            }}
          >
            X
          </div>
          <OverlayBox
            item={overlayItem}
            emitClose={() => {
              this.closeOverlay();
            }}
          />
        </ReactModal>

        <SearchBar
          social={social}
          emitHamburgerClicked={() => {
            this.setState({
              isHamburgerMenuOpen: !this.state.isHamburgerMenuOpen,
            });
          }}
          emitSelected={(item) => {
            this.slotSelected(item);
          }}
          emitHighlighted={(item) => {
            this.slotHighlighted(item);
          }}
          emitClicked={(item) => {
            this.slotClicked(item);
          }}
        />

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
              this.slotSetFilterbyID(item);
            }}
            resetFilters={this.resetFilters}
          />
        </SlidingPanel>

        {/* Info panel on the RHS */}
        <SlidingPanel isOpen={this.state.isInfoPanelOpen} position="right">
          <span
            className={styles.closePanelButton}
            onClick={() => {
              this.setState({ isInfoPanelOpen: false });
            }}
          >
            X
          </span>
          <InfoBox
            item={selected}
            social={social}
            emitSelected={(item) => {
              this.slotSelected(item);
            }}
            emitHighlighted={(item) => {
              this.slotHighlighted(item);
            }}
            emitToggleFilter={(item) => {
              this.slotToggleFilter(item);
            }}
          />
        </SlidingPanel>

        {/* Filter on bottom of page */}
        <SlidingPanel isOpen={this.state.isFilterPanelOpen} position="bottom" height="20%">
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
              this.slotClearFilters();
            }}
          />
        </SlidingPanel>

        {/* This creates the menu on the LHS opened by the hamburger */}
        <SlidingPanel isOpen={this.state.isHamburgerMenuOpen} position="left" width="10%" height="100%">
          <BrunelMenu
            setOverlay={this.setOverlay}
            clickReset={() => {
              this.resetAll();
            }}
            clickSource={() => {
              this.viewSource();
            }}
            emitClose={() => {
              this.setState({ isHamburgerMenuOpen: false });
            }}
          />
        </SlidingPanel>

        <div className={styles.shipNameContainer}>
          <ShipTitle name={this.state.selectedShip} />
        </div>

        <div className={styles.bottomContainer}>
          <ShipSelector
            projects={this.state.social.getProjects()}
            shipFilter={(item) => this.slotSetFilter(item)}
            resetFilters={this.resetFilters}
            selectedShip={this.state.selectedShip}
          />
        </div>

        {/* The social graph itself */}
        <div className={graphContainerClass}>
          <SocialGraph
            social={this.state.social}
            selected={selected}
            highlighted={highlighted}
            emitClicked={(id) => this.slotSelected(id)}
            setOverlay={this.setOverlay}
            wobble={this.state.wobbleEnabled}
            selectedShipID={this.state.selectedShipID}
          />
        </div>

        <div className={styles.rightSidePanel}>
          <AnalysisButton togglePanel={() => this.toggleAnalysisPanel()} />
        </div>

        <SlidingPanel isOpen={this.state.isAnalysisOpen} position="right" width="10%">
          <AnalysisPanel
            toggleFilterPanel={() => this.toggleFilterPanel()}
            toggleTimeLinePanel={() => this.toggleTimeLinePanel()}
            toggleWobble={() => this.toggleWobble()}
            togglePanel={() => this.toggleAnalysisPanel()}
          />
        </SlidingPanel>
      </div>
    );
  }
}

export default SocialApp;
