
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
import SearchBar from './components/SearchBar';
import BrunelMenu from './components/BrunelMenu';

// Brunel model
import Social from './model/Social';

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
    social.setWindow(new DateRange({start:"1836-06-26", end:"1858-01-31"}));

    this.state = {
      social: social,
      selected_item: null,
      overlay_item: null,
      isInfoPanelOpen: false,
      isTimeLinePanelOpen: false,
      isHamburgerMenuOpen: false,
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
                   isHamburgerMenuOpen:false,
                  });
  }

  closeOverlay(){
    this.setState({isOverlayOpen:false,
                   overlay_item:null});
  }

  showInfo(item){
    console.log(item);
    if (item._isAProjectObject){
      this.setState({overlay_item:item,
                     isOverlayOpen:true});
    }
    else{
      this.setState({selected_item:item,
                     isInfoPanelOpen:true});
    }
  }

  slotToggleFilter(item){
    if (!item){
      return;
    }

    let social = this.state.social;
    social.toggleFilter(item);

    this.setState(social);
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

  slotSelected(id){
    if (!id){
      this.closePanels();
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

  viewAbout(){
    console.log("View about");
  }

  viewSource(){
    console.log("View source");
  }

  resetAll(){
    console.log("Reset all");
  }

  render(){
    const selected = this.state.selected_item;
    const overlay_item = this.state.overlay_item;
    const social = this.state.social;

    let reset_button = null;
    let filter_text = social.getFilterText();

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

    let menu = [];

    menu.push(["About", ()=>{this.viewAbout()}]);
    menu.push(["View Source", ()=>{this.viewSource()}]);
    menu.push(["Reset", ()=>{this.resetAll()}]);

    return (
      <div>
        <div className={styles.backgroundImage} />
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
          <div className={styles.closeOverlayButton}
                onClick={()=>{this.closeOverlay()}}>X</div>
          <OverlayBox item={overlay_item}
                      emitClose={()=>{this.closeOverlay()}}/>
        </ReactModal>

        <SearchBar social={social}
                   emitHamburgerClicked={()=>{this.setState({isHamburgerMenuOpen:true})}}
                   emitSelected={(item)=>{this.slotSelected(item)}}
                   emitClicked={(item)=>{this.slotClicked(item)}}/>

        <SlidingPanel isOpen={this.state.isTimeLinePanelOpen}
                      position='bottom'>
          <span className={styles.closePanelButton}
                onClick={()=>{this.setState({isTimeLinePanelOpen:false})}}>X</span>
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
          <span className={styles.closePanelButton}
                onClick={()=>{this.setState({isInfoPanelOpen:false})}}>X</span>
          <InfoBox item={selected} social={social}
                   emitSelected={(item)=>{this.slotSelected(item)}}
                   emitToggleFilter={(item)=>{this.slotToggleFilter(item)}}/>
        </SlidingPanel>

        <SlidingPanel isOpen={this.state.isHamburgerMenuOpen}
                      position='left'
                      size="100px" minSize="100px">
          <BrunelMenu emitClose={()=>{this.setState({isHamburgerMenuOpen:false})}}
                      items={menu} />
        </SlidingPanel>

        <div className={styles.graphContainer}>
          <SocialGraph social={this.state.social}
                       emitClicked={(id)=>this.slotSelected(id)} />
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
