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

      tokenList.forEach(function(elem) {
        if (elem.type === 'string' && elem.value.length === 0) throw new Error("Can you not?");

        if (elem.type === 'string') {
          var regex = new RegExp(elem.value);
          var id = uuid();
          var maybeRegex = regexTable.filter(r => r.rhs.toString() === regex.toString())[0];
          if (maybeRegex) {
            id = maybeRegex.lhs;
          } else {
            regexTable.push({
              lhs: id,
              rhs: regex,
              lambda: null,
            });
          }
          rhs.push(id);
        } else {
          rhs.push(elem.value);
        }
      });
      table.push({
        lhs: lhs,
        rhs: rhs,
        lambda: list[i + 1],
      });
    }
  });

  return [table, regexTable];
}

function removeEmpty(arr) {
  return arr.filter(v => v.length !== 0);
}

function computeFirstSets(rules) {
  var first = {};
  rules.forEach(rule => {
    first[rule.lhs] = rule.lhs === 'start-token' ? [""] : [];
    rule.rhs.forEach(token => {
      first[token] = isTerminal(rules, token) ? [token] : [];
    });
  });

  var stillChange = true;
  while(stillChange) {
    stillChange = false;
    rules.forEach(rule => {
      if (rule.rhs.length === 0) {
        var len = first[rule.lhs].length;
        first[rule.lhs] = dedupe(first[rule.lhs].concat([""]), v => v);
        if (first[rule.lhs].length !== len) stillChange = true;
      } else {
        var containedEmpty = false;
        var i = 0;
        do {
          var len = first[rule.lhs].length;
          containedEmpty = first[rule.rhs[i]].filter(token => token.length === 0).length > 0;
          console.log(containedEmpty);
          first[rule.lhs] = dedupe(first[rule.lhs].concat(removeEmpty(first[rule.rhs[i]])), v => v)
          if (first[rule.lhs].length !== len) stillChange = true;
          i++;
        } while (containedEmpty && i < rule.rhs.length);
        if (containedEmpty) first[rule.lhs].push("");

      }
    })
  }

  return first;
}

function makeClosure(rules, first, items) {
  var closure = items;
  items.forEach(function(item) {
    var curRule = rules[item.rule];
    var nextToken = curRule.rhs[item.dotPos];
    var nextRules = rules.filter(v => v.lhs === nextToken);

    var lookaheads = [item.lookahead];
    // Should use lookaheads
    if (item.dotPos < curRule.rhs.length) {
      lookaheads = first[nextToken];
    }
    nextRules.forEach(rule => {
      lookaheads.forEach(lookahead => {
        var newItem = {
          rule: rules.indexOf(rule),
          dotPos: 0,
          lookahead: lookahead,
        };
        if (!closure.some(v => v.rule === newItem.rule
                              && v.lookahead === newItem.lookahead)) {
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
  var regex = regexTable.filter(r => r.lhs === token)[0];
  return `${regex ? `REGEX (${regex.rhs})` : `"${token}"`}`;
}

function pprintRule(regexTable, rule, i) {
  return `${i}: ${getRegexLhs(regexTable, rule.lhs)}\t\t-> ${rule.rhs.join(" ")}`;
}

function pprintRules(rules, regexTable) {
  return rules.map(pprintRule.bind(null, regexTable)).join("\n");
}
function pprintRow(regexTable, row, i) {
  return `${i}: ${row.items.map(item => `(${item.rule}, ${getRegexLhs(regexTable, item.lookahead)}, ${item.dotPos})`).join(", ")} \n${Object.keys(row.actions).map(key => `\t${getRegexLhs(regexTable, key)}\n\t\t: ${row.actions[key].type} ${row.actions[key].value}`).join("\n")}`;
}
function pprintTable(regexTable, table) {
  return table.map(pprintRow.bind(null, regexTable)).join("\n");
}

function makeTable(rules) {
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
        lookahead: ""
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
    // console.log("=============================================== ", i, curState.init);
    // Get the closures until we hit the fixed point
    while (true) {
      var prevLength = curState.items.length;
      curState.items = makeClosure(rules, first, curState.items);
      // console.log("---------------");
      if (prevLength === curState.items.length) break;
    }

    curState.actions = {};
    curState.items.map(item => [rules[item.rule].rhs[item.dotPos] || "", item])
    .forEach(arr => {
      var curToken = arr[0];
      var item = arr[1];
      if (isReduction(rules, item)) {
        if (curState.actions[item.lookahead]) throw new Error("Conflict detected: reduce/"+curState.actions[item.lookahead].type);
        curState.actions[item.lookahead] = {
          type: "reduce",
          value: item.rule,
          item: item,
        };
        // console.log("Reduction ", item.rule, rules[item.rule], item.lookahead, curToken);
      } else {
        var maybePreviousState = table.filter(v => v.init != null && v.init.state === i && v.init.token === curToken)[0];
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
          console.log("Goto ", curToken);
        } else {

          // if (curState.actions[curToken] && curState.actions[curToken].type !== "shift") throw new Error("Conflict detected: shift/" + curState.actions[curToken].type + " ---- " + JSON.stringify(item) + "/"+ JSON.stringify(curState.actions[curToken].item));
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
          // console.log("Shift ", curToken);
        }
      }
    });
  }

  return table;
}

function dedupe(arr, hash) {
  var obj = arr.reduce((acc, v) => {
    acc["-" + hash(v)] = v;
    return acc;
  }, {});
  return Object.keys(obj).map(key => obj[key]);
}

var lisp = require("./lisp");
var cfg = require('./cfg.gen');
var rules = makeRules(cfg.value[2].value[2].value[1]);
var regexTable = rules[1];
console.log(pprintRules(rules[0], regexTable));
var table = makeTable(rules[0]);
console.log(pprintTable(regexTable, table));
