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
<<<<<<< HEAD
1245xx
=======
12451111
>>>>>>> 00e68cf7bf57f2bb7fbd333d6cf7d366f1f456ba
