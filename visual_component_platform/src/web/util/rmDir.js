/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-07-01 20:54:40
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-07-01 20:59:30
 */
const fs = require('fs')

module.exports =  function deleteall(path) {
	var files = [];
	if(fs.existsSync(path)) {
		files = fs.readdirSync(path);
		files.forEach(function(file, index) {
			var curPath = path + "/" + file;
			if(fs.statSync(curPath).isDirectory()) { // recurse
				deleteall(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
  }
}