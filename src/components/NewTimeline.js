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

    var start_date = moment("1836-01-01");
    var end_date = moment("1858-12-31");

    this.state = {
      defaultTimeStart: start_date,
      defaultTimeEnd: end_date,
    };
  }

  render() {
    const projects = this.props.projects;

    const timeline_items = projects.values().map((project) => {
      let items = project.getNewTimeLine();

      console.log(items["start_time"], items["end_time"], items["name"]);
    

      items["group"] = 1;

      return items;
    });

    // const groups = [{ id: 1, title: "Projects" }];

    const groups = [
      { id: 1, title: "Projects" },
    ];

    const items = [
      {
        id: 1,
        group: 1,
        title: "SS Great Western",
        start_time: moment("1836-06-26"),
        end_time: moment("1838-03-31"),
      },
      {
        id: 2,
        group: 1,
        title: "SS Great Britain",
        start_time: moment("1839-07-01"),
        end_time: moment("1843-07-19"),
      },
      {
        id: 3,
        group: 1,
        title: "SS Great Eastern",
        start_time: moment("1854-05-01"),
        end_time: moment("1858-01-31"),
      },
    ];

    return (
      <Timeline
        groups={groups}
        items={items}
        sidebarContent={<div>Above The Left</div>}
        // itemsSorted
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
  //   emitWindowChanged: PropTypes.func.isRequired,
  //   getItems: PropTypes.array,
  //   is_active: PropTypes.bool,
};

export default NewTimeline;
