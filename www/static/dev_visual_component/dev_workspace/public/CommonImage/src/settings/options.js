/**
 * @description
 * @author vision <vision.shi@tianjishuju.com>
 * @license www.tianjishuju.com/license
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
    ComponentOptionsSetting,
    Form,
    FormItemGroup,
    FormItem,
    UploadImage,
    RadioGroup,
    Radio
} from 'datavi-editor/templates';

export default class OptionsSetting extends ComponentOptionsSetting {

    static propTypes = {
        options: PropTypes.object.isRequired,
        updateOptions: PropTypes.func.isRequired
    };

    getTabs() {
        return {
            chart: {
                label: '图片',
                content: () => this.renderText()
            }
        };
    }

    renderText() {

        const { options } = this.props;

        return (<Form>
            <FormItemGroup title="图片">
                <FormItem full>
                    <UploadImage
                        src={options.image}
                        onChange={image => this.updateOptions({ image })}
                    />

                </FormItem>
                <FormItem label="方式" full>
                    <RadioGroup
                        value={options.type}
                        onChange={event => this.updateOptions({ type: event.target.value })}
                    >
                        <Radio value="full">铺满</Radio>
                        <Radio value="contain">适应</Radio>
                        <Radio value="repeat">填充</Radio>
                    </RadioGroup>
                </FormItem>
            </FormItemGroup>
        </Form>);
    }
}
