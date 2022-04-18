/**
 * Created by chencheng on 17-8-30.
 */
import EnumRouter from 'constants/EnumRouter';
import { AssembleRoute } from 'routes/routeTool';

import UserList from './routes/userList';
import RoleList from './routes/roleList';
import AccessTokenList from './routes/accessTokenList';


import userListReducer from './reducers/userListReducer';
import roleListReducer from './reducers/roleListReducer';
import accessTokenListReducer from './reducers/accessTokenListReducer';

export default AssembleRoute([
    {
        path: EnumRouter.rbac_userList,
        component: UserList,
        reducers:[userListReducer]
    },
    {
        path: EnumRouter.rbac_roleList,
        // permissionMark: EnumMenuPermission.userM_roleList,
        component: RoleList,
        reducers:[roleListReducer]
    },
    {
        path: EnumRouter.rbac_accessTokenList,
        component: AccessTokenList,
        reducers:[accessTokenListReducer]
    },
]);

