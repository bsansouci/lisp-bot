var login = require("facebook-chat-api");
var request = require("request");
var lisp = require("./lisp");

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


function startBot(api) {
  var currentUsername;
  var currentUserId;
  var currentThreadId;
  var currentChat;
  var currentOtherUsernames;
  var currentOtherIds;

  lisp.addFunction("send-message", function (utils){
    return function(args, charPos){
        utils.checkNumArgs(args, 2);
        if (utils.isList(args[0]) || utils.isList(args[1]))
            utils.throwError("Arguments can't be lists.", charPos);
        api.sendMessage(args[1].value, args[0].value);
        return utils.Node("Message sent", "string", 0, {src:""});
    };
  }, "Call with threadid, then message");
  lisp.addFunction("thread-id", function(utils){
    return function(args, charPos) {
      return utils.Node(currentThreadId, "number", charPos);
    };
  }, "Current thread id.");

  lisp.addFunction("id-list", function(utils){
    return function(args, charPos) {
      return utils.makeArr.apply(null, [charPos].concat(currentOtherIds.map(
       function(x) {return utils.Node(x, "number", charPos);})));
    };
  }, "List of ids in thread.");

  lisp.addFunction("name-list", function(utils){
    return function(args, charPos) {
      return utils.makeArr.apply(null, [charPos].concat(currentOtherUsernames.map(
       function(x) {return utils.Node(x, "string", charPos);})));
    };
  }, "List of names in thread.");


  // Main method
  api.listen(function(err, message, stopListening) {
    if(err) return console.error(err);

    console.log("Received ->", message);
    read(message.body, message.sender_name.split(' ')[0], message.thread_id, message.sender_id, message.participant_names, message.participant_ids, function(msg) {
      if(!msg) return;
      console.log("Sending ->", msg, msg.text.length, message.thread_id);
      if(msg.text && msg.text.length > 0) {
        console.log("SENT");
        api.sendMessage(msg.text, message.thread_id);
      } else api.markAsRead(message.thread_id);
    });
  });


  // messages, username, chat id are Strings, otherUsernames is array of Strings
  function read(message, username, thread_id, userId, otherUsernames, otherIds, callback) {
    // Default chat object or existing one
    // And set the global object
    //if (!currentChat.existingChat){
    //  currentChat.existingChat = true;
    //  api.sendMessage("Hey, type '/help' for some useful commands!", thread_id);
    //}
    currentThreadId = thread_id;
    currentUserId = userId;
    currentUsername = username;
    currentOtherUsernames = otherUsernames;

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
        var output = lisp.evaluate(AST);
        outTxt = lisp.prettyPrint(output);
      } catch (e) {
        outTxt = e.toString();
      }

      return sendReply({text: outTxt});
    } else {
      return null;
    }
  }
}

// Main function
login("config.json", function(err, api) {
  if(err) return console.error(err);
    startBot(api);
});
