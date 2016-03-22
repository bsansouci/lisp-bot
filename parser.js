var lisp = require('./lisp');

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

const EOF = uuid();

function makeRules(ast) {
  var table = [];
  var regexTable = [];

  ast.value.forEach(function(node) {
    var list = node.value;
    var lhs = list[0].value;
    for (var i = 1; i < list.length; i += 2) {
      var tokenList = list[i].value;
      var rhs = [];
      if (tokenList.length === 0) throw new Error("Can't handle empty for now...");

      tokenList.forEach(function(elem, j) {
        if (elem.type === 'list' || elem.type === 'string') {
          var string = elem, priority = 0;
          if (elem.type === 'list'){
            var string = elem.value[0];
            priority = elem.value[1] ? elem.value[1].value : 0;
          }

          var maybeMatchOnEmpty = ''.match(string.value);
          if (maybeMatchOnEmpty && maybeMatchOnEmpty.index === 0) {
            throw new Error("Can you not match on emtpy string plz with `" + string.value + "`");
          }

          var regex = new RegExp(string.value);
          var id = uuid();
          var maybeRegex = regexTable.filter(r => r.rhs.toString() === regex.toString())[0];
          if (maybeRegex) {
            id = maybeRegex.lhs;
          } else {
            regexTable.push({
              lhs: id,
              rhs: regex,
              priority: priority,
              lambda: null,
            });
          }
          rhs.push(id);
        } else if (elem.type === 'identifier'){
          rhs.push(elem.value);
        } else {
          throw new Error("Unexpected AST node of type `" + elem.type + "` found at position inside rule #" + i + " at position " + j);
        }
      });
      var lambda = list[i + 1];
      lambda.isMacro = true;
      table.push({
        lhs: lhs,
        rhs: rhs,
        lambda: lambda,
      });
    }
  });

  regexTable.push({
    lhs: EOF,
    rhs: new RegExp(/$/),
    lambda: null,
  })
  return [table, regexTable];
}

function removeEmpty(arr) {
  return arr.filter(v => v.length !== 0);
}

function computeFirstSets(rules) {
  var first = {};
  rules.forEach(rule => {
    rule.rhs.forEach(token => {
      first[token] = isTerminal(rules, token) ? [token] : [];
    });
  });
  first['start-token'] = [];
  first[EOF] = [EOF];

  rules.forEach(rule => {
    if (first[rule.lhs] == null) throw new Error("Unused rule -> " + rule.lhs);
  });

  var stillChange = true;
  while (stillChange) {
    stillChange = false;
    rules.forEach(rule => {
      var len = first[rule.lhs].length;
      if (rule.rhs.length === 0) {
        first[rule.lhs] = dedupe(first[rule.lhs].concat(['']), v => v);
      } else {
        var containedEmpty = false;
        var i = 0;
        do {
          var len = first[rule.lhs].length;
          containedEmpty = first[rule.rhs[i]].filter(token => token.length ===
            0).length > 0;
          first[rule.lhs] = dedupe(first[rule.lhs].concat(removeEmpty(first[
            rule.rhs[i]])), v => v);
          if (first[rule.lhs].length !== len) stillChange = true;
          i++;
        } while (containedEmpty && i < rule.rhs.length);
        if (containedEmpty) first[rule.lhs].push('');
      }
      if (first[rule.lhs].length !== len) stillChange = true;
    });
  }

  return first;
}

function getFollow(rules, first, item) {
  if (rules[item.rule].rhs.length === 0) return [];

  var sequence = rules[item.rule].rhs;

  var thing = [];
  var containedEmpty = false;
  var i = item.dotPos + 1;
  containedEmpty = true
  while (containedEmpty && i < sequence.length) {
    var len = thing.length;
    containedEmpty = first[sequence[i]].filter(token => token.length === 0).length >
      0;
    thing = dedupe(thing.concat(removeEmpty(first[sequence[i]])), v => v);
    if (thing.length !== len) stillChange = true;
    i++;
  }
  if (containedEmpty && i === sequence.length) thing.push(item.lookahead);

  return thing;
}

function makeClosure(rules, first, items) {
  var closure = items.slice();
  items.forEach(function(item) {
    var curRule = rules[item.rule];
    if (item.dotPos === curRule.rhs.length) return;

    var nextToken = curRule.rhs[item.dotPos];
    var nextRules = rules.filter(v => v.lhs === nextToken);
    var follow = getFollow(rules, first, item);

    nextRules.forEach(rule => {
      follow.forEach(lookahead => {
        var newItem = {
          rule: rules.indexOf(rule),
          dotPos: 0,
          lookahead: lookahead,
        };
        if (!closure.some(v => v.rule === newItem.rule && v.lookahead ===
            newItem.lookahead && v.dotPos === newItem.dotPos
          )) {
          closure.push(newItem);
        }
      })
    });
  });
  return closure;
}

function isReduction(rules, item) {
  return item.dotPos >= rules[item.rule].rhs.length;
}

function isTerminal(rules, token) {
  return rules.every(v => v.lhs !== token);
}

