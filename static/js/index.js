var VNode = require('./VirtualNode');
var numberTree = require('./VirtualDiff');
var _ = require('lodash');

function assert(condition, message) {
  if (!condition) {
    throw message || "Assertion failed";
  }
}

var a = new VNode(1, []);
var b = new VNode(1, [], 0);
numberTree(a);
assert(_.isEqual(a,b));

a = new VNode(1, null);
a.appendChild(new VNode(2,null));
a.appendChild(new VNode(3,null));
b = new VNode(1, null, 0);
b.appendChild(new VNode(2,null,1));
b.appendChild(new VNode(3,null,2));
numberTree(a);
assert(_.isEqual(a,b));


a = new VNode(1, null);
var aChild = new VNode(2,null);
aChild.appendChild(new VNode(3,null));
a.appendChild(aChild);
aChild = new VNode(4,null);
aChild.appendChild(new VNode(5,null));
a.appendChild(aChild);

b = new VNode(1, null, 0);
var bChild = new VNode(2,null, 1);
bChild.appendChild(new VNode(3,null, 2));
b.appendChild(bChild);
bChild = new VNode(4,null, 3);
bChild.appendChild(new VNode(5,null,4));
b.appendChild(bChild);

numberTree(a);
assert(_.isEqual(a,b));
