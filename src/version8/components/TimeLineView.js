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
      dimensions: {height:300, width:600},
      max_window: new DateRange({start:"1800-01-01", end:"2020-12-31"}),
    }

    this._is_activated = this.props.is_active;
    this._window = null;
  }

  activate(){
    this._is_activated = true;
  }

  deactivate(){
    this._is_activated = false;
  }

  isActive(){
    return this._is_activated;
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
  }

  getTimeLine(){
    if (this.timeline){
      return this.timeline.$el;
    }
    else{
      return null;
    }
  }

  selectHandler(props){
    if (!this.isActive()){
      return;
    }

    console.log(`${this.props.name}: Selected`);
    console.log(props);
  }

  rangeChangedHandler(props){
    if (props.byUser){
      let window = new DateRange({start:new Date(props.start),
                                  end:new Date(props.end)});
      this._window = window;
    }

    //we emit the set window, not what the TimeLine thinks, as otherwise
    //we get weird behaviour on setup as we get initial rangeChanged fires
    //for pre-rendered views
    const window = this._window;

    if (window && this.isActive() && this.props.emitWindowChanged){
      this.props.emitWindowChanged(window);
    }
  }

  setWindow(window){
    if (!this.isActive()){
      console.log(`${this.props.name}: setWindow when inactive`);
      return;
    }

    if (!window){
      console.log(`${this.props.name}: setWindow with no window`);
      return;
    }

    if (this._window === window){
      console.log(`${this.props.name}: setWindow with no change in window`);
      return;
    }

    const max_window = this.state.max_window;

    if (max_window){
      let new_window = max_window.intersect(window);

      if (new_window.getDelta() !== window.getDelta()){
        if (window.getStart() < max_window.getStart()){
          new_window = new DateRange({start:max_window.getStart(),
                                      end:max_window.getStart()+window.getDelta()});
        }
        else if (window.getEnd() > max_window.getEnd()){
          new_window = new DateRange({start:max_window.getEnd()-window.getDelta(),
                                      end:max_window.getEnd()});
        }

        if (new_window.getStart() < max_window.getStart()){
          new_window = new DateRange({start:max_window.getStart(),
                                      end:new_window.end()});
        }

        if (new_window.getEnd() > max_window.getEnd()){
          new_window = new DateRange({start:new_window.getStart(),
                                      end:max_window.getEnd()});
        }

        window = new_window;
      }

      const min_delta = 24*60*60*1000;

      if (window.getDelta() < min_delta){
        window = new DateRange({start:window.getStart(),
                                end:window.getStart()+min_delta});
      }
    }

    this._window = window;
    this.getTimeLine().setWindow(window.getStartDate(), window.getEndDate(),
                                 {animation:true});
  }

  setStartDate(date){
    if (!date){
      return;
    }

    const window = this._window;

    if (window){
      this.setWindow(new DateRange({start:date, end:window.getEndDate()}));
    }
  }

  setEndDate(date){
    if (!date){
      return;
    }

    const window = this._window;

    if (window){
      this.setWindow(new DateRange({start:window.getStartDate(), end:date}));
    }
  }

  scrollLeft(){
    const window = this._window;

    if (window){
      this.setWindow(window.shiftEarlier());
    }
  }

  scrollRight(){
    const window = this._window;

    if (window){
      this.setWindow(window.shiftLater());
    }
  }

  zoomIn(){
    const window = this._window;

    if (window){
      this.setWindow(window.zoomIn());
    }
  }

  zoomOut(){
    const window = this._window;

    if (window){
      this.setWindow(window.zoomOut());
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

    let window = this._window;

    if (this.props.getWindow){
      window = this.props.getWindow();
    }

    if (!(window && window.hasBounds())){
      if (max_window && max_window.hasBounds()){
        window = max_window;
      }
      else{
        window = new DateRange({start:"2000-01-31", end:"2020-12-31"});
      }
    }

    this._window = window;

    let start = this._window.getStartDate();
    let end = this._window.getEndDate();

    let items = null;

    if (this.isActive()){
      if (this.props.getItems){
        items = this.props.getItems();
      }
    }

    if (items === null || items.length === 0){
      items = [];
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
      let activated = this._is_activated;
      timeline.setWindow(start, end, {animation:false});
      this._is_activated = activated;
    }

    return (
      <div className={styles.container}
           style={{width:width, height:height}}>
        <Timeline className={styles.timeline}
                  ref={el => (this.timeline = el)}
                  rangechangedHandler={(props)=>{this.rangeChangedHandler(props)}}
                  selectHandler={(props)=>{this.selectHandler(props)}}
                  options={my_options}
                  items={items}/>
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
                  onClick={()=>{this.setWindow(max_window)}}>&harr;</button>
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
