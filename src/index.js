"use strict";

var login = require("facebook-chat-api");
var lisp = require("./lisp");
var Firebase = require("firebase");
var RJSON = require("rjson");

var config = JSON.parse(require('fs').readFileSync('config.json', 'utf8'));

var db = new Firebase(config.firebase);
var globalScopeDB = db.child("globalScope");
var allStackFramesDB = db.child("allStackFrames");
var allRuleListsDB = db.child("allRuleLists");

function startBot(api, globalScope, allStackFrames, allRuleLists) {
  var currentUserId;
  var currentThreadId;
  var currentChat;
  var currentOtherUsernames;
  var currentOtherIds;
  var currentStackFrame;
  var currentRuleList;

  // Loaded globally
  lisp.evaluate(lisp.parse("(load parser)"));

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
      delete allStackFrames[currentThreadId];
      return utils.toLispData("Namespace cleared");
    };
  }, "Will delete all user-defined values.");

  // lisp.addMacro("define-with-default", function(utils) {
  //   return function(args, charPos) {
  //     utils.checkNumArgs(charPos, args, 2);
  //     if(args[0].type !== 'identifier') utils.throwError("First argument to define-with-default should be an identifier.", args[0]);
  //
  //     if(currentStackFrame[args[0].value]) {
  //       return globalScope[currentStackFrame[args[0].value]].node;
  //     }
  //
  //     return lisp.evaluate(utils.makeArr(charPos,
  //       new utils.Node("define", "identifier", charPos),
  //       new utils.Node(args[0].value, "identifier", charPos),
  //       lisp.evaluate(args[1])
  //     ));
  //   };
  // }, "Will define only if that identifier isn't already defined in the scope (aka loaded from the DB).");

  // Main method
  var stopListening = api.listen(function(err, event) {
    if(err) return console.error(err);

    if(event.type === 'message') {
      console.log("Received ->", event);
      read(event.body, event.threadID, event.senderID, event.participantNames, event.participantIDs, function(msg) {
        if(!msg) return;
        if(msg.text && msg.text.length > 0) {
          console.log("Sending ->", msg, msg.text.length, event.threadID);
          api.sendMessage("```scheme\n" + msg.text + "\n```", event.threadID);
        } else api.markAsRead(event.threadID);
      });
    }
  });


  // messages, chat id are Strings, otherUsernames is array of Strings
  function read(message, threadID, userId, otherUsernames, otherIds, callback) {
    // Default chat object or existing one
    // And set the global object
    //if (!currentChat.existingChat){
    //  currentChat.existingChat = true;
    //  api.sendMessage("Hey, type '/help' for some useful commands!", threadID);
    //}
    currentThreadId = threadID;
    currentUserId = userId;
    currentOtherUsernames = otherUsernames;

    var newThread = !allStackFrames[currentThreadId] || allStackFrames[currentThreadId].length == 0;

    allStackFrames[currentThreadId] = allStackFrames[currentThreadId] || {};
    currentStackFrame = allStackFrames[currentThreadId];

    if (allRuleLists[currentThreadId] != null) {
      currentRuleList = allRuleLists[currentThreadId] === "{}" ? {} : RJSON.unpack(JSON.parse(allRuleLists[currentThreadId]));
    } else {
      allRuleLists[currentThreadId] = {};
    }

    parseLisp(message, callback, newThread);
  }

  function parseLisp(msg, sendReply, newThread) {

    var inTxt = "";

    if ((/^\/[\S\s]+/m).test(msg)){
      inTxt = "(" + msg.slice(1) + ")";
    } else if ((/^\([\S\s]+\)/m).test(msg)){
      inTxt = msg;
    }

    var outTxt = "";
    if (inTxt.length > 0) {
      try {
        var availableNodes = {};
        Object.keys(globalScope).forEach(function(uuid) {
          availableNodes[uuid] = globalScope[uuid].node;
        });

        var output;
        var context = {
          stackFrame: currentStackFrame,
          uuidToNodeMap: availableNodes,
          ruleList: currentRuleList,
        };

        if (newThread) {
          var defaultVars = lisp.parseAndEvaluateWith("(load std-lib)", context);
          defaultVars = lisp.parseAndEvaluateWith("(load bot-lib)", defaultVars);
          output = lisp.parseAndEvaluateWith(inTxt, defaultVars);
        } else {
          output = lisp.parseAndEvaluateWith(inTxt, context);
        }

        outTxt = lisp.prettyPrint(output.res, output.uuidToNodeMap);

        if (outTxt.length > 0) {
          if (outTxt[0] == '"' && outTxt[outTxt.length-1] == '"') {
            outTxt = outTxt.substring(1,outTxt.length-1);
          }
          sendReply({text: outTxt});
        }
      } catch (e) {
        outTxt = e.toString();
        sendReply({text: outTxt});
      }

      try {
        Object.keys(output.stackFrame).forEach(function(identifier) {
          var uuid = output.stackFrame[identifier];
          var node = output.uuidToNodeMap[uuid];

          currentStackFrame[identifier] = uuid;
        });

        Object.keys(output.uuidToNodeMap).forEach(function(uuid) {
          var node = output.uuidToNodeMap[uuid];

          var writePermissions = [currentThreadId];
          if(globalScope[uuid] && globalScope[uuid].writePermissions) {
            writePermissions = globalScope[uuid].writePermissions;
          }

          globalScope[uuid] = {
            node: typeof node !== 'string' ? JSON.stringify(RJSON.pack(node)) : node,
            writePermissions: node.type === 'ref' ? writePermissions : null,
          };
        });

        // Update allRuleLists with the new one
        allRuleLists[currentThreadId] = JSON.stringify(RJSON.pack(output.ruleList));
        globalScopeDB.set(globalScope);
        allStackFramesDB.set(allStackFrames);
        allRuleListsDB.set(allRuleLists);

      } catch (e) {
        console.error('Error during data persist: `'+e+'`');
      }
    }
  }
}

function replaceUndefinedList(node){
  switch(node.type){
    case 'list':
      node.value = node.value || [];
      node.value.forEach(n => replaceUndefinedList(n));
      break;
    case 'function':
      node.argNames = node.argNames || [];
      node.scope = node.scope || {};
      break;
  }
}

// Main function
db.once('value', function(snapshot) {
  var data = snapshot.val() || {};
  login(config, {forceLogin: true}, function(err, api) {
    if(err) return console.error(err);
    if (data.globalScope) {
      Object.keys(data.globalScope).forEach(k => replaceUndefinedList(data.globalScope[k]));
    }
    startBot(api, data.globalScope || {}, data.allStackFrames || {}, data.allRuleLists || {});
  });
});
