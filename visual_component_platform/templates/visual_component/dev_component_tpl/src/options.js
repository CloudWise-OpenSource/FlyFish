module.exports = (component_mark) => `
import React from 'react';
import {
    ComponentOptionsSetting,
    Form,
    FormItemGroup,
    FormItem,
    Input,
} from 'datavi-editor/templates';

export default class OptionsSetting extends ComponentOptionsSetting {
    
  getTabs() {
    return {
      
    };
  }
}
`;