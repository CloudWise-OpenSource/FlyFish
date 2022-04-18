/**
 * Created by chencheng on 17-8-30.
 */
import EnumRouter from 'constants/EnumRouter';
import EnumMenuPermission from 'constants/EnumMenuPermission';
import { AssembleRoute } from 'routes/routeTool';

import Img from './routes/img';
import ImgGroup from './routes/group';

import imgReducer from './reducers/imgReducer';

export default AssembleRoute([
    {
        path: EnumRouter.fileManager_img,
        permissionMark: EnumMenuPermission.fileManager_img,
        component: Img,
        reducers: [imgReducer]
    },
    {
        path: EnumRouter.fileManager_imgGroup,
        permissionMark: EnumMenuPermission.fileManager_imgGroup,
        component: ImgGroup,
        reducers: [imgReducer]
    },
]);

