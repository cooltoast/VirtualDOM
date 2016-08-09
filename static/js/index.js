var VNode = require('./VirtualNode');
var VirtualDiff = require('./VirtualDiff');
var Patch = require('./Patch');
var _ = require('lodash');

var diff = VirtualDiff['diff'];
var applyPatches = VirtualDiff['applyPatches'];
var buildDOMTree = VirtualDiff['buildDOMTree'];

function render1(count) {
  var n = new VNode('root', null,'p');

  var child;
  if (count % 3 == 1) {
    child = new VNode('heading', null,'h3');
    child.appendChild(new VNode('another heading', null,'h3'));
  } else if (count % 3 == 2) {
    child = new VNode('div', null,'div');
    child.appendChild(new VNode('another div', null,'div'));
  } else {
    child = new VNode('paragraph', null,'p');
    child.appendChild(new VNode('another paragraph', null,'p'));
  }
  n.appendChild(child);

  n.appendChild(new VNode('end', null,'p'));
  return n;
}

function render2(count) {
  var n = new VNode(count, null,'p');

  var child = new VNode('heading', null,'h3');
  child.appendChild(new VNode('another heading', null,'h3'));
  n.appendChild(child);

  var child = new VNode('div', null,'div');
  child.appendChild(new VNode('another div', null,'div'));
  n.appendChild(child);

  var child = new VNode('paragraph', null,'p');
  child.appendChild(new VNode('another paragraph', null,'p'));
  n.appendChild(child);

  n.appendChild(new VNode('end', null,'p'));
  return n;
}

function build(count) {
  return render1(count);
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

