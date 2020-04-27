import PropTypes from "prop-types";
import React from "react";
import moment from "moment";

import Timeline, { TimelineHeaders, SidebarHeader, DateHeader } from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";

// import generateFakeData from "./generate-fake-data";

// var keys = {
//   groupIdKey: "id",
//   groupTitleKey: "title",
//   groupRightTitleKey: "rightTitle",
//   itemIdKey: "id",
//   itemTitleKey: "title",
//   itemDivTitleKey: "title",
//   itemGroupKey: "group",
//   itemTimeStartKey: "start",
//   itemTimeEndKey: "end",
//   groupLabelKey: "title",
// };

class NewTimeline extends React.Component {
  constructor(props) {
    super(props);

    this.setFilter = this.setFilter.bind(this);

    this.state = {
      defaultTimeStart: moment("1836-01-01"),
      defaultTimeEnd: moment("1858-12-31"),
      lastShip: null,
    };
  }

  setFilter(id, name) {
    // First check if the ship is the same as the last one clicked
    const shipName = name;

    console.log(shipName, this.state.lastShip);

    if (shipName === this.state.lastShip) {
      this.props.resetFilters();
      // Allows the ship to be selected again
      this.setState({ lastShip: "" });
      return;
    }

    this.setState({ lastShip: shipName });
    this.props.shipFilterID(id, name);
  }

  render() {
    const projects = this.props.projects;

    const timeline_items = projects.values().map((project, index) => {
      let item = project.getNewTimeLine();

      item["id"] = index;
      item["group"] = 1;

      item["itemProps"] = {
        // these optional attributes are passed to the root <div /> of each item as <div {...itemProps} />
        "data-custom-attribute": "Random content",
        "aria-hidden": true,
        onMouseDown: () => {
          this.setFilter(item["project_id"], item["title"]);
        },
        className: "weekend",
        style: {
          //   background: "fuchsia",
        },
      };

      return item;
    });

    const groups = [{ id: 1, title: "Projects" }];

    return (
      <Timeline
        groups={groups}
        items={timeline_items}
        sidebarContent={<div>Above The Left</div>}
        itemTouchSendsClick={false}
        stackItems
        itemHeightRatio={0.8}
        showCursorLine
        canMove={false}
        canResize={false}
        visibleTimeStart={this.state.defaultTimeStart}
        visibleTimeEnd={this.state.defaultTimeEnd}
      >
        <TimelineHeaders className="sticky">
          <SidebarHeader>
            {({ getRootProps }) => {
              return <div {...getRootProps()}>Left</div>;
            }}
          </SidebarHeader>
          <DateHeader unit="primaryHeader" />
          <DateHeader />
        </TimelineHeaders>
      </Timeline>
    );
  }
}

NewTimeline.propTypes = {
  projects: PropTypes.func.isRequired,
  shipFilterID: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired,
  //   emitWindowChanged: PropTypes.func.isRequired,
  //   getItems: PropTypes.array,
  //   is_active: PropTypes.bool,
};

export default NewTimeline;
