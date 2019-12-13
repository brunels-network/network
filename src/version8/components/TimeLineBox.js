
import React, { Component } from 'react'
import Timeline from 'react-visjs-timeline'

import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';

import styles from './TimeLineBox.module.css';

const timeline_options = {
  height: "200px",
}

var timeline_items =  [
  { id: 1, content: "item 1", start: "2014-04-20" },
  { id: 2, content: "item 2", start: "2014-04-14" },
  { id: 3, content: "item 3", start: "2014-04-18" },
  { id: 4, content: "item 4", start: "2014-04-16", end: "2014-04-19" },
  { id: 5, content: "item 5", start: "2014-04-25" },
  { id: 6, content: "item 6", start: "2014-04-27", type: "point" }
];

class TimeLineBox extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedIds: [],
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <Tabs key="timeline-tabs"
              onChange={(tabId) => { console.log(tabId) }}
              className={styles.tabs}>
          <TabList className={styles.tabList}>
            <Tab className={styles.tab}
                  key="projects"
                  tabFor="projects">Projects</Tab>
            <Tab className={styles.tab}
                  key="timeline"
                  tabFor="timeline">Timeline</Tab>
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
            <Timeline className={styles.timeline}
                      ref="timeline"
                      options={timeline_options}
                      items={timeline_items}/>
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
