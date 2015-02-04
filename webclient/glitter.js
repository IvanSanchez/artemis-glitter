


console.log('Sending greetings');


var text = require('./jade/helloworld')({thing:'world'});
console.log(text);

console.log(document.body);

document.body.innerHTML = text;


console.log('Greeting sent');



module.exports = 'Foobar!';

