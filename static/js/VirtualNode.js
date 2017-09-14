var uuid = require('uuid');

function VNode(value, children, nodeName) {
  this.value = value;
  this.children = children;
  this.nodeName = nodeName;
  this.id = uuid.v4();

  return this;
}

VNode.prototype.numChildren = function() {
  return (this.children == null) ? 0 : this.children.length;
};

VNode.prototype.appendChild = function(child) {
  if (this.children != null) {
    this.children.push(child);
  } else {
    this.children = [child];
  }
};

VNode.prototype.removeChild = function(child) {
  try {
    var i = this.children.indexOf(child);
  } catch (err) {
    console.log(err);
  }

  return this.children.splice(i, 1)[0];
};

VNode.prototype.isSimpleNodename = function() {
  var simpleNodenames = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  return (simpleNodenames.indexOf(this.nodeName) > -1);
};

module.exports = VNode;
