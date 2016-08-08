// return t2 subtree to overwrite on t1
// actions: "delete", "insert", "node_replace", "tree_replace"
function Patch(action, node) {
  this.action = action;
  this.node = node;
  return this;
}

module.exports = Patch;
