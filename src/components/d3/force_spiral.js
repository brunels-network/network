function constant(x) {
  return function () {
    return x;
  };
}

export default function (w, h) {
  var nodes,
    strength = constant(0.1),
    strengths;

  if (h == null) h = 600;
  if (w == null) w = 600;

  let x = w / 2;
  let y = h / 2;

  let rx = 0.75 * x;
  let ry = 0.75 * y;

  function force(alpha) {

    let phi = 0.0;

    for (var i = 0, n = nodes.length; i < n; ++i) {
        let node = nodes[i];

        /*let dx = node.x - x || 1e-6;
        let dy = node.y - y || 1e-6;*/

        /*let tan_phi = dy / dx;

        if (dx < 0) {
            phi = Math.atan(tan_phi) + Math.PI;
        }
        else {
            phi = Math.atan(tan_phi);
        }*/

        /*if (Math.abs(dx) > 0.5 * radiuses[i] || Math.abs(dy) > 0.5 * radiuses[i]) {
            phi = phi + (2.0 * Math.PI);
        }*/

        let r_scl = 0.1 + (0.4 * 0.5 * phi / Math.PI);

        let rad_x = (r_scl * rx * Math.cos(phi));
        let rad_y = (r_scl * ry * Math.sin(phi));

        node.vx += (x + rad_x - node.x) * strengths[i] * alpha;
        node.vy += (y + rad_y - node.y) * strengths[i] * alpha;

        phi += 0.15 * Math.PI;
    }
  }

  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length;
    strengths = new Array(n);
    for (i = 0; i < n; ++i) {
      strengths[i] = +strength(nodes[i], i, nodes);
    }
  }

  force.initialize = function (_) {
    nodes = _;
    initialize();
  };

  force.strength = function (_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
  };

  force.x = function (_) {
    return arguments.length ? (x = +_, force) : x;
  };

  force.y = function (_) {
    return arguments.length ? (y = +_, force) : y;
  };

  return force;
}