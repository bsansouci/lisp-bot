"use strict";

var login = require("facebook-chat-api");
var lisp = require("./lisp");
var Firebase = require("firebase");

var db = new Firebase(process.env.LISP_BOT_FIREBASE);
var globalScopeDB = db.child("globalScope");
var allStackFramesDB = db.child("allStackFrames");
var allMacrosDB = db.child("allMacros");

function startGC(globalScope, allStackFrames, allMacros) {
  var usedUuids = {}
  allStackFrames.forEach(markThreadScope);
  allMacros.forEach(markThreadScope);
  globalScopeDB.set(sweep(globalScope));

  // Internal Functions
  function markThreadScope(threadScope){
    Object.keys(threadScope).forEach((k) => markNode(threadScope[k]);
  }

  function markNode(uuid){
    if (!isMarked(uuid)){
      mark(uuid)
      var node = globalScope[uuid].node;
      switch (astNode.type){
        case 'ref':
          markNode(node.value)
          break;
        case 'function':
          markThreadScope(node.scope);
          markThreadScope(node.macroScope);
          break;
      }
    }
  }

  function sweep(globalScope){
    return Object.keys(globalScope).reduce((acc, k) => {
      if (usedUuids.hasOwnProperty(k)){
        acc[k] = globalScope[k];
      }
    }, {});
  }

  function mark(uuid){
    usedUuids[uuid] = null;
  }

  function isMarked(uuid){
    usedUuids.hasOwnProperty(uuid);
  }
}


// Main function
db.once('value', function(snapshot) {
  var data = snapshot.val() || {};
  startGC(data.globalScope || {}, data.allStackFrames || {}, data.allMacros || {});
});
