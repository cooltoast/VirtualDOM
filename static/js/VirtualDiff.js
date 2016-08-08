// return t2 subtree to overwrite on t1
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
  if (t1.value != t2.value) {
    patches[t1.index] = [new Patch('replace', t2)];
  } else {
    inspectChildren(t1, t2, patches);
  }
};

function inspectChildren(t1, t2, patches) {
  var t1C = t1.numChildren();
  var t2C = t2.numChildren();
  var l = Math.max(t1C, t2C);

  if (t2C > 0) {
    for (var i = 0; i < l; ++i) {
      if (i >= t1C) { // insert remaining t2 children
        var p = new Patch('insert', t2.children[i])
        if (_.isArrayLike(patches[t1.index])) {
          patches[t1.index].push(p);
        } else {
          patches[t1.index] = [p];
        }

      } else if (i >= t2C) { // delete remaining t1 children
        var p = new Patch('delete');
        if (_.isArrayLike(patches[t1.children[i].index])) {
          patches[t1.children[i].index].push(p);
        } else {
          patches[t1.children[i].index] = [p];
        }

      } else { // compare both children
        diffHelper(t1.children[i], t2.children[i], patches);
      }
    }
  } else { // t2C == 0, delete all t1 children
    for (var i = 0; i < t1C; ++i) {
      var p = new Patch('delete');
      if (_.isArrayLike(patches[t1.children[i].index])) {
        patches[t1.children[i].index].push(p);
      } else {
        patches[t1.children[i].index] = [p];
      }
    }
  }
};

module.exports = {'numberTree':numberTree, 'diff':diff, 'Patch':Patch};
