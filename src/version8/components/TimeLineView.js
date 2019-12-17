import React, { Component } from 'react';
import Timeline from 'react-visjs-timeline';
import DatePicker from 'react-datepicker';

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

function dateAdd(date, interval, units) {
  //copied from 'https://stackoverflow.com/questions/1197928/
  //                    how-to-add-30-minutes-to-a-javascript-date-object'
  if(!(date instanceof Date)){
    console.log("NOT A DATE!");
    console.log(date);
    return undefined;
  }
  var ret = new Date(date); //don't change original date
  var checkRollover = function() { if(ret.getDate() !== date.getDate()) ret.setDate(0);};
  switch(String(interval).toLowerCase()) {
    case 'year'   :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;
    case 'quarter':  ret.setMonth(ret.getMonth() + 3*units); checkRollover();  break;
    case 'month'  :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;
    case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
    case 'day'    :  ret.setDate(ret.getDate() + units);  break;
    case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
    case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
    case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
    default       :  ret = undefined;  break;
  }
  return ret;
}

class TimeLineView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedIds: [],
      dimensions: {height:300, width:600},
      timeRange: {start:null, end:null},
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
        height: this.container.offsetHeight - 100,
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

  rangeChangedHandler(props){
    console.log("Range changed");
    console.log(props);
    this.setState({
      timeRange: {
        start: props.start,
        end: props.end,
      }
    });
  }

  zoomIn(){
    this.getTimeLine().zoomIn(1.0);
  }

  zoomOut(){
    this.getTimeLine().zoomOut(1.0);
  }

  setStartDate(date){
    console.log(`SET START ${date}`);
    this.getTimeLine().setWindow(date, this.state.timeRange.end,
                                  {animation:true});
  }

  setEndDate(date){
    console.log(`SET END ${date}`);
    this.getTimeLine().setWindow(this.state.timeRange.start, date,
                                  {animation:true});
  }

  scrollLeft(){
    let delta = this.state.timeRange.end - this.state.timeRange.start;
    let start = dateAdd(this.state.timeRange.start, "second", -delta/1000);
    let end = dateAdd(this.state.timeRange.end, "second", -delta/1000);
    this.getTimeLine().setWindow(start, end, {animation:true});
  }

  scrollRight(){
    let delta = this.state.timeRange.end - this.state.timeRange.start;
    let start = dateAdd(this.state.timeRange.start, "second", delta/1000);
    let end = dateAdd(this.state.timeRange.end, "second", delta/1000);
    this.getTimeLine().setWindow(start, end, {animation:true});
  }

  render() {
    console.log("RENDER TIMELINE");
    console.log(this.getTimeLine());

    let my_options = {...timeline_options};
    my_options["height"] = `${this.state.dimensions.height}px`;
    my_options["width"] = `${this.state.dimensions.width}px`;

    const DateInput = ({ value, onClick }) => (
      <button className={styles.zoomButton} onClick={onClick}>
        {value}
      </button>
    );

    return (
      <div ref={el => (this.container = el)}
           className={styles.container}
           style={{width:"100%", height:"100%"}}>
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
                      selected={this.state.timeRange.start}
                      openToDate={this.state.timeRange.start}
                      selectsStart
                      startDate={this.state.timeRange.start}
                      endDate={this.state.timeRange.end}
                      dateFormat="d MMMM yyyy"
                      showMonthYearPicker
                      showYearDropdown
                      dropdownMode="select"
                      customInput={<DateInput />}
                      onChange={(date)=>{this.setStartDate(date)}}/>
          <button className={styles.scrollButton}
                  onClick={()=>{console.log("RESET")}}>&harr;</button>
          <DatePicker className={styles.datePicker}
                      selected={this.state.timeRange.end}
                      openToDate={this.state.timeRange.end}
                      selectsEnd
                      startDate={this.state.timeRange.start}
                      endDate={this.state.timeRange.end}
                      dateFormat="d MMMM yyyy"
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
