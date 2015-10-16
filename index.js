var login = require("facebook-chat-api");
var request = require("request");
var lisp = require("./lisp");
var Firebase = require("firebase");

// Little binding to prevent heroku from complaining about port binding
var http = require('http');
http.createServer(function (req, res) {
  console.log("ping");
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end("");
}).listen(process.env.PORT || 5000);

setInterval(function() {
  http.get("http://marc-zuckerbot.herokuapp.com", function(res) {
    console.log("pong");
  });
}, 1800000 * Math.random() + 1200000); // between 20 and 50 min


var db = new Firebase(process.env.MARC_ZUCKERBOT_FIREBASE);
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
    currentScope = allScopes[currentThreadId] = allScopes[currentThreadId] || [];

    // Remove one Marc
    if(currentOtherUsernames.indexOf("Marc") !== -1) {
      currentOtherUsernames.splice(currentOtherUsernames.indexOf("Marc"), 1);
    }

    // Remove Marc from this list
    currentOtherIds = otherIds.filter(function(v) {return v !== 100009069356507;});

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
    if (inTxt.length > 0){
      try {
        var AST = lisp.parse(inTxt);
        var context = currentScope.reduce(function(acc, v) {
          acc[globalScope[v].identifier] = globalScope[v].node;
          return acc;
        }, {});

        var output = lisp.evaluateWith(AST, context);

        for (var i = currentScope.length - 1; i >= 0; i--) {
          globalScope[currentScope[i]].node = output.newContext[globalScope[currentScope[i]].identifier];
          delete output.newContext[globalScope[currentScope[i]].identifier];
        }

        for (var prop in output.newContext) {
          var newEntry = {
            identifier: prop,
            node: output.newContext[prop]
          };
          var id = genId();
          globalScope[id] = newEntry;
          currentScope.push(id);
        }

        outTxt = lisp.prettyPrint(output.res);
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

var genId;

// Main function
db.once('value', function(snapshot) {
  var data = snapshot.val() || {};
  login({
    email: process.env.FB_LOGIN_EMAIL,
    password: process.env.FB_LOGIN_PASSWORD
  }, {forceLogin: true}, function(err, api) {
    if(err) return console.error(err);
    genId = (function(counter) {
      return function() {
        return counter++;
      };
    })(Object.keys(data.globalScope || {}).length);
    startBot(api, data.globalScope || {}, data.allScopes || {});
  });
});

