
import React, { Component } from 'react'
import Timeline from 'react-visjs-timeline'

import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';

import styles from './TimeLineBox.module.css';

const timeline_options = {
  autoResize: false,
  horizontalScroll: true,
  max: "2020-01-01",
  min: "1800-01-01",
  showCurrentTime: false,
  showTooltips: false,
  verticalScroll: true,
  zoomable: false,
  zoomKey: "shiftKey",
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
      dimensions: {height:300, width:600},
    }
  }

  componentDidMount() {
    this.setState({
      dimensions: {
        width: this.container.offsetWidth,
        height: this.container.offsetHeight,
      },
    });
    window.addEventListener('resize', ()=>{this.updateSize()});
  }

  componentWillUnmount() {
    window.removeEventListener('resize', ()=>{this.updateSize()});
  }

  updateSize() {
    if (!(this.container)){
      console.log("Resize with no contianer?");
      return;
    }

    this.setState({
      dimensions: {
        width: this.container.offsetWidth - 10,
        height: this.container.offsetHeight - 60,
      }
    });
    console.log(`Timeline resize ${this.state.dimensions.width}x${this.state.dimensions.height}`);
  }

  getTimeLine(){
    try {
      return this.timeline.$el;
    }
    catch(error){
      console.log(`No timeline ${error}`);
    }
  }

  selectHandler(props){
    console.log("Selected");
    console.log(props);
  }

  changeHandler(props){
    console.log("Changed");
    console.log(props);
  }

  rangeChangeHandler(props){
    console.log("Range change");
    console.log(props);
  }

  rangeChangedHandler(props){
    console.log("Range changed");
    console.log(props);
  }

  clickHandler(props){
    console.log("Clicked");
    console.log(props);
  }

  render() {
    console.log(this.getTimeLine());

    let my_options = {...timeline_options};
    my_options["height"] = `${this.state.dimensions.height}px`;
    my_options["width"] = `${this.state.dimensions.width}px`;
    console.log(`RENDER ${this.state.dimensions.width}x${this.state.dimensions.height}`);

    return (
      <div ref={el => (this.container = el)}
           className={styles.container}>
        <Tabs key="timeline-tabs"
              onChange={(tabId) => { console.log(tabId); this.updateSize(); }}
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
            <div style={{width:"99%", height:"99%"}}>
              <Timeline className={styles.timeline}
                        ref={el => (this.timeline = el)}
                        clickHandler={(props)=>{this.clickHandler(props)}}
                        rangeChangeHandler={(props)=>{this.rangeChangeHandler(props)}}
                        rangeChangedHandler={(props)=>{this.rangeChangedHandler(props)}}
                        selectHandler={(props)=>{this.selectHandler(props)}}
                        changeHandler={(props)=>{this.changeHandler(props)}}
                        options={my_options}
                        items={timeline_items}/>
            </div>
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
