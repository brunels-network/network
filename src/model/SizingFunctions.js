
/** Size each node by the influence of each node. Calculates the
 *  weight for a node and returns it
 */
function size_by_influence(nodes, edges, social) {
  let min_size = null;
  let max_size = null;

  nodes.forEach((node) => {
    let size = node.weight;

    if (min_size === null) {
      min_size = size;
      max_size = size;
    }
    else if (size > max_size) {
      max_size = size;
    }
    else if (size < min_size) {
      min_size = size;
    }

    node.size = size;
  });

  if (max_size === min_size) {
    nodes.forEach((node) => {
      nodes.size = 10.0;
    });
  }
  else {
    //scale between 1 and 10
    nodes.forEach((node) => {
      let size = 1.0 + (9.0 * (node.size - min_size) / (max_size - min_size));
      node.size = size;
    });
  }
}

/** Size each node by the number of connections only */
function size_by_connections(nodes, edges, social) {
  let min_size = null;
  let max_size = null;

  nodes.forEach((node) => {
    let size = node.edge_count;

    if (min_size === null) {
      min_size = size;
      max_size = size;
    }
    else if (size > max_size) {
      max_size = size;
    }
    else if (size < min_size) {
      min_size = size;
    }

    node.size = size;
  });

  if (max_size === min_size) {
    nodes.forEach((node) => {
      nodes.size = 10.0;
    });
  }
  else {
    //scale between 1 and 10
    nodes.forEach((node) => {
      let size = 1.0 + (9.0 * (node.size - min_size) / (max_size - min_size));
      node.size = size;
    });
  }
}

export {
  size_by_connections as default,
  size_by_connections,
  size_by_influence
};
