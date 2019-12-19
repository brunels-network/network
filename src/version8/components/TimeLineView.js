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
      window: new DateRange({start:"2000-01-01", end:"2020-12-31"}),
    }
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
    if (!this.isActive()){
      return;
    }

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

  rangeChangedHandler(props){
    if (!this.isActive()){
      return;
    }

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

    if (!this.isActive()){
      return (<div className={styles.container}
                   style={{width:width, height:height}}>
                No activated!
              </div>);
    }

    let my_options = {...timeline_options};
    my_options["height"] = height;
    my_options["width"] = width;

    let start = this.state.window.getStartDate();
    let end = this.state.window.getEndDate();

    let timeline_items = null;

    if (this.props.getContents){
      let contents = this.props.getContents();

      console.log(contents);

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

      console.log(start);
      console.log(end);
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
