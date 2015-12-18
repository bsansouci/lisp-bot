const stdin = process.openStdin();
const lisp = require('./lisp');
const lispParse = makeParser('./cfg.gen');
// lisp.evaluate(lispParse('(load std-lib)'));
// lisp.evaluate(lispParse('(load tests)'));
lisp.evaluate(lispParse('(load defs)'));

const parse = makeParser('./xml.cfg');
console.log('cli:', lisp.prettyPrint(lisp.evaluate(parse('<main x="10"><main/></main>'))));

// lisp.evaluate(parse('(load polyfill)'));
// lisp.evaluate(parse('(load bot-lib)'));
console.log('--------------');

stdin.addListener('data', function(d) {
  const str = d.toString().substring(0, d.length-1).trim();

  // Added for compliance with chatbot input format
  if ((/^\/\(.+\)$/).test(str)){
    str = str.slice(1);
  } else if ((/^\/.+/).test(str)){
    str = "(" + str.slice(1) + ")";
  } else if ((/^\(.+\)/).test(str)){
    str = str;
  }

  // try {
    const AST = lispParse(str);
    const output = lisp.evaluate(AST);
    const pretty = lisp.prettyPrint(output);
    console.log(pretty);
  // } catch (e) {
  //   console.log(e);
  // }
});

function makeParser(cfgName) {
  const parser = require('./parser');
  const cfg = require(cfgName);
  const rules = parser.makeRules(cfg.value[2].value[2].value[1]);
  const ruleTable = rules[0];
  const regexTable = rules[1];
  const table = parser.makeTable(ruleTable);
  const parse = str => {
    const parsedAST = parser.parse(table, regexTable, ruleTable, str);
    if (!parsedAST.success) console.error(parsedAST);

    return parsedAST.value;
  };

  return parse;
}
