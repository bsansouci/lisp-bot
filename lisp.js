/*jslint node: true */
"use strict";
var fs = require("fs");
var RJSON = require("rjson");

var sourceString = "";
var LOADING = false;
var localStack = [{}];
var uuidToNodeMap = {};
var reservedUuids = {};

function makeParser(ruleList) {
  const parser = require('./parser');
  const rules = parser.makeRules(ruleList);
  const ruleTable = rules[0];
  const regexTable = rules[1];
  const table = parser.makeTable(ruleTable, regexTable);
  return str => {
    const maybeAST = parser.parse(table, regexTable, ruleTable, str);
    if (!maybeAST.success) {
      throw new Error("Couldn't parse.");
    }
    return maybeAST.value;
  };
}

function evaluate(ast) {
  // TODO: plz... don't... arg...
  if(isList(ast) && ast.value == null) ast.value = [];

  if(!isList(ast)) {
    if(ast.type !== "identifier") {
      return ast;
    }
    var maybeLocal = getLocal(localStack, ast.value);
    if(maybeLocal != null) return maybeLocal;

    if(symbolTable.hasOwnProperty(ast.value)) return new Node(symbolTable[ast.value], "function", ast.charPos);
    if(macroTable.hasOwnProperty(ast.value)) {
      return new Node(macroTable[ast.value], "function", ast.charPos, {isMacro: true});
    }

    throwError("Undeclared identifier `" + ast.value + "`", ast);
  }
  if(ast.value.length === 0) return ast;

  var firstElem = ast.value[0];
  var func = evaluate(firstElem);
  if(func.isMacro) {
    if (macroTable[firstElem.value]) {
      return evalLambda(func, ast.value.slice(1), firstElem.charPos, firstElem.value);
    } else {
      return evaluate(evalLambda(func, ast.value.slice(1), firstElem.charPos, firstElem.value));
    }
  }

  if (func.type !== "function" && typeof firstElem.value !== "string") return throwError("Trying to call something that isn't a function (received "+firstElem.type+").", firstElem);
  if(func.type !== "function") return throwError("Identifier '" + firstElem.value + "' isn't a function (received "+func.type+").", firstElem);

  return evalLambda(func, ast.value.slice(1), firstElem.charPos, firstElem.value);
}

function evalLambda(func, args, charPos, funcName) {
  if(localStack.length > 512) {
    throwError("Stack overflow > 512");
  }
  if (!func.isMacro) args = args.map(evaluate);

  // Native functions/macros
  if(typeof func.value === 'function') {
    localStack.push(Object.assign({}, localStack[localStack.length - 1]));
    try {
      var ret = func.value(args, charPos);
      localStack.pop();
      return ret;
    } catch(e) {
      localStack.pop();
      throw stackTrace(e, funcName);
    }
  }

  var argNames = func.argNames.value || [];
  var variadicArgs = argNames.length > 1 && argNames[argNames.length - 1].value === "...";
  if((!variadicArgs && args.length !== argNames.length) || (variadicArgs && args.length < argNames.length - 2)) {
    throwError("Improper number of arguments. Expected: " + (variadicArgs ? argNames.length - 2 : argNames.length) + ", got: " + args.length, charPos);
  }

  var map = {};
  var addedToUuidToNodeMap = [];

  // This is so we don't add "..."
  var length = argNames.length - (variadicArgs ? 1 : 0);
  for (var i = 0; i < length; i++) {
    var node = args[i] ? args[i] : makeArr(charPos);
    if (!uuidToNodeMap[node.uuid]) {
      uuidToNodeMap[node.uuid] = node;
      addedToUuidToNodeMap.push(node.uuid);
    }
    map[argNames[i].value] = node.uuid;
  }

  if(variadicArgs) {
    var node = makeArr.apply(null, [charPos].concat(args.slice(argNames.length - 2)));
    if (!uuidToNodeMap[node.uuid]) {
      uuidToNodeMap[node.uuid] = node;

      addedToUuidToNodeMap.push(node.uuid);
    }
    map[argNames[argNames.length - 2].value] = node.uuid;
  }

  // create a new scope for that function
  localStack.push(Object.assign({}, func.scope, map));
  try {
    var result = evaluate(func.value);
    localStack.pop();
    addedToUuidToNodeMap.forEach(uuid => {
      if (!reservedUuids[uuid]) {
        delete uuidToNodeMap[uuid];
      }
    });
    if (localStack.length === 1) {
      reservedUuids = {};
    }
    return result;
  } catch(e) {
    var savedStack = localStack.pop();
    throw stackTrace(e, funcName);
  }
}

