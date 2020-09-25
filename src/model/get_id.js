
/** Return the ID number of the passed node. This is used to
 *  standardise how I get IDs. It will first try 'getID()',
 * then, if that fails, .id, and will then return the object
 * itself
 */
export default function get_id(node) {
  if (node === null) {
    return null;
  } else if (node.getID) {
    return node.getID();
  } else if (node.id) {
    return node.id;
  } else {
    return node;
  }
}
