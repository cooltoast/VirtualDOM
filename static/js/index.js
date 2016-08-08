var VNode = require('./VirtualNode');
var VDiff = require('./VirtualDiff');
var _ = require('lodash');


var numberTree = VDiff['numberTree'];
var diff = VDiff['diff'];
var Patch = VDiff['Patch'];
var applyPatches = VDiff['applyPatches'];
var buildDOMTree = VDiff['buildDOMTree'];

function build(count) {
  var n = new VNode(count, null);
  n.appendChild(new VNode(count*2, null));
  return n;
}

var count = 0;
var vDom = build(count);
var rootNode = buildDOMTree(vDom);     // Create an initial root DOM node ...
document.body.appendChild(rootNode);    // ... and it should be in the document

setInterval(function () {
  count++;

  var newVDom = build(count);
  var patches = diff(vDom, newVDom);
  rootNode = applyPatches(rootNode, patches);
  vDom = newVDom;
}, 1000)


/*
function assert(condition, message) {
  if (!condition) {
    throw message || "Assertion failed";
  }
}

var a,b,c,d,e,f;

applyPatches(document.body.children[0], {2:[new Patch('delete')]});

a = new VNode(10, null);
applyPatches(document.body.children[0], {3:[new Patch('insert', a)]});

b = new VNode(500, null);
c = new VNode(1000, null);
c.appendChild(b);
applyPatches(document.body.children[0], {2:[new Patch('replace', c)]});

var count = 0;
setInterval(function () {
    count++;
    a = new VNode(count, null);
    applyPatches(document.body.children[0], {5:[new Patch('replace', a)]});

}, 1000);


a = new VNode(1, null);
b = new VNode(2, null);
numberTree(a);
assert(_.isEqual(diff(a,b), {0:[new Patch('replace', b)]}), "wrong answer");

c = new VNode(2, null);
d = new VNode(3, null);
e = new VNode(4, null);
f = new VNode(5, null);
a = new VNode(1, [c,d,e]);
b = new VNode(1, [c,d,e,f]);
numberTree(a);
assert(_.isEqual(diff(a,b), {0:[new Patch('insert', f)]}), "wrong answer");

c = new VNode(2, null);
d = new VNode(3, null);
e = new VNode(4, null);
f = new VNode(5, null);
a = new VNode(1, [c,d,e]);
b = new VNode(10, [c,d,e,f]);
numberTree(a);
assert(_.isEqual(diff(a,b), {0:[new Patch('replace', b)]}), "wrong answer");

c = new VNode(2, null);
d = new VNode(3, null);
e = new VNode(4, null);
f = new VNode(5, null);
a = new VNode(1, [c,d,e]);
b = new VNode(1, [c,d,e,f]);
numberTree(a);
assert(_.isEqual(diff(a,b), {0:[new Patch('insert', f)]}), "wrong answer");

c = new VNode(2, null);
d = new VNode(3, null);
e = new VNode(4, null);
f = new VNode(5, null);
a = new VNode(1);
b = new VNode(1, [c,d,e,f]);
numberTree(a);
assert(_.isEqual(diff(a,b), {0:[new Patch('insert', c),new Patch('insert', d),new Patch('insert', e),new Patch('insert', f)]}), "wrong answer");



a = new VNode(1, null);
b = new VNode(1, null, 0);
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
*/
