/**
 * Created by chencheng on 17-8-30.
 */
import EnumRouter from 'constants/EnumRouter';
import { AssembleRoute } from 'routes/routeTool';
import CategoriesList from './routes/categoriesList';
import OrgList from './routes/orgList';
import ComponentList from './routes/componentList';
import ComponentChangeList from './routes/componentChangeList';
import ComponentChangeDetail from './routes/componentChangeDetail';
import ComponentCreate from './routes/componentCreate';
import SceneManage from './routes/sceneManage';

import categoriesListReducer from './reducers/categoriesListReducer';
import componentListReducer from './reducers/componentListReducer';
import orgListReducer from './reducers/orgListReducer';

export default AssembleRoute([
    {
        path: EnumRouter.v_component_categoriesList,
        component: CategoriesList,
        reducers: [categoriesListReducer]
    },
    {
        path: EnumRouter.v_org_list,
        component: OrgList,
        reducers: [orgListReducer]
    },
    {
        path: EnumRouter.v_component_list,
        component: ComponentList,
        reducers: [componentListReducer]
    },
    {
        path: EnumRouter.v_component_change_list,
        component: ComponentChangeList,
    },
    {
        path: EnumRouter.v_component_change_detail,
        component: ComponentChangeDetail,
    },
    {
        path: EnumRouter.v_component_create,
        component: ComponentCreate,
    },
    {
        path: EnumRouter.v_scene_manage,
        component: SceneManage,
    }
]);

