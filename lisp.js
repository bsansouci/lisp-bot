/*jslint node: true */
"use strict";
var fs = require("fs");

var sourceString = "";
function parse(str) {
  sourceString = str;
  return parseHelper(str, 0);
}

function parseHelper(str, charPos) {
  if(str.charAt(0) === "'") return makeArr(charPos, new Node("quote", "identifier", charPos), parseHelper(str.substring(1), charPos + 1));

  if(str.charAt(0) === "`") return makeArr(charPos, new Node("syntax-quote", "identifier", charPos), parseHelper(str.substring(1), charPos + 1));

  if(str.charAt(0) === "~" && str.charAt(1) === "@") return makeArr(charPos, new Node("unquote-splice", "identifier", charPos), parseHelper(str.substring(2), charPos + 2));

  if(str.charAt(0) === "~") return makeArr(charPos, new Node("unquote", "identifier", charPos), parseHelper(str.substring(1), charPos + 1));

  var rightParen = str.charAt(str.length - 1) === ")";
  var leftParen = str.charAt(0) === "(";

  if(!leftParen && rightParen) throw new Error("First char isn't an open paren. str: " + str);
  if(!rightParen && leftParen) throw new Error("Last char isn't a close paren. str: " + str);

  if(!rightParen && !leftParen) {
    // Number
    if(!isNaN(str)) {
      return new Node(parseFloat(str), "number", charPos);
    }

    // Bool
    if(str === "false" || str === "true") {
      return new Node(str === "true", "boolean", charPos);
    }

    // Strings
    if(str.charAt(0) === "\"" && str.charAt(str.length - 1) === "\"") {
      return new Node(str.substring(1, str.length - 1), "string", charPos);
    }

    return new Node(str, "identifier", charPos);
  }

  str = str.substring(1, str.length - 1);
  var list = makeArr(charPos);
  var arr = str.split('');
  var matchingParen = 0;
  var insideString = false;
  var tmpString = "";
  for (var i = 0; i < str.length; i++) {
    if(arr[i] === "\"") insideString = !insideString;
    if(arr[i] === "(") matchingParen++;
    if(arr[i] === ")") matchingParen--;
    if(arr[i] === " " && !insideString && matchingParen === 0 && tmpString.length !== 0) {
      list.push(parseHelper(tmpString.trim(), 2 + charPos + i - tmpString.length));
      tmpString = "";
    }

    tmpString += arr[i];
  }
  if(tmpString.length !== 0) {
    list.push(parseHelper(tmpString.trim(), 2 + charPos + str.length - tmpString.length));
  }

  return list;
}

function evaluate(ast) {
  if(!isList(ast)) {
    if(ast.type !== "identifier") {
      return ast;
    }
    var maybeLocal = getLocal(localStack, ast.value);
    if(maybeLocal) return maybeLocal;
    if(symbolTable.hasOwnProperty(ast.value)) return new Node(symbolTable[ast.value], "function", ast.charPos);

    return throwError("Undeclared identifier " + ast.value, ast);
  }
  if(ast.length === 0) return ast;

  var maybeMacro = macroTable[ast[0].value];
  if(maybeMacro) {
    return maybeMacro(makeArr.apply(null, [ast[0].charPos].concat(ast.slice(1))), ast[0].charPos);
  }

  var maybeLocalMacro = getLocal(macroStack, ast[0].value);
  if(maybeLocalMacro) {
    return maybeLocalMacro.value(makeArr.apply(null, [ast[0].charPos].concat(ast.slice(1))));
  }
  var evaledAST = ast.map(evaluate);

  var func = evaledAST[0];
  if(func.type !== "function") return throwError("Identifier '" + ast[0].value + "' isn't a function.", ast[0]);

  return func.value(makeArr.apply(null, [ast[0].charPos].concat(evaledAST.slice(1))), ast[0].charPos);
}

function getLocal(stack, name) {
  for (var i = stack.length - 1; i >= 0; i--) {
    if(stack[i].hasOwnProperty(name)) return stack[i][name];
  }

  return null;
}

function isList(a) {
  return a instanceof Array;
}

function Node(value, type, charPos, extras) {
  var node = {
    src: sourceString,
    value: value,
    type: type,
    charPos: charPos
  };
  if(typeof value === "function") node.value = value.bind(node);

  if(extras) return merge(node, extras);

  return node;
}

function makeArr(charPos) {
  var arr = Array.prototype.slice.call(arguments, 1);
  arr.charPos = charPos;
  arr.src = sourceString;
  return arr;
}

