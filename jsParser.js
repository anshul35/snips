/*
This code helps you to parse and tokenise the javascript code as input and replces all "private" variables(variables with "_" as prefix) to randomly generated strings so that your users cannot use them for their purpose.


Dependencies:
esprima package for parsing and tokenising the code which you can get from https://github.com/ariya/esprima and escodegen package for genrating the code back from customised AST which you can get from https://github.com/Constellation/escodegen  
*/
var esprima = require("./esprima/esprima.js");
var esc = require("./escodegen/escodegen.js");
var code = 'var __anshul = 42; var __p = function(d){console.log(d + __anshul); __anshul = "fweh"}';
var foo = esprima.tokenize(code);
function randomstring(L){
    var s= '';
    var randomchar=function(){
    	var n= Math.floor(Math.random()*62);
    	if(n<10) return n; //1-10
    	if(n<36) return String.fromCharCode(n+55); //A-Z
    	return String.fromCharCode(n+61); //a-z
    }
    while(s.length< L) s+= randomchar();
    return s;
}
var dict = [];
for(var x in foo){
	boo = foo[x];
	if(boo.value.indexOf("__") === 0 && boo.type == "Identifier"){
		rand = randomstring(5);
		dict.push({prev :  boo.value, after : rand});
	}
}
console.log(dict);
var parsed_code = esprima.parse(code);

function traverse(o ) {
    for (i in o) {
        if (typeof(o[i])=="object") {
            if(o[i])
            if((i === 'id' || i === 'right' || i === 'left')&& o[i].hasOwnProperty("name")){
                for(x in dict){
                    if(dict[x].prev === o[i].name){
                        o[i].name = dict[x].after;
                        break;
                    }
                }
            }
            else
                traverse(o[i]);
        }
    }
}             

traverse(parsed_code);
console.log(esc.generate(parsed_code));
