/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { message, Upload, Modal } from "@chaoswise/ui";
import { observer, loadingStore, toJS } from "@chaoswise/cw-mobx";
import { successCode } from "@/config/global";

const AppProjectManage = observer(({ activeItem = {}, onCancel, onSave, datasourceId }) => {
   
    const uploadProps = {
        name: 'file',
        multiple: true,
        accept:'.csv,.json',
        showUploadList:false,
        data: { datasourceId },
        action: `${window.LCAP_CONFIG.javaApiDomain}/api/dataplateform/datatable/addTableFile`,
        onChange(info) {
            const { status, response } = info.file;
            if (status == 'done') {
                if (response.code == successCode) {
                    onCancel && onCancel(false);
                    message.success('上传成功!');
                    onSave();
                } else {
                    message.error(response.msg || '上传失败!');
                }
            }
        },
        showUploadModal: false
    };
    const changeUploadProps = {
        name: 'file',
        multiple: true,
        showUploadList:false,
        accept:'.csv,.json',
        data: { datasourceId: activeItem.datasourceId, tableName: activeItem.tableName },
        action: `${window.LCAP_CONFIG.javaApiDomain}/api/dataplateform/datatable/updateTableFile`,
        onChange(info) {
            const { status, response } = info.file;
            if (status == 'done') {
                if (response.code == successCode) {
                    onCancel && onCancel(false);
                    message.success('更新成功!');
                    onSave();
                } else {
                    message.error(response.msg || '更新失败!');
                }
            }
        },
        showUploadModal: false
    };
    const Props = Object.keys(activeItem).length > 0 ? changeUploadProps : uploadProps;
    return (
        <Modal
            className='myModal'
            draggable
            style={{ marginTop: '10vh', marginBtoom: '20px' }}
            okText='确认'
            title={Object.keys(activeItem).length > 0 ? '更新文件' : '上传文件'}
            footer={null}
            onCancel={() => { onCancel(false); }}
            visible={true}
        >
            <div style={{ paddingBottom: '20px' }}>
                <Upload.Dragger
                    {...Props}
                >
                </Upload.Dragger>

            </div>
        </Modal>
    );
});
export default AppProjectManage;
