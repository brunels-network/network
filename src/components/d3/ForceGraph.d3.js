import * as d3 from "d3";

import lodash from "lodash";

import { v4 as uuidv4 } from "uuid";

import styles from "../ForceGraph.module.css";

import positionGroups from "../../position_groups.json";

function _null_function() {}

function constrain(x, w, r = 20) {
  return Math.max(r, Math.min(w - r, x));
}

function _resolve(item) {
  if (!item) {
    return null;
  } else if (item.getID) {
    return item.getID();
  } else {
    return item;
  }
}

/** The main class that renders the graph in the ForceGraph */
class ForceGraphD3 {
  constructor(props) {
    // TODO - Check the need for these bindings
    this._updateSimulation = this._updateSimulation.bind(this);
    this._updateLink = this._updateLink.bind(this);
    this._updateNodeText = this._updateNodeText.bind(this);
    this._updateNode = this._updateNode.bind(this);
    this.draw = this.draw.bind(this);
    this.drawFromScratch = this.drawFromScratch.bind(this);
    this.setPositionColors = this.setPositionColors.bind(this);
    this.getPositionColor = this.getPositionColor.bind(this);
    this.update = this.update.bind(this);
    this.updateGraph = this.updateGraph.bind(this);

    this.drag = this.drag.bind(this);
    this.dragLink = this.dragLink.bind(this);

    // generate a UID for this graph so that we don't clash
    // with any other graphs on the same page
    let uid = uuidv4();

    this.state = {
      width: null,
      height: null,
      social: null,
      selected: null,
      highlighted: null,
      signalClicked: _null_function,
      signalMouseOut: _null_function,
      signalMouseOver: _null_function,
      colors: {},
      uid: uid.slice(uid.length - 8),
    };

    this._size_changed = true;
    this._graph_changed = true;
    this._is_running = false;
    this._is_drawn = false;

    // Set parameters for the force simulation
    this._target_decay = 0.4;
    this._target_alpha = 0.3;

    this.update(props);
  }

  updateGraph(social) {
    let w = this.state.width;
    let h = this.state.height;

    this.state.social = social;
    // this.setState({ social: social });

    if (!w || !h) {
      return;
    }

    let graph = null;

    if (social) {
      graph = social.getGraph();
    }

    // The social object will cache the 'getGraph' result, meaning
    // that any change in this object signals that the graph needs
    // to be redrawn
    if (graph !== this.state.graph) {
      //save the cached graph
      this.state.graph = graph;
      //   this.setState({ graph: graph });

      // This view needs to clone its own copy of the graph, as
      // D3 will update the graph object. We need to clone in case
      // two ForceGraph.d3 views are viewing the same Social graph
      graph = lodash.cloneDeep(this.state.graph);

      // need to update IDs so that the edges refer to the index
      // of the node in the nodes array - this could be optimised!
      for (let l in graph.edges) {
        let edge = graph.edges[l];
        for (let n in graph.nodes) {
          let node = graph.nodes[n];
          if (edge.source === node.id) {
            edge.source = n;
            edge.source_id = node.id;
          } else if (edge.target === node.id) {
            edge.target = n;
            edge.target_id = node.id;
          }
        }
      }

      //index any old nodes
      let old_nodes = [];
      let old = {};

      if (this._graph) {
        old_nodes = this._graph.nodes;

        for (let n in old_nodes) {
          old[old_nodes[n].id] = n;
        }
      }

      for (let n in graph.nodes) {
        let node = graph.nodes[n];

        let i = old[node.id];

        if (i) {
          let o = old_nodes[i];
          node.x = o.x;
          node.y = o.y;
        } else {
          node.x = w * Math.random();
          node.y = h * Math.random();
        }

        if (node.fixed) {
          if (i) {
            node.fx = node.x;
            node.fy = node.y;
          } else {
            node.fx = w / 2;
            node.fy = h / 2;
          }
        }
      }

      this._graph = graph;
      this._graph_changed = true;
    }
  }

