import React, { Component } from 'react';
import Timeline from 'react-visjs-timeline';

import DatePicker from 'react-datepicker';

import DateRange from '../model/DateRange';

import "react-datepicker/dist/react-datepicker.css";

import styles from './TimeLineView.module.css';

const timeline_options = {
  autoResize: true,
  horizontalScroll: true,
  showCurrentTime: false,
  showTooltips: false,
  verticalScroll: true,
  zoomable: false,
}

class DateInput extends Component {
   render(){
     let {value, onClick} = this.props;

     return (<button className={styles.zoomButton} onClick={onClick}>
              {value}
             </button>);
   }
};

class TimeLineView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activated: false,
      dimensions: {height:300, width:600},
      max_window: new DateRange({start:"1800-01-01", end:"2020-12-31"}),
    }

    this.window = new DateRange({start:"2000-01-01", end:"2020-12-31"});
  }

  activate(){
    this.setState({activated:true});
  }

  deactivate(){
    this.setState({activated:false});
  }

  isActive(){
    return this.state.activated;
  }

  updateSize(dimensions) {
    this.setState({
      dimensions: {
        width: dimensions.width - 10,
        height: dimensions.height - 100,
      }
    });

    let timeline = this.getTimeLine();
    if (timeline){
      timeline.redraw();
    }
    else{
      console.log("No timeline to redraw?");
    }
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
    if (!this.isActive()){
      return;
    }

    console.log("Selected");
    console.log(props);
  }

  rangeChangedHandler(new_window){
    if (!this.isActive()){
      return;
    }

    let window = new DateRange({start:new_window.start, end:new_window.end});

    if (window === this.window){
      console.log("No change in window");
      return;
    }

    console.log(`Setting window state to ${window.toString()}`);
    this.window = window;

    if (this.props.emitWindowChanged){
      console.log(`emitWindowChanged(${window.toString()}`);
      this.props.emitWindowChanged(window);
    }
  }

  zoomIn(){
    this.getTimeLine().zoomIn(1.0);
  }

  zoomOut(){
    this.getTimeLine().zoomOut(1.0);
  }

  setWindow(window){
    if (!this.isActive()){
      return;
    }

    if (!window){
      return;
    }

    if (this.window === window){
      return;
    }

    const max_window = this.state.max_window;

    if (max_window){
      if (!max_window.contains(window)){
        return;
      }
    }

    console.log(`Set window to ${window.toString()}`);

    this.getTimeLine().setWindow(window.getStartDate(), window.getEndDate(),
                                 {animation:true});
  }

  setStartDate(date){
    if (!date){
      return;
    }

    const window = this.window;

    if (!window){
      return;
    }

    this.setWindow(new DateRange({start:date, end:window.getEndDate()}));
  }

  setEndDate(date){
    if (!date){
      return;
    }

    const window = this.window;

    if (!window){
      return;
    }

    this.setWindow(new DateRange({start:date, end:window.getEndDate()}));
  }

  scrollLeft(){
    const window = this.window;

    if (window){
      this.setWindow(window.shiftEarlier());
    }
  }

  scrollRight(){
    const window = this.window;

    if (window){
      this.setWindow(window.shiftLater());
    }
  }

  render() {
    let height = `${this.state.dimensions.height}px`;
    let width = `${this.state.dimensions.width}px`;

    let my_options = {...timeline_options};
    my_options["height"] = height;
    my_options["width"] = width;

    let max_window = this.state.max_window;

    if (max_window){
      my_options["max"] = max_window.getEndDate();
      my_options["min"] = max_window.getStartDate();
    }

    let start = this.window.getStartDate();
    let end = this.window.getEndDate();

    let timeline_items = null;

    if (this.isActive()){
      if (this.props.getContents){
        let contents = this.props.getContents();

        if (contents){
          timeline_items = contents.items;

          let window = contents.window;

          if (window.hasStart()){
            start = window.getStartDate();
          }

          if (window.hasEnd()){
            end = window.getEndDate();
          }
        }
      }
    }

    if (timeline_items === null){
      timeline_items = [];
    }

    if (start){
      my_options["start"] = start;
    }

    if (end){
      my_options["end"] = end;
    }

    let timeline = this.getTimeLine();

    if (timeline){
      //need to set the window here to prevent animation when
      //changing tabs
      timeline.setWindow(start, end, {animation:false});
    }

    return (
      <div className={styles.container}
           style={{width:width, height:height}}>
        <Timeline className={styles.timeline}
                  ref={el => (this.timeline = el)}
                  rangechangedHandler={(props)=>{this.rangeChangedHandler(props)}}
                  selectHandler={(props)=>{this.selectHandler(props)}}
                  options={my_options}
                  items={timeline_items}/>
        <div className={styles.buttonGroup}>
          <button className={styles.scrollButton}
                  onClick={()=>{this.scrollLeft()}}>&larr;</button>
          <button className={styles.zoomButton}
                  onClick={()=>{this.zoomOut()}}>-</button>
          <DatePicker className={styles.datePicker}
                      selected={start}
                      openToDate={start}
                      selectsStart
                      startDate={start}
                      endDate={end}
                      dateFormat="d MMM yyyy"
                      showMonthYearPicker
                      showYearDropdown
                      dropdownMode="select"
                      customInput={<DateInput />}
                      onChange={(date)=>{this.setStartDate(date)}}/>
          <button className={styles.scrollButton}
                  onClick={()=>{console.log("RESET")}}>&harr;</button>
          <DatePicker className={styles.datePicker}
                      selected={end}
                      openToDate={end}
                      selectsEnd
                      startDate={start}
                      endDate={end}
                      dateFormat="d MMM yyyy"
                      showMonthYearPicker
                      showYearDropdown
                      dropdownMode="select"
                      customInput={<DateInput />}
                      onChange={(date)=>{this.setEndDate(date)}}/>
          <button className={styles.zoomButton}
                  onClick={()=>{this.zoomIn()}}>+</button>
          <button className={styles.scrollButton}
                  onClick={()=>{this.scrollRight()}}>&rarr;</button>
        </div>
      </div>
    );
  }
}

export default TimeLineView
