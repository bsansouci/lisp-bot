var sys = require("sys");
var stdin = process.openStdin();
var lisp = require("./lisp");

var rest = "";
stdin.addListener("data", function(d) {
  var parens = 0;
  var str = (rest + " " +d.toString().substring(0, d.length-1)).trim();
  var arr = str.split('');

  for (var i = 0; i < arr.length; i++) {
    if(arr[i] === "(") parens++;
    if(arr[i] === ")") parens--;
  }
  if(parens < 0) throw new Error("Brackets mismatch, too many at the end.");

  if(parens > 0) {
    rest = str;
    return;
  }
  rest = "";
  str.replace("\n", " ");

  try {
    var AST = lisp.parse(str);
    var output = lisp.evaluate(AST);
    console.log(output);
  } catch (e) {
    console.log(e);
  }
});