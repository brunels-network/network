import get_id from "./get_id";

/** Score by the weight of each node */
function score_by_weight(nodes, edges, social) {
  let scores = [];

  for (let i in nodes) {
    let node = nodes[i];
    scores.push([node.weight[Object.keys(node.weight)[0]], i]);
  }

  scores.sort((x, y) => {
    return y[0] - x[0];
  });

  for (let i in scores) {
    nodes[scores[i][1]].sort_index = i;
  }
}

/** Score by the number of connections only */
function score_by_connections(nodes, edges, social) {
  let counts = {};

  let add_count = (id) => {
    // ensures x == 1 if id doesn't exist in counts
    let x = (counts[id] || 0) + 1;
    counts[id] = x;
  };

  for (let i in edges) {
    add_count(edges[i].source);
    add_count(edges[i].target);
  }

  let scores = [];

  for (let i in nodes) {
    let node = nodes[i];
    let node_id = get_id(node);
    let score = 0.0;

    if (counts[node_id]) {
      score += counts[node_id];
    }

    scores.push([score, i]);
  }

  // sort the scores such that the most connected nodes are first
  scores.sort((x, y) => {
    return y[0] - x[0];
  });

  for (let i in scores) {
    nodes[scores[i][1]].sort_index = i;
  }
}

/** Score the passed nodes using the number of connections and their
 *  relationship to the anchor node
 */
function score_by_connections_to_anchor(nodes, edges, social) {
  let connections = social.getConnections();

  let counts = {};

  let add_count = (id) => {
    // ensures x == 1 if id doesn't exist in counts
    let x = (counts[id] || 0) + 1;
    counts[id] = x;
  };

  for (let i in edges) {
    add_count(edges[i].source);
    add_count(edges[i].target);
  }

  let scores = [];

  let anchor = social.getAnchor();
  let anchor_id = get_id(anchor);

  for (let i in nodes) {
    let node = nodes[i];
    let node_id = get_id(node);
    let score = 0.0;

    if (node_id === anchor_id) {
      score += 1000000.0;
    }

    if (connections.areConnected(anchor_id, node_id)) {
      score += 50000.0;
    }

    if (counts[node_id]) {
      score += counts[node_id];
    }

    scores.push([score, i]);
  }

  // sort the scores such that the most connected nodes are first
  scores.sort((x, y) => {
    return y[0] - x[0];
  });

  for (let i in scores) {
    nodes[scores[i][1]].sort_index = i;
  }
}

export {
  score_by_connections as default,
  score_by_connections,
  score_by_connections_to_anchor,
  score_by_weight
};
