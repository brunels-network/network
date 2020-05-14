import PropTypes from "prop-types";
import React from "react";
import moment from "moment";

import Timeline, { TimelineHeaders, DateHeader, CustomHeader } from "react-calendar-timeline";

import "./TimelineCSSOverride.css";

class NewTimeline extends React.Component {
  constructor(props) {
    super(props);

    this.setFilter = this.setFilter.bind(this);
    this.itemRenderer = this.itemRenderer.bind(this);

    this.state = {
      defaultTimeStart: moment("1829-01-01"),
      defaultTimeEnd: moment("1846-12-31"),
      lastShip: null,
    };

    this.textStyle = {
      overflow: "hidden",
      paddingLeft: 3,
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    };

    this.dateHeaderStyle = {
      color: "black",
      fontSize: "16px",
      backgroundColor: "#E8CEAA",
      fontFamily: "Playfair Display SC",
      border: "white",
    };
  }

  setFilter(id, shipName) {
    if (shipName === this.state.lastShip) {
      this.props.resetFilters();
      // Allows the ship to be selected again
      this.setState({ lastShip: "" });
      return;
    }

    this.setState({ lastShip: shipName });
    this.props.onClick(id, shipName);
  }

  openOverview() {
    return;
  }

  itemRenderer({ item, itemContext, getItemProps }) {
    // const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();

    const background = itemContext.selected ? (itemContext.dragging ? "#008080" : "#008080") : "#808080";
    const border = itemContext.resizing ? "#008080" : "#808080";

    return (
      <div
        {...getItemProps({
          style: {
            background,
            border,
            borderStyle: "solid",
            fontSize: "18px",
            fontFamily: "Playfair Display SC",
            borderWidth: 0,
          },
          onMouseDown: () => {
            this.setFilter(item["project_id"], item["title"]);
          },
        })}
      >
        <div style={this.textStyle}>{itemContext.title}</div>
      </div>
    );
  }

  render() {
    const projects = this.props.projects;

    const timeline_items = projects.values().map((project, index) => {
      let item = project.getNewTimeLine();

      item["id"] = index;
      item["group"] = 1;

      return item;
    });

    const groups = [{ id: 1, title: "Projects" }];

    return (
      <Timeline
        groups={groups}
        items={timeline_items}
        sidebarWidth={0}
        itemTouchSendsClick={true}
        stackItems
        lineHeight={60}
        itemHeightRatio={0.8}
        showCursorLine
        canMove={false}
        canResize={false}
        traditionalZoom={true}
        timeSteps={{ year: 1 }}
        itemRenderer={this.itemRenderer}
        defaultTimeStart={this.state.defaultTimeStart}
        defaultTimeEnd={this.state.defaultTimeEnd}
      >
        <TimelineHeaders>
          {/* <DateHeader unit="primaryHeader" style={this.dateHeaderStyle} /> */}
          <CustomHeader height={30} unit="year">
            {({ headerContext: { intervals }, getRootProps, getIntervalProps }) => {
              console.log(getIntervalProps);
              return (
                <div {...getRootProps()}>
                  {intervals.map((interval, index) => {
                    const intervalStyle = {
                      lineHeight: "30px",
                      textAlign: "center",
                      borderLeft: "1px solid white",
                      cursor: "pointer",
                      backgroundColor: "#E9CEAB",
                      color: "black",
                      fontFamily: "Playfair Display SC",
                    };
                    return (
                      <div
                        key={index}
                        {...getIntervalProps({
                          interval,
                          style: intervalStyle,
                        })}
                      >
                        <div className="sticky">{interval.startTime.format("YYYY")}</div>
                      </div>
                    );
                  })}
                </div>
              );
            }}
          </CustomHeader>
        </TimelineHeaders>
      </Timeline>
    );
  }
}

NewTimeline.propTypes = {
  projects: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired,
};

export default NewTimeline;
