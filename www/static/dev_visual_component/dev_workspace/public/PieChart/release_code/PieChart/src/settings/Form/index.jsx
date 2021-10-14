import * as React from 'react';
import {
  Form as FormV3,
  FormItem as FormItemV3,
} from 'datavi-editor/templates';

import { validElementType, noop } from './utils';
import { ESCAPEELEMENTTYPE } from './constant';

class Form extends React.Component {
  FormInstance = null;

  constructor(props) {
    super(props);
    this.create(props);
  }

  create = (props) => {
    const {
      name,
      initialValues,
      onFieldsChange = noop,
      onValuesChange = noop,
      forwardForm = noop,
      ...restProps
    } = props;

    this.FormInstance = FormV3.create({
      name,
      onValuesChange,
      onFieldsChange,
      mapPropsToFields() {
        if (initialValues) {
          return Object.fromEntries(Object.entries(initialValues).map(([key, value]) => ([key, FormV3.createFormField({
            value
          })])))
        }
        return {};
      }
    })(({ children, form: decoratorForm, ...props }) => {
      forwardForm(decoratorForm)
      return (
        <FormV3 {...props} {...restProps}>
          {
            children && React.Children.count(children) >= 1
              ?
              this.decoratorChild(decoratorForm, children)
              :
              children
          }
        </FormV3>
      )
    })
  }

  decoratorChild = (decoratorForm, children, parentIndex) => {
    return [children].flat().map((container, index) => {
      const key = parentIndex ? [parentIndex, index].join('-') : index;
      if (container && container.type && container.type.displayName === 'ShareFormItem') {
        return React.cloneElement(container, {
          key,
          getFieldDecorator: decoratorForm.getFieldDecorator,
        })
      } else if (container && container.props) {
        const groupChildren = container.props.children;
        const renderChildren = this.decoratorChild(decoratorForm, groupChildren, key);
        return React.cloneElement(container, {
          key,
        }, renderChildren)
      }
      return container;
    })
  }

  shouldComponentUpdate() {
    // 阻止rerender
    return false;
  }

  render() {
    const {
      name,
      initialValues,
      onFieldsChange = noop,
      onFinish = noop,
      onFinishFailed = noop,
      onValuesChange = noop,
      validateMessages,
      forwardForm = noop,
      ...restProps
    } = this.props

    return <this.FormInstance {...restProps} />
  }
}

const FormItem = ({
  children,
  name,
  // enum getFieldDecorator options
  rules = [],
  getValueFromEvent,
  initialValue,
  normalize,
  preserve,
  trigger,
  validateFirst,
  validateTrigger,
  valuePropName,
  // enum getFieldDecorator options end
  getFieldDecorator = (name, options) => (element) => element,
  ...restProps
}) => {
  if (children && React.Children.count(children) === 1 && shouldWrapper(children.type)) {
    const options = Object.fromEntries(Object.entries({
      rules,
      getValueFromEvent,
      initialValue,
      normalize,
      preserve,
      trigger,
      validateFirst,
      validateTrigger,
      valuePropName,
    }).filter(([key, value]) => value))
    return (
      <FormItemV3 {...restProps}>
        {
          getFieldDecorator(name, options)(children)
        }
      </FormItemV3>
    );
  }
  return children;
}

FormItem.displayName = 'ShareFormItem'

Form.Item = FormItem;

export default Form;

export {
  FormItem
}

/**
 * 是否需要包裹双向绑定函数
 * @param {string} elementType 
 * @returns 
 */
function shouldWrapper(elementType) {
  return !ESCAPEELEMENTTYPE.includes(elementType) && validElementType(elementType);
}