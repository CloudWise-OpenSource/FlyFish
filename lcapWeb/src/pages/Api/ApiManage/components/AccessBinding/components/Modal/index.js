import React from "react";
import { Modal, Input, Select, Form,Icon } from "@chaoswise/ui";
import { useIntl } from "react-intl";
import { toJS } from "@chaoswise/cw-mobx";

export default Form.create({ name: "FORM_IN_PROJECT_MODAL" })(
  function EditProjectModal({ flag, list, form, onChange, activeApi = {}, onSave, onCancel }) {
    const intl = useIntl();
    let selectArr = toJS(list);//下拉框总数据
    const { getFieldDecorator } = form;
    return (
        <Modal
        draggable
        okText='确认'
        size="small"
        style={{marginTop:'20vh'}}
        onCancel={onCancel}
        visible={true}
      >
        <span style={{ display: 'flex', alignItems: 'center', padding: '40px 20px' }}>
          <Icon type="question-circle" style={{ fontSize: '20px', marginRight: '10px', color: '#faad14' }} />
          <span style={{ fontSize: '16px' }}>
           {`确定${flag?'停用':'启用'}<${activeApi.name}>吗`}
          </span>
        </span>
      </Modal>
    );
  }
);
