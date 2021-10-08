var child_process = require('child_process');
const platform = process.env.NODE_ENV || 'macos';

console.log(platform, 11111)
let command = '';
switch (platform) {
	case 'macos':
		command = 'cd macos && ./bin/code-server'
		break;
	case 'linux':
		command = 'cd linux && ./bin/code-server'
		break;
	default:
		break;
}

child_process.exec(command,function (error, stdout, stderr) {
	if (error !== null) {
	  console.log('exec error: ' + error);
	}
	console.log(stdout)
});