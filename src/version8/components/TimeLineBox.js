import React, { Component } from 'react';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';

import TimeLineView from './TimeLineView';

import styles from './TimeLineBox.module.css';

class TimeLineBox extends Component {
  constructor(props) {
    super(props)
  }

  updateSize(){
    console.log("UPDATE SIZE");
  }

  render() {
    return (
      <div className={styles.container}>
        <Tabs key="timeline-tabs"
              onChange={(tabId) => { console.log(tabId); this.updateSize(); }}
              className={styles.tabs}>
          <TabList className={styles.tabList}>
            <Tab className={styles.tab}
                 key="timeline"
                 tabFor="timeline">Timeline</Tab>
            <Tab className={styles.tab}
                 key="projects"
                 tabFor="projects">Projects</Tab>
            <Tab className={styles.tab}
                 key="analysis"
                 tabFor="analysis">Analysis</Tab>
          </TabList>

          <TabPanel key="projects" tabId="projects" className={styles.tabPanel}>
            <div className={styles.centerContainer}>
              <p>
                This will contain information and a timeline of the three
                ship projects.
              </p>
            </div>
          </TabPanel>

          <TabPanel key="timeline" tabId="timeline" className={styles.tabPanel}>
            <TimeLineView/>
          </TabPanel>

          <TabPanel key="analysis" tabId="analysis" className={styles.tabPanel}>
            <div className={styles.centerContainer}>
              <p>
                This will contain tools and graphs for temporal social
                network analysis.
              </p>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default TimeLineBox