function merge(obj1, obj2) {
  var ret = {};
  for(var prop in obj1) {
    if(obj1.hasOwnProperty(prop)) ret[prop] = obj1[prop];
  }
  for(var prop2 in obj2) {
    if(obj2.hasOwnProperty(prop2)) ret[prop2] = obj2[prop2];
  }

  return ret;
}

function prettyPrint(node) {
  if (typeof node === "undefined") return "undefined";
  if(!isList(node)) {
    switch(node.type) {
      case "identifier":
      case "boolean":
      case "number":
        return node.value.toString();
      case "function":
        return "[Function]";
      case "string":
        return "\"" + node.value + "\"";
      default:
        throw new Error("Cannot prettyPrint node: `"+ JSON.stringify(node) + "`, type:" + typeof node);
    }
  }

  return node.reduce(function(acc, v, i) {
    return acc + prettyPrint(v) + (i !== node.length - 1 ? " " : "");
  }, "(") + ")";
}

function throwError(str, node) {
  var charPos, src;
  if(typeof node === "number") { // We passed a charpos directly
    charPos = node;
    src = sourceString;
  } else {
    charPos = node.charPos;
    src = node.src;
  }

  if (charPos == -1 || !charPos){
    throw new Error("Error : " + str);
  } else {
    throw new Error("Error @ char " + charPos + ": " + str + "\nIn region: `"+src.substring(Math.max(0, charPos - 60), charPos) + ">>" + src.substring(charPos, Math.min(src.length, charPos + 25)) + "`");
  }

}

function checkNumArgs(args, num) {
  if(args.length !== num) throw new Error("Improper number of arguments. Expected: " + num + ", got: " + args.length);
}

var localStack = [{}];
var macroStack = [{}];

