function List(value, type, charPos) {
  var next = null;
  var prev = null;

  this.value = value;
  this.type = type;
  this.charPos = charPos;

  return this;
}

function addAfter(list, node) {
  if(!list) return node;
  if(!node) return list;

  if(list.next) {
    node.next = list.next;
    node.next.prev = node;
  }
  list.next = node;
  node.prev = list;

  return list;
}

function remove(node) {
  if(!node) return null;

  if(node.next) node.next.prev = node.prev;
  if(node.prev) node.prev.next = node.next;

  return node;
}

function removeAt(list, i) {
  return remove(get(list, i));
}

function getLength(list) {
  if(!list) return 0;

  for(var i = 1;list = list.next;i++);
  return i;
}

function get(list, i) {
  for(var cur = list;cur && i--;cur = cur.next);
  return cur;
}

function getLast(list) {
  if(!list) return null;
  for(var cur = list; cur.next; cur = cur.next);
  return cur;
}

function push(list, node) {
  var r = addAfter(getLast(list), node);
  return list ? list : r;
}

function clone(node) {
  var n = new List(node.value, node.type, node.charPos);
  // n.next = node.next;
  // n.prev = node.prev;
  return n;
}

// this.addBefore = function(node) {
//     if(!node) return;

//     prev.next = node;
//     node.prev = prev;
//     node.next = this;

//     return this;
//   }.bind(this);

module.exports = {
  List: List,
  get: get,
  clone: clone,
  push: push,
  addAfter: addAfter,
  getLast: getLast,
  // addBefore: addBefore,
  remove: remove,
  getLength:getLength,
  removeAt: removeAt
};