  update(props) {
    let size_changed = false;

    if (props.wobble) {
      this._target_decay = 0.4;
      this._target_alpha = 0.3;
    } else {
      this._target_decay = 0.4;
      this._target_alpha = 0;
    }

    let hasWidth = Object.prototype.hasOwnProperty.call(props, "width");

    if (hasWidth) {
      if (this.state.width !== props.width) {
        this.state.width = props.width;
        // this.setState({ width: props.width });
        size_changed = true;
      }
    }

    let hasHeight = Object.prototype.hasOwnProperty.call(props, "height");

    if (hasHeight) {
      if (this.state.height !== props.height) {
        this.state.height = props.height;
        // this.setState({ height: props.height });
        size_changed = true;
      }
    }

    if (size_changed) {
      this._size_changed = true;
    }

    let hasSignalClicked = Object.prototype.hasOwnProperty.call(props, "signalClicked");

    if (hasSignalClicked) {
      if (this.state.signalClicked) {
        this.state.signalClicked = props.signalClicked;
        // this.setState({ signalClicked: props.signalClicked });
      } else {
        this.state.signalClicked = _null_function;
        // this.setState({ signalClicked: _null_function });
      }
    }

    let hasSignalMouseOut = Object.prototype.hasOwnProperty.call(props, "signalMouseOut");

    if (hasSignalMouseOut) {
      if (this.state.signalMouseOut) {
        this.state.signalMouseOut = props.signalMouseOut;
        // this.setState({ signalMouseOut: props.signalMouseOut });
      } else {
        this.state.signalMouseOut = _null_function;
        // this.setState({ signalMouseOut: _null_function });
      }
    }

    let hasSignalMouseOver = Object.prototype.hasOwnProperty.call(props, "signalMouseOver");

    if (hasSignalMouseOver) {
      if (this.state.signalMouseOver) {
        this.state.signalMouseOver = props.signalMouseOver;
        // this.setState({ signalMouseOver: props.signalMouseOver });
      } else {
        this.state.signalMouseOver = _null_function;
        // this.setState({ signalMouseOver: _null_function });
      }
    }

    let hasSocial = Object.prototype.hasOwnProperty.call(props, "social");

    if (hasSocial) {
      this.updateGraph(props.social);
    }

    // We can setup the colours object
    this.setPositionColors();

    let hasSelected = Object.prototype.hasOwnProperty.call(props, "selected");

    if (hasSelected) {
      this.state.selected = _resolve(props.selected);
      //   this.setState({ selected: _resolve(props.selected) });
    }

    let hasHighlighted = Object.prototype.hasOwnProperty.call(props, "highlighted");

    if (hasHighlighted) {
      this.state.highlighted = _resolve(props.highlighted);
      //   this.setState({ highlighted: _resolve(props.highlighted) });
    }
  }

  className() {
    return `ForceGraphD3-${this.state.uid}`;
  }

  getPositionColor(entity) {
    // This takes an entity (a person or a business) and finds the
    // colour that's given in the positions_groups.json file
    const positions = entity["positions"];
    const group = entity["group"];

    // TODO - rework and simplify this
    if (group == "anchor") {
      return positionGroups["anchor"]["color"];
    }

    // If we get an undefined position return white
    if (!positions) {
      const entity_id = entity["id"].toLowerCase();

      if (entity_id.startsWith("b")) {
        return positionGroups["business"]["color"];
      } else {
        console.error("No colour available for this entity : ", entity);
        return "#FFFFFF";
      }
    }

    // Split string by colon, for now just use the first value
    let positionCode;
    // Split the string and try both
    const splitGroup = group.split(":");

    try {
      // As some of the positions objects don't have a value for both
      // projects (called groups here) we have to check both
      try {
        positionCode = positions[splitGroup[0]][0];
      } catch (error) {
        positionCode = positions[splitGroup[1]][0];
      }
    } catch (error) {
      console.error("Error with position ", positions, " with splitGroup ", splitGroup, error);
      positionCode = "unknown";
    }

    positionCode = positionCode.toLowerCase();

    return this.state.colors[positionCode];
  }

