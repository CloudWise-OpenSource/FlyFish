/**
 * Created by chencheng on 17-8-30.
 */
import EnumRouter from 'constants/EnumRouter';
import { DefaultLayout, AssembleRoute } from 'routes/routeTool';
import Login from './routes/login';
import Registry from './routes/registry';

export default AssembleRoute([
    {
        Layout: DefaultLayout,
        path: EnumRouter.login,
        component: Login,
    },
    {
        Layout: DefaultLayout,
        path: EnumRouter.registry,
        component: Registry,
    }
]);
