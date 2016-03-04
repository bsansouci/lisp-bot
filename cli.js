const stdin = process.openStdin();
const lisp = require('./lisp');
lisp.evaluate(lisp.parse('(load parser)'));
lisp.evaluate(lisp.parse('(load std-lib)'));
// lisp.evaluate(lisp.parse('(load tests)'));
// lisp.evaluate(lisp.parse('(load defs)'));

// const parse = makeParser('./xml.cfg');
// console.log('cli:', lisp.prettyPrint(lisp.evaluate(parse('<main x="10"><main/></main>'))));

// lisp.evaluate(parse('(load polyfill)'));
// lisp.evaluate(parse('(load bot-lib)'));
// console.log('--------------');

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
  if (str.length > 0) {
    // try {
    const AST = lisp.parse(str);
    const output = lisp.evaluate(AST);
    const pretty = lisp.prettyPrint(output);
    console.log(pretty);
    // } catch (e) {
    //   console.log(e);
    // }
  }
});
