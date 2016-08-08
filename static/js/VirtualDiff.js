// return n2 subtree to overwrite on n1
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


function diff(n1, n2, patch, index) {
  if (n1 != null && n2 == null) {
    patch[index] = ['insert', n2];
  }

  if (n1 == null && n2 != null) {
    patch[index] = ['remove']; //make patch object
  }

  if (n1.value != n2.value) {
    patch[index] = ['replace',n2.value];
  } else {
    inspectChildren(n1, n2, patch, index);
  }
};

function inspectChildren(n1, n2, patch, index) {
  var n1C = n1.children.length;
  var n2C = n2.children.length;
  var l = Math.max(n1C, n2C);

  for (var i = 0; i < l; ++i) {
    ++index;

    // n1 less children than n2, add new
    if (i >= n1C) {
      patch[index] = ['remove']; 
    }

    else {
      diff(n1.chidren[i], n2.children[i], patch, index);
    }
  }

  return index;
};

module.exports = numberTree;
