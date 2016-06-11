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
  Object.keys(allStackFrames).forEach(threadID => markThreadScope(allStackFrames[threadID]));
  Object.keys(allMacros).forEach(threadID => markThreadScope(allMacros[threadID]));
  globalScopeDB.set(sweep(globalScope));

  // Internal Functions
  function markThreadScope(threadScope){
    Object.keys(threadScope).forEach(k => markNode(threadScope[k]));
  }

  function markNode(uuid){
    if (!isMarked(uuid)){
      mark(uuid)
      var node = globalScope[uuid].node;
      switch (node.type){
        case 'ref':
          markNode(node.value)
          break;
        case 'function':
          markThreadScope(node.scope || {});
          markThreadScope(node.macroScope || {});
          break;
      }
    }
  }

  function sweep(globalScope){
    var ret = Object.keys(globalScope).reduce((acc, k) => {
      if (isMarked(k)){
        acc[k] = globalScope[k];
      }
      return acc;
    }, {});
    console.log("Cleaned up " + (Object.keys(globalScope).length - Object.keys(ret).length) + " objects.");
    return ret;
  }

  function mark(uuid){
    usedUuids[uuid] = null;
  }

  function isMarked(uuid){
    return usedUuids.hasOwnProperty(uuid);
  }
}


// Main function
db.once('value', function(snapshot) {
  var data = snapshot.val() || {};
  startGC(data.globalScope || {}, data.allStackFrames || {}, data.allMacros || {});
});
