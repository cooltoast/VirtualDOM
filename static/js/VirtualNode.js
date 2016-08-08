function VNode(value,children,index) {
  this.value = value;
  this.children = children;
  this.index = index;

  return this;
};

VNode.prototype.numChildren = function() {
  return (this.children == null) ? 0 : this.children.length;
}

VNode.prototype.appendChild = function(child) {
  if (this.children != null) {
    this.children.push(child);
  } else {
    this.children = [child];
  }
}

VNode.prototype.removeChild = function(child) {
  try {
    var i = this.children.indexOf(child);
  }
  catch(err) {
    console.log(err);
  }

  var child = this.children.splice(i,1);
  return child[0];
}

module.exports = VNode;
