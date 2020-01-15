import React, { Component } from 'react';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';

import TimeLineView from './TimeLineView';

import styles from './TimeLineBox.module.css';

class TimeLineBox extends Component {
  constructor(props){
    super(props);

    this.state = {
      dimensions: {height:300, width:600},
    }

    this.tabs = {};
    this.container = null;
  }

  componentDidMount() {
    window.addEventListener('resize', ()=>{this.updateSize()});
    this.updateSize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', ()=>{this.updateSize()});
  }

  activate(tabId){
    Object.keys(this.tabs).forEach((key, index) =>{
      if (key !== tabId){
        let tab = this.tabs[key];
        if (tab){
          tab.deactivate();
        }
      }
    });

    if (this.tabs[tabId]){
      this.tabs[tabId].activate();
    }
  }

  updateSize(){
    if (this.container){
      this.setState({
        dimensions: {
          width: this.container.offsetWidth,
          height: this.container.offsetHeight,
        }
      });
    }

    Object.keys(this.tabs).forEach((key, index) =>{
      let tab = this.tabs[key];
      if (tab){
        tab.updateSize(this.state.dimensions);
      }
    });
  }

  render() {
    return (
      <div ref={el => (this.container = el)}
           className={styles.container}>
        <Tabs key="timeline-tabs"
              onChange={(tabId) => { this.activate(tabId); this.updateSize(); }}
              className={styles.tabs}>
          <TabList className={styles.tabList}>
            <Tab className={styles.tab}
                 key="items"
                 tabFor="items">Timeline</Tab>
            <Tab className={styles.tab}
                 key="projects"
                 tabFor="projects">Projects</Tab>
            <Tab className={styles.tab}
                 key="analysis"
                 tabFor="analysis">Analysis</Tab>
          </TabList>

          <TabPanel key="projects" tabId="projects"
                    className={styles.tabPanel}>
            <TimeLineView ref={el => (this.tabs.projects = el)}
                          name="projects"
                          selected={this.props.selected}
                          getMaxWindow={this.props.getMaxWindow}
                          getWindow={this.props.getProjectWindow}
                          getItems={this.props.getProjectTimeLine}
                          emitWindowChanged={this.props.emitWindowChanged}
                          emitSelected={this.props.emitSelected}
                          emitClicked={this.props.emitClicked}/>
          </TabPanel>

          <TabPanel key="analysis" tabId="analysis" className={styles.tabPanel}>
            <div className={styles.centerContainer}>
              <p>
                This will contain tools and graphs for temporal social
                network analysis.
              </p>
            </div>
          </TabPanel>

          <TabPanel key="items" tabId="items" className={styles.tabPanel}>
            <TimeLineView ref={el => (this.tabs.items = el)}
                          name="items"
                          is_active={true}
                          selected={this.props.selected}
                          getMaxWindow={this.props.getMaxWindow}
                          getWindow={this.props.getItemWindow}
                          getItems={this.props.getItemTimeLine}
                          emitWindowChanged={this.props.emitWindowChanged}
                          emitSelected={this.props.emitSelected}
                          emitClicked={this.props.emitClicked}/>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default TimeLineBox
