import {PureComponent} from 'react';
import {Upload,Button} from 'antd';
import { MainHeader, MainContent } from 'templates/MainLayout';
import EnumAPI from 'constants/EnumAPI';
import T from "utils/T";
const baseURL = ENV.mock.isStart ? ENV.mock.apiDomain : ENV.apiDomain;

export default class LogoManage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            fileList:[]
        }
    }

    render() {
        const {fileList} = this.state;
        const props = {
            action:baseURL+EnumAPI.system_uploadLogo,
            withCredentials:true,
            fileList:fileList,
            onChange:(info)=>{
                let {fileList} = info;
                fileList = fileList.filter((file) => {
                    if (file.response) {
                        if (file.response.code === 0){
                            T.prompt.success(file.response.msg);
                            return true;
                        }else if (file.status === 'error'){
                            T.prompt.error('上传失败');
                        }
                    }
                    return true;
                });
                this.setState({
                    fileList:fileList
                })
            },
            beforeUpload:(file)=>{
                //上传前先清空
                this.setState({
                    fileList:[]
                })
            }
        };

        return (
            <div>
                <MainHeader title={'logo管理'}/>
                <MainContent>
                    <Upload
                        {...props}
                    >
                       <Button>文件上传</Button>
                    </Upload>
                </MainContent>
            </div>
        )
    }
}
