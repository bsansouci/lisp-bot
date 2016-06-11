/* @flow */
/*jslint node: true */
"use strict";

var fs = require("fs");
var RJSON = require("rjson");

var LOADING:number = 0;
var localStack = [{}];
var uuidToNodeMap = {};
var reservedUuids = {};

type ASTNodeT =
  identT | stringT | numberT | refT | funcT | listT;

type identT = 
  {type: "identifier", value: string, uuid: string, docs?: string};

type stringT = 
  {type: "string", value: string, uuid: string, docs?: string};

type numberT = 
  {type: "number", value: number, uuid: string, docs?: string};

type refT = 
  {type: "ref", value:string, uuid: string, docs?: string};

type listT =
  {type: "list", value: Array<ASTNodeT>, uuid: string, docs?: string};

type funcT =
  {type: "function", value:ASTNodeT, argNames?:listT, scope:{[key: string]: string}, isMacro:boolean, uuid: string, docs?: string};

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

var trueNode = {
  type: "boolean",
  value: true,
  uuid: uuid(),
}

var falseNode = {
  type: "boolean",
  value: false,
  uuid: uuid(),
}

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

function evaluate(ast: ASTNodeT):ASTNodeT {
  console.log(ast);
  console.log("\n\n\n\n");

  if(ast.type !== "list") {
    if(ast.type !== "identifier") {
      return ast;
    }
    var maybeLocal = getLocal(localStack, ast.value);
    if(maybeLocal != null) return maybeLocal;

    if(symbolTable.hasOwnProperty(ast.value)) {
      return {
        type: "function",
        value: symbolTable[ast.value],
        uuid: uuid(),
        scope: {},
        isMacro:false,
      }
    }

    if(macroTable.hasOwnProperty(ast.value)) {
      return {
        type: "function",
        value: macroTable[ast.value],
        isMacro: true,
        scope: {},
        uuid: uuid(),
      };
    }

    throw new Error("Undeclared identifier `" + ast.value + "`"+ JSON.stringify(ast));
  }

  var firstElem:ASTNodeT = ast.value[0];
  var func:ASTNodeT = evaluate(firstElem);
  if(func.type && func.type === "function" && func.isMacro) {
    if (firstElem.type === "identifier" && macroTable[firstElem.value]) {
      return evalLambda(func, ast.value.slice(1), firstElem.value);
    } else {
      return evaluate(evalLambda(func, ast.value.slice(1), firstElem));
    }
  }

  if (func.type !== "function") {
    if (firstElem.type === "identifier") {
      throw new Error("Identifier '" + firstElem.value + "' isn't a function (received "+func.type+").");
    } else {
    console.log(firstElem);
      throw new Error("Trying to call something that isn't a function (received "+firstElem.type+").");
    }
  }

  return evalLambda(func, ast.value.slice(1), firstElem);
}

