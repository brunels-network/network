// package imports
import React from "react";
import Dry from "json-dry";
import ReactModal from "react-modal";

// Brunel components
import SocialGraph from "./components/SocialGraph";
import InfoBox from "./components/InfoBox";
import TimeLineBox from "./components/TimeLineBox";
import FilterBox from "./components/FilterBox";
import SlidingPanel from "./components/SlidingPanel";
import OverlayBox from "./components/OverlayBox";
import SearchBar from "./components/SearchBar";
import BrunelMenu from "./components/BrunelMenu";
import DefaultButton from "./components/DefaultButton";
import ShipSelector from "./components/ShipSelector";
import ShipTitle from "./components/ShipTitle";

// Brunel model
import Social from "./model/Social";

// Data for import
import graph_data from "./data.json";

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
    console.log(social);

    if (!(social instanceof Social)) {
      console.log("Could not parse!");
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
      wobbleEnabled: true,
      selectedShip: null,
    };

    this.socialGraph = null;
  }

  resetFilters() {
    let social = this.state.social;
    social.resetFilters();
    this.setState({ social: social, selectedShip: null });
  }

  closePanels() {
    this.setState({
      isInfoPanelOpen: false,
      isTimeLinePanelOpen: false,
      isHamburgerMenuOpen: false,
      isFilterPanelOpen: false,
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
    this.setState({ selectedShip: item.getName() });
  }

  slotToggleFilter(item) {
    if (!item) {
      return;
    }

    let social = this.state.social;
    social.toggleFilter(item);

    this.setState(social);
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

  //   getMethods = (obj) => {
  //     let properties = new Set();
  //     let currentObj = obj;
  //     do {
  //       Object.getOwnPropertyNames(currentObj).map((item) =>
  //         properties.add(item)
  //       );
  //     } while ((currentObj = Object.getPrototypeOf(currentObj)));
  //     return [...properties.keys()].filter(
  //       (item) => typeof obj[item] === "function"
  //     );
  //   };

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
    let graphContainerClass = this.state.isHamburgerMenuOpen
      ? styles.graphContainerMenuOpen
      : styles.graphContainerMenuClosed;

    // let sidebarClass = this.state.isHamburgerMenuOpen ? styles.sidebarVis : stules

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

        <SlidingPanel isOpen={this.state.isTimeLinePanelOpen} position="bottom">
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
            getMaxWindow={() => {
              return this.state.social.getMaxWindow();
            }}
            getProjectWindow={() => {
              return this.state.social.getWindow();
            }}
            getItemWindow={() => {
              return this.state.social.getWindow();
            }}
            getProjectTimeLine={() => {
              return this.state.social.getProjectTimeLine();
            }}
            getItemTimeLine={() => {
              return this.state.social.getItemTimeLine();
            }}
            emitClicked={(item) => {
              this.slotClicked(item);
            }}
            emitSelected={(item) => {
              this.slotSelected(item);
            }}
            emitHighlighted={(item) => {
              this.slotHighlighted(item);
            }}
            emitWindowChanged={(window) => {
              this.slotWindowChanged(window);
            }}
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
        <SlidingPanel isOpen={this.state.isFilterPanelOpen} position="bottom">
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
        <SlidingPanel isOpen={this.state.isHamburgerMenuOpen} position="left">
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

        {/* The social graph itself */}

        <div className={graphContainerClass}>
          <SocialGraph
            social={this.state.social}
            selected={selected}
            highlighted={highlighted}
            emitClicked={(id) => this.slotSelected(id)}
            wobble={this.state.wobbleEnabled}
          />
        </div>

        <div className={styles.shipNameContainer}>
          <ShipTitle name={this.state.selectedShip} />
        </div>

        <div className={styles.bottomContainer}>
          <ShipSelector
            projects={this.state.social.getProjects()}
            shipFilter={(item) => this.slotSetFilter(item)}
            resetFilters={this.resetFilters}
          />
        </div>

        {/* Some side panel */}
        <div className={styles.sidePanel}>
          <div>
            <DefaultButton
              onClick={() => {
                this.toggleFilterPanel();
              }}
            >
              Filters
            </DefaultButton>
          </div>
          <div>
            <DefaultButton onClick={() => this.toggleTimeLinePanel()}>{"Timeline"}</DefaultButton>
          </div>
          <div>
            <DefaultButton onClick={this.toggleWobble}>Wobble</DefaultButton>
          </div>
        </div>
      </div>
    );
  }
}

export default SocialApp;