var macroTable = {
  "docs": function(args, charPos) {
    if(args.length !== 1) throw new Error("Wrong number of arguments. Please give only one argument");
    if (symbolTable[args[0].value] && symbolTable[args[0].value].docs)
      return new Node(symbolTable[args[0].value].docs, "string", args[0].charPos);
    else if (symbolTable[args[0].value]){
      return new Node("Built-in function.", "string", args[0].charPos);
    }
    var maybeMacro = getLocal(macroStack, args[0].value);
    if(maybeMacro) return new Node(maybeMacro.docs, "string", args[0].charPos);

    var maybeFunc = getLocal(localStack, args[0].value);
    if(maybeFunc) return new Node(maybeFunc.docs, "string", args[0].charPos);

    throw new Error("Undefined identifier '"+args[0].value+"'.");
  },
  "define": function(args, charPos) {
    var name = args[0];
    if(name.type !== "identifier") {
      return throwError("First argument to define isn't an identifier", name);
    }

    if(symbolTable.hasOwnProperty(name.value) || macroTable.hasOwnProperty(name.value)) throwError("Reserved, can't redefine " + name.value, name);

    var body = args[1];
    var docs = "No docs";
    // Adding optional comments when defining functions
    if(body.type === "string" && args.length > 2) {
      docs = body.value;
      body = args[2];
    }

    var res = evaluate(body);
    // Attach the docs to the object inside the localstack
    res.docs = docs;

    localStack[localStack.length - 1][name.value] = res;
    return res;
  },
  "lambda": function(args, charPos) {
    var params = args[0];
    if(!isList(params)) throwError("Params should be a list of arguments.", params);

    for (var i = 0; i < params.length; i++) {
      if(isList(params[i])) throwError("Params can't be lists.", params[i]);
    }

    var body = args[1];

    var variadicArgs = params.length > 1 && params[params.length - 1].value === "...";
    return new Node(function(arr) {
      if((!variadicArgs && arr.length !== params.length) || (variadicArgs && arr.length < params.length - 2)) throw new Error("Improper number of arguments. Expected: " + (variadicArgs ? params.length - 2 : params.length) + ", got: " + arr.length);

      var map = {};
      for (var i = 0; i < params.length; i++) {
        map[params[i].value] = arr[i] ? arr[i] : makeArr(charPos);
      }
      if(variadicArgs) {
        map[params[params.length - 2].value] = makeArr.apply(null, [charPos].concat(arr.slice(params.length - 2)));
        delete map["..."];
      }

      // create a new scope for that function
      localStack.push(map);
      macroStack.push({});
      if(localStack.length > 1024) return throwError("Stack overflow > 1024", this);
      var res = evaluate(body);
      localStack.pop();
      macroStack.pop();
      return res;
    }, "function", params.charPos);
  },
  "quote": function(args, charPos) {
    return args[0];
  },
  "unquote": function(args, charPos) {
    if(args.length === 0) throwError("The macro unquote takes one argument.", args);

    return evaluate(args[0]);
  },
  "define-macro": function(args, charPos) {
    var name = args[0];
    var body = args[1];

    var docs = "No docs";

    // Adding optional comments when defining functions
    if(body.type === "string" && args.length > 2) {
      docs = body.value;
      body = args[2];
    }

    var f = macroTable.lambda(body.slice(1));

    // Attach the docs to the object inside the localstack using the
    // extras param in new Node constructor
    macroStack[macroStack.length - 1][name.value] = new Node(function(arg) {
      return evaluate(f.value(arg));
    }, "function", name.charPos, {docs: docs});

    return macroStack[macroStack.length - 1][name.value];
  },
  "syntax-quote": function(args, charPos) {
    var traverse = function(node) {
      if(!isList(node)) return node;

      if(node.length > 0 && node[0].value === "unquote") {
        return evaluate(node[1]);
      }

      var newTree = makeArr(charPos);
      for (var i = 0; i < node.length; i++) {
        if(isList(node[i]) && node[i].length > 0 && node[i][0].value === "unquote-splice") {
          newTree = newTree.concat(evaluate(node[i][1]));
        } else newTree.push(traverse(node[i]));
      }

      return newTree;
    };
    return traverse(args[0]);
  },
  "if": function(args, charPos) {
    if(args.length < 2) throwError("Too few arguments to if.", args);

    var bool = evaluate(args[0]);
    if(bool.type !== "boolean") throw new Error("If first argument has to evaluate to a boolean, not a '"+bool.type+"'"+bool.value);
    if(bool.value) {
      return evaluate(args[1]);
    }
    return evaluate(args[2]);
  },
  "load": function(args, charPos) {
    var name = args[0].value;
    var data = fs.readFileSync(name + ".bot", 'utf8').toString();
    console.log("Loading", name);
    var arr = data.split('\n');
    var rest = "";
    for (var i = 0; i < arr.length; i++) {
      var s = (rest + " " + arr[i]).trim();
      var arr2 = s.split('');
      var parens = 0;
      for (var j = 0; j < arr2.length; j++) {
        if(arr2[j] === '(') parens++;
        if(arr2[j] === ')') parens--;
      }
      if(parens < 0) throw new Error("Brackets mismatch, too many closing brackets.");

      if(parens > 0) {
        rest = s;
        continue;
      }
      rest = "";
      s = s.replace(/\n|\s+/g, " ");
      if(s.length === 0) continue;

      try {
        evaluate(parse(s));
      } catch (e) {
        console.log(e);
      }
    }
    console.log("--------------------");
    return [];
  }
};