function evalLambda(func: any, args: ASTNodeT[], funcName?: string | ASTNodeT) {
  if(localStack.length > 512) {
    throw new Error("Stack overflow > 512");
  }
  if (!func.isMacro) args = args.map(evaluate);

  // Native functions/macros
  if(typeof func.value === 'function') {
    localStack.push(Object.assign({}, localStack[localStack.length - 1]));
    try {
      var ret = func.value(args);
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
    throw new Error("Improper number of arguments. Expected: " + (variadicArgs ? argNames.length - 2 : argNames.length) + ", got: " + args.length);
  }

  var map = {};
  var addedToUuidToNodeMap = [];

  // This is so we don't add "..."
  var length = argNames.length - (variadicArgs ? 1 : 0);
  for (var i = 0; i < length; i++) {
    var node = args[i] ? args[i] : makeArr();
    if (!uuidToNodeMap[node.uuid]) {
      uuidToNodeMap[node.uuid] = node;
      addedToUuidToNodeMap.push(node.uuid);
    }
    map[argNames[i].value] = node.uuid;
  }

  if(variadicArgs) {
    var node = makeArrOfArr(args.slice(argNames.length - 2));
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
    if (funcName){
      throw stackTrace(e, funcName);
    } else {
      throw stackTrace(e);
    }
  }
}

function stackTrace(error : Error, funcName?: string | ASTNodeT){
  var innerFuncName = "";
  if (typeof funcName === "object") {
    if (funcName.type === "identifier"){
      innerFuncName = funcName.value;
    } else {
      innerFuncName = "[Anonymous lambda]";
    }
  } else if (!funcName || typeof funcName === 'function'){
    innerFuncName = "[Native function]";
  }

  var errorLen = error.message.split("\n").length;
  if (errorLen < 15)
    return new Error(error.message+"\nin function: "+innerFuncName);
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

function makeArr(): listT {
  return {
    type:"list",
    value:Array.prototype.slice.call(arguments, 1),
    uuid: uuid(),
  };
}

function makeArrOfArr(arr:ASTNodeT[]): listT {
  return {
    type:"list",
    value:arr,
    uuid: uuid(),
  };
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

function prettyPrint(node?:ASTNodeT,
                     optionalRefMapping?:{[key:string]:ASTNodeT},
                     cycles?:{[key:string]:boolean}) {
  if (node == null) return "!!undefined!!";
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
      return "(" + node.value
        .map(v => prettyPrint(v, optionalRefMapping, cycles))
        .join(" ") + ")"
    default:
      throw new Error("Cannot prettyPrint node: `"+ JSON.stringify(node) + "`, type:" + node.type);
  }
}

function checkNumArgs(args, num) {
  if(args.length !== num) {
    throw new Error("Improper number of arguments. Expected: " + num + ", got: " + args.length);
  }
}

var macroTable = {
  "docs": function(args) {
    checkNumArgs(args, 1);
    if (args[0].type !== "identifier"){
      throw new Error("Only identifiers can have docs.");
    }

    if (symbolTable[args[0].value]){
      return {
        value: symbolTable[args[0].value].docs || "Built-in function.",
        type: "string", 
        uuid: uuid(),
        };
    } else if (macroTable[args[0].value]){
      return {
        value: macroTable[args[0].value].docs || "Built-in macro.", 
        type: "string",
        uuid: uuid()
      };
    }

    var maybeFunc = getLocal(localStack, args[0].value);
    if(maybeFunc) {
      return {
        value: maybeFunc.docs || "No docs.",
        type: "string", 
        uuid: uuid()
      };
    }

    throw new Error("Undefined identifier '"+args[0].value+"'.");
  },
  "define": function(args) {
    if (args.length !== 2 && args.length !== 3){
      throw new Error("Improper number of arguments to define. Expected: 2 or 3, got: "+args.length);
    }

    var name = args[0];
    if(name.type !== "identifier") {
      throw new Error("First argument to define isn't an identifier, got `"+name.type+"` instead.");
    }

    if (localStack.length > 2 + LOADING) throw new Error("Define can only be called from the top-level scope.");

    if(symbolTable.hasOwnProperty(name.value) || macroTable.hasOwnProperty(name.value)) throw new Error("Reserved, can't redefine " + name.value);

    var body:ASTNodeT = args[1];
    var docs = null;
    // Adding optional comments when defining functions
    if(body.type === "string" && args.length === 3) {
      docs = body.value;
      body = args[2];
    }

    // Hacky way to save native functions by wrapping them in a lambda
    if(body.type === 'identifier' && symbolTable.hasOwnProperty(body.value)) {

      body = {
        type: "function",
        value: makeArr(
          {type:"identifier", value:"apply", uuid:uuid()},
          {type:"identifier", value:body.value, uuid:uuid()},
          {type:"identifier", value:"args", uuid:uuid()}),
        isMacro: false,
        uuid: uuid(),
        scope: {},
        argNames: makeArr(
          {type:"identifier", value:"args", uuid:uuid()},
          {type:"identifier", value:"...", uuid:uuid()}),
      };
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
  "define-once": function(args) {
    if (args.length !== 2 && args.length !== 3){
      throw new Error("Improper number of arguments to define-once. Expected: 2 or 3, got: "+args.length);
    }

    var name = args[0];
    if(name.type !== "identifier") {
      throw new Error("First argument to define-once isn't an identifier, got `"+name.type+"` instead.");
    }

    if (localStack.length > 2 + LOADING) throw new Error("Define-once can only be called from the top-level scope.");


    if (!getLocal(localStack, name.value)){
      return macroTable.define(args);
    }

    return getLocal(localStack, name.value);
  },
  "lambda": function(args) {
    checkNumArgs(args, 2);

    var argNames = args[0];
    if(argNames.type !== "list") throw new Error("argNames should be a list of arguments.");

    for (var i = 0; i < argNames.value.length; i++) {
      if(argNames.value[i].type !== 'identifier') throw new Error("argNames should be identifier.");
    }

    var body = args[1];
    var allIdentifiers = findAllIdentifiers(body);
    var topStack = localStack[localStack.length - 1];
    var newScope = {};
    allIdentifiers.forEach(v => {
      if (topStack[v]) {
        newScope[v] = topStack[v];
        reservedUuids[topStack[v]] = true;
      }
    });

    var lambdaNode:funcT = {
      value:body,
      type: "function",
      scope: newScope,
      argNames: argNames,
      isMacro: false,
      uuid: uuid(),
    };

    lambdaNode.scope['recur'] = lambdaNode.uuid;

    return lambdaNode;
  },
  "quote": function(args) {
    checkNumArgs(args, 1);
    return args[0];
  },
  "unquote": function(args) {
    checkNumArgs(args, 1);
    return evaluate(args[0]);
  },
  "define-macro": function(args) {
    if (args.length !== 2 && args.length !== 3){
      throw new Error("Improper number of arguments to define-macro. Expected: 2 or 3, got: "+args.length);
    }

    var name = args[0];
    if(name.type !== "identifier") {
      throw new Error("First argument to define-macro isn't an identifier, got `"+name.type+"` instead.");
    }
    if (localStack.length > 2 + LOADING) throw new Error("Define can only be called from the top-level scope.");


    var lambda = args[1];
    var docs = "No docs";

    // Adding optional comments when defining functions
    if(lambda.type === "string" && args.length > 2) {
      docs = lambda.value;
      lambda = args[2];
    }

    // Attach the docs to the object inside the localStack using the
    // extras param in Node constructor
    var evaledLambda = evaluate(lambda);


    // If the node evaledLambda is a function, add itself to the scope so it can
    // recurse
    if(evaledLambda.type !== 'function') {
      throw new Error("Tried to define macro that wasn't a lambda");
    }

    evaledLambda.docs = docs;
    evaledLambda.isMacro = true;
    evaledLambda.scope[name.value] = evaledLambda.uuid;
    uuidToNodeMap[evaledLambda.uuid] = evaledLambda;
    localStack[0][name.value] = evaledLambda.uuid;
    localStack[1][name.value] = evaledLambda.uuid;
    return evaledLambda;
  },
  "syntax-quote": function(args) {
    var traverse = function(node) {
      if(node.type !== "list") return node;

      if(node.value.length > 0 && node.value[0].value === "unquote") {
        return evaluate(node.value[1]);
      }

      var newTree:listT = makeArr();
      for (var i = 0; i < node.value.length; i++) {
        if((node.value[i].type !== "list") && node.value[i].value.length > 0 && node.value[i].value[0].value === "unquote-splice") {

          var evaledExpr = evaluate(node.value[i].value[1]);
          if (evaledExpr.type === "list"){
            newTree.value = newTree.value.concat(evaledExpr.value);
          } else {
            throw new Error("Unquote splice only applies to lists.");
          }

        } else newTree.value.push(traverse(node.value[i]));
      }

      return newTree;
    };
    return traverse(args[0]);
  },
  "if": function(args) {
    if(args.length < 3) throw new Error("Too few arguments to if.");

    var bool = evaluate(args[0]);

    if(bool.type !== "boolean") throw new Error("If first argument has to evaluate to a boolean, not a '"+bool.type+"' "+bool.value.toString());
    if(bool.value) {
      return evaluate(args[1]);
    }
    return evaluate(args[2]);
  },
  "load": function(args) {
    var name = args[0].value;
    var data = "";
    try {
      data = fs.readFileSync(name + ".bot", 'utf8').toString();
    } catch (e) {
      throw new Error("File '"+name+"' could not be loaded.");
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
        // console.error(e);
        LOADING--;
        throw e;
      }
    }
    LOADING--;
    console.log("--------------------");
    return makeArr();
  },
  "let" : function(args) {
    checkNumArgs(args, 2);
    var vars = args[0];
    var body = args[1];

    if (vars.value.length%2 !== 0){
      throw new Error("An even length list must be the first argument to let.");
    }

    var varsMap = vars.value
      .filter((v, i) => !(i%2))
      .reduce((acc, v, i) => (Object.assign(acc, {[i*2]: vars.value[i*2+1]})), {});

    if (Object.keys(varsMap).some(i => vars.value[i].type !== "identifier"))
      throw new Error("You can only assign to an identifier.");

    Object.keys(varsMap).forEach(
      i => {
        var k = vars.value[i];
        var evaled = evaluate(varsMap[i]);
        uuidToNodeMap[evaled.uuid] = evaled;
        localStack[localStack.length - 1][k.value] = evaled.uuid;});

    return evaluate(body);
  }
};

var symbolTable: {[key:string]:((args:ASTNodeT[]) => ASTNodeT)} = {
  "edit-parser": function(args) {
  console.log(args);
    var id = uuid();
    globalRuleList = evalLambda(args[0], [quoteNode(globalRuleList), 
      { 
        type: "function",
        id,
        isMacro: false,
        scope: {recur:id},
        value: (args) => {
          var ruleList = args[0];
          var quotedThingy = args[1];
          var nameOfRuleToExtend = quotedThingy.value[0].value;
          // Check if rule exists
          if (!ruleList.value.some(v => v.value[0].value === nameOfRuleToExtend)) {
            throw new
              Error("Could not find rule named `" + nameOfRuleToExtend.toString() + "`.", quotedThingy);
          }

          var nodeValue = 
            ruleList.value.map(v => (v.value[0].value === nameOfRuleToExtend) ?
              {
                value: v.value.concat(quotedThingy.value.slice(1)),
                type : 'list',
                uuid : uuid(),
              } : v);

          return {
            value: nodeValue, 
            type: 'list', 
            uuid: uuid(),
          };
        }
      }
   ]);

    globalParser = makeParser(globalRuleList);

    return globalRuleList;
  },
  "reverse-hack": function(args) {
    if (args[0].type === "list"){
      return {
        type: "list",
        value: args[0].value.reverse(),
        uuid: uuid()
      };
    } else throw new Error("Cannot reverse something of type "+args[0].type+".");
   },
  "parse-int": function(args) {
    checkNumArgs(args, 1);
    if (args[0].type === "string"){
      if (isNaN(args[0].value)) throw new Error("Tried to parse NaN.");

      return {
        type: "number",
        value: parseInt(args[0].value),
        uuid: uuid()
      };
    } else throw new Error("Cannot parse something of type "+args[0].type+".");
  },
  "parse-identifier": function(args) {
    checkNumArgs(args, 1);
    if (args[0].type === "string"){
      return {
        type: "identifier",
        value: args[0].value,
        uuid: uuid()
      };
    } else throw new Error("Cannot parse something of type "+args[0].type+".");
  },
  "parse-string": function(args) {
    checkNumArgs(args, 1);
    if (args[0].type === "string"){
      return {
        type: "string",
        value: args[0].value.substring(1, args[0].value.length - 1),
        uuid: uuid()
      };
    } else throw new Error("Cannot parse something of type "+args[0].type+".");
  },
  "parse-boolean": function(args) {
    checkNumArgs(args, 1);
    if (args[0].type === "string"){
      if (args[0].value !== "true" && args[0].value !== "false") {
        throw new Error("Cannot call parse-bool on '" + args[0].value + "'.", args[0]);
      }

      return {
        type: "boolean",
        value: args[0].value === "true",
        uuid: uuid()
      };
    } else throw new Error("Cannot parse something of type "+args[0].type+".");
  },
   "<": function(args) {
    return {
      value: args[0].value < args[1].value,
      type: "boolean",
      uuid: uuid(),
    }
  },
  "+": function(args) {
    if(args.length === 0) return makeArr();

    if (args.some(v => v.type !== "number")) {
      throw new Error("+ only accepts numbers.") 
    }

    return {
      type: "number",
      value: args.reduce((acc, v) => acc + v.value), 
      uuid: uuid()
    };
  },
  "-": function(args) {
    if(args.length === 0) return makeArr();
    if(args.length === 1) return {type: "number", value: -args[0].value, uuid: uuid()};

    if (args.some(v => v.type !== "number")) {
      throw new Error("- only accepts numbers.") 
    }

    return {
      type:"number",
      value: args.reduce((acc, v) => acc - v.value), 
      uuid: uuid()
    };
  },
  "*": function(args) {
    if(args.length === 0) return makeArr();

    if (args.some(v => v.type !== "number")) {
      throw new Error("* only accepts numbers.") 
    }

    return {
      type: "number",
      value: args.reduce((acc, v) => acc * v.value), 
      uuid: uuid(),
    };
  },
  "/": function(args) {
    if(args.length === 0) return makeArr();
    if(args.length === 1) return args[0];

    if (args.some(v => v.type !== "number")) {
      throw new Error("/ only accepts numbers.") 
    }

    return {
      type: "number",
      value: args.reduce((acc, v) => acc / v.value),
      uuid: uuid(),
    };
  },
  "cdr": function(args) {
    checkNumArgs(args, 1);

    var rest = args[0];
    if(rest.type !== "list") throw new Error("cdr expects a list as unique argument. Got "+rest.type+" instead.");
    return makeArr(rest.value.slice(1));
  },
  "car": function(args) {
    checkNumArgs(args, 1);

    var rest = args[0];
    if(rest.type !== "list") throw new Error("car expects a list as unique argument. Got "+rest.type+" instead.");
    if(rest.value.length < 1) throw new Error("Car not defined on empty lists");
    return rest.value[0];
  },
  "cons": function(args) {
    checkNumArgs(args, 2);

    var el = args[0];
    var arr = args[1];

    if(arr.type !== "list") arr = makeArrOfArr(arr);
    return makeArrOfArr([el].concat(arr.value));
  },
  "equal?" : function(args) {
    if (args.length < 2) throw new Error("equal? takes two arguments. You gave " + args.length);

    for (var i = 1; i < args.length; i++){
      if (!areStructurallyEqual(args[i], args[0])) return falseNode;
    }

    return trueNode;
  },
  "concat": function(args){
    checkNumArgs(args, 2);

    var arr1 = args[0];
    var arr2 = args[1];

    if(arr1.type !== "list" || arr2.type !== "list") throw new Error("concat takes two lists.");

    return makeArrOfArr(arr1.value.concat(arr2.value));
  },
  "split": function(args) {
    checkNumArgs(args, 2);

    if(args[0].type !== "string") throw new Error("First argument should be a string");
    if(args[1].type !== "string") throw new Error("Second argument should be a string");

    return makeArrOfArr(
      args[0].value
        .split(new RegExp(args[1].value))
        .map((x, i) =>({value:x, type: "string", uuid: uuid()})));
  },
  "join": function(args) {
    checkNumArgs(args, 2);

    var list = args[0];
    if(list.type !== "list") throw new Error("First argument should be a list");
    if(args[1].type !== "string") throw new Error("Second argument should be a string");

    if (list.value.some(v => v.type !== "string")){
      throw new Error("Joined elements should be strings");
    }

    return {
      type: "string",
      value: list.value.map(v => v.value).join(args[1].value),
      uuid: uuid(),
    }
  },
  "rand": function(args) {
    var r;

    if (args.some(v => v.type !== "number")) {
      throw new Error("rand only accepts numbers as arguments.") 
    }

    if (args.length === 2) {
      r = ~~(Math.random()*(args[1].value-args[0].value)+args[0].value);
    } else if (args.length === 1) {
      r = ~~(Math.random()*args[0].value);
    } else if (args.length === 0){
      r = Math.random();
    } else {
      throw new Error("rand should be called with 0, 1, or 2 arguments");
    }

    return {
      type: "number",
      value: r, 
      uuid: uuid()
    }
    //{docs : "Returns value between 0 and 1 with no args, 0 and max with 1 arg, and min and max with 2 args."}
  },
  "typeof": function(args) {
    checkNumArgs(args, 1);
    return {
      value: args[0].type,
      type: "string",
      uuid: uuid()
    };
  },
  "string": function(args) {
    checkNumArgs(args, 1);
    return {
      type: "string",
      value: prettyPrint(args[0]),
      uuid: uuid(),
    };
  },
  "ref": function(args){
    checkNumArgs(args, 1);
    uuidToNodeMap[args[0].uuid] = args[0];

    return {
      type: "ref",
      value: args[0].uuid,
      uuid: uuid(),
    };
  },
  "set!": function(args){
    checkNumArgs(args, 2);
    // 1st arg: ref
    // 2nd arg: new val
    if (args[0].type !== 'ref') throw new Error("First argument to set! must be a ref type.");
    if (args[1].type === 'ref') throw new Error("Second argument to set! cannot be a ref type.");

    args[0].value = args[1].uuid;
    uuidToNodeMap[args[1].uuid] = args[1];
    return args[0];
  },
  "get": function(args){
    checkNumArgs(args, 1);
    if (args[0].type !== 'ref') throw new Error("First argument to get must be a ref type.");

    if(!uuidToNodeMap.hasOwnProperty(args[0].value)) {
      throw new Error("Couldn't find ref.", args[0]);
    }
    return uuidToNodeMap[args[0].value];
  },
  "apply": function(args) {
    checkNumArgs(args, 2);

    var func = evaluate(args[0]);
    var arr = args[1];
    if(func.type !== "function") throw new Error("First argument should be a function.");

    if(arr.type !== "list") throw new Error("Second argument should be a list.");
    var funcArgs = arr.value;

    return evalLambda(func, funcArgs, args[0].value);
  },
};

function quoteNode(n:ASTNodeT):listT{
  return makeArr({value:"quote", type:"identifier", uuid:uuid()}, n);
}

function areStructurallyEqual(obj1, obj2){
  if (obj1 === obj2) return true;
  if (obj1.type === "list" && obj2.type === "list"){
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

function toLispData(obj: any){
  if(obj instanceof Array){
    var arr = [];
    for (var i = 0; i < obj.length; i++){
      arr.push(toLispData(obj[i]));
    }
    return makeArrOfArr(arr);
  } else if (typeof obj === "object"){
    var map:ASTNodeT[] = [];
    for (var field in obj){
      if (obj.hasOwnProperty(field)){
        var entry = [field, obj[field]];
        map.push(toLispData(entry));
      }
    }
    return makeArrOfArr(map);
  } else if (typeof obj === "number"){
    return {
      type: "number",
      value: obj,
      uuid: uuid(),
    };
  } else if (typeof obj === "string"){
    return {
      type: "string",
      value: obj,
      uuid: uuid(),
    };
  } else {
    return makeArr();
  }
}

var utils = {
  makeArr: makeArr,
  areStructurallyEqual: areStructurallyEqual,
  checkNumArgs: checkNumArgs,
  toLispData: toLispData
};

function addFunction(name:string, func:((utils:Object) => funcT), docs:string){
  if (symbolTable[name]){
    throw new Error("A function with name "+name+" already defined.");
  } else {
    symbolTable[name] = func(utils);
    if (docs){
      symbolTable[name].docs = docs;
    }
  }
}

function addMacro(name:string, func:((utils:Object) => funcT), docs:string) {
  if (macroTable[name]){
    throw new Error("A macro with name "+name+" already defined.");
  } else {
    macroTable[name] = func(utils);
    if (docs){
      macroTable[name].docs = docs;
    }
  }
}

function parseAndEvaluateWith(string:string, context:{stackFrame:any, ruleList:any, uuidToNodeMap:any}) {
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


function findAllIdentifiers(ast:ASTNodeT) {
  var dedupeObj = {};
  if (ast.type === "list") {
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

var parse = (str:string) => globalParser(str);

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
