var Patch = require('./Patch');

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

module.exports = {'numberTree':numberTree, 'diff':diff};
