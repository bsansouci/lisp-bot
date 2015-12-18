var assert = require('assert');

var lisp = require("../lisp");
var parser = require('../parser');

describe('Parse:', () => {
  var parseAndPprint = null
  before(() => {
    // Setup the parser
    var cfg = require('../cfg.gen');
    var rules = parser.makeRules(cfg.value[2].value[2].value[1]);
    var ruleTable = rules[0];
    var regexTable = rules[1];
    var table = parser.makeTable(ruleTable);
    parseAndPprint = str => {
      var parsedAST = parser.parse(table, regexTable, ruleTable, str);
      if (!parsedAST.success) throw parsedAST;

      return lisp.prettyPrint(parsedAST.value);
    };
  });

  it('should parse simple lists', () => {
    assert(parseAndPprint("()") === "()");
    assert(parseAndPprint("(1)") === "(1)");
    assert(parseAndPprint("(1 2 3)") === "(1 2 3)");
    assert(parseAndPprint("(1 2 3 4 5 6 7 8 9 10)") === "(1 2 3 4 5 6 7 8 9 10)");
  });

  it('should parse primitive types', () => {
    assert(parseAndPprint("(123980 123 414214)") === "(123980 123 414214)");
    assert(parseAndPprint("(true false)") === "(true false)");
    assert(parseAndPprint("(fn \"something\")") === "(fn \"something\")");
  });

  it('should parse nested lists', () => {
    assert(parseAndPprint("(())") === "(())");
    assert(parseAndPprint("(() () ())") === "(() () ())");
    assert(parseAndPprint("((()) ((())) ())") === "((()) ((())) ())");
  });

  it('should eat up any number of spaces', () => {
    assert(parseAndPprint("(1 2)") === "(1 2)");
    assert(parseAndPprint("(1       2)") === "(1 2)");
    assert(parseAndPprint("(1       2    4  )") === "(1 2 4)");
  });

  it('should not accept syntactically invalid programs', () => {
    assert.throws(() => parseAndPprint("(1 2 3"));
    assert.throws(() => parseAndPprint("(1 ((2 3)"));
    assert.throws(() => parseAndPprint("(((((1(()1)))))))"));
    assert.throws(() => parseAndPprint("(((((1(()1)))())())())())"));
    assert.throws(() => parseAndPprint("(\"something goes here)"));
  });
});
