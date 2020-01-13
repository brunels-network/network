import React, { Component } from 'react';
import Timeline from 'react-visjs-timeline';

import DatePicker from 'react-datepicker';

import DateRange from '../model/DateRange';

import "react-datepicker/dist/react-datepicker.css";

import styles from './TimeLineView.module.css';

function _customOrder(a, b) {
  // order by id
  return a.id - b.id;
}

const timeline_options = {
  autoResize: true,
  horizontalScroll: true,
  showCurrentTime: false,
  showTooltips: false,
  verticalScroll: true,
  zoomable: false,
  order: _customOrder,
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

    if (this.props.emitSelected){
      this.props.emitSelected(props.items[0]);
    }
  }

  rangeChangedHandler(props){
    if (props.byUser){
      let window = new DateRange({start:props.start.toISOString(),
                                  end:props.end.toISOString()});
      if (!window.hasBounds()){
        console.log(`Something went wrong? ${window}`);
        return;
      }
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
      return;
    }

    if (!window){
      return;
    }

    if (this._window === window){
      return;
    }

    this._window = window;
    console.log(`Set window to ${window}`);
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

    let window = this._window;
    let max_window = this._window;

    if (this.props.getWindow){
      window = this.props.getWindow();
    }

    if (this.props.getMaxWindow){
      max_window = this.props.getMaxWindow();

      if (max_window.hasBounds()){
        my_options["max"] = max_window.getLatestEnd().toDate();
        my_options["min"] = max_window.getEarliestStart().toDate();

        if (!window){
          window = max_window;
        }

        console.log(`USING MAX_WINDOW ${max_window}`);
      }
      else{
        console.log(`Unbounded max_window? ${max_window}`);
        max_window = null;
      }
    }

    if (!window){
      window = new DateRange({start:"2000-01-31", end:"2020-12-31"});
    }

    this._window = window;

    let start = this._window.getEarliestStart();
    let end = this._window.getLatestEnd();

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
      start = start.toDate();
      my_options["start"] = start;
    }

    if (end){
      end = end.toDate();
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

    console.log(my_options);

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
