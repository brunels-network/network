import PropTypes from "prop-types";
import React, { Component } from "react";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";

import TimeLineView from "./TimeLineView";
import NewTimeline from "./NewTimeline";

import styles from "./TimeLineBox.module.css";

class TimeLineBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dimensions: { height: 300, width: 600 },
    };

    this.tabs = {};
    this.container = null;
  }

  componentDidMount() {
    window.addEventListener("resize", () => {
      this.updateSize();
    });
    this.updateSize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", () => {
      this.updateSize();
    });
  }

  activate(tabId) {
    Object.keys(this.tabs).forEach((key) => {
      if (key !== tabId) {
        let tab = this.tabs[key];
        if (tab) {
          tab.deactivate();
        }
      }
    });

    if (this.tabs[tabId]) {
      this.tabs[tabId].activate();
    }
  }

  updateSize() {
    if (this.container) {
      this.setState({
        dimensions: {
          width: this.container.offsetWidth,
          height: this.container.offsetHeight,
        },
      });
    }

    Object.keys(this.tabs).forEach((key) => {
      let tab = this.tabs[key];
      if (tab) {
        tab.updateSize(this.state.dimensions);
      }
    });
  }

  render() {
    return (
      <div ref={(el) => (this.container = el)} className={styles.container}>
        <Tabs
          key="timeline-tabs"
          onChange={(tabId) => {
            this.activate(tabId);
            this.updateSize();
          }}
          className={styles.tabs}
        >
          <TabList className={styles.tabList}>
            <Tab className={styles.tab} key="items" tabFor="items">
              Timeline
            </Tab>
            <Tab className={styles.tab} key="projects" tabFor="projects">
              Projects
            </Tab>
            <Tab className={styles.tab} key="analysis" tabFor="analysis">
              Analysis
            </Tab>
          </TabList>

          <TabPanel key="projects" tabId="projects" className={styles.tabPanel}>
            <NewTimeline
              projects={this.props.projects}
              onClick={this.props.shipSelect}
              resetFilters={this.props.resetFilters}
            />
          </TabPanel>

          <TabPanel key="analysis" tabId="analysis" className={styles.tabPanel}>
            <div className={styles.centerContainer}>
              <p>This will contain tools and graphs for temporal social network analysis.</p>
            </div>
          </TabPanel>

          <TabPanel key="items" tabId="items" className={styles.tabPanel}>
            <NewTimeline
              projects={this.props.projects}
              onClick={this.props.shipSelect}
              resetFilters={this.props.resetFilters}
            />
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

TimeLineBox.propTypes = {
  projects: PropTypes.object.isRequired,
  shipSelect: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired,
  //   emitClicked: PropTypes.func.isRequired,
  //   emitSelected: PropTypes.func.isRequired,
  //   emitWindowChanged: PropTypes.func.isRequired,
  //   getItemTimeLine: PropTypes.func.isRequired,
  //   getItemWindow: PropTypes.func.isRequired,
  //   getMaxWindow: PropTypes.func.isRequired,
  //   getProjectTimeLine: PropTypes.func.isRequired,
  //   getProjectWindow: PropTypes.func.isRequired,
  //   selected: PropTypes.func,
};

export default TimeLineBox;
