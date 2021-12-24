/**
 * Created by chencheng on 17-8-30.
 */
import EnumRouter from 'constants/EnumRouter';
import { AssembleRoute } from 'routes/routeTool';
import ComponentList from './routes/componentList';



import componentListReducer from './reducers/componentListReducer';

export default AssembleRoute([
    {
        path: EnumRouter.v_component_list,
        component: ComponentList,
        reducers: [componentListReducer]
    }
]);

