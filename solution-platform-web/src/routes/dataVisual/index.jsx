/**
 * Created by chencheng on 17-8-30.
 */
import EnumRouter from 'constants/EnumRouter';
import EnumMenuPermission from 'constants/EnumMenuPermission';
import { AssembleRoute } from 'routes/routeTool';
import BigScreen from './routes/bigScreen';
import Three3DEdit from './routes/3dEdit';

import screenListReducer from './reducers/screenListReducer';

export default AssembleRoute([
    {
        path: EnumRouter.dVisual_bigScreen,
        permissionMark: EnumMenuPermission.dv_bigScreen,
        component: BigScreen,
        reducers: [screenListReducer]
    },
    {
        path: EnumRouter.dVisual_3dEdit,
        component: Three3DEdit,
        reducers: []
    }
]);

