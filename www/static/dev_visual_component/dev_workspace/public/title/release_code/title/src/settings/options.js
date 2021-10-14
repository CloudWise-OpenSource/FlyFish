
import React from 'react';
import {
    ComponentOptionsSetting,
    Form,
    Select,
    FormItemGroup,
    ColorPickerInput,
    InputNumber,
    FormItem,
    Input,
    Radio,
} from 'datavi-editor/templates';

const { TextArea } = Input;
export default class OptionsSetting extends ComponentOptionsSetting {
    constructor(props){
        super(props);
        const { text, isLink, hrefUrl, isNewWindow, color, fontSize, fontFamily, fontWeight, justifyContent, alignItems } = props.options;
        this.state = {
            text,
            isLink,
            hrefUrl,
            isNewWindow,
            color,
            fontFamily,
            fontWeight,
            fontSize,
            justifyContent,
            alignItems
        }
    }

    /**
     * 获取Tabs项
     */
    getTabs() {
        return {
            config: {
                label: '配置',
                content: () =>  this.renderTitle()
            },
        }
    }

    /**
     * 渲染标题
     */
    renderTitle(){
        const { options = {} } = this.props;
        const { text = '', hrefUrl = '' } = this.state;
        return <Form>
            <FormItemGroup>
                <div style={{fontSize: 14, fontWeight: 700, padding: '10px 0'}}>内容</div>
                <FormItem>
                    <TextArea
                        placeholder="支持HTML标签写法"
                        value={text}
                        onChange={event => this.setState({ text: event.target.value })}
                        rows="6" autosize={{ minRows: 4, maxRows: 10 }}
                        onBlur={() => this.updateOptions({ text: text })}
                    />
                </FormItem>
            </FormItemGroup>

            {/* 文字 */}
            <FormItemGroup title={'文字'} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <FormItem label="字体样式">
                    <Select
                        placeholder="请选择字体样式"
                        value={options.fontFamily}
                        onChange={value => this.updateOptions({fontFamily: value})}
                    >
                    {
                        ['inherit', 'serif', 'sans-serif', 'cursive', 'fantasy', 'monospace'].map(item=> <Option key={item} value={item}>{item}</Option>)
                    }
                    </Select>
                </FormItem>
                <FormItem label="字体大小">
                    <InputNumber
                        value={parseInt(options.fontSize)}
                        min={12}
                        onChange={value => this.updateOptions({ fontSize: value })}
                    />
                </FormItem>
                <FormItem label="字体粗细">
                    <Select
                        placeholder="请选择字体样式"
                        value={options.fontWeight}
                        onChange={value => this.updateOptions({fontWeight: value})}
                    >
                    {
                        [100, 200, 300, 400, 500, 600, 700, 800].map(item=> <Option key={item} value={item}>{item}</Option>)
                    }
                    </Select>
                </FormItem>
                <FormItem label="字体颜色">
                    <ColorPickerInput
                        value={options.color}
                        onChange={color => this.updateOptions({ color: color })}
                    />
                </FormItem> 
                <FormItem label="水平对齐">
                    <div style={{width: '115px'}}>
                        <Radio.Group 
                            onChange={event => this.updateOptions({ justifyContent: event.target.value })} 
                            value={options.justifyContent}>
                            <Radio value={'flex-start'}>左</Radio>
                            <Radio value={'center'}>中</Radio>
                            <Radio value={'flex-end'}>右</Radio>
                        </Radio.Group>
                    </div>
                </FormItem> 
                <FormItem label="垂直对齐">
                    <div style={{width: '115px'}}>
                        <Radio.Group 
                            onChange={event => this.updateOptions({ alignItems: event.target.value })} 
                            value={options.alignItems}>
                            <Radio value={'flex-start'}>上</Radio>
                            <Radio value={'center'}>中</Radio>
                            <Radio value={'flex-end'}>下</Radio>
                        </Radio.Group>
                    </div>
                </FormItem>
            </FormItemGroup>
            
            {/* 行为 */}
            <div style={{fontSize: 14, fontWeight: 700, padding: '10px 0', borderTop: '1px solid #ccc'}}>行为</div>
            <FormItem label="是否开启链接跳转">
                <div style={{width: '115px'}}>
                    <Radio.Group 
                        onChange={event => this.updateOptions({ isLink: event.target.value })} 
                        value={options.isLink}>
                        <Radio value={true}>开启</Radio>
                        <Radio value={false}>关闭</Radio>
                    </Radio.Group>
                </div>
            </FormItem> 
            <FormItem label="链接地址">
                <Input
                    placeholder="请输入点击跳转Url"
                    value={hrefUrl}
                    onChange={event => this.setState({ hrefUrl: event.target.value })}
                    onBlur={() => this.updateOptions({ hrefUrl: hrefUrl })}
                />
            </FormItem>
            <FormItem label="超链接打开窗口方式">
                <Radio.Group 
                    onChange={event => this.updateOptions({ isNewWindow: event.target.value })} 
                    value={options.isNewWindow}>
                    <Radio value={true}>新窗口</Radio>
                    <Radio value={false}>当前窗口</Radio>
                </Radio.Group>
            </FormItem>
        </Form>
    }
}