function stackTrace(error, funcName){
  if (typeof funcName === "object") {
    funcName = "[Anonymous lambda]";
  } else if (!funcName || typeof funcName === 'function'){
    funcName = "[Native function]";
  }

  var errorLen = error.message.split("\n").length;
  if (errorLen < 15)
    return new Error(error.message+"\nin function: "+funcName);
  else if (errorLen == 15)
    return new Error(error.message+"\n...");
  else
    return error;
}

function getLocal(stack, name) {
  var uuid = stack[stack.length - 1][name];
  if(uuid != null && !uuidToNodeMap.hasOwnProperty(uuid)) {
    throw new Error("Couldn't find node of " + name + " with uuid " + uuid + ".");
  }
  if(uuid != null && uuidToNodeMap.hasOwnProperty(uuid)) {
    if (typeof uuidToNodeMap[uuid] === 'string'){
      uuidToNodeMap[uuid] = RJSON.unpack(JSON.parse(uuidToNodeMap[uuid]));
    }
    return uuidToNodeMap[uuid];
  }

  return null;
}

function isList(a) {
  return a.type === 'list';
}

function Node(value, type, charPos, extras) {
  // if(!uuidToNodeMap.hasOwnProperty(value.uuid)) {
  //   throw new Error("Making a node with a value that's not in the uuidToNodeMap with uuid " + value.uuid);
  // }
  var node = {
    src: sourceString,
    value: value,
    type: type,
    charPos: charPos,
    uuid: uuid(),
  };
  if(extras) node = merge(node, extras);
  // if(typeof value === "function") node.value = value.bind(node);

  return node;
}

