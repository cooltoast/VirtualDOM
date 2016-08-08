var assert = require('assert');
var VNode = require('./VirtualNode');
var VirtualDiff = require('./VirtualDiff');
var ApplyPatches = require('./ApplyPatches');
var Patch = require('./Patch');
var _ = require('lodash');

var numberTree = VirtualDiff['numberTree'];
var diff = VirtualDiff['diff'];
var applyPatches = ApplyPatches['applyPatches'];
var buildDOMTree = ApplyPatches['buildDOMTree'];

var a,b,c,d,e,f;

describe('VirtualNode', function() {
  describe('#constructor', function() {
    it('should construct', function() {
      var v = new VNode(1,null,'div');
      assert(v.value == 1);
    });
  });
});

describe('VirtualDiff', function() {
  describe('#numberTree()', function() {
    it('should index simple trees', function() {
      a = new VNode(1, null, '');
      b = new VNode(1, null, '', 0);
      numberTree(a);
      assert(_.isEqual(a,b));
    });

    it('should index small trees', function() {
      a = new VNode(1, null, '');
      a.appendChild(new VNode(2,null, ''));
      a.appendChild(new VNode(3,null, ''));
      b = new VNode(1, null, '', 0);
      b.appendChild(new VNode(2,null, '',1));
      b.appendChild(new VNode(3,null, '',2));
      numberTree(a);
      assert(_.isEqual(a,b));
    });

    it('should index medium trees', function() {
      a = new VNode(1, null, '');
      var aChild = new VNode(2,null, '');
      aChild.appendChild(new VNode(3,null, ''));
      aChild.appendChild(new VNode(4,null, ''));
      a.appendChild(aChild);
      a.appendChild(new VNode(5,null, ''));
      a.appendChild(new VNode(6,null, ''));

      b = new VNode(1, null, '',0);
      var bChild = new VNode(2,null, '',1);
      bChild.appendChild(new VNode(3,null, '',2));
      bChild.appendChild(new VNode(4,null, '',3));
      b.appendChild(bChild);
      b.appendChild(new VNode(5,null, '',4));
      b.appendChild(new VNode(6,null, '',5));

      numberTree(a);
      assert(_.isEqual(a,b));
    });
  });

  describe('#diff()', function() {
    it('should not diff same nodeName and value', function() {
      a = new VNode(1, null,'div');
      b = new VNode(1, null,'div');
      assert(_.isEqual(diff(a,b), {}));
    });

    it('should node_replace same nodename, diff value', function() {
      a = new VNode(1, null,'div');
      b = new VNode(2, null,'div');
      assert(_.isEqual(diff(a,b), {0:[new Patch('node_replace', b)]}));
    });

    it('should node_replace diff nodename, both simpleNodename, and same value', function() {
      a = new VNode(1, null,'div');
      b = new VNode(1, null,'p');
      assert(_.isEqual(diff(a,b), {0:[new Patch('node_replace', b)]}));
    });

    it('should tree_replace diff nodename, not both simpleNodename, and same value', function() {
      a = new VNode(1, null,'div');
      b = new VNode(1, null,'table');
      assert(_.isEqual(diff(a,b), {0:[new Patch('tree_replace', b)]}));
    });

    it('should node_replace diff nodename, both simpleNodename, and diff value', function() {
      a = new VNode(1, null,'div');
      b = new VNode(2, null,'p');
      assert(_.isEqual(diff(a,b), {0:[new Patch('node_replace', b)]}));
    });

    it('should tree_replace diff nodename, not both simpleNodename, and diff value', function() {
      a = new VNode(1, null,'div');
      b = new VNode(2, null,'table');
      assert(_.isEqual(diff(a,b), {0:[new Patch('tree_replace', b)]}));
    });

    it('should find an insert', function() {
      c = new VNode(2, null);
      d = new VNode(3, null);
      e = new VNode(4, null);
      f = new VNode(5, null);
      a = new VNode(1, [c,d,e]);
      b = new VNode(1, [c,d,e,f]);
      assert(_.isEqual(diff(a,b), {0:[new Patch('insert', f)]}));
    });

    it('should find a node_replace and insertion', function() {
      c = new VNode(2, null);
      d = new VNode(3, null);
      e = new VNode(4, null);
      f = new VNode(5, null);
      a = new VNode(1, [c,d,e], 'div');
      b = new VNode(10, [c,d,e,f], 'div');
      assert(_.isEqual(diff(a,b), {0:[new Patch('node_replace', b), new Patch('insert', f)]}));
    });

    it('should find a tree_replace and insertion', function() {
      c = new VNode(2, null);
      d = new VNode(3, null);
      e = new VNode(4, null);
      f = new VNode(5, null);
      a = new VNode(1, [c,d,e], 'div');
      b = new VNode(10, [c,d,e,f], 'table');
      assert(_.isEqual(diff(a,b), {0:[new Patch('tree_replace', b)]}));
    });

    it('should find a deletion', function() {
      c = new VNode(2, null);
      d = new VNode(3, null);
      e = new VNode(4, null);
      f = new VNode(5, null);
      a = new VNode(1, [c,d,e,f]);
      b = new VNode(1, [c,d,e]);
      assert(_.isEqual(diff(a,b), {4:[new Patch('delete')]}));
    });

    it('should find multiple insertions', function() {
      c = new VNode(2, null);
      d = new VNode(3, null);
      e = new VNode(4, null);
      f = new VNode(5, null);
      a = new VNode(1);
      b = new VNode(1, [c,d,e,f]);
      assert(_.isEqual(diff(a,b), {0:[new Patch('insert', c),new Patch('insert', d),new Patch('insert', e),new Patch('insert', f)]}), "wrong answer");
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
