/**
 * Created by chencheng on 17-8-30.
 */
import EnumRouter from 'constants/EnumRouter';
import { DefaultLayout, AssembleRoute } from 'routes/routeTool';
import Login from './routes/login';

export default AssembleRoute([
    {
        Layout: DefaultLayout,
        path: EnumRouter.login,
        component: Login,
    }
]);
