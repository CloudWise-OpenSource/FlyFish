/**
 * Created by chencheng on 17-8-30.
 */
import EnumRouter from 'constants/EnumRouter';
import EnumMenuPermission from 'constants/EnumMenuPermission';

import PluginList from './routes/pluginList';
import PluginUpload from './routes/pluginUpload';
import PluginConf from './routes/pluginConf';
import PluginLog from './routes/pluginLog';
import PluginTask from './routes/pluginTask/index';
import PluginWorker from './routes/pluginWorker/index'

import PluginListReducer from './reducers/pluginList'
import PluginUploadReducer from './reducers/pluginUpload'
import PluginConfReducer from './reducers/pluginConf'
import PluginLogReducer from './reducers/pluginLog'


export default [
    {
        path: EnumRouter.dHub_pluginList,
        permissionMark: EnumMenuPermission.dataCollect_collector,
        component: PluginList,
        reducers:PluginListReducer
    },
    {
        path: EnumRouter.dHub_pluginUpload,
        permissionMark: EnumMenuPermission.dataCollect_collector,
        component: PluginUpload,
        reducers:PluginUploadReducer
    },
    {
        path: EnumRouter.dHub_pluginConf,
        permissionMark: EnumMenuPermission.dataCollect_collector,
        component: PluginConf,
        reducers:PluginConfReducer
    },
    {
        path: EnumRouter.dHub_pluginLog,
        permissionMark: EnumMenuPermission.dataCollect_collector,
        component: PluginLog,
        reducers:PluginLogReducer
    },
    {
        path: EnumRouter.dHub_pluginTask,
        permissionMark: EnumMenuPermission.dataCollect_collector,
        component: PluginTask,

    },
    {
        path: EnumRouter.dHub_pluginWorker,
        permissionMark: EnumMenuPermission.dataCollect_collector,
        component: PluginWorker,
    }
];

