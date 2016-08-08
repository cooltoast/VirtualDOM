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

module.exports = {'applyPatches':applyPatches,'buildDOMTree':buildDOMTree};
