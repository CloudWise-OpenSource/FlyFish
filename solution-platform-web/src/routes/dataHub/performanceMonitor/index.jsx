/**
 * Created by chencheng on 17-8-30.
 */
import EnumRouter from 'constants/EnumRouter';
import EnumMenuPermission from 'constants/EnumMenuPermission';

import HubMonitorList from './routes/hubMonitorList';
import PluginMonitorList from './routes/pluginMonitorList';
import HostMonitorList from './routes/hostMonitorList';

import hubMonitorListReducer from './reducers/hubMonitorList';
import pluginMonitorListReducer from './reducers/pluginMonitorList';
import hostMonitorListReducer from './reducers/hostMonitorList';


export default [
    {
        path: EnumRouter.dHub_hubMonitorList,
        permissionMark: EnumMenuPermission.dataCollect_pm_hub,
        component: HubMonitorList,
        reducers: hubMonitorListReducer
    },
    {
        path: EnumRouter.dHub_pluginMonitorList,
        permissionMark: EnumMenuPermission.dataCollect_pm_plugin,
        component: PluginMonitorList,
        reducers: pluginMonitorListReducer
    },
    {
        path: EnumRouter.dHub_hostMonitorList,
        permissionMark: EnumMenuPermission.dataCollect_pm_host,
        component: HostMonitorList,
        reducers: hostMonitorListReducer
    },

];

