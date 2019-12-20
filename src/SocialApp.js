
// package imports
import React from 'react';
import Dry from 'json-dry';
import ReactModal from 'react-modal';

// Brunel components
import SocialGraph from "./components/SocialGraph";
import InfoBox from "./components/InfoBox";
import TimeLineBox from './components/TimeLineBox';
import SlidingPanel from './components/SlidingPanel';
import OverlayBox from './components/OverlayBox';

// Brunel model
import Social from './model/Social';
import Project from './model/Project';

// Data for import
import graph_data from './data.json';

// Styling for the app
import styles from './SocialApp.module.css'
import DateRange from './model/DateRange';

class SocialApp extends React.Component {
  constructor(props){
    super(props);

    let social = Dry.parse(graph_data);
    console.log(social);

    if (!(social instanceof Social )){
      console.log("Could not parse!");
      social = new Social();
    }

    // special cases for Brunel project...
    social.setAnchor("Brunel");

    social.add(new Project({name:"SS Great Western",
                            duration:new DateRange({start:"1836-06-26",
                                                    end:"1838-03-31"}),
                            url:"https://en.wikipedia.org/wiki/SS_Great_Western",
                          }));

    social.add(new Project({name:"SS Great Britain",
                            duration:new DateRange({start:"1839-07-01",
                                                    end:"1843-07-19"}),
                            url:"https://en.wikipedia.org/wiki/SS_Great_Britain",
                          }));

    social.add(new Project({name:"SS Great Eastern",
                            duration:new DateRange({start:"1854-05-01",
                                                    end:"1858-01-31"}),
                            url:"https://en.wikipedia.org/wiki/SS_Great_Eastern",
                          }));

    social.setWindow(new DateRange({start:"1835-01-01", end:"1860-12-31"}));

    this.state = {
      social: social,
      selected_item: null,
      isInfoPanelOpen: false,
      isTimeLinePanelOpen: false,
      timeline: new TimeLineBox(),
      isOverlayOpen: false
    };

    this.socialGraph = null;
  }

  resetFilters(){
    let social = this.state.social;
    social.resetFilters();
    this.setState({social:social});
  }

  closePanels(){
    this.setState({isInfoPanelOpen:false,
                   isTimeLinePanelOpen:false,
                  });
  }

  closeOverlay(){
    this.setState({isOverlayOpen:false});
  }

  selectNode(node){
    let social = this.state.social;
    social.toggleNodeFilter(node);
    this.setState({social:social});
  }

  selectGroup(group){
    let social = this.state.social;
    social.toggleGroupFilter(group);
    this.setState({social:social});
  }

  showInfo(item){
    if (item._isAProjectObject){
      this.setState({overlay_item:item,
                     isOverlayOpen:true});
    }
    else{
      this.setState({selected_item:item,
                     isInfoPanelOpen:true});
    }
  }

  slotSelected(item){
    if (!item){
      return;
    }

    if (item){
      const social = this.state.social;
      item = social.get(item);
    }

    let is_node = false;

    if (item.isNode){
      is_node = item.isNode();
    }

    if (is_node){
      this.selectNode(item);
    }
    else {
      this.selectGroup(item);
    }
  }

  getNetwork(){
    const social = this.state.social;

    if (social){
      return social.getNetwork();
    }
    else{
      return null;
    }
  }

  slotClicked(id){
    if (!id){
      this.setState({isInfoPanelOpen:false,
                     isTimeLinePanelOpen:false});
      return;
    }

    let network = this.getNetwork();
    if (network){
      let selection = network.getSelection();
      try{
        if (id.getID){
          network.selectNodes([id.getID()]);
        }
        else{
          network.selectNodes([id]);
        }
      }
      catch(error){
        network.setSelection(selection);
      }
    }

    const social = this.state.social;
    const item = social.get(id);
    this.showInfo(item);
  }

  slotWindowChanged(window){
    let social = this.state.social;

    if (social.setWindow(window)){
      this.setState({social:social});
    }
  }

  toggleInfoPanel(){
    this.setState({isInfoPanelOpen: !(this.state.isInfoPanelOpen)});
  }

  toggleTimeLinePanel(){
    this.setState({isTimeLinePanelOpen: !(this.state.isTimeLinePanelOpen)});
  }

  render(){
    const selected = this.state.selected_item;
    const social = this.state.social;

    const node_filter = social.getNodeFilter();
    const group_filter = social.getGroupFilter();

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
        <div className={styles.container}></div>
        <ReactModal isOpen={this.state.isOverlayOpen}
                    onRequestClose={()=>{this.closeOverlay()}}
                    contentLabel='Information overlay'
                    className={styles.modal}
                    overlayClassName={{base:styles.modalOverlay,
                                       afterOpen:styles.modalOverlayAfterOpen,
                                       beforeClose:styles.modalOverlayBeforeClose}}
                    closeTimeoutMS={200}
                    appElement={document.getElementById('root')}
                    >
          <span className={styles.closeButton}
                onClick={()=>{this.closeOverlay()}}>Close</span>
          <OverlayBox />
        </ReactModal>

        <SlidingPanel isOpen={this.state.isTimeLinePanelOpen}
                      position='bottom'>
          <span className={styles.closeButton}
                onClick={()=>{this.setState({isTimeLinePanelOpen:false})}}>Close</span>
          <TimeLineBox selected={selected}
                       getProjectWindow={()=>{return this.state.social.getWindow()}}
                       getItemWindow={()=>{return this.state.social.getWindow()}}
                       getProjectTimeLine={()=>{return this.state.social.getProjectTimeLine()}}
                       getItemTimeLine={()=>{return this.state.social.getItemTimeLine()}}
                       emitClicked={(item)=>{this.slotClicked(item)}}
                       emitSelected={(item)=>{this.slotClicked(item)}}
                       emitWindowChanged={(window)=>{
                                    this.slotWindowChanged(window)}}/>
        </SlidingPanel>

        <SlidingPanel isOpen={this.state.isInfoPanelOpen}
                      position='right'>
          <span className={styles.closeButton}
                onClick={()=>{this.setState({isInfoPanelOpen:false})}}>Close</span>
          <InfoBox item={selected} social={social}
                   emitClicked={(item)=>{this.slotClicked(item)}}
                   emitSelected={(item)=>{this.slotSelected(item)}}/>
        </SlidingPanel>

        <div className={styles.graphContainer}>
          <SocialGraph social={this.state.social}
                       emitClicked={(id)=>this.slotClicked(id)} />
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