function getRegexLhs(regexTable, token) {
  if (token === EOF) return "EOF";
  var regex = regexTable.filter(r => r.lhs === token)[0];
  return `${regex ? `REGEX(${regex.rhs})` : `"${token}"`}`;
}

function pprintRule(regexTable, rule, i) {
  return `${i}: ${getRegexLhs(regexTable, rule.lhs)}\t\t-> ${rule.rhs.join(" ")}`;
}

function pprintRules(rules, regexTable) {
  return rules.map(pprintRule.bind(null, regexTable)).join("\n");
}

function pprintRow(regexTable, row, i) {
  return `${i}: ${row.items.map(item => `(${item.rule}, ${getRegexLhs(regexTable, item.lookahead)}, ${item.dotPos})`).join(", ")} \n${Object.keys(row.actions).map(key => `\t${getRegexLhs(regexTable, key)}\n\t\t: ${row.actions[key].type}${row.actions[key].value}`).join("\n")}`;
}

function pprintTable(regexTable, table) {
  return table.map(pprintRow.bind(null, regexTable)).join("\n");
}

function pprintItem(regexTable, item){
  return `(${item.rule}, ${getRegexLhs(regexTable, item.lookahead)}, ${item.dotPos})`;
}

function find(list, pred){
  for (var i = 0; i < list.length; i++) {
    value = list[i];
    if (pred.call(null, value, i, list)) {
      return value;
    }
  }
}

function makeTable(rules, regexTable) {
  var startRule = rules.filter(function(v) {
    return v.lhs === 'start-token';
  })[0];
  if (startRule == null) throw new Error("No start-token");

  var table = [];
  table.push({
    init: null,
  });

  var first = computeFirstSets(rules);

  // Table grows as we iterate over it
  for (var i = 0; i < table.length; i++) {
    var curState = table[i];

    if (curState.init == null) {
      curState.items = [{
        rule: rules.indexOf(startRule),
        dotPos: 0,
        lookahead: EOF
      }];
    } else {
      curState.items = table[curState.init.state].items
        .filter(v => curState.init.token === rules[v.rule].rhs[v.dotPos])
        .filter(v => !isReduction(rules, v))
        .map(v => {
          return {
            rule: v.rule,
            dotPos: v.dotPos + 1,
            lookahead: v.lookahead,
          };
        });
    }

    // Get the closures until we hit the fixed point
    while (true) {
      var prevLength = curState.items.length;
      curState.items = makeClosure(rules, first, curState.items);
      if (prevLength === curState.items.length) break;
    }

    curState.actions = {};
    curState.items.map(item => [rules[item.rule].rhs[item.dotPos] || EOF, item])
      .forEach(arr => {
        var curToken = arr[0];
        var item = arr[1];

        if (isReduction(rules, item)) {
          if (curState.actions[item.lookahead]) throw new Error(
            "Conflict detected: reduce/" + curState.actions[item.lookahead]
            .type);
          curState.actions[item.lookahead] = {
            type: "reduce",
            value: item.rule,
            item: item,
          };
        } else {
          var maybePreviousState = find(table, v => v.init != null
            && v.init.token === curToken
            && compareItemSets(table[v.init.state].items, curState.items));

          if (curToken.length === 0) throw new Error("wtf");
          if (!isTerminal(rules, curToken)) {
            if (maybePreviousState != null) {
              curState.actions[curToken] = {
                type: "goto",
                value: table.indexOf(maybePreviousState)
              };
            } else {
              curState.actions[curToken] = {
                type: "goto",
                value: table.length
              };
              table.push({
                init: {
                  state: i,
                  token: curToken
                },
              });
            }
          } else {
            if (curState.actions[curToken] && curState.actions[curToken].type !== "shift") throw new Error("Conflict detected: shift/" + curState.actions[curToken].type + " ---- " + pprintItem(regexTable, item) + "/"+ pprintItem(regexTable, curState.actions[curToken].item));
            if (maybePreviousState != null) {
              curState.actions[curToken] = {
                type: "shift",
                value: table.indexOf(maybePreviousState),
                item: item,
              };
            } else {
              curState.actions[curToken] = {
                type: "shift",
                value: table.length,
                item: item,
              };
              table.push({
                init: {
                  state: i,
                  token: curToken,
                },
              });
            }
          }
        }
      });
  }

  return table;
}

function compareItemSets(items1, items2) {
  return items1 === items2 || (items1.length === items2.length && subset(items1, items2) && subset(items2, items1));
}

function subset(items1, items2) {
  for (var i = 0; i < items1.length; i++) {
    var foundIt = false;
    for (var j = 0; j < items2.length; j++) {
      if (items2[j].dotPos === items1[i].dotPos && items2[j].rule === items1[i]
        .rule && items2[j].lookahead === items1[i].lookahead) {
        foundIt = true;
        break;
      }
    }
    if (!foundIt) return false;
  }

  return true;
}

function dedupe(arr, hash) {
  var obj = arr.reduce((acc, v) => {
    acc["-" + hash(v)] = v;
    return acc;
  }, {});
  return Object.keys(obj).map(key => obj[key]);
}

