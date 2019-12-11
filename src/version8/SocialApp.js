
// package imports
import React from 'react';
import Dry from 'json-dry';

// Brunel components
import SocialGraph from "./components/SocialGraph";
import InfoBox from "./components/InfoBox";
import TimeLineBox from './components/TimeLineBox';
import SlidingPanel from './components/SlidingPanel';

// Brunel model
import Social from './model/Social';

// Data for import
import graph_data from './data.json';

// Styling for the app
import styles from './SocialApp.module.css'

class SocialApp extends React.Component {
  constructor(props){
    super(props);

    let social = Dry.parse(graph_data);

    if (!(social instanceof Social )){
      console.log("Could not parse!");
      social = new Social();
    }

    let group_filter = null;
    let person_filter = null;
    let anchor = "Brunel";

    this.state = {
      social: social,
      selected_item: null,
      graph: social.getGraph({anchor:anchor, group_filter:group_filter,
                              person_filter: person_filter}),
      group_filter: group_filter,
      person_filter: person_filter,
      anchor: anchor,
      isInfoPanelOpen: false,
      isTimeLinePanelOpen: false,
      timeline: new TimeLineBox(),
    };
  }

  resetFilters(node){
    let node_filter = null;
    let group_filter = null;
    let anchor = this.state.anchor;
    let social = this.state.social;

    let graph = social.getGraph({anchor:anchor, node_filter:node_filter,
                                 group_filter:group_filter});

    this.setState({graph:graph,
                   node_filter:node_filter,
                   group_filter:group_filter,
                  });
  }

  selectNode(node){
    let group_filter = this.state.group_filter;
    let node_filter = this.state.node_filter;
    let anchor = this.state.anchor;
    let social = this.state.social;

    if (node === node_filter){
      // switch off the current filter
      node_filter = null;
    }
    else{
      node_filter = node;
    }

    //create a new graph with this filter
    let graph = social.getGraph({anchor:anchor,
                                 group_filter:group_filter,
                                 node_filter: node_filter});

    this.setState({node_filter: node_filter, graph: graph});
  }

  selectGroup(group){
    let group_filter = this.state.group_filter;
    let node_filter = this.state.node_filter;
    let anchor = this.state.anchor;
    let social = this.state.social;

    if (group === group_filter){
      // switch off the current filter
      group_filter = null;
    }
    else{
      group_filter = group;
    }

    //create a new graph with this filter
    let graph = social.getGraph({anchor:anchor,
                                 group_filter:group_filter,
                                 node_filter: node_filter});

    this.setState({group_filter: group_filter,
                   graph: graph});
  }

  showInfo(item){
    this.setState({selected_item:item,
                   isInfoPanelOpen:true});
  }

  slotSelected(item){
    if (!item){
      return;
    }

    let is_node = false;

    try{
      is_node = item.isNode();
    }
    catch(error)
    {}

    if (is_node){
      this.selectNode(item);
    }
    else{
      this.selectGroup(item);
    }
  }

  slotClicked(id){
    if (!id){
      this.setState({isInfoPanelOpen:false,
                     isTimeLinePanelOpen:false});
      return;
    }

    const social = this.state.social;
    const item = social.get(id);
    this.showInfo(item);
  }

  toggleInfoPanel(){
    this.setState({isInfoPanelOpen: !(this.state.isInfoPanelOpen)});
  }

  toggleTimeLinePanel(){
    this.setState({isTimeLinePanelOpen: !(this.state.isTimeLinePanelOpen)});
  }

  render(){
    const item = this.state.selected_item;
    const social = this.state.social;

    const node_filter = this.state.node_filter;
    const group_filter = this.state.group_filter;

    let filter_text = null;
    let reset_button = null;

    if (node_filter){
      filter_text = `${node_filter}`;
    }

    if (group_filter){
      let text = `${group_filter}`;
      if (filter_text){
        filter_text = `${filter_text} and ${text}`;
      }
      else{
        filter_text = text;
      }
    }

    if (filter_text){
      filter_text = <div className={styles.filterText}>
                      {filter_text}
                    </div>;
      reset_button = <button onClick={() => {this.resetFilters()}}
                             className={styles.controlButton}
                             style={{fontSize:"small"}}>
                       Reset Filters
                     </button>;
    }

    return (
      <div>
        <SlidingPanel isOpen={this.state.isTimeLinePanelOpen}
                      position='bottom'>
          {this.state.timeline.render()}
        </SlidingPanel>
        <SlidingPanel isOpen={this.state.isInfoPanelOpen}
                      position='right'>
          <InfoBox item={item} social={social}
                   emitClicked={(item)=>{this.slotClicked(item)}}
                   emitSelected={(item)=>{this.slotSelected(item)}}/>
        </SlidingPanel>
        <div className={styles.graphContainer}>
          <SocialGraph graph={this.state.graph}
                       emitClicked={(id)=>this.slotClicked(id)}
                       anchor={this.state.anchor} />
        </div>
        <div className={styles.bottomContainer}>
          <button onClick={() => this.toggleTimeLinePanel()}
                  className={styles.controlButton}
                  style={{fontSize:"small"}}>
            Show timeline
          </button>
          {filter_text}
          {reset_button}
          <div className={styles.citationText}>
           <a href="https://github.com/chryswoods/brunel">
            View source</a>
          </div>
        </div>
      </div>
    );
  }
};

export default SocialApp;
