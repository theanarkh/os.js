// const readline = require('readline');

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });
// rl.prompt(true)
// rl.on('line', (input) => {
//   console.log(`${input}`);
//   rl.prompt(true)
// });

var fs = require('fs');
fs.writeFile('disk',Buffer.alloc(1024 * 1024 * 1024), function(err) {
	if (err) {
		console.log(err)
	}
})
12