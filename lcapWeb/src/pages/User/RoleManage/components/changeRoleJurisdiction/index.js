import React from "react";
import { Modal, Form, message,Tree } from "@chaoswise/ui";
import { useIntl } from "react-intl";
import {
    toJS
} from "@chaoswise/cw-mobx";
const { TreeNode } = Tree;
import styles from './style.less';
export default Form.create({ name: "FORM_IN_USER_MODAL" })(
    function ChangeRoleJurisdiction({ close, checkProject, menuList, form, project = {}, onSave, onCancel }) {
        let menuListData = toJS(menuList);
        let oldData = toJS(project);
        // 默认选中的节点url
        let new1 = oldData.menus.map(item => item.url);
        let end = new1.filter(item => item !== '/app' && item !== '/template' && item !== '/user' && item !== '/api');

        let sendarr = [];
        sendarr = { menus: project.menus };
        // 选中组合数据
        const onCheck = (checkedKeys, event) => {
            let sendMenuArr = event.checkedNodes.map(item => {
                return {
                    name: item.props.title,
                    url: item.key
                };

            });
            let flagArr = [];
            menuListData.map(item => {
                if (item.children) {
                    let aa = JSON.parse(JSON.stringify(item));
                    delete aa.children;
                    flagArr.push(aa, ...item.children);
                } else {
                    flagArr.push(item);
                }
            });
            event.halfCheckedKeys.forEach(item => {
                let father = toJS(menuList.find(item1 => item1.url === item));
                delete father.children;
                sendMenuArr.push(father);
            });

            let oldChildren = [];
            sendMenuArr && sendMenuArr.length > 0 && sendMenuArr.map(item => {
                let childrenOne = toJS(flagArr.find(item1 => {
                    return item1.name === item.name;
                }));
                oldChildren.push(childrenOne);
            });
            oldChildren.sort((a, b) => a.index - b.index);
            sendarr = { menus: oldChildren };
        };
        // 默认展开所有一级
        let checkarr = [];
        let arr1 = menuListData && menuListData.map((item, index) => {
            checkarr.push(item.url);
            let arr2 = item.children && item.children.map((item, index) => {
                return (
                    <TreeNode title={item.name} key={item.url} />
                );

            });
            return (
                <TreeNode title={item.name} key={item.url}>
                    {arr2}
                </TreeNode>
            );
        });
        return (
            <Modal
                draggable
                onCancel={() => onCancel && onCancel()}
                onOk={() => {
                    onSave && onSave(sendarr);

                }}
                size="middle"
                title='设置栏目权限'
                visible={true}
            >
                <Tree
                    className={styles.roleModal}
                    checkable
                    defaultExpandedKeys={checkarr}
                    defaultCheckedKeys={end}
                    onCheck={onCheck}
                >
                    {arr1}
                </Tree>
            </Modal>
        );
    }
);