function makeArr(charPos) {
  return new Node(Array.prototype.slice.call(arguments, 1), "list", charPos)
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

// Todo: I'm pretty sure there's something wrong there
function prettyPrint(node, optionalRefMapping, cycles) {
  if (typeof node === "undefined") return "!!undefined!!";
  if(!optionalRefMapping) optionalRefMapping = uuidToNodeMap;
  cycles = cycles || {};

  switch(node.type) {
    case "identifier":
    case "boolean":
    case "number":
      return node.value.toString();
    case "function":
      var name = node.isMacro ? "Macro" : "Function";
      if(typeof node.value === 'function') return "[Native "+name+"]";
      return "["+name+": " + prettyPrint(node.argNames, optionalRefMapping, cycles) + " -> " + prettyPrint(node.value, optionalRefMapping, cycles) + "]";
    case "ref":
      if (cycles[node.uuid])
        return "[Circular Ref]"
      else {
        cycles = Object.assign({}, cycles);
        cycles[node.uuid] = true;
        return "[Ref: " + prettyPrint(optionalRefMapping[node.value], optionalRefMapping, cycles) + "]";
      }
    case "string":
      return "\"" + node.value.replace('"','\\"') + "\"";
    case "list":
      if(node.value == null || node.value.length === 0) return "()";
      return node.value.reduce(function(acc, v, i) {
        return acc + prettyPrint(v, optionalRefMapping, cycles) + (i < node.value.length - 1 ? " " : "");
      }, "(") + ")";
    default:
      throw new Error("Cannot prettyPrint node: `"+ JSON.stringify(node) + "`, type:" + node.type);
  }
}

function throwError(str, node) {
  var charPos, src;
  if(typeof node !== "object") { // We passed a charPos directly
    charPos = node;
    src = sourceString;
  } else {
    charPos = node.charPos;
    src = node.src;
  }

  if (charPos == -1 || !charPos){
    throw new Error(str);
  } else {
    throw new Error("At char " + charPos + ": " + str);
    // ""\nIn region: `"+src.substring(Math.max(0, charPos - 60), charPos) + ">>" + src.substring(charPos, Math.min(src.length, charPos + 25)) + "`");
  }
}

function checkNumArgs(charPos, args, num) {
  if(args.length !== num) {
    throwError("Improper number of arguments. Expected: " + num + ", got: " + args.length, charPos);
  }
}

var macroTable = {
  "docs": function(args, charPos) {
    checkNumArgs(charPos, args, 1);
    if (args[0].type !== "identifier"){
      throwError("Only identifiers can have docs.");
    }

    if (symbolTable[args[0].value]){
      return new Node(symbolTable[args[0].value].docs || "Built-in function.", "string", args[0].charPos);
    } else if (macroTable[args[0].value]){
      return new Node(macroTable[args[0].value].docs || "Built-in macro.", "string", args[0].charPos);
    }

    var maybeFunc = getLocal(localStack, args[0].value);
    if(maybeFunc) return new Node(maybeFunc.docs || "No docs.", "string", args[0].charPos);

    throwError("Undefined identifier '"+args[0].value+"'.", charPos);
  },
  "define": function(args, charPos) {
    if (args.length !== 2 && args.length !== 3){
      throwError("Improper number of arguments to define. Expected: 2 or 3, got: "+args.length,charPos);
    }

    var name = args[0];
    if(name.type !== "identifier") {
      return throwError("First argument to define isn't an identifier, got `"+name.type+"` instead.", name);
    }

    if (localStack.length > 2 + LOADING) throwError("Define can only be called from the top-level scope.", charPos);

    if(symbolTable.hasOwnProperty(name.value) || macroTable.hasOwnProperty(name.value)) throwError("Reserved, can't redefine " + name.value, name);

    var body = args[1];
    var docs = null;
    // Adding optional comments when defining functions
    if(body.type === "string" && args.length === 3) {
      docs = body.value;
      body = args[2];
    }

    // Hacky way to save native functions by wrapping them in a lambda
    if(body.type === 'identifier' && symbolTable.hasOwnProperty(body.value)) {
      body = new Node(
        makeArr(charPos,
          new Node('apply', 'identifier', charPos),
          new Node(body.value, 'identifier', charPos),
          new Node('args', 'identifier', charPos)
        ), 'function', charPos, {
        argNames: makeArr(charPos,
          new Node('args', 'identifier', charPos),
          new Node('...', 'identifier', charPos)
        )
      });
    }
    var res = evaluate(body);

    // Attach the docs to the object inside the localStack
    if (docs){
      res.docs = docs;
    }

    // If the node res is a function, add itself to the scope so it can recurse
    if(res.type === 'function') {
      res.scope[name.value] = res.uuid;
    }

    uuidToNodeMap[res.uuid] = res;
    localStack[0][name.value] = res.uuid;
    localStack[1][name.value] = res.uuid;

    return res;
  },
  "define-once": function(args, charPos) {
    if (args.length !== 2 && args.length !== 3){
      throwError("Improper number of arguments to define-once. Expected: 2 or 3, got: "+args.length,charPos);
    }

    var name = args[0];
    if(name.type !== "identifier") {
      return throwError("First argument to define-once isn't an identifier, got `"+name.type+"` instead.", name);
    }

    if (localStack.length > 2 + LOADING) throwError("Define-once can only be called from the top-level scope.", charPos);


    if (!getLocal(localStack, name.value)){
      return macroTable.define(args, charPos);
    }

    return getLocal(localStack, name.value);
  },
  "lambda": function(args, charPos) {
    checkNumArgs(charPos, args, 2);

    var argNames = args[0];
    if(!isList(argNames)) throwError("argNames should be a list of arguments.", argNames);

    for (var i = 0; i < argNames.value.length; i++) {
      if(argNames.value[i].type !== 'identifier') throwError("argNames should be identifier.", argNames.value[i]);
    }

    var body = args[1];
    var allIdentifiers = findAllIdentifiers(body);
    var topStack = localStack[localStack.length - 1];
    var newScope = {};
    allIdentifiers.forEach(function(v) {
      if (topStack[v]) {
        newScope[v] = topStack[v];
        reservedUuids[topStack[v]] = true;
      }
    });

    var lambdaNode = new Node(body, "function", argNames.charPos, {
      scope: newScope,
      argNames: argNames
    });

    lambdaNode.scope.recur = lambdaNode.uuid;

    return lambdaNode;
  },
  "quote": function(args, charPos) {
    checkNumArgs(charPos, args, 1);
    return args[0];
  },
  "unquote": function(args, charPos) {
    checkNumArgs(charPos, args, 1);
    return evaluate(args[0]);
  },
  "define-macro": function(args, charPos) {
    if (args.length !== 2 && args.length !== 3){
      throwError("Improper number of arguments to define-macro. Expected: 2 or 3, got: "+args.length,charPos);
    }

    var name = args[0];
    if(name.type !== "identifier") {
      return throwError("First argument to define-macro isn't an identifier, got `"+name.type+"` instead.", name);
    }
    if (localStack.length > 2 + LOADING) throwError("Define can only be called from the top-level scope.", charPos);


    var lambda = args[1];
    var docs = "No docs";

    // Adding optional comments when defining functions
    if(lambda.type === "string" && args.length > 2) {
      docs = lambda.value;
      lambda = args[2];
    }

    // Attach the docs to the object inside the localStack using the
    // extras param in new Node constructor
    var evaledLambda = evaluate(lambda);

    evaledLambda.docs = docs;
    evaledLambda.isMacro = true;

    // If the node evaledLambda is a function, add itself to the scope so it can
    // recurse
    if(evaledLambda.type === 'function') {
      evaledLambda.scope[name.value] = evaledLambda.uuid;
    }

    uuidToNodeMap[evaledLambda.uuid] = evaledLambda;
    localStack[0][name.value] = evaledLambda.uuid;
    localStack[1][name.value] = evaledLambda.uuid;
    return evaledLambda;
  },
  "syntax-quote": function(args, charPos) {
    var traverse = function(node) {
      if(!isList(node)) return node;

      if(node.value.length > 0 && node.value[0].value === "unquote") {
        return evaluate(node.value[1]);
      }

      var newTree = makeArr(charPos);
      for (var i = 0; i < node.value.length; i++) {
        if(isList(node.value[i]) && node.value[i].value.length > 0 && node.value[i].value[0].value === "unquote-splice") {
          newTree.value = newTree.value.concat(evaluate(node.value[i].value[1]).value);
        } else newTree.value.push(traverse(node.value[i]));
      }

      return newTree;
    };
    return traverse(args[0]);
  },
  "if": function(args, charPos) {
    if(args.length < 3) throwError("Too few arguments to if.", args);

    var bool = evaluate(args[0]);

    if(bool.type !== "boolean") throw new Error("If first argument has to evaluate to a boolean, not a '"+bool.type+"' "+bool.value);
    if(bool.value) {
      return evaluate(args[1]);
    }
    return evaluate(args[2]);
  },
  "load": function(args, charPos) {
    var name = args[0].value;
    var data;
    try {
      data = fs.readFileSync(name + ".bot", 'utf8').toString();
    } catch (e) {
      throwError("File '"+name+"' could not be loaded.");
    }
    console.log("Loading", name);
    var arr = data.split('\n');
    var rest = "";
    LOADING++;
    for (var i = 0; i < arr.length; i++) {
      var s = (rest + " " + arr[i]).trim();
      var arr2 = s.split('');
      var parens = 0;
      for (var j = 0; j < arr2.length; j++) {
        if(arr2[j] === '(') parens++;
        if(arr2[j] === ')') parens--;
      }
      if(parens < 0) throwError("Brackets mismatch, too many closing brackets.", charPos);

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
        // console.error(e);
        LOADING--;
        throw e;
      }
        //throwError(e.toString(), charPos);
    }
    LOADING--;
    console.log("--------------------");
    return makeArr(charPos);
  },
  "let" : function(args, charPos) {
    checkNumArgs(charPos, args, 2);
    var vars = args[0];
    var body = args[1];
    if (vars.value.length%2 !== 0){
      throwError("An even length list must be the first argument to let.", charPos);
    }

    var varsMap = vars.value.filter((v, i) => !(i%2)).reduce((acc,v,i) => (Object.assign(acc, {[i*2]: vars.value[i*2+1]})), {});
    var identMap = {};
    Object.keys(varsMap).forEach(i => vars.value[i].type === "identifier" ? null
      : throwError("You can only assign to an identifier.  Tried to assign to "+vars.value[i].type, vars.value[i].charPos));

    Object.keys(varsMap).forEach(
      i => {
        var k = vars.value[i];
        var evaled = evaluate(varsMap[i]);
        uuidToNodeMap[evaled.uuid] = evaled;
        localStack[localStack.length - 1][k.value] = evaled.uuid;});
    return evaluate(body);
  }
};