var symbolTable = {
  "+": function(args, charPos) {
    if(args.length === 0) return [];

    return new Node(args.reduce(function(acc, v) {
      if(isList(v)) throwError("Cannot add lists. + only accepts numbers.", v);
      return acc + v.value;
    }, 0), args[0].type, charPos);
  },
  "-": function(args, charPos) {
    if(args.length === 0) return makeArr(charPos);
    if(args.length === 1) return new Node(-args[0].value, "number", args[0].charPos);

    return new Node(args.slice(1).reduce(function(acc, v) {
      if(isList(v)) throwError("Cannot subtract lists. - only accepts numbers.", v);
      return acc - v.value;
    }, args[0].value), args[0].type, charPos);
  },
  "*": function(args, charPos) {
    if(args.length === 0) return makeArr(charPos);

    return new Node(args.reduce(function(acc, v) {
      if(isList(v)) throwError("Cannot multiply lists. * only accepts numbers.", v);
      return acc * v.value;
    }, 1), args[0].type, charPos);
  },
  "/": function(args, charPos) {
    if(args.length === 0) return makeArr(charPos);
    if(args.length === 1) return args[0];

    return new Node(args.slice(1).reduce(function(acc, v) {
      if(isList(v)) throwError("Cannot divide lists. / only accepts numbers.", v);
      return acc / v.value;
    }, args[0].value), args[0].type, charPos);
  },
  "cdr": function(args, charPos) {
    checkNumArgs(args, 1);

    var rest = args[0];
    if(!isList(rest)) throwError("cdr expects a list as unique argument.", rest);
    return rest.slice(1);
  },
  "car": function(args, charPos) {
    checkNumArgs(args, 1);

    var rest = args[0];
    if(!isList(rest)) throwError("car expects a list as unique argument.", rest);
    if(rest.length < 1) throwError("Car not defined on empty lists", rest);
    return rest[0];
  },
  "cons": function(args, charPos) {
    checkNumArgs(args, 2);

    var el = args[0];
    var arr = args[1];

    if(!isList(arr)) arr = [arr];

    return makeArr.apply(null, [charPos, el].concat(arr));
  },
  "apply": function(args, charPos) {
    checkNumArgs(args, 2);

    var func = args[0];
    var arr = args[1];
    if(!isList(arr)) throw new Error("Second argument should be a list.");
    if(typeof func !== "function") throw new Error("First argument should be a function.");

    return func(arr);
  },
  "equal?" : function(args, charPos) {
    if (args.length < 2) throwError("equal? takes two arguments. You gave " + args.length, args);
    for (var i = 1; i < args.length; i++){

      if (!areStructurallyEqual(args[i], args[0])) return new Node(false, "boolean", -2);
    }
    return new Node(true, "boolean", args);
  },
  "debug": function(args, charPos){
    checkNumArgs(args, 2);
    console.log("Debug: " + prettyPrint(args[0]));
    return args[1];
  },
  "split": function(args, charPos) {
    checkNumArgs(args, 2);
    if(args[0].type !== "string") throwError("First argument should be a string", args[0]);
    if(args[1].type !== "string") throwError("Second argument should be a string", args[1]);
    return makeArr.apply(null, [args[0].charPos].concat(args[0].value.split(new RegExp(args[1].value)).map(function(x, i) {return new Node(x, "string", charPos + i);})));
  },
  "join": function(args, charPos) {
    checkNumArgs(args, 2);
    if(!isList(args[0])) throwError("First argument should be a list", args[0]);
    if(args[1].type !== "string") throwError("Second argument should be a string", args[1]);

    return new Node(args[0].reduce(function(acc, val, i) {
      acc += val.value;

      if(i < args[0].length - 1) acc += args[1].value;
      return acc;
    }, ""), "string", charPos);
  },
  "rand": function(args, charPos) {
    var r;
    if (args.length > 1) {
      r = ~~(Math.random()*(args[1].value-args[0].value)+args[0].value);
    } else if (args.length > 0) {
      r = ~~(Math.random()*args[0].value);
    } else {
      r = Math.random();
    }
    return new Node(r, "number", charPos);
    //{docs : "Returns value between 0 and 1 with no args, 0 and max with 1 arg, and min and max with 2 args."}
  }
};

function areStructurallyEqual(obj1, obj2){
  if (obj1 === obj2) return true;
  if (isList(obj1) && isList(obj2)){
    if (obj1.length != obj2.length) return false;
    else {
      for (var i = 0; i < obj1.length; i++){
        if (!areStructurallyEqual(obj1[i], obj2[i])) return false;
      }
      return true;
    }
  } else {
    if (obj1.type != obj2.type) return false;
    if (obj1.value != obj2.value) return false;
    return true;
  }
}

function toLispData(obj, charPos){
  if(obj instanceof Array){
    var arr = [];
    for (var i = 0; i < obj.length; i++){
      arr.push(toLispData(obj[i], charPos));
    }
    return makeArr.apply(null, [charPos].concat(arr));
  } else if (typeof obj === "object"){
    var map = [];
    for (var field in obj){
      if (obj.hasOwnProperty(field)){
        var entry = [field, obj[field]];
        map.push(toLispData(entry, charPos));
      }
    }
    return makeArr.apply(null,[charPos].concat(map));
  } else if (typeof obj === "number"){
    return new Node(obj, "number", charPos);
  } else if (typeof obj === "string"){
    return new Node(obj, "string", charPos);
  } else {
    return makeArr(charPos);
  }
}

var utils = {
  throwError: throwError,
  makeArr: makeArr,
  Node: Node,
  areStructurallyEqual: areStructurallyEqual,
  checkNumArgs: checkNumArgs,
  isList: isList,
  toLispData: toLispData
};

function addFunction(name, func, docs){
  if (symbolTable[name]){
    throw new Error("This function with name "+name+" already defined.");
  } else {
    symbolTable[name] = func(utils);
    if (docs){
      symbolTable[name].docs = docs;
    }
  }
}

module.exports = {
  parse: parse,
  evaluate: evaluate,
  prettyPrint: prettyPrint,
  addFunction: addFunction
};
