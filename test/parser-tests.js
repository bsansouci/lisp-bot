var assert = require('assert');
var lisp = require("../lisp");

describe('Parse tests:', () => {
  var parseAndPprint = null
  before(() => {
    parseAndPprint = str => lisp.prettyPrint(lisp.parse(str));
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

// describe('Eval tests', () => {
//
// });