  setPositionColors() {
    // Read all the positions for this graph
    const namedPositions = this.state.social.getPositions().items();

    let colorTable = {};

    // Read the positions and colours from a JSON file that can be easily updated
    for (let [position, uid] of Object.entries(namedPositions)) {
      uid = uid.toLowerCase();
      // Process these to remove whitespace and non letter/number characters so we have less likelihood of errors
      let trimPosition = position
        .replace(/\s/g, "")
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

      // Here positionGroups is the import JSON object containing
      // which positions are in which group and the colour assigned to them
      for (let members of Object.values(positionGroups)) {
        if (members["members"].includes(trimPosition)) {
          colorTable[uid] = members["color"];
          break;
        } else {
          // Assign bright blue to any we don't recognize, but this
          // shouldn't (hopefully) happen if the JSON is correct
          colorTable[uid] = "blue";
        }
      }
    }

    // Set the colour for the anchor
    colorTable["anchor"] = positionGroups["anchor"]["color"];

    this.state.colors = colorTable;
  }

  handleMouseClick() {
    return () => {
      let svg = this._mainGroup;
      if (!svg) {
        return;
      }

      let node = d3.select(this);
      node.raise();

      let id = node.attr("id");

      if (!id) {
        return;
      }

      let items = svg.selectAll(`#${id}`);

      items.classed(styles.highlight, true);

      items = svg.selectAll(`[source_id=${id}]`);
      items.classed(styles.highlight, true);

      items = svg.selectAll(`[target_id=${id}]`);
      items.classed(styles.highlight, true);

      this.state.signalClicked(id);
      d3.event.stopPropagation();
    };
  }

  handleMouseOver() {
    return () => {
      let svg = this._mainGroup;
      if (!svg) {
        return;
      }

      let node = d3.select(this);
      node.raise();

      let id = node.attr("id");

      if (!id) {
        return;
      }

      //highlight the node
      let items = svg.selectAll(`#${id}`);
      items.classed(styles.highlight, true);

      //highlight the connection lines with this node as a source
      items = svg.selectAll(`[source_id=${id}]`);
      items.classed(styles.highlight, true);

      //highlight the nodes with this node as a target
      items.each((d) => {
        let target_id = d.target.id;
        svg.selectAll(`#${target_id}`).classed(styles.highlight, true);
      });

      //highlight the connection lines with this node as a target
      items = svg.selectAll(`[target_id=${id}]`);
      items.classed(styles.highlight, true);

      //highlight the nodes with this node as a source
      items.each((d) => {
        let source_id = d.source.id;
        svg.selectAll(`#${source_id}`).classed(styles.highlight, true);
      });

      if (node.attr("source_id")) {
        svg.selectAll(`#${node.attr("source_id")}`).classed(styles.highlight, true);

        svg.selectAll(`#${node.attr("target_id")}`).classed(styles.highlight, true);
      }

      this.state.signalMouseOver(id);
    };
  }

  handleMouseOut() {
    return () => {
      let svg = this._mainGroup;
      if (!svg) {
        return;
      }

      let node = d3.select(this);
      let id = node.attr("id");

      let items = svg.selectAll(`#${id}`);

      items.classed(styles.highlight, false);

      //highlight the connection lines with this node as a source
      items = svg.selectAll(`[source_id=${id}]`);
      items.classed(styles.highlight, false);

      //highlight the nodes with this node as a target
      items.each((d) => {
        let target_id = d.target.id;
        svg.selectAll(`#${target_id}`).classed(styles.highlight, false);
      });

      //highlight the connection lines with this node as a target
      items = svg.selectAll(`[target_id=${id}]`);
      items.classed(styles.highlight, false);

      //highlight the nodes with this node as a source
      items.each((d) => {
        let source_id = d.source.id;
        svg.selectAll(`#${source_id}`).classed(styles.highlight, false);
      });

      if (node.attr("source_id")) {
        svg.selectAll(`#${node.attr("source_id")}`).classed(styles.highlight, false);

        svg.selectAll(`#${node.attr("target_id")}`).classed(styles.highlight, false);
      }

      this.state.signalMouseOut(id);
    };
  }

