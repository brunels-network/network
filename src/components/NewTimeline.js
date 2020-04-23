import PropTypes from "prop-types";
import React from "react";
import moment from "moment";

import Timeline, { TimelineHeaders, SidebarHeader, DateHeader } from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";

import generateFakeData from "./generate-fake-data";

var keys = {
  groupIdKey: "id",
  groupTitleKey: "title",
  groupRightTitleKey: "rightTitle",
  itemIdKey: "id",
  itemTitleKey: "title",
  itemDivTitleKey: "title",
  itemGroupKey: "group",
  itemTimeStartKey: "start",
  itemTimeEndKey: "end",
  groupLabelKey: "title",
};

class NewTimeline extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: null,
      defaultTimeStart: this.toUnixTimestamp("1800-01-01"),
      defaultTimeEnd: this.toUnixTimestamp("1860-12-31"),
    };

  }

  toUnixTimestamp(date) {
    return moment(date).unix();
  }

  getProjects() {
    // Parse the projects passed and add them to the timelime
    const p = this.props.projects.map((project) => {
      let items = project.getTimeline();

      items["group"] = 1;

      return items;
    });

    this.setState({ projects: p });
  }

  render() {
    const groups = [{ id: 1, title: "Projects" }];

    return (
      <Timeline
        groups={groups}
        items={this.state.projects}
        keys={keys}
        sidebarContent={<div>Above The Left</div>}
        // itemsSorted
        itemTouchSendsClick={false}
        stackItems
        itemHeightRatio={0.75}
        showCursorLine
        canMove={false}
        canResize={false}
        defaultTimeStart={this.state.defaultTimeStart}
        defaultTimeEnd={this.state.defaultTimeEnd}
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
  //   emitWindowChanged: PropTypes.func.isRequired,
  //   getItems: PropTypes.array,
  //   is_active: PropTypes.bool,
};

export default NewTimeline;
