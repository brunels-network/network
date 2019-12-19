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

    this.projectView = null;
    this.itemView = null;
    this.container = null;
  }

  componentDidMount() {
    window.addEventListener('resize', ()=>{this.updateSize()});
    this.updateSize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', ()=>{this.updateSize()});
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

    console.log(`UPDATE SIZE ${this.state.dimensions.width} ${this.state.dimensions.height}`);

    if (this.projectView){
      this.projectView.updateSize(this.state.dimensions);
    }
    else{
      console.log("Resize with no project view?");
    }

    if (this.itemView){
      this.itemView.updateSize(this.state.dimensions);
    }
    else{
      console.log("Resize with no item view?");
    }
  }

  render() {
    return (
      <div ref={el => (this.container = el)}
           className={styles.container}>
        <Tabs key="timeline-tabs"
              onChange={(tabId) => { console.log(tabId); this.updateSize(); }}
              className={styles.tabs}>
          <TabList className={styles.tabList}>
            <Tab className={styles.tab}
                 key="analysis"
                 tabFor="analysis">Analysis</Tab>
            <Tab className={styles.tab}
                 key="timeline"
                 tabFor="timeline">Timeline</Tab>
            <Tab className={styles.tab}
                 key="projects"
                 tabFor="projects">Projects</Tab>
          </TabList>

          <TabPanel key="analysis" tabId="analysis" className={styles.tabPanel}>
            <div className={styles.centerContainer}>
              <p>
                This will contain tools and graphs for temporal social
                network analysis.
              </p>
            </div>
          </TabPanel>

          <TabPanel key="projects" tabId="projects"
                    className={styles.tabPanel}>
            <TimeLineView ref={el => (this.projectView = el)}
                          social={this.props.social}
                          item={this.props.item}
                          emitWindowChanged={this.props.emitWindowChanged}
                          emitSelected={this.props.emitSelected}
                          emitClicked={this.props.emitClicked}/>
          </TabPanel>

          <TabPanel key="timeline" tabId="timeline" className={styles.tabPanel}>
            <TimeLineView ref={el => (this.itemView = el)}
                          social={this.props.social}
                          item={this.props.item}
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
