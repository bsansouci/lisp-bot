function parse(str) {
  var rightParen = str.charAt(str.length - 1) === ")";
  var leftParen = str.charAt(0) === "(";

  if(!leftParen && rightParen) throw new Error("First char isn't an open paren. str: " + str);
  if(!rightParen && leftParen) throw new Error("Last char isn't a close paren. str: " + str);

  // TODO: add other typecasts in here
  if(!rightParen && !leftParen) {
    if(!isNaN(str)) return parseFloat(str);

    return str;
  }

  str = str.substring(1, str.length - 1);
  var list = [];
  var arr = str.split('');
  var matchingParen = 0;
  var tmpString = "";
  for (var i = 0; i < str.length; i++) {
    if(arr[i] === "(") matchingParen++;
    if(arr[i] === ")") matchingParen--;
    if(arr[i] === " " && matchingParen === 0 && tmpString.length !== 0) {
      list.push(parse(tmpString.trim()));
      tmpString = "";
    }

    tmpString += arr[i];
  }
  if(tmpString.length !== 0) list.push(parse(tmpString.trim()));

  return list;
}

function evaluate(ast) {
  // todo do some casting here
  if(!(ast instanceof Array)) {
    if(!isNaN(ast)) return parseFloat(ast);

    var maybeLocal = getLocal(localStack, ast);
    if(maybeLocal) return maybeLocal;

    if(symbolTable.hasOwnProperty(ast)) return symbolTable[ast];

    return ast;
  }

  var maybeMacro = macroTable[ast[0]];
  if(maybeMacro) {
    ast.shift();
    return maybeMacro(ast);
  }

  var evaledAST = ast.map(evaluate);

  var func = evaledAST.shift();
  if(typeof func !== "function") throw new Error("Identifier '" + func + "' isn't a function.");
  return func(evaledAST);
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

function swapInAST(body, map) {
  var newBody = [];
  for (var i = 0; i < body.length; i++) {
    if(isList(body[i])) {
      newBody.push(swapInAST(body[i], map));
    } else {
      if(map[body[i]]) newBody.push(map[body[i]]);
      else newBody.push(body[i]);
    }
  }

  return newBody;
}

function checkNumArgs(args, num) {
  if(args.length !== num) throw new Error("Improper number of arguments. Expected: " + num + ", got: " + args.length);
}

var localStack = [{}];

var macroTable = {
  "def": function(args) {
    var name = args[0];

    if(symbolTable.hasOwnProperty(name) || macroTable.hasOwnProperty(name)) throw new Error("Reserved, can't redefine " + name);

    var res = evaluate(args[1]);
    localStack[localStack.length - 1][name] = res;
    return res;
  },
  "fn": function(args) {
    var params = args[0];
    if(!isList(params)) throw new Error("Params should be a list of arguments.");

    for (var i = 0; i < params.length; i++) {
      if(isList(params[i])) throw new Error("Params can't be lists.");
    }

    var body = args[1];

    var variadicArgs = params.length > 1 && params[params.length - 1] === "...";

    return function(arr) {
      if(!variadicArgs && arr.length !== params.length) throw new Error("Improper number of arguments. Expected: " + params.length + ", got: " + arr.length);

      var map = {};
      for (var i = 0; i < params.length; i++) {
        map[params[i]] = arr[i];
      }

      if(variadicArgs) {
        map[params[params.length - 2]] = ["quote", arr.slice(params.length - 2)];
        delete map["..."];
      }

      return evaluate(swapInAST(body, map));
    };
  },
  "quote": function(args) {
    return args[0];
  }
};

var symbolTable = {
  "+": function(args) {
    return args.reduce(function(acc, v) {return acc + v;}, 0);
  },
  "-": function(args) {
    return args.reduce(function(acc, v) {return acc - v;}, 0);
  },
  "*": function(args) {
    return args.reduce(function(acc, v) {return acc * v;}, 1);
  },
  "/": function(args) {
    return args.reduce(function(acc, v) {return acc / v;}, 1);
  },
  "cdr": function(args) {
    checkNumArgs(args, 1);

    var rest = args[0];
    if(!isList(rest)) throw new Error("cdr expects a list as unique argument.");

    return rest.slice(1);
  },
  "car": function(args) {
    checkNumArgs(args, 1);

    var rest = args[0];
    if(!isList(rest)) throw new Error("car expects a list as unique argument.");

    return rest[0];
  },
  "cons": function(args) {
    checkNumArgs(args, 2);

    var el = args[0];
    var arr = args[1];

    if(!isList(arr)) arr = [arr];

    return [el].concat(arr);
  },
  "apply": function(args) {
    checkNumArgs(args, 2);

    var func = args[0];
    var arr = args[1];
    if(!isList(arr)) throw new Error("Second argument should be a list.");
    if(typeof func !== "function") throw new Error("First argument should be a function.");

    return func(arr);
  }
};

module.exports = {
  parse: parse,
  evaluate: evaluate
};