function findMatch(inputStream, tokens, regexTable) {
  if (inputStream.str.length === 0) return {
    key: EOF,
    value: null,
    matched: ""
  };

  var matches = [];
  tokens.forEach(token => {
    if (token.length === 0) return;
    var regex = regexTable.filter(r => token === r.lhs)[0];
    var res = inputStream.str.match(regex.rhs);
    if (!res || res.index > 0) return;
    matches.push({
      key: regex.lhs,
      value: res[0]
    });
  });

  var longestMatch = {
    key: "",
    value: ""
  };
  matches.forEach(match => {
    if (match.value.length > longestMatch.value.length) {
      longestMatch = match;
    }
  });
  var maybeDuplicates = matches.filter(match => match.value.length === longestMatch.value.length);

  if (maybeDuplicates.length > 1){
    maybeDuplicates = maybeDuplicates.sort((i1, i2) => regexTable[i1.key].priority - regexTable[i2.key].priority);
  }

  if (maybeDuplicates.length > 1 && regexTable[maybeDuplicates[0]].priority === regexTable[maybeDuplicates[0]].priority){
    throw new Error("Matched two things at " + inputStream.str + " with " + JSON.stringify(maybeDuplicates.slice(0,2).map(v => getRegexLhs(regexTable, v.key))));
  }
  if (maybeDuplicates.length === 0) {
    if (inputStream.str.match(/^\s+/)) {
      inputStream.str = inputStream.str.replace(/^\s+/, '');
      return findMatch(inputStream, tokens, regexTable);
    } else {
      throw new Error("Couldn't find any regex that matched '" + inputStream.str +
        "'");
    }
  }

  var kvp = {
    key: maybeDuplicates[0].key,
    value: lisp.toLispData(maybeDuplicates[0].value, -1),
    matched: maybeDuplicates[0].value,
  };
  return kvp;
}

function parse(table, regexTable, rules, inputString) {
  var tokenStack = [];
  var stateStack = [0];
  var inputStream = {
    str: inputString
  };
  while (true) {
    var state = table[stateStack[stateStack.length - 1]];
    var keyValuePair = findMatch(inputStream, Object.keys(state.actions).filter(isTerminal.bind(null, rules)), regexTable);

    var action = state.actions[keyValuePair.key];
    if (!action) {
      return {
        success: false,
        value: null
      };
    }
    switch (action.type) {
      case "reduce":
        var rule = rules[action.value];
        var argList = tokenStack.slice(tokenStack.length - rule.rhs.length);
        tokenStack = tokenStack.slice(0, tokenStack.length - rule.rhs.length);
        stateStack = stateStack.slice(0, stateStack.length - rule.rhs.length);

        var evaledAst = lisp.evaluate(rule.lambda);
        evaledAst.isMacro = true;

        var result = {
          key: rule.lhs,
          value: lisp.evalLambda(evaledAst, argList.map(kvp => kvp.value), -1),
        };
        tokenStack.push(result);

        if (rule.lhs === "start-token") {
          return { success: true, value: result.value };
        }
        var gotoState = stateStack[stateStack.length - 1];
        stateStack.push(table[gotoState].actions[rule.lhs].value);
        break;
      case "shift":
        inputStream.str = inputStream.str.substring(keyValuePair.matched.length);
        tokenStack.push(keyValuePair);
        stateStack.push(action.value);
        break;
    }
  }

}

function findRule(arr, token) {
  return arr.filter(v => v.lhs === token)[0];
}

module.exports = {
  makeRules: makeRules,
  makeTable: makeTable,
  parse: parse,
}

// var lisp = require("./lisp");
// var cfg = require('./cfg.gen');
// var rules = makeRules(cfg.value[2].value[2].value[1]);
// var ruleTable = rules[0];
// var regexTable = rules[1];
// var table = makeTable(ruleTable);
// console.log(pprintRules(ruleTable, regexTable));
// // console.log(pprintTable(regexTable, table));
// var test = parse(table, regexTable, ruleTable, "(define core (lambda () (quote ((start-token (expr) (lambda (x) x)) (expr (list-token) (lambda (x) x) (atom-token) (lambda (x) x)) (list-token (\"\\(\" expr-list \"\\)\") (lambda (_ x _) x) (\"\\(\" \"\\)\") (lambda (_ _) (quote ()))) (atom-token (\"\\-?\\d*\\.?\\d*e?\\-?\\d+\") parse-int (\"[^ ()0-9]+[^ ()]*\") parse-identifier (\"\\\"([^\\\"\\\\\\n]|(\\\\\\\\)*\\\\\\\"|\\\\[^\\\"\\n])*\\\"\") parse-string (\"true|false\") parse-boolean) (expr-list (expr-list expr) (lambda (coll e) (cons e coll)) (expr) (lambda (args ...) args))))))");
// console.log(lisp.prettyPrint(test.value));
//
// (edit-parser (lambda (rule-list add-to)
//   (add-to rule-list '(expr (expr "->" expr) (lambda (args _ e) `(lambda ~args ~e))))))
