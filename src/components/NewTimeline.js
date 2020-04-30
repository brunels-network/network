import PropTypes from "prop-types";
import React from "react";
import moment from "moment";

import Timeline, { TimelineHeaders, SidebarHeader, DateHeader } from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";

class NewTimeline extends React.Component {
  constructor(props) {
    super(props);

    this.setFilter = this.setFilter.bind(this);
    this.itemRenderer = this.itemRenderer.bind(this);

    this.state = {
      defaultTimeStart: moment("1836-01-01"),
      defaultTimeEnd: moment("1858-12-31"),
      lastShip: null,
    };

    this.textStyle = {
      overflow: "hidden",
      paddingLeft: 3,
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    };
  }

  setFilter(id, name) {
    // First check if the ship is the same as the last one clicked
    const shipName = name;

    if (shipName === this.state.lastShip) {
      this.props.resetFilters();
      // Allows the ship to be selected again
      this.setState({ lastShip: "" });
      return;
    }

    this.setState({ lastShip: shipName });
    this.props.onClick(id, name);
  }

  openOverview() {
    return;
  }

  itemRenderer({ item, timelineContext, itemContext, getItemProps, getResizeProps }) {
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();

    const background = itemContext.selected ? (itemContext.dragging ? "#008080" : "#008080") : "#808080";
    const border = itemContext.resizing ? "#008080" : "#808080"

    return (
      <div
        // This expands getItemProps here
        {...getItemProps({
          style: {
            background,
            border,
            borderStyle: "solid",
            fontSize: "14px",
            fontFamily: "serif",
          },
          onMouseDown: () => {
            this.setFilter(item["project_id"], item["title"]);
          },
        })}
      >
        {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : null}

        <div style={this.textStyle}>{itemContext.title}</div>

        {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : null}
      </div>
    );
  }

  render() {
    const projects = this.props.projects;

    const timeline_items = projects.values().map((project, index) => {
      let item = project.getNewTimeLine();

      item["id"] = index;
      item["group"] = 1;

      //   item["color"] = "rgb(158, 14, 206)";
      //   item["selectedBgColor"] = "rgba(225, 166, 244, 1)";
      //   item["bgColor"] = "rgba(225, 166, 244, 0.6)";

      //   item["itemProps"] = {
      //     "aria-hidden": true,
      //     onMouseDown: () => {
      //       this.setFilter(item["project_id"], item["title"]);
      //     },
      //     className: "weekend",
      //   };

      return item;
    });

    const groups = [{ id: 1, title: "Projects" }];

    // const selectedStyle = {
    //         background: '#FA8FAB',
    //         border: '1px solid #ff9800',
    //         zIndex: 82
    //         }

    return (
      <Timeline
        selected={null}
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
        <TimelineHeaders className="sticky">
          <DateHeader style={{ color: "#008080", backgroundColor: "#808080", fontFamily: "serif" }} />
        </TimelineHeaders>
      </Timeline>
    );
  }
}

NewTimeline.propTypes = {
  projects: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired,
  //   emitWindowChanged: PropTypes.func.isRequired,
  //   getItems: PropTypes.array,
  //   is_active: PropTypes.bool,
};

export default NewTimeline;