  drag() {
    let simulation = this._simulation;

    return d3
      .drag()
      .on("start", (d) => {
        simulation.alphaTarget(this._target_alpha).velocityDecay(this._target_decay).restart();

        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (d) => {
        if (!this._is_running) simulation.restart();

        let w = this.state.width;
        let h = this.state.height;

        d.fx = constrain(d3.event.x, w, d.r);
        d.fy = constrain(d3.event.y, h, d.r);
      })
      .on("end", (d) => {
        simulation.alphaTarget(0).restart();

        if (!d.fixed) {
          d.fx = null;
          d.fy = null;
        }
      });
  }

  dragLink() {
    return d3
      .drag()
      .on("start", (d) => {
        this._simulation.alphaTarget(this._target_alpha).velocityDecay(this._target_decay).restart();

        //find the two nodes connected to this edge
        let source = this._graph.nodes[d.source.index];
        let target = this._graph.nodes[d.target.index];

        //fix those nodes in place
        source.fx = source.x;
        source.fy = source.y;

        target.fx = target.x;
        target.fy = target.y;
      })
      .on("drag", (d) => {
        if (!this._is_running) {
          this._simulation.restart();
        }

        //find the two nodes connected to this edge
        let source = this._graph.nodes[d.source.index];
        let target = this._graph.nodes[d.target.index];

        //moves those nodes with the event - move the center point of the
        //line connecting these two nodes...
        let dx = 0.5 * (target.x - source.x);
        let dy = 0.5 * (target.y - source.y);

        source.fx = constrain(d3.event.x - dx, this.state.width, source.r);
        source.fy = constrain(d3.event.y - dy, this.state.height, source.r);

        target.fx = constrain(d3.event.x + dx, this.state.width, target.r);
        target.fy = constrain(d3.event.y + dy, this.state.height, target.r);
      })
      .on("end", (d) => {
        this._simulation.alphaTarget(0).restart();

        //find the two nodes connected to this edge
        let source = this._graph.nodes[d.source.index];
        let target = this._graph.nodes[d.target.index];

        if (!source.fixed) {
          source.fx = null;
          source.fy = null;
        }

        if (!target.fixed) {
          target.fx = null;
          target.fy = null;
        }
      });
  }

  _updateNode(data) {
    let node = this._mainGroup.select(".node-group").selectAll(".node");

    node = node
      .data(data, (d) => d.id)
      .join(
        (enter) => enter.append("circle").attr("class", `node ${styles.node}`),
        (update) => update.attr("class", `node ${styles.node}`)
      )
      .attr("r", (d) => {
        return d.size;
      })
      .attr("id", (d) => {
        return d.id;
      })
      .attr("fill", (d) => {
        return this.getPositionColor(d);
      })
      .on("click", this.handleMouseClick())
      .on("mouseover", this.handleMouseOver())
      .on("mouseout", this.handleMouseOut())
      .call(this.drag());

    return node;
  }

  _updateNodeText(data) {
    let text = this._mainGroup.select(".node_text-group").selectAll(".node_text");

    text = text
      .data(data, (d) => d.id)
      .join(
        (enter) => enter.append("text").attr("class", `node_text ${styles.node_text}`),
        (update) => update.attr("class", `node_text ${styles.node_text}`)
      )
      .text((d) => d.label)
      .attr("id", (d) => {
        return d.id;
      })
      .on("click", this.handleMouseClick())
      .on("mouseover", this.handleMouseOver())
      .on("mouseout", this.handleMouseOut())
      .call(this.drag());

    return text;
  }

  _updateLink(data) {
    let link = this._mainGroup.select(".link-group").selectAll(".link");

    link = link
      .data(data, (d) => d.id)
      .join(
        (enter) => enter.append("line").attr("class", `link ${styles.link}`),
        (update) => update.attr("class", `link ${styles.link}`)
      )
      .attr("class", `link ${styles.link}`)
      .attr("id", (d) => {
        return d.id;
      })
      .attr("source_id", (d) => {
        return d.source_id;
      })
      .attr("target_id", (d) => {
        return d.target_id;
      })
      .on("click", this.handleMouseClick())
      .on("mouseover", this.handleMouseOver())
      .on("mouseout", this.handleMouseOut())
      .call(this.dragLink());

    return link;
  }

  _updateSimulation() {
    if (this._simulation) {
      this._simulation.stop();
      this._simulation = null;
      this._is_running = false;
    }

    let w = this.state.width;
    let h = this.state.height;

    let simulation = d3
      .forceSimulation(this._graph.nodes)
      .force("charge", d3.forceManyBody().strength(-150).distanceMin(1).distanceMax(100))
      .force(
        "link",
        d3
          .forceLink()
          .links(this._graph.edges)
          .distance((d) => {
            return 50 * (1 + d.value);
          })
          .iterations(5)
      )
      .force(
        "collision",
        d3
          .forceCollide()
          .radius((d) => {
            return 1 + d.size;
          })
          .strength(1.0)
          .iterations(5)
      )
      .on("tick", () => {
        this._link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        this._node
          .attr("cx", (d) => {
            return (d.x = constrain(d.x, w, d.r));
          })
          .attr("cy", (d) => {
            return (d.y = constrain(d.y, h, d.r));
          });

        this._label.attr("x", (d) => d.x).attr("y", (d) => d.y);
      })
      .on("end", () => {
        this._is_running = false;
      });

    this._is_running = true;

    // Save the simulation so that we can update it later...
    this._simulation = simulation;
  }

  drawFromScratch() {
    console.log("DRAW FROM SCRATCH");
    let graph = this._graph;

    if (!graph) {
      if (this.state.social) {
        this.updateGraph(this.state.social);
      }

      graph = this._graph;
      if (!graph) {
        console.log("Nothing to draw...");
        return;
      }
    }

    d3.select(`.${this.className()} > *`).remove();

    let container = d3.select(`.${this.className()}`);

    if (!container) {
      console.log(`Cannot find container element class ${this.className()}`);
      return;
    }

    const width = this.state.width;
    const height = this.state.height;

    console.log(`REDRAW ${width}x${height}`);

    if (!width || !height) {
      console.log(`Invalid width or height? ${width} x ${height}`);
      return;
    }

    let svg = container
      .append("svg")
      .attr("height", height)
      .attr("width", width)
      .attr("id", "svg-viz")
      .attr("align", "center")
      .on("click", () => {
        this.state.signalClicked(null);
      });

    let mainGroup = svg;
    this._mainGroup = mainGroup;

    this._updateSimulation();

    mainGroup.append("g").attr("class", "link-group");
    mainGroup.append("g").attr("class", "node-group");
    mainGroup.append("g").attr("class", "node_text-group");

    this._link = this._updateLink(graph.edges);
    this._node = this._updateNode(graph.nodes);
    this._label = this._updateNodeText(graph.nodes);

    this._is_drawn = true;
  }

  draw() {
    if (!this._is_drawn) {
      this.drawFromScratch();
      this._size_changed = false;
      this._graph_changed = false;
      return;
    }

    let update_simulation = false;

    if (this._size_changed) {
      let container = d3.select(`.${this.className()}`);
      container.selectAll("svg").attr("width", this.state.width).attr("height", this.state.height);
      this._size_changed = false;
      update_simulation = true;
    }

    if (this._graph_changed) {
      this._node = this._updateNode(this._graph.nodes);
      this._label = this._updateNodeText(this._graph.nodes);
      this._link = this._updateLink(this._graph.edges);
      this._graph_changed = false;
      update_simulation = true;
    }

    if (update_simulation) {
      this._updateSimulation();
    }
  }
}

export default ForceGraphD3;
