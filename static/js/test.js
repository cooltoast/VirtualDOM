var assert = require('assert');
var VNode = require('./VirtualNode');
var {diff} = require('./VirtualDiff');
var Patch = require('./Patch');

var a, b, c, d, e, f;

describe('VirtualNode', function() {
  describe('#constructor', function() {
    it('should construct', function() {
      var v = new VNode(1, null, 'div');
      assert(v.value === 1);
    });
  });
});

describe('VirtualDiff', function() {
  describe('#diff()', function() {
    var ans;

    it('should not diff same nodeName and value', function() {
      a = new VNode(1, null, 'div');
      b = new VNode(1, null, 'div');
      assert.deepEqual(diff(a, b), {});
    });

    it('should node_replace same nodename, diff value', function() {
      a = new VNode(1, null, 'div');
      b = new VNode(2, null, 'div');
      ans = {};
      ans[a.id] = [new Patch('node_replace', b)];
      assert.deepEqual(diff(a, b), ans);
    });

    it('should node_replace diff nodename, both simpleNodename, and same value', function() {
      a = new VNode(1, null, 'div');
      b = new VNode(1, null, 'p');
      ans = {};
      ans[a.id] = [new Patch('node_replace', b)];
      assert.deepEqual(diff(a, b), ans);
    });

    it('should tree_replace diff nodename, not both simpleNodename, and same value', function() {
      a = new VNode(1, null, 'div');
      b = new VNode(1, null, 'table');
      ans = {};
      ans[a.id] = [new Patch('tree_replace', b)];
      assert.deepEqual(diff(a, b), ans);
    });

    it('should node_replace diff nodename, both simpleNodename, and diff value', function() {
      a = new VNode(1, null, 'div');
      b = new VNode(2, null, 'p');
      ans = {};
      ans[a.id] = [new Patch('node_replace', b)];
      assert.deepEqual(diff(a, b), ans);
    });

    it('should tree_replace diff nodename, not both simpleNodename, and diff value', function() {
      a = new VNode(1, null, 'div');
      b = new VNode(2, null, 'table');
      ans = {};
      ans[a.id] = [new Patch('tree_replace', b)];
      assert.deepEqual(diff(a, b), ans);
    });

    it('should find an insert', function() {
      c = new VNode(2, null);
      d = new VNode(3, null);
      e = new VNode(4, null);
      f = new VNode(5, null);
      a = new VNode(1, [c, d, e]);
      b = new VNode(1, [c, d, e, f]);
      ans = {};
      ans[a.id] = [new Patch('insert', f)];
      assert.deepEqual(diff(a, b), ans);
    });

    it('should find a node_replace and insertion', function() {
      c = new VNode(2, null);
      d = new VNode(3, null);
      e = new VNode(4, null);
      f = new VNode(5, null);
      a = new VNode(1, [c, d, e], 'div');
      b = new VNode(10, [c, d, e, f], 'div');
      ans = {};
      ans[a.id] = [new Patch('node_replace', b), new Patch('insert', f)];
      assert.deepEqual(diff(a, b), ans);
    });

    it('should find a tree_replace and insertion', function() {
      c = new VNode(2, null);
      d = new VNode(3, null);
      e = new VNode(4, null);
      f = new VNode(5, null);
      a = new VNode(1, [c, d, e], 'div');
      b = new VNode(10, [c, d, e, f], 'table');
      ans = {};
      ans[a.id] = [new Patch('tree_replace', b)];
      assert.deepEqual(diff(a, b), ans);
    });

    it('should find a deletion', function() {
      c = new VNode(2, null);
      d = new VNode(3, null);
      e = new VNode(4, null);
      f = new VNode(5, null);
      a = new VNode(1, [c, d, e, f]);
      b = new VNode(1, [c, d, e]);
      ans = {};
      ans[f.id] = [new Patch('delete')];
      assert.deepEqual(diff(a, b), ans);
    });

    it('should find multiple insertions', function() {
      c = new VNode(2, null);
      d = new VNode(3, null);
      e = new VNode(4, null);
      f = new VNode(5, null);
      a = new VNode(1);
      b = new VNode(1, [c, d, e, f]);
      ans = {};
      ans[a.id] = [c, d, e, f].map(x => new Patch('insert', x));
      assert.deepEqual(diff(a, b), ans);
    });
  });
});


/*
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
*/
