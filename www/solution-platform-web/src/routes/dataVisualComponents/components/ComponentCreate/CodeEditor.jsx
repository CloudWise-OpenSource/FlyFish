/**
* Created by chencheng on 17-8-31.
*/
import { PureComponent, Fragment } from 'react';
import { Button, Row, Col, Card, Modal, Switch, Icon } from 'antd';
import {
	doSaveDevFileContent,
	doNpmDevComponent,
	doCompileDevComponent,
} from '../../action/component';
import CodeFileTree from './component/CodeFileTree';

import styles from './CodeEditor.scss';
import PropTypes from 'prop-types';
import T from 'utils/T';

import { EnumCodeEditor } from 'constants/app/dataVisualComponents';
const noSaveFileValueComfirmMessage = '您尚有文件内容未保存, 是否离开?';

/**
	* 获取编辑器语言
	* @param fileName
	* @return {string}
	*/
const getEditorLanguage = (fileName = '') => {
	const suffix = fileName.split('.').pop();
	switch (suffix) {
		case 'js':
		case 'jsx':
			return 'javascript';

		case 'json':
			return 'json';

		case 'css':
			return 'css';

		case 'scss':
			return 'scss';

		case 'less':
			return 'less';

		case 'html':
			return 'html';

		case 'xml':
			return 'xml';

		case 'ts':
		case 'tsx':
			return 'typescript';
		default:
			return 'javascript';
	}
};

const theme = ['vs', 'vs-dark'];

@T.decorator.propTypes({
	component_id: PropTypes.number.isRequired,
	codeCompileStatusCb: PropTypes.func.isRequired
})
export default class CodeEditor extends PureComponent {
	constructor() {
		super();

		this.currentEditFilePath = null;    // 当前编辑文件的的路径
		this.isCompilation = null;          // 是否处于编译过程中

		this.state = {
			code: '',
			editCode: '',
			language: getEditorLanguage(),
			isCollapseEditor: false,            // 是否折叠编辑区
			npmInstalling: false,               // npm install 安装状态
			selectedKeys: [], // 当前文件树展开状态
			editorTheme: theme[0], // 编辑器主题
		};
	}

	editorDidMount(editor, monaco) {
		editor.focus();
		this.initKeyboard(editor, monaco);
	}

	componentDidMount() {
		const storageTheme = this.getEditorTheme();
		this.setState({
			editorTheme: storageTheme
		});
		window.addEventListener('beforeunload', this.pageBeforeunloadCallback);
		window.addEventListener('message', this.codeCompileCallback, false);
	}

	componentWillUnmount() {
		window.removeEventListener('beforeunload', this.pageBeforeunloadCallback);
		window.removeEventListener('message', this.codeCompileCallback, false);
	}

	codeCompileCallback = (event) => {
		if (event.origin === window.ENV.coderDomain && event.data && event.data.method === 'codeCompile') {
			const { codeCompileStatusCb } = this.props;
			codeCompileStatusCb(false);

			switch (event.data.action) {
				case 'prepare':
					T.prompt.success('保存成功, 开始编译...');
					this.isCompilation = true;
					codeCompileStatusCb(true);
					break;
				case 'success':
					T.prompt.success('编译成功');
					this.isCompilation = false;
					codeCompileStatusCb(false);
					break;
				case 'fail':
					T.prompt.error('编译失败！');
					this.isCompilation = false;
					codeCompileStatusCb(false);
					break;
				default:
					break;
			}
		}
	}

	pageBeforeunloadCallback = (event) => {
		const { code, editCode } = this.state;
		if (this.currentEditFilePath && code !== editCode) {
			// Cancel the event as stated by the standard.
			event.preventDefault();
			// Chrome requires returnValue to be set.
			event.returnValue = noSaveFileValueComfirmMessage;
		}
	}

	/**
		* 检测当前文件保存情况
		*/
	checkSaveStatus = () => {
		return new Promise((resolve) => {
			const { code, editCode } = this.state;
			if (this.currentEditFilePath && code !== editCode) {
				Modal.confirm({
					title: '提示',
					content: noSaveFileValueComfirmMessage,
					onCancel: () => resolve(false),
					onOk: () => resolve(true)
				});
				return;
			}
			resolve(true);
		});

	}

