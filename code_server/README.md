## code-server 
	online web editor

## 配置

	此编辑器如果勇于iframe嵌入，需要修改poseMessage配置解决寡欲问题，修改如下：
	- mac
		vi linux-amd64/dist/pages/vscode.js
		host: 修改为iframe所在域域名
	- linux
		vi macos/dist/pages/vscode.js
		host: 修改为iframe所在域域名
## 部署

- mac
	npm run macos-start
- linux
	npm run linux-start