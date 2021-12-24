/**
 * Created by chencheng on 17-8-30.
 */
import EnumRouter from 'constants/EnumRouter';
import EnumMenuPermission from 'constants/EnumMenuPermission';

import MonitorList from './routes/monitorList';


export default [
    {
        path: EnumRouter.dHub_collectMonitorList,
        permissionMark: EnumMenuPermission.dataCollect_cm,
        component: MonitorList,
    },
];

