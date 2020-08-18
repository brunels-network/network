function constant(x) {
  return function () {
    return x;
  };
}

function return_argument(x) {
  return x;
}

export default function (width, height) {
  let nodes = null;
  let index = return_argument;
  let strength = constant(0.1);
  let strengths = null;
  let indexes = null;

  if (height == null) height = 600;
  if (width == null) width = 600;

  let center_x = width / 2;
  let center_y = height / 2;

  let radius_x = 0.75 * center_x;
  let radius_y = 0.75 * center_y;

  // offset the center slightly as the spiral
  // biases to top right
  center_x -= 0.15 * radius_x;
  center_y += 0.15 * radius_y;

  function force(alpha) {
    let angle = 0.0;
    let j = 0;
    let delta = 0;

    for (let i = 0, n = nodes.length; i < n; ++i) {
      let node = nodes[i];

      let rx = 0.0;
      let ry = 0.0;

      if (j > 0) {
        let radius = Math.sqrt(j);
        angle += Math.asin(1 / radius);
        rx = Math.cos(angle) * radius * (0.2 * radius_x);
        ry = Math.sin(angle) * radius * (0.2 * radius_y);
      }

      node.vx += (center_x + rx - node.x) * strengths[i] * alpha;
      node.vy += (center_y + ry - node.y) * strengths[i] * alpha;

      for (let k = 1; k <= delta; ++k) {
        j += 1;
        let radius = Math.sqrt(j);
        angle += Math.asin(1 / radius);
      }

      j += 1;
    }
  }

  function initialize() {
    if (!nodes) return;

    let n = nodes.length;

    // collect the strengths and indexes
    strengths = new Array(n);
    indexes = new Array(n);

    for (let i = 0; i < n; ++i) {
      strengths[i] = +strength(nodes[i], i, nodes);
      indexes[i] = index(nodes[i], i, nodes);
    }

    console.log(strengths);
    console.log(indexes);

    // now calculate all of the points
  }

  force.initialize = function (_) {
    nodes = _;
    initialize();
  };

  force.strength = function (_) {
    return arguments.length ? ((strength = typeof _ === "function" ? _ : constant(+_)), initialize(), force) : strength;
  };

  force.index = function (_) {
    return arguments.length ? ((index = typeof _ === "function" ? _ : return_argument(_)), initialize(), force) : index;
  };

  return force;
}
