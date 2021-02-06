const fs = require("fs");
module.exports = function log(content, id) {
	if (id !== 'test') {
		return
	}
	let text = new Date() + "[log]--" + content + '\n'
	let filename = id || 'log'
	// console.log(text);
	if (!fs.existsSync(`${__dirname}/../log/`)) {
		fs.mkdirSync(`${__dirname}/../log/`)
	}
	fs.writeFile(`${__dirname}/../log/${filename}.txt`, text, {
		flag: 'a+'
	}, err => { })
}