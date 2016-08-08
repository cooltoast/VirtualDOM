var VNode = require('./VirtualNode');
var VDiff = require('./VirtualDiff');
var _ = require('lodash');


var numberTree = VDiff['numberTree'];
var diff = VDiff['diff'];
var Patch = VDiff['Patch'];
var applyPatches = VDiff['applyPatches'];
var buildDOMTree = VDiff['buildDOMTree'];

function build(count) {
  var n = new VNode('root', null,'p');

  if (count % 2 == 1) {
    var child = new VNode(count, null,'h1');
    child.appendChild(new VNode(count*2, null,'h1'));
  } else {
    var child = new VNode(count, null,'p');
    child.appendChild(new VNode(count*2, null,'p'));
  }

  n.appendChild(child);
  n.appendChild(new VNode('hello', null,'p'));

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

