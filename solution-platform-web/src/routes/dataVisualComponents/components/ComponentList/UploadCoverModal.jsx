/**
 * Created by chencheng on 17-8-31.
 */
import PropTypes from 'prop-types';
import T from 'utils/T';

import { Component } from 'react';
import { Row, Col, Icon, Button, Upload } from 'antd';
import Modal from 'templates/ToolComponents/Tj_Modal';
import { doUploadComponentCover } from "../../action/component";
import EnumAPI from "../../../../constants/EnumAPI";

@T.decorator.propTypes({
	component_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]).isRequired,
    getComponentListCb: PropTypes.func.isRequired
})
export default class UploadCoverModal extends Component {
	static defaultProps = {
        component_id: false,
        getComponentListCb: () => {}
	}

    constructor() {
        super();
        this.state = {
            saving: false,      // 保存数据过程状态
			visible: false,		// 是否显示modal
            previewVisible: false,
            previewImage: '',
            coverList: [],
        };
    }

	componentDidMount() {
    	this.setState({visible: true})
	}

    /**
     * 保存
     */
    saveCover = () => {
		const { coverList } = this.state;

		if (coverList.length < 1) {
			T.prompt.error("请选择要上传的文件");
			return false;
		}

		this.setState({ saving: true }, () => {
			const { component_id } = this.props;

			const thenParams = [
				() => {
					this.setState({saving: false, visible: false});
					this.props.getComponentListCb();
					T.prompt.success('上传成功');
				},

				resp => {
					this.setState({saving: false});
					T.prompt.error(resp.msg);
				}
			];


            doUploadComponentCover({ component_id, cover: coverList}).then(...thenParams);

		})
    }

    render() {
        const { saving, visible, coverList , previewVisible, previewImage,} = this.state;

        const props = {
            accept:"image/*",
            fileList: coverList,
            onPreview: (file) => {
                this.setState({
                    previewImage: file.url || file.thumbUrl,
                    previewVisible: true,
                });
            },
            onRemove: (file) => {
                this.setState(({ coverList }) => {
                    const index = coverList.indexOf(file);
                    const newFileList = coverList.slice();
                    newFileList.splice(index, 1);
                    return {
                        coverList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {

                this.setState(({ coverList }) => ({
                    coverList: [file]
                }));

                // 禁止自动上传
                return false;
            },
        };

        return (<Modal
				title={"上传封面"}
				key={1}
				visible={visible}
				onCancel={() => this.setState({visible: false})}
				footer={[
					<Button key="back" onClick={() => this.setState({visible: false})}>取消</Button>,
					<Button key="submit" type="primary" loading={saving} onClick={this.saveCover}>
						保存
					</Button>,
				]}
			>
				<Row type="flex" align="middle" justify="center">
					<Col span={18}>
						<Upload {...props}>
							<Button>
								<Icon type="upload" /> 选择封面
							</Button>
						</Upload>
                        {
                            coverList.length> 0 && <ul>
                                <li>文件名称：{coverList[0].name}</li>
                                <li>文件大小：{(coverList[0].size / 1024).toFixed(2)} KB</li>
                                <li>文件类型：{coverList[0].type}</li>
                                <li>最近修改时间:{T.helper.dateFormat(coverList[0].lastModified)}</li>
                            </ul>
                        }
					</Col>
				</Row>
			</Modal>
        );
    }
}