	/**
	* 设置文件内容
	* @param content
	*/
	setFileContent(filePath, content, selectedKeys) {
		// 判断当前文件是否保存
		if (filePath) {
			this.checkSaveStatus().then(status => {
				if (status) {
					// 这里处理一下删除文件的时候，相应的内容也要清除掉
					let state = {
						code: '',
						editCode: '',
						language: getEditorLanguage()
					};
					if (typeof content !== 'string') {
						this.currentEditFilePath = null;
					} else {
						this.currentEditFilePath = filePath;
						state = {
							code: content,
							editCode: content,
							language: getEditorLanguage(filePath)
						};
					}
					this.setState({
						...state,
						selectedKeys
					});
				}
			});
		} else {
			this.setState({
				selectedKeys
			});
		}

	}

	/**
		* 初始化键盘操作
		* @param editor
		*/
	initKeyboard(editor, monaco) {
		const { component_id, codeCompileStatusCb } = this.props;
		// ctrl + s 保存文件
		editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
			// 保存文件内容
			if (this.currentEditFilePath) {

				doSaveDevFileContent(component_id, this.currentEditFilePath, editor.getValue()).then(
					() => {
						T.prompt.success('保存成功');
						// 保存的话同步一下editCode和code
						this.setState({
							code: this.state.editCode
						});

						// 是否开启编译
						if ((
							this.currentEditFilePath.match(/\.jsx?$/) ||
							this.currentEditFilePath.match(/\.less$/) ||
							this.currentEditFilePath.match(/\.css$/))
							&& !this.isCompilation
						) {

							this.isCompilation = true;
							codeCompileStatusCb(true);
							doCompileDevComponent(component_id).then(() => {
								this.isCompilation = false;
								codeCompileStatusCb(false);
								T.prompt.success('编译完成');
							}, (resp) => {
								this.isCompilation = false;
								codeCompileStatusCb(false, resp.msg);
								T.prompt.error(resp.msg);
							});
						}
					},
					(resp) => {
						this.isCompilation = false;
						codeCompileStatusCb(false);
						T.prompt.error(resp.msg);
					}
				);
			}
		});
	}

	/**
		* npm安装依赖包
		* @param component_id
		*/
	npmInstallDevComponent(component_id) {
		T.prompt.confirm(() => {
			this.setState({ npmInstalling: true }, () => {
				doNpmDevComponent(component_id).then(() => {
					this.setState({ npmInstalling: false });
					T.prompt.success('npm install 安装依赖包完成');
				}, (resp) => {
					this.setState({ npmInstalling: false });
					T.prompt.error(resp.msg);
				});
			});
		}, { title: '确定安装依赖？' });
	}

	onEditorChange = (code) => {
		this.setState({
			editCode: code
		});
	}

	/**
	 * 主题变化
	 * @param {boolean} check
	 */
	editorThemeChange = (check) => {
		const chooseTheme = theme[Number(check)];
		this.setState({
			editorTheme: chooseTheme
		}, () => {
			this.setEditorTheme(chooseTheme);
		});
	}

	/**
	 * 获取当前主题
	 * @returns {string}
	 */
	getEditorTheme = () => {
		const currentTheme = T.storage.getStorage(EnumCodeEditor.themeKey) || theme[0];
		return currentTheme;
	}

	/**
	 * 设置主题
	 * @param {string} theme
	 */
	setEditorTheme = (chooseTheme) => {
		T.storage.setStorage(EnumCodeEditor.themeKey, chooseTheme);
	}

	render() {
		const { component_id, component_mark, org_mark } = this.props;
		const { npmInstalling } = this.state;   // 编辑器的高度
		const codeServerUrl = window.ENV.coderDomain + '/?component_id=' + component_id + '&folder=/data/app/flyFish/flyfish/www/static/dev_visual_component/dev_workspace/' + org_mark + '/' + component_mark;
		return (
    <div className={styles.code_editor}>
        <Card
            title="编辑区"
            className="editor-card"
            bodyStyle={{ padding: 0 }}
            style={{ marginBottom: 10 }}
            extra={
						[
    <Button
        key={1}
        type="primary"
        style={{ margin: '0 5px' }}
        loading={npmInstalling}
        onClick={() => this.npmInstallDevComponent(component_id)}
							>
        <span>安装依赖</span>
    </Button>
						]
					}
				>
            <Row>
                <CodeFileTree component_id={component_id} />
                <div className={styles.code_editor}>
                    <iframe id="child" src={codeServerUrl} width="100%" height="600" />
                </div>
            </Row>
        </Card>
    </div>
		);
	}
}
