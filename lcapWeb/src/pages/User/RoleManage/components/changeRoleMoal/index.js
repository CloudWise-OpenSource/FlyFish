import React from "react";
import { Modal, Form } from "@chaoswise/ui";
import { useIntl } from "react-intl";
import { Transfer, Row, Col } from 'antd';
import { observer, loadingStore, toJS } from '@chaoswise/cw-mobx';

import store from "../../model/index";

export default Form.create({ name: "FORM_IN_USER_MODAL" })(
    function ChangeRoleModal({ id, form, project = {}, checkProject = {}, onSave, onCancel }) {
        // let new1=toJS(checkProject);
        let [new1, setnew1] = React.useState(toJS(checkProject));
        let flag = false;
        const endData = project.map(item => {
            return {
                key: item.id,
                disabled: item.status === 'invalid',
                userName: item.username,
                userEmail: item.email
            };
        });
        const handleChange = (nextTargetKeys) => {
            setnew1(nextTargetKeys);
        };
        return (
            <Modal
                width={900}
                draggable
                onCancel={() => onCancel && onCancel()}
                onOk={() => {

                    onSave && onSave(id, { members: new1 });
                }}
                size="middle"
                title='管理成员'
                visible={true}
            >
                <Row type="flex" justify="center">
                    <Col>
                        <Transfer
                            dataSource={endData}
                            showSearch
                            listStyle={{
                                width: 350,
                                height: 300,
                            }}
                            titles={['待添加成员', '已添加成员']}
                            searchPlaceholder="搜索成员"
                            operations={['添加', '移除']}
                            targetKeys={new1}
                            onChange={handleChange}
                            render={item => `${item.userName}-${item.userEmail}`}
                        />
                    </Col>
                </Row>

            </Modal>
        );
    }
);
