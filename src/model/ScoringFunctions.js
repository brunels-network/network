import get_id from "./get_id";

/** Score by the influence of each node */
function score_by_influence(nodes, edges, social) {
  let scores = [];

  let anchor = social.getAnchor();
  let anchor_id = null;
  let connections = null;

  if (anchor) {
    anchor_id = get_id(anchor);
    connections = social.getConnections();
  }

  for (let i in nodes) {
    let node = nodes[i];
    let score = node.weight + node.edge_count / 1000000.0

    if (anchor_id) {
      if (node.id === anchor_id) {
        score += 100000.0;
      }
      else if (connections.areConnected(node.id, anchor_id)) {
        score += 50000.0;
      }
    }

    scores.push([score, i]);
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
  let anchor = social.getAnchor();
  let anchor_id = null;
  let connections = null;

  if (anchor) {
    anchor_id = get_id(anchor);
    connections = social.getConnections();
  }

  let scores = [];

  for (let i in nodes) {
    let node = nodes[i];
    let score = node.edge_count + node.weight / 1000000.0

    if (anchor_id) {
      if (node.id === anchor_id) {
        score += 100000.0;
      }
      else if (connections.areConnected(node.id, anchor_id)) {
        score += 50000.0;
      }
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
  score_by_influence
};
