"use strict";

var login = require("facebook-chat-api");
var lisp = require("./lisp");
var Firebase = require("firebase");

var db = new Firebase(process.env.LISP_BOT_FIREBASE);
var globalScopeDB = db.child("globalScope");
var allScopesDB = db.child("allScopes");

function startBot(api, globalScope, allScopes) {
  var currentUsername;
  var currentUserId;
  var currentThreadId;
  var currentChat;
  var currentOtherUsernames;
  var currentOtherIds;
  var currentScope;

  lisp.addFunction("listen", function (utils){
    return function(args, charPos){
        utils.checkNumArgs(args, 2);
        utils.throwError("Unimplemented.", charPos);
        return utils.toLispData("deal with it.");
    };
  }, "Call with regex, then function.  Listens to all messages and calls the function when the regex is matched.");
  lisp.addFunction("send-message", function (utils){
    return function(args, charPos){
        utils.checkNumArgs(args, 2);
        if (utils.isList(args[0]) || utils.isList(args[1]))
            utils.throwError("Arguments can't be lists.", charPos);
        api.sendMessage(args[1].value, args[0].value);
        return utils.toLispData("Message sent");
    };
  }, "Call with threadid, then message");
  lisp.addFunction("thread-id", function(utils){
    return function(args, charPos) {
      return utils.toLispData(currentThreadId);
    };
  }, "Current thread id.");

  lisp.addFunction("id-list", function(utils){
    return function(args, charPos) {
      return utils.toLispData(currentOtherIds);
    };
  }, "List of ids in thread.");

  lisp.addFunction("name-list", function(utils){
    return function(args, charPos) {
      return utils.toLispData(currentOtherUsernames);
    };
  }, "List of names in thread.");

  lisp.addFunction("clear-namespace", function(utils) {
    return function(args, charPos) {
      delete globalScope[currentThreadId];
      return utils.toLispData("Namespace cleared");
    };
  }, "Will delete all user-defined values.");

  lisp.addMacro("define-with-default", function(utils) {
    return function(args, charPos) {
      utils.checkNumArgs(charPos, args, 2);
      if(args[0].type !== 'identifier') utils.throwError("First argument to define-with-default should be an identifier.", args[0]);

      if(currentScope[args[0].value]) {
        return globalScope[currentScope[args[0].value]].node;
      }

      return lisp.evaluate(utils.makeArr(charPos,
        new utils.Node("define", "identifier", charPos),
        new utils.Node(args[0].value, "identifier", charPos),
        lisp.evaluate(args[1])
      ));
    };
  }, "Will define only if that identifier isn't already defined in the scope (aka loaded from the DB).");

  // Load std-lib and bot-lib
  lisp.evaluate(lisp.parse("(load std-lib)"));
  lisp.evaluate(lisp.parse("(load bot-lib)"));

  // Main method
  var stopListening = api.listen(function(err, event) {
    if(err) return console.error(err);

    if(event.type === 'message') {
      console.log("Received ->", event);
      read(event.body, event.senderName.split(' ')[0], event.threadID, event.senderID, event.participantNames, event.participantIDs, function(msg) {
        if(!msg) return;
        if(msg.text && msg.text.length > 0) {
          console.log("Sending ->", msg, msg.text.length, event.threadID);
          api.sendMessage(msg.text, event.threadID);
        } else api.markAsRead(event.threadID);
      });
    }
  });


  // messages, username, chat id are Strings, otherUsernames is array of Strings
  function read(message, username, threadID, userId, otherUsernames, otherIds, callback) {
    // Default chat object or existing one
    // And set the global object
    //if (!currentChat.existingChat){
    //  currentChat.existingChat = true;
    //  api.sendMessage("Hey, type '/help' for some useful commands!", threadID);
    //}
    currentThreadId = threadID;
    currentUserId = userId;
    currentUsername = username;
    currentOtherUsernames = otherUsernames;
    allScopes[currentThreadId] = allScopes[currentThreadId] || {};
    currentScope = allScopes[currentThreadId];

    parseLisp(message, callback);
  }

  function parseLisp(msg, sendReply) {

    var inTxt = "";

    if ((/^\/\(.+\)$/).test(msg)){
      inTxt = msg.slice(1);
    } else if ((/^\/.+/).test(msg)){
      inTxt = "(" + msg.slice(1) + ")";
    } else if ((/^\(.+\)/).test(msg)){
      inTxt = msg;
    }

    var outTxt = "";
    if (inTxt.length > 0) {
      try {
        var AST = lisp.parse(inTxt);
        var context = {};
        var macros = {};
        var refs = {};
        Object.keys(currentScope).forEach(function(identifier) {
          var uid = currentScope[identifier];
          if(globalScope[uid].isMacro) {
            macros[identifier] = globalScope[uid].node;
          } else {
            if(globalScope[uid].node.type === 'ref') {
              refs[globalScope[uid].node.value] = globalScope[globalScope[uid].node.value].node;
            }
            context[identifier] = globalScope[uid].node;
          }
        });

        var defaultVars = lisp.evaluateWith(lisp.parse("(load bot-default-variables)"), context, macros, refs);
        var output = lisp.evaluateWith(AST, defaultVars.newContext, defaultVars.newMacros, defaultVars.newRefMapping);

        Object.keys(output.newContext).forEach(function(identifier) {
          var node = output.newContext[identifier];
          var writePermissions = [currentThreadId];
          if(globalScope[node.uuid] && globalScope[node.uuid].writePermissions) {
            writePermissions = globalScope[node.uuid].writePermissions;
          }

          globalScope[node.uuid] = {
            node: node,
            writePermissions: node.type === 'ref' ? writePermissions : null,
            isMacro: false,
          };

          currentScope[identifier] = node.uuid;
        });

        Object.keys(output.newMacros).forEach(function(identifier) {
          var node = output.newMacros[identifier];
          globalScope[node.uuid] = {
            node: node,
            isMacro: true,
          };

          currentScope[identifier] = node.uuid;
        });

        Object.keys(output.newRefMapping).forEach(function(uuid) {
          var node = output.newRefMapping[uuid];

          globalScope[node.uuid] = {
            node: node,
            isMacro: false,
          };
        });

        outTxt = lisp.prettyPrint(output.res, output.newRefMapping);
      } catch (e) {
        outTxt = e.toString();
      }

      globalScopeDB.set(globalScope);
      allScopesDB.set(allScopes);

      if (outTxt[0] == '"' && outTxt[outTxt.length-1] == '"') {
        outTxt = outTxt.substring(1,outTxt.length-1);
      }

      return sendReply({text: outTxt});
    } else {
      return null;
    }
  }
}

// Main function
db.once('value', function(snapshot) {
  var data = snapshot.val() || {};
  var config = JSON.parse(require('fs').readFileSync('config.json', 'utf8'));
  login(config, {forceLogin: true}, function(err, api) {
    if(err) return console.error(err);
    data.globalScope = data.globalScope || {};

    startBot(api, data.globalScope, data.allScopes || {});
  });
});
