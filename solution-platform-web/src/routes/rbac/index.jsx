/**
 * Created by chencheng on 17-8-30.
 */
import EnumRouter from 'constants/EnumRouter';
import EnumMenuPermission from 'constants/EnumMenuPermission';
import { AssembleRoute } from 'routes/routeTool';

import UserList from './routes/userList';
import RoleList from './routes/roleList';
import GroupList from './routes/groupList';
import Permission from './routes/permission';

import userListReducer from './reducers/userListReducer';
import roleListReducer from './reducers/roleListReducer';
import groupListReducer from './reducers/groupListReducer';

export default AssembleRoute([
    {
        path: EnumRouter.rbac_userList,
        permissionMark: EnumMenuPermission.userM_userList,
        component: UserList,
        reducers:[userListReducer]
    },
    {
        path: EnumRouter.rbac_roleList,
        permissionMark: EnumMenuPermission.userM_roleList,
        component: RoleList,
        reducers:[roleListReducer]
    },
    {
        path: EnumRouter.rbac_groupList,
        permissionMark: EnumMenuPermission.userM_groupList,
        component: GroupList,
        reducers:[groupListReducer]
    },
    {
        path: EnumRouter.rbac_permission,
        permissionMark: EnumMenuPermission.userM_permissionList,
        component: Permission,
    },
]);

