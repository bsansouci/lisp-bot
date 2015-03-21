var sys = require("sys");
var stdin = process.openStdin();
var lisp = require("./lisp");

lisp.evaluate(lisp.parse("(load std-lib)"));

stdin.addListener("data", function(d) {
  var str = d.toString().substring(0, d.length-1).trim();

  // Added for compliance with chatbot input format
  if ((/^\/\(.+\)$/).test(str)){
    str = str.slice(1);
  } else if ((/^\/.+/).test(str)){
    str = "(" + str.slice(1) + ")";
  } else if ((/^\(.+\)/).test(str)){
    str = str;
  }

  try {
    var AST = lisp.parse(str);
    var output = lisp.evaluate(AST);
    var pretty = lisp.prettyPrint(output);
    console.log(pretty);
  } catch (e) {
    console.log(e);
  }
});
