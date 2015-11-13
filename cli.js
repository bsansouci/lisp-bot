var stdin = process.openStdin();
var lisp = require("./lisp");

lisp.evaluate(lisp.parse("(load std-lib)"));
lisp.evaluate(lisp.parse("(load polyfill)"));
lisp.evaluate(lisp.parse("(load bot-lib)"));
lisp.evaluate(lisp.parse("(load tests)"));
console.log(lisp.evaluate(lisp.parse("(test-print false)")).value);
console.log("--------------");

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
