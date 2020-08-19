/** Internal function used to return a function that
 *  returns a constant value
 **/
function _constant(x) {
  return function () {
    return x;
  };
}

/** Internal function used to return a function that counts up from
 *  0 every time it is called
 */
function _return_index() {
  let i = 0;
  return function () {
    let j = i;
    i += 1;
    return j;
  }
}

/** Force function that pulls nodes towards a spiral design that
 *  is centered in a canvas of specified width and height. You can
 *  specify the strength of this force, and also the index that
 *  maps a node to a point in the spiral. The center point of the
 *  spiral is index 0, with subsequent points counting up uniformly
 *  from there. The spiral is resized automatically to ensure that
 *  all points are contained on the canvas.
 */
export default function force_spiral(width, height) {
  let nodes = null;
  let index = _return_index();
  let strength = _constant(0.1);
  let strengths = null;
  let indexes = null;
  let points_x = null;
  let points_y = null;

  if (height == null) height = 600;
  if (width == null) width = 600;

  /** Calculate the force on the nodes and update the velocities.
   *  This uses the spiral points pre-calculated in 'initialise'.
   *  Each node looks up its spiral point based on the index
   *  assigned to each node
   */
  function force(alpha) {
    if (!nodes) return;

    for (let i = 0, n = nodes.length; i < n; ++i) {
      let node = nodes[i];
      let index = indexes[i];
      node.vx += (points_x[index] - node.x) * strengths[i] * alpha;
      node.vy += (points_y[index] - node.y) * strengths[i] * alpha;
    }
  }

  /** Initialise the spiral. This pre-fectches all of the strengths
   *  for the nodes and places them into an array.
   *
   *  This then pre-fetches all of the node indexes, and, using the
   *  maximum index, works out and pre-calculates the points of a
   *  spiral with enough points to satisfy all indexes, and that
   *  ensures that they all fit onto the screen.
   *
   *  These points are placed into the points_x and points_y arrays.
   */
  function initialize() {
    if (!nodes) return;

    let n = nodes.length;

    // collect the strengths and indexes
    strengths = new Array(n);
    indexes = new Array(n);

    for (let i = 0; i < n; ++i) {
      strengths[i] = +strength(nodes[i], i, nodes);
      indexes[i] = Math.floor(index(nodes[i], i, nodes));

      if (indexes[i] < 0) {
        indexes[i] = 0;
      } else if (indexes[i] >= 1024 * 1024) {
        // limit to 1 MB
        indexes[i] = 1024 * 1024;
      }
    }

    // what is the maximum index - will need to know this to generate
    // all of the points
    let max_index = Math.max(...indexes);

    // now calculate all of the points
    points_x = new Array(max_index + 1);
    points_y = new Array(max_index + 1);

    let angle = 0.0;
    let radius = 0.0;

    let min_x = 0.0;
    let max_x = 0.0;
    let min_y = 0.0;
    let max_y = 0.0;

    for (let i = 1; i <= max_index; ++i) {
      radius = Math.sqrt(i);
      angle += Math.asin(1 / radius);
      points_x[i] = Math.cos(angle) * radius;
      points_y[i] = Math.sin(angle) * radius;

      min_x = Math.min(min_x, points_x[i]);
      max_x = Math.max(max_x, points_x[i]);

      min_y = Math.min(min_y, points_y[i]);
      max_y = Math.max(max_y, points_y[i]);
    }

    // we now need to scale such that 'radius' can fit comfortably
    // on a width * height page
    let center_x = width / 2;
    let center_y = height / 2;

    let scale_x = 0.80 * width / (max_x - min_x);
    let scale_y = 0.80 * height / (max_y - min_y);

    // offset the center slightly as the spiral biases slightly
    center_x -= 0.5 * scale_x * (max_x + min_x);
    center_y -= 0.5 * scale_y * (max_y + min_y);

    points_x[0] = center_x;
    points_y[0] = center_y;

    for (let i = 1; i <= max_index; ++i) {
      points_x[i] = center_x + (points_x[i] * scale_x);
      points_y[i] = center_y + (points_y[i] * scale_y);
    }
  }

  /** Add the initialise function to the force object that will be returned */
  force.initialize = function (_) {
    nodes = _;
    initialize();
  };

  /** Allow the user to supply their own value or function that
   *  sets the strength for each node
   */
  force.strength = function (_) {
    return arguments.length ? ((strength = typeof _ === "function" ?
      _ : _constant(+_)), initialize(), force) : strength;
  };

  /** Allow the user to supply their own value or function that
   *  sets the index on the spiral for each node
   */
  force.index = function (_) {
    return arguments.length ? ((index = typeof _ === "function" ?
      _ : _return_index()), initialize(), force) : index;
  };

  return force;
}