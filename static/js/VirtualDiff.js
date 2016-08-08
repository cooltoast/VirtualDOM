// return t2 subtree to overwrite on t1
// actions: "delete", "insert", "node_replace", "tree_replace"
function Patch(action, node) {
  this.action = action;
  this.node = node;
  return this;
}

function numberTree(t) {
  numberTreeHelper(t, 0);
};

function numberTreeHelper(t, index) {
  if (t == null) {
    return index;
  }

  t.index = index;
  if (t.children != null) {
    for (var i = 0; i < t.children.length; ++i) {
      index = numberTreeHelper(t.children[i], index + 1);
    }
  }
  return index;
};

function diff(t1, t2) {
  validateTree(t1);
  validateTree(t2);
  numberTree(t1);
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
      appendPatch(patches, p, t1.index);
    }
  } else { // ((t1.nodeName != t2.nodeName))
    if (t1.isSimpleNodename() && t2.isSimpleNodename()) {
      p = new Patch('node_replace', t2);
      appendPatch(patches, p, t1.index);
    } else {
      p = new Patch('tree_replace', t2);
      appendPatch(patches, p, t1.index);
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
      appendPatch(patches, p, t1.index);

    } else { // (i >= t2C) delete remaining t1 children
      p = new Patch('delete');
      appendPatch(patches, p, t1.children[i].index);
    }
  }
};

function appendPatch(patches, patch, index) {
  if (_.isArrayLike(patches[index])) {
    patches[index].push(patch);
  } else {
    patches[index] = [patch];
  }
  return;
}

function mapDOM(root, index, DOMmap, patchIndices) {
  if (root == null) {
    return index;
  }

  if (patchIndices.indexOf(index) > -1) {
    DOMmap[index] = root;
  }
  if (root.children != null) {
    for (var i = 0; i < root.children.length; ++i) {
      index = mapDOM(root.children[i], index + 1, DOMmap, patchIndices);
    }
  }
  return index;
};

function buildDOMTree(t) {
  if (t.value == null) {
    return null;
  }

  var dom = createDOMNode(t);

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

function applyPatch(dom, patch) {
  var result = null;

  for (var i in patch) {
    var p = patch[i];
    switch(p.action) {
      case "delete":
        result = dom.parentNode;
        result.removeChild(dom);
        break;
      case "node_replace":
        var newDom = createDOMNode(p.node);
        //append children to newdom node and replace
        while(dom.children.length > 0) {
          newDom.appendChild(dom.children[0]);
        }
        dom.parentNode.replaceChild(newDom, dom);
        result = newDom
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
    }
  }

  return result;
};

function getPatchIndices(patches) {
  var patchIndices = [];
  for (var key in patches) {
    if (patches.hasOwnProperty(key)) {
      patchIndices.push(parseInt(key));
    }
  }

  return patchIndices;
}


function applyPatches(root, patches) {
  var patchIndices = getPatchIndices(patches);

  var DOMmap = {}
  mapDOM(root, 0, DOMmap, patchIndices);

  var newRoot = null;
  for (var index in DOMmap) {
    if (DOMmap.hasOwnProperty(index)) {
      // keep track if root is modified
      if (index == 0) {
        newRoot = applyPatch(DOMmap[index], patches[index]);
      } else {
        applyPatch(DOMmap[index], patches[index]);
      }
    }
  }

  // return new root if root was modified
  return (newRoot != null) ? newRoot : root;
};

module.exports = {'numberTree':numberTree, 'diff':diff, 'Patch':Patch,'applyPatches':applyPatches,'buildDOMTree':buildDOMTree};
