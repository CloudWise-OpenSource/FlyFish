/**
		* 代码文件树
		*/
import { PureComponent } from 'react';
import { Tree, Icon } from 'antd';
import BoxContent from 'templates/ToolComponents/BoxContent';
import CodeTreeOperateModal from './CodeTreeOperateModal';
import UploadFile from './UploadFile';

import PropTypes from 'prop-types';
import T from 'utils/T';

import {
	doInitDevComponentSpace,
	doReadDevFile,
	doDelDevFileOrDir,
} from '../../../action/component';

import { EnumCodeTreeOperateType } from 'constants/app/dataVisualComponents';
const TreeNode = Tree.TreeNode;

@T.decorator.propTypes({
	// setFileContentFn: PropTypes.func.isRequired,
	component_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	style: PropTypes.object,
	selectedKeys: PropTypes.arrayOf(PropTypes.string)
})
class CodeFileTree extends PureComponent {
	constructor() {
		super();
		this.state = {
			data: [],
			loading: false,
		}
		this.firstInitDevComponentSpace = true;
	}

	componentDidMount() {
		this.initDevComponentSpace();
	}

	/**
		* 监听选中
		* @param selectedKeys
		* @param info
		*/
	onSelect = (selectedKeys, info) => {
		const { component_id, setFileContentFn } = this.props;
		const { key, isFile } = info.node.props.data;

		if (isFile) {
			doReadDevFile(component_id, key).then(resp => setFileContentFn(key, resp.data, selectedKeys), resp => T.prompt.error(resp.msg));
		} else {
			setFileContentFn(null, null, selectedKeys)
		}
	}

	/**
		* 监听操作
		* @param type
		* @param item
		*/
	onOperate(type, item) {
		const component_id = this.props.component_id;
		const filePath = item.key;
		const { selectedKeys, setFileContentFn } = this.props;

		if (type == EnumCodeTreeOperateType.del) {
			T.prompt.confirm(() => {
				return doDelDevFileOrDir(component_id, filePath).then(
					() => {
						T.prompt.success('操作成功');
						this.initDevComponentSpace();
						setFileContentFn(filePath, null, selectedKeys.filter(v => v !== filePath))
					},
					(resp) => {
						T.prompt.error(resp.msg);
					}
				);
			}, { title: '确定删除？' });

		} else if (type == EnumCodeTreeOperateType.upload) {
			T.helper.renderModal(<UploadFile
				filePath={filePath}
				component_id={parseInt(component_id)}
				initDevComponentSpaceCb={() => this.initDevComponentSpace()}
			/>)

		} else {
			T.helper.renderModal(<CodeTreeOperateModal
				operateType={type}
				filePath={filePath}
				component_id={parseInt(component_id)}
				name={type == EnumCodeTreeOperateType.edit ? item.title : null}
				initDevComponentSpaceCb={() => this.initDevComponentSpace()}
			/>)
		}
	}

	/**
		* 初始化开发组件空间
		*/
	initDevComponentSpace() {
		const component_id = this.props.component_id;

		this.setState({ loading: true }, () => {
			doInitDevComponentSpace(component_id).then(resp => {
				if (this.firstInitDevComponentSpace) {
					this.firstInitDevComponentSpace= false;
					this.props.refreshViewIframe && this.props.refreshViewIframe();
				}
				this.setState({ loading: false, data: [resp.data] });
			}, (resp) => {
				T.prompt.error(resp.msg);
				this.setState({ loading: false });
			})
		})
	}

	render() {
		const { data, loading } = this.state;
		const { selectedKeys = [] } = this.props;

		const loop = data => data.map((item) => {
			if ((item.children && item.children.length > 0) || item.isDir) {
				return <TreeNode key={item.key} title={<TreeTitle title={item.title} isFile={item.isFile} onOperate={(type) => this.onOperate(type, item)} />} data={item}>{loop(item.children)}</TreeNode>;
			}
			return <TreeNode key={item.key} title={<TreeTitle title={item.title} isFile={item.isFile} onOperate={(type) => this.onOperate(type, item)} />} data={item} />;
		});
		let srcNode = data.length > 0 && data[0] && data[0].children ? data[0].children.find(item => item.title === 'src') : null;

		return (
			<div></div>
			// <div className="code-file-tree" style={this.props.style}>
			// 	<div className="inner">
			// 		<BoxContent isNotData={data.length < 1} loading={loading}>
			// 			<Tree
			// 				showLine={true}
			// 				defaultExpandedKeys={data.length > 0 ? [data[0].key, srcNode ? srcNode.key : null].filter(Boolean) : []}
			// 				onSelect={this.onSelect}
			// 				selectedKeys={selectedKeys}
			// 			>
			// 				{loop(data)}
			// 			</Tree>
			// 		</BoxContent>
			// 	</div>
			// </div>
		);
	}
}

export default CodeFileTree;

const iconGapStyle = { marginLeft: 5 };
const iconDeleteGapStyle = { ...iconGapStyle, color: 'red' };
/**
	* 树结构子分支标题
	* @param {String} title
	* @param {Boolean} isFile
	* @param {Function} onOperate
	* @returns {XML}
	* @constructor
	*/
const TreeTitle = ({ title, isFile, onOperate }) => {
	const handleOperate = (event, type) => {
		event.stopPropagation();
		onOperate(type)
	}
	return (
		<div className="tree-item-header">
			<div className="name">
				{title}
			</div>

			<div className="btn">
				<div>
					{isFile ? null : <Icon type="plus" onClick={(event) => handleOperate(event, EnumCodeTreeOperateType.add)} />}
					{isFile ? null : <Icon type="upload" onClick={(event) => handleOperate(event, EnumCodeTreeOperateType.upload)} style={{ marginLeft: 5 }} />}
					<Icon type="edit" onClick={(event) => handleOperate(event, EnumCodeTreeOperateType.edit)} style={iconGapStyle} />
					<Icon type="delete" onClick={(event) => handleOperate(event, EnumCodeTreeOperateType.del)} style={iconDeleteGapStyle} />
				</div>
			</div>
		</div>
	)
};
TreeTitle.propTypes = {
	title: PropTypes.string.isRequired,
	isFile: PropTypes.bool.isRequired,
	onOperate: PropTypes.func.isRequired,
};

export { TreeTitle };
