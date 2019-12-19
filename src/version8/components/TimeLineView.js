import React, { Component } from 'react';
import Timeline from 'react-visjs-timeline';
import DatePicker from 'react-datepicker';

import DateRange from '../model/DateRange';

import "react-datepicker/dist/react-datepicker.css";

import styles from './TimeLineView.module.css';

const timeline_options = {
  width: "100%",
  height: "100%",
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
  { id: 1, content: "item 1", start: "1814-04-20" },
  { id: 2, content: "item 2", start: "1814-04-14" },
  { id: 3, content: "item 3", start: "1814-04-18" },
  { id: 4, content: "item 4", start: "1814-04-16", end: "1814-04-19" },
  { id: 5, content: "item 5", start: "1814-04-25" },
  { id: 6, content: "item 6", start: "1814-04-27", type: "point" }
];

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
      selectedIds: [],
      dimensions: {height:300, width:600},
      window: new DateRange(),
    }
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
    console.log("Selected");
    console.log(props);
  }

  rangeChangedHandler(props){
    let window = new DateRange({start:props.start, end:props.end});

    this.setState({window: window});

    if (this.props.emitWindowChanged){
      this.props.emitWindowChanged(window);
    }
  }

  zoomIn(){
    this.getTimeLine().zoomIn(1.0);
  }

  zoomOut(){
    this.getTimeLine().zoomOut(1.0);
  }

  setStartDate(date){
    this.getTimeLine().setWindow(date, this.state.window.getEndDate(),
                                  {animation:true});
  }

  setEndDate(date){
    this.getTimeLine().setWindow(this.state.window.getStartDate(), date,
                                  {animation:true});
  }

  scrollLeft(){
    let window = this.state.window.shiftEarlier();
    this.getTimeLine().setWindow(window.getStartDate(), window.getEndDate(),
                                 {animation:true});
  }

  scrollRight(){
    let window = this.state.window.shiftLater();
    this.getTimeLine().setWindow(window.getStartDate(), window.getEndDate(),
                                 {animation:true});
  }

  render() {
    let height = `${this.state.dimensions.height}px`;
    let width = `${this.state.dimensions.width}px`;

    let my_options = {...timeline_options};
    my_options["height"] = height;
    my_options["width"] = width;

    let start = this.state.window.getStartDate();
    let end = this.state.window.getEndDate();

    if (this.props.social){
      let window = this.props.social.getWindow();

      if (window.hasStart()){
        start = window.getStartDate();
      }

      if (window.hasEnd()){
        end = window.getEndDate();
      }
    }

    if (start){
      my_options["start"] = start;
    }

    if (end){
      my_options["end"] = end;
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
