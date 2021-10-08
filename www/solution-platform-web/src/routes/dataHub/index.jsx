/**
 * Created by chencheng on 17-8-30.
 */
import { AssembleRoute } from 'routes/routeTool';

import pluginManage from './pluginManage';
import performanceMonitor from './performanceMonitor';
import collectMonitor from './collectMonitor';


export default AssembleRoute(pluginManage, performanceMonitor, collectMonitor);

