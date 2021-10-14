var child_process = require('child_process');
const platform = process.env.NODE_ENV || 'macos';

let command = '';
switch (platform) {
	case 'macos':
		command = 'macos/bin/code-server --config config.yaml'
		break;
	case 'linux':
		command = 'linux/bin/code-server --config config.yaml'
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