/**
 * Created by chencheng on 17-8-30.
 */
import EnumRouter from 'constants/EnumRouter';
import EnumMenuPermission from 'constants/EnumMenuPermission';
import { AssembleRoute } from 'routes/routeTool';

import OperateLogList from './routes/operateLogList';
import LogoManage from './routes/logoManage';
import TagManage from './routes/tagManage';
import operateLogListReducer from './reducers/operateLogListReducer';

export default AssembleRoute([
    {
        path: EnumRouter.system_operateLogList,
        permissionMark: EnumMenuPermission.systemM_operateLogList,
        component: OperateLogList,
        reducers: [operateLogListReducer]
    },
    {
       path: EnumRouter.system_logo_manage,
       permissionMark: EnumMenuPermission.systemM_logoManage,
       component: LogoManage,
    },
    {
        path: EnumRouter.system_tag_manage,
        permissionMark: EnumMenuPermission.systemM_tagManage,
        component: TagManage
    }
]);