var symbolTable = {
  "edit-parser": function(args, charPos) {
    globalRuleList = evalLambda(args[0], [quoteNode(globalRuleList), new Node(function(args, charPos) {
      var ruleList = args[0];
      var quotedThingy = args[1];
      var nameOfRuleToExtend = quotedThingy.value[0].value;
      // Check if rule exists
      if (!ruleList.value.some(v => v.value[0].value === nameOfRuleToExtend)) {
        throwError("Could not find rule named `" + nameOfRuleToExtend + "`.", quotedThingy);
      }

      return new Node(ruleList.value.map(v => {
        if (v.value[0].value === nameOfRuleToExtend) {
          return new Node(v.value.concat(quotedThingy.value.slice(1)), 'list', v.charPos);
        }
        return v;
      }), 'list', charPos);
    }, "function", charPos)]);

    globalParser = makeParser(globalRuleList);

    return globalRuleList;
  },
  "reverse-hack": function(args, charPos) {
    return new Node(args[0].value.reverse(), "list", charPos);
   },
  "parse-int": function(args, charPos) {
    checkNumArgs(charPos, args, 1);
    return new Node(parseInt(args[0].value), "number", charPos);
  },
  "parse-identifier": function(args, charPos) {
    checkNumArgs(charPos, args, 1);
    return new Node(args[0].value, "identifier", charPos);
  },
  "parse-string": function(args, charPos) {
    checkNumArgs(charPos, args, 1);
    return new Node(args[0].value.substring(1, args[0].value.length - 1), "string", charPos);
  },
  "parse-boolean": function(args, charPos) {
    checkNumArgs(charPos, args, 1);
    if (args[0].value !== "true" && args[0].value !== "false") {
      throwError("Cannot call parse-bool on '" + args[0].value + "'.", args[0]);
    }
    return new Node(args[0].value === "true", "boolean", charPos);
  },
   "<": function(args, charPos) {
    return new Node(args[0].value < args[1].value, "boolean", charPos);
  },
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
    checkNumArgs(charPos, args, 1);

    var rest = args[0];
    if(!isList(rest)) throwError("cdr expects a list as unique argument. Got "+rest.type+" instead.", rest);
    return makeArr.apply(null, [charPos].concat(rest.value.slice(1)));
  },
  "car": function(args, charPos) {
    checkNumArgs(charPos, args, 1);

    var rest = args[0];
    if(!isList(rest)) throwError("car expects a list as unique argument. Got "+rest.type+" instead.", rest);
    if(rest.value.length < 1) throwError("Car not defined on empty lists", rest);
    return rest.value[0];
  },
  "cons": function(args, charPos) {
    checkNumArgs(charPos, args, 2);

    var el = args[0];
    var arr = args[1];

    if(!isList(arr)) arr = makeArr(charPos, arr);

    return makeArr.apply(null, [charPos, el].concat(arr.value));
  },
  "equal?" : function(args, charPos) {
    if (args.length < 2) throwError("equal? takes two arguments. You gave " + args.length, args[0]);
    for (var i = 1; i < args.length; i++){
      if (!areStructurallyEqual(args[i], args[0])) return new Node(false, "boolean", -2);
    }
    return new Node(true, "boolean", args);
  },
  "concat": function(args, charPos){
    checkNumArgs(charPos, args, 2);

    var arr1 = args[0];
    var arr2 = args[1];

    if(!isList(arr1) || !isList(arr2)) throwError("concat takes two lists.");

    return makeArr.apply(null, [charPos].concat(arr1.value.concat(arr2.value)));
  },
  "split": function(args, charPos) {
    checkNumArgs(charPos, args, 2);

    if(args[0].type !== "string") throwError("First argument should be a string", args[0]);
    if(args[1].type !== "string") throwError("Second argument should be a string", args[1]);
    return makeArr.apply(null, [args[0].charPos].concat(args[0].value.split(new RegExp(args[1].value)).map(function(x, i) {return new Node(x, "string", charPos + i);})));
  },
  "join": function(args, charPos) {
    checkNumArgs(charPos, args, 2);

    var list = args[0];
    if(!isList(list)) throwError("First argument should be a list", list);
    if(args[1].type !== "string") throwError("Second argument should be a string", args[1]);

    return new Node(list.value.reduce(function(acc, val, i) {
      if(val.type !== "string" && val.type !== "number") throwError("Joined elements should be strings", val);

      acc += val.value.toString();

      if(i < list.value.length - 1) acc += args[1].value;
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
  },
  "typeof": function(args, charPos) {
    checkNumArgs(charPos, args, 1);
    return new Node(args[0].type, "string", charPos);
  },
  "string": function(args, charPos) {
    checkNumArgs(charPos, args, 1);
    return new Node(prettyPrint(args[0]), "string", charPos);
  },
  "ref": function(args, charPos){
    checkNumArgs(charPos, args, 1);
    uuidToNodeMap[args[0].uuid] = args[0];

    return new Node(args[0].uuid, "ref", charPos);
  },
  "set!": function(args, charPos){
    checkNumArgs(charPos, args, 2);
    // 1st arg: ref
    // 2nd arg: new val
    if (args[0].type !== 'ref') throwError("First argument to set! must be a ref type.", charPos);
    if (args[1].type === 'ref') throwError("Second argument to set! cannot be a ref type.", charPos);

    args[0].value = args[1].uuid;
    uuidToNodeMap[args[1].uuid] = args[1];
    return args[0];
  },
  "get": function(args, charPos){
    checkNumArgs(charPos, args, 1);
    if (args[0].type !== 'ref') throwError("First argument to get must be a ref type.", charPos);

    if(!uuidToNodeMap.hasOwnProperty(args[0].value)) {
      throwError("Couldn't find ref.", args[0]);
    }
    return uuidToNodeMap[args[0].value];
  },
  "apply": function(args, charPos) {
    checkNumArgs(charPos, args, 2);

    var func = evaluate(args[0]);
    var arr = args[1];
    if(func.type !== "function") throwError("First argument should be a function.", func);

    if(!isList(arr)) throwError("Second argument should be a list.", func);
    var funcArgs = arr.value;

    return evalLambda(func, funcArgs, charPos, args[0].value);
  },
};

function quoteNode(n){
  return makeArr(n.charPos, new Node("quote", "identifier", n.charPos), n);
}

function areStructurallyEqual(obj1, obj2){
  if (obj1 === obj2) return true;
  if (isList(obj1) && isList(obj2)){
    if (obj1.value.length != obj2.value.length) return false;
    else {
      for (var i = 0; i < obj1.value.length; i++){
        if (!areStructurallyEqual(obj1.value[i], obj2.value[i])) return false;
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
  charPos = charPos || -1;
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
    throw new Error("A function with name "+name+" already defined.");
  } else {
    symbolTable[name] = func(utils);
    if (docs){
      symbolTable[name].docs = docs;
    }
  }
}

function addMacro(name, func, docs) {
  if (macroTable[name]){
    throw new Error("A macro with name "+name+" already defined.");
  } else {
    macroTable[name] = func(utils);
    if (docs){
      macroTable[name].docs = docs;
    }
  }
}

// ntext = {
//   stackFrame: currentStackFrame,
//   macros: currentMacros,
//   uuidToNodeMap: availableNodes,
//   ruleList: currentRuleList,
// };

function parseAndEvaluateWith(string, context) {
  var savedLocalStack0 = localStack[0];
  var savedGlobalRuleList = globalRuleList;
  var savedGlobalParser = globalParser;
  var savedUuidToNodeMap = uuidToNodeMap;

  localStack = [context.stackFrame];
  uuidToNodeMap = context.uuidToNodeMap;

  if (context.ruleList) {
    globalRuleList = context.ruleList;
    if (!areStructurallyEqual(globalRuleList, savedGlobalRuleList)){
      globalParser = makeParser(context.ruleList);
    }
  }

  var toEval = parse(string);
  var res = evaluate(toEval);

  var newUuidToNodeMap = uuidToNodeMap;
  var newStackFrame = localStack[0];
  var newRuleList = globalRuleList;

  uuidToNodeMap = savedUuidToNodeMap;
  localStack = [savedLocalStack0];
  globalParser = savedGlobalParser;
  globalRuleList = savedGlobalRuleList;

  return {
    res: res,
    stackFrame: newStackFrame,
    uuidToNodeMap: newUuidToNodeMap,
    ruleList: newRuleList,
  };
}

var uuid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
})();

function findAllIdentifiers(ast) {
  var dedupeObj = {};
  if (isList(ast)) {
    if(ast.value == null) return [];
    return ast.value.reduce(function(acc, v) {
      findAllIdentifiers(v).forEach(function(v) {dedupeObj[v] = v;});
      return acc.concat(Object.keys(dedupeObj));
    }, []);
  }

  if(ast.type === 'identifier') {
    return [ast.value];
  }

  return [];
}

var parse = str => globalParser(str);

module.exports = {
  evaluate: evaluate,
  prettyPrint: prettyPrint,
  addFunction: addFunction,
  addMacro: addMacro,
  parseAndEvaluateWith: parseAndEvaluateWith,
  evalLambda: evalLambda,
  toLispData: toLispData,
  quoteNode: quoteNode,
  parse: parse,
};

var globalRuleList = require('./cfg.gen').value[2].value[2].value[1];
var globalParser = makeParser(globalRuleList);
