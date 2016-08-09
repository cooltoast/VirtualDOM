var Patch = require('./Patch');

var DOMmap = {};

function diff(t1, t2) {
  validateTree(t1);
  validateTree(t2);
  var patches = {};
  diffHelper(t1, t2, patches);
  return patches;
}

function validateTree(t) {
  if (t == null || t.value == null) {
    throw "cannot have null tree";
  }
}

function diffHelper(t1, t2, patches) {
  var p;

  if (t1.nodeName == t2.nodeName) {
    if (t1.value != t2.value) {
      p = new Patch('node_replace', t2);
      appendPatch(patches, p, t1);
    } else {
      // retain same node id
      t2.id = t1.id;
    }
  } else { // ((t1.nodeName != t2.nodeName))
    if (t1.isSimpleNodename() && t2.isSimpleNodename()) {
      p = new Patch('node_replace', t2);
      appendPatch(patches, p, t1);
    } else {
      p = new Patch('tree_replace', t2);
      appendPatch(patches, p, t1);
      return;
    }
  }

  inspectChildren(t1, t2, patches);
};

function inspectChildren(t1, t2, patches) {
  var t1C = t1.numChildren();
  var t2C = t2.numChildren();
  var l = Math.max(t1C, t2C);
  var p;

  for (var i = 0; i < l; ++i) {
    if (i < t1C && i < t2C) { // compare both children
      diffHelper(t1.children[i], t2.children[i], patches);

    } else if (i >= t1C) { // insert remaining t2 children
      p = new Patch('insert', t2.children[i])
      appendPatch(patches, p, t1);

    } else { // (i >= t2C) delete remaining t1 children
      p = new Patch('delete');
      appendPatch(patches, p, t1.children[i]);
    }
  }
};

function appendPatch(patches, patch, vNode) {
  if (_.isArrayLike(patches[vNode.id])) {
    patches[vNode.id].push(patch);
  } else {
    patches[vNode.id] = [patch];
  }
  return;
}


function buildDOMTree(t) {
  if (t.value == null) {
    return null;
  }

  var dom = createDOMNode(t);
  DOMmap[t.id] = dom;

  for (var i = 0; i < t.numChildren(); i++) {
    var child = buildDOMTree(t.children[i]);
    if (child != null) {
      dom.appendChild(child);
    }
  }

  return dom;
}

function createDOMNode(vNode) {
  var dom = document.createElement(vNode.nodeName.toLowerCase());
  dom.innerText = vNode.value;
  return dom;
}

function applyPatch(vNodeId, patch) {
  var result = null;
  var dom = DOMmap[vNodeId];

  for (var i in patch) {
    var p = patch[i];
    switch(p.action) {
      case "delete":
        result = dom.parentNode;
        result.removeChild(dom);
        delete DOMmap[vNodeId];
        break;
      case "node_replace":
        var newDom = createDOMNode(p.node);
        //append children to newdom node and replace
        while(dom.children.length > 0) {
          newDom.appendChild(dom.children[0]);
        }
        dom.parentNode.replaceChild(newDom, dom);
        result = newDom;
        delete DOMmap[vNodeId];
        DOMmap[p.node.id] = newDom;
        break;
      case "tree_replace":
        var newDom = buildDOMTree(p.node);
        dom.parentNode.replaceChild(newDom, dom);
        result = newDom
        break;
      case "insert":
        var newDom = buildDOMTree(p.node);
        dom.appendChild(newDom);
        result = dom;
        //DOMmap[p.node] = newDom;
    }
  }

  return result;
};

function applyPatches(root, patches) {
  var newRoot = null;
  for (var id in patches) {
    if (patches.hasOwnProperty(id)) {
      if (DOMmap[id] == root) {
        newRoot = applyPatch(id, patches[id]);
      } else {
        applyPatch(id, patches[id]);
      }
    }
  }

  // return new root if root was modified
  return (newRoot != null) ? newRoot : root;
};

module.exports = {'diff':diff, 'applyPatches':applyPatches,'buildDOMTree':buildDOMTree};
