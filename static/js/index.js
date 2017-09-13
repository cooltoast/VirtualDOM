var VNode = require('./VirtualNode');
var {diff, applyPatches, buildDOMTree} = require('./VirtualDiff');

function render1(count) {
  var n = new VNode('root', null, 'p');

  var child;
  if (count % 3 === 1) {
    child = new VNode('heading', null, 'h3');
    child.appendChild(new VNode('another heading', null, 'h3'));
  } else if (count % 3 === 2) {
    child = new VNode('div', null, 'div');
    child.appendChild(new VNode('another div', null, 'div'));
  } else {
    child = new VNode('paragraph', null, 'p');
    child.appendChild(new VNode('another paragraph', null, 'p'));
  }
  n.appendChild(child);

  n.appendChild(new VNode('end', null, 'p'));
  return n;
}

function render2(count) {
  var n;

  if (count % 2 === 1) {
    n = new VNode(count, null, 'p');
  } else {
    n = new VNode(count, null, 'h4');
  }

  var child = new VNode('paragraph', null, 'p');
  child.appendChild(new VNode('another paragraph', null, 'p'));
  n.appendChild(child);

  n.appendChild(new VNode('end', null, 'p'));
  return n;
}

function render3(count) {
  var n = new VNode('root', null, 'p');

  for (var i = 1; i < count + 1; i++) {
    if (i % 2 === 1) {
      n.appendChild(new VNode('paragraph ' + i, null, 'h3'));
    } else {
      n.appendChild(new VNode('paragraph ' + i, null, 'p'));
    }
  }

  return n;
}

var build = render3;

var count = 0;
var vDom = build(count);
var rootNode = buildDOMTree(vDom);     // Create an initial root DOM node ...
document.body.appendChild(rootNode);    // ... and it should be in the document

setInterval(function() {
  count++;

  var newVDom = build(count);
  var patches = diff(vDom, newVDom);
  rootNode = applyPatches(rootNode, patches);
  vDom = newVDom;
}, 1000);

