import * as d3 from "d3";

import lodash from "lodash";

import { v4 as uuidv4 } from "uuid";

import styles from "../ForceGraph.module.css";

function _null_function(params) {}

function constrain(x, w, r = 20) {
  return Math.max(r, Math.min(w - r, x));
}

function dragLink(THIS) {
  let simulation = THIS._simulation;

  function dragstarted(d) {
    simulation.alphaTarget(0.3).restart();

    //find the two nodes connected to this edge
    let source = THIS._graph.nodes[d.source.index];
    let target = THIS._graph.nodes[d.target.index];

    //fix those nodes in place
    source.fx = source.x;
    source.fy = source.y;

    target.fx = target.x;
    target.fy = target.y;
  }

  function dragged(d) {
    if (!THIS._is_running) simulation.restart();

    //find the two nodes connected to this edge
    let source = THIS._graph.nodes[d.source.index];
    let target = THIS._graph.nodes[d.target.index];

    //moves those nodes with the event - move the center point of the
    //line connecting these two nodes...
    let dx = 0.5 * (target.x - source.x);
    let dy = 0.5 * (target.y - source.y);

    source.fx = constrain(d3.event.x - dx, THIS.state.width, source.r);
    source.fy = constrain(d3.event.y - dy, THIS.state.height, source.r);

    target.fx = constrain(d3.event.x + dx, THIS.state.width, target.r);
    target.fy = constrain(d3.event.y + dy, THIS.state.height, target.r);
  }

  function dragended(d) {
    simulation.alphaTarget(0).restart();

    //find the two nodes connected to this edge
    let source = THIS._graph.nodes[d.source.index];
    let target = THIS._graph.nodes[d.target.index];

    if (!source.fixed) {
      source.fx = null;
      source.fy = null;
    }

    if (!target.fixed) {
      target.fx = null;
      target.fy = null;
    }
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

function drag(THIS) {
  let simulation = THIS._simulation;

  function dragstarted(d) {
    simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    if (!THIS._is_running) simulation.restart();

    let w = THIS.state.width;
    let h = THIS.state.height;

    d.fx = constrain(d3.event.x, w, d.r);
    d.fy = constrain(d3.event.y, h, d.r);
  }

  function dragended(d) {
    simulation.alphaTarget(0).restart();

    if (!d.fixed) {
      d.fx = null;
      d.fy = null;
    }
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

function handleMouseClick(THIS) {
  function handle() {
    let svg = THIS._mainGroup;
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

    THIS.state.signalClicked(id);
    d3.event.stopPropagation();
  }

  return handle;
}

function handleMouseOver(THIS) {
  function handle() {
    let svg = THIS._mainGroup;
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
    items.each((d, i) => {
      let target_id = d.target.id;
      svg.selectAll(`#${target_id}`).classed(styles.highlight, true);
    });

    //highlight the connection lines with this node as a target
    items = svg.selectAll(`[target_id=${id}]`);
    items.classed(styles.highlight, true);

    //highlight the nodes with this node as a source
    items.each((d, i) => {
      let source_id = d.source.id;
      svg.selectAll(`#${source_id}`).classed(styles.highlight, true);
    });

    if (node.attr("source_id")) {
      svg
        .selectAll(`#${node.attr("source_id")}`)
        .classed(styles.highlight, true);

      svg
        .selectAll(`#${node.attr("target_id")}`)
        .classed(styles.highlight, true);
    }

    THIS.state.signalMouseOver(id);
  }

  return handle;
}

function handleMouseOut(THIS) {
  function handle() {
    let svg = THIS._mainGroup;
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
    items.each((d, i) => {
      let target_id = d.target.id;
      svg.selectAll(`#${target_id}`).classed(styles.highlight, false);
    });

    //highlight the connection lines with this node as a target
    items = svg.selectAll(`[target_id=${id}]`);
    items.classed(styles.highlight, false);

    //highlight the nodes with this node as a source
    items.each((d, i) => {
      let source_id = d.source.id;
      svg.selectAll(`#${source_id}`).classed(styles.highlight, false);
    });

    if (node.attr("source_id")) {
      svg
        .selectAll(`#${node.attr("source_id")}`)
        .classed(styles.highlight, false);

      svg
        .selectAll(`#${node.attr("target_id")}`)
        .classed(styles.highlight, false);
    }

    THIS.state.signalMouseOut(id);
  }

  return handle;
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
      colors: {
        color: d3.scaleOrdinal(d3.schemeCategory10),
        last_color: -1,
        group_to_color: {},
      },
      uid: uid.slice(uid.length - 8),
    };

    this._size_changed = true;
    this._graph_changed = true;
    this._is_running = false;

    this.update(props);
  }

  updateGraph(social) {
    let w = this.state.width;
    let h = this.state.height;

    this.state.social = social;

    if (!w || !h) {
      return;
    }

    let graph = null;

    if (social) {
      graph = social.getGraph();
    }

    // the social object will cache the 'getGraph' result, meaning
    // that any change in this object signals that the graph needs
    // to be redrawn
    if (graph !== this.state.graph) {
      //save the cached graph
      this.state.graph = graph;

      //this view needs to clone its own copy of the graph, as
      //D3 will update the graph object. We need to clone in case
      //two ForceGraph.d3 views are viewing the same Social graph
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

    if (props.hasOwnProperty("width")) {
      if (this.state.width !== props.width) {
        this.state.width = props.width;
        size_changed = true;
      }
    }

    if (props.hasOwnProperty("height")) {
      if (this.state.height !== props.height) {
        this.state.height = props.height;
        size_changed = true;
      }
    }

    if (size_changed) {
      this._size_changed = true;
    }

    if (props.hasOwnProperty("signalClicked")) {
      if (this.state.signalClicked) {
        this.state.signalClicked = props.signalClicked;
      } else {
        this.state.signalClicked = _null_function;
      }
    }

    if (props.hasOwnProperty("signalMouseOut")) {
      if (this.state.signalMouseOut) {
        this.state.signalMouseOut = props.signalMouseOut;
      } else {
        this.state.signalMouseOut = _null_function;
      }
    }

    if (props.hasOwnProperty("signalMouseOver")) {
      if (this.state.signalMouseOver) {
        this.state.signalMouseOver = props.signalMouseOver;
      } else {
        this.state.signalMouseOver = _null_function;
      }
    }

    if (props.hasOwnProperty("social")) {
      this.updateGraph(props.social);
    }

    if (props.hasOwnProperty("selected")) {
      this.state.selected = _resolve(props.selected);
    }

    if (props.hasOwnProperty("highlighted")) {
      this.state.highlighted = _resolve(props.highlighted);
    }
  }

  className() {
    return `ForceGraphD3-${this.state.uid}`;
  }

  getGroupColor(group) {
    let color = this.state.colors.group_to_color[group];

    if (!color) {
      this.state.colors.last_color += 1;
      color = this.state.colors.last_color;
      this.state.colors.group_to_color[group] = color;
    }

    return this.state.colors.color(color);
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
        return this.getGroupColor(d.group);
      })
      .on("click", handleMouseClick(this))
      .on("mouseover", handleMouseOver(this))
      .on("mouseout", handleMouseOut(this))
      .call(drag(this));

    return node;
  }

  _updateNodeText(data) {
    let text = this._mainGroup
      .select(".node_text-group")
      .selectAll(".node_text");

    text = text
      .data(data, (d) => d.id)
      .join(
        (enter) =>
          enter.append("text").attr("class", `node_text ${styles.node_text}`),
        (update) => update.attr("class", `node_text ${styles.node_text}`)
      )
      .text((d) => d.label)
      .attr("id", (d) => {
        return d.id;
      })
      .on("click", handleMouseClick(this))
      .on("mouseover", handleMouseOver(this))
      .on("mouseout", handleMouseOut(this))
      .call(drag(this));

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
      .on("click", handleMouseClick(this))
      .on("mouseover", handleMouseOver(this))
      .on("mouseout", handleMouseOut(this))
      .call(dragLink(this));

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

    let THIS = this;

    function ended() {
      THIS._is_running = false;
    }

    function ticked() {
      THIS._link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      THIS._node
        .attr("cx", (d) => {
          return (d.x = constrain(d.x, w, d.r));
        })
        .attr("cy", (d) => {
          return (d.y = constrain(d.y, h, d.r));
        });

      THIS._label.attr("x", (d) => d.x).attr("y", (d) => d.y);
    }

    let simulation = d3
      .forceSimulation(this._graph.nodes)
      .force(
        "charge",
        d3.forceManyBody().strength(-150).distanceMin(1).distanceMax(100)
      )
      .force(
        "link",
        d3
          .forceLink()
          .links(this._graph.edges)
          .distance((d) => {
            return 25 * (1 + d.value);
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
      .on("tick", ticked)
      .on("end", ended);

    this._is_running = true;

    // save the simulation so that we can update it later...
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
      container
        .selectAll("svg")
        .attr("width", this.state.width)
        .attr("height", this.state.height);
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
