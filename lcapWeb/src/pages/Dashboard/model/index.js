import { toMobx } from '@chaoswise/cw-mobx';
import { reqApplicationList, reqTagsList, reqTotalNum, deleteApplication, addApplication, changeApplication, reqProjectList, copyApplication, } from "../services";
import _ from "lodash";


const model = {
    // 唯一命名空间
    namespace: "DashboardStore",
    // 状态
    state: {
        projectList: [],
        swiperData: [],
        topTotal: [],
        otherTotal: {},
        IsLibApplicationList: [],
        slider: null,
        carouselPage: 1,
        key: '2D',
        applicationList: [],
        tagList: [],
        total: 0,
        cardItems: [],
        curPage: 0,
        pageSize: 6,
        activeCard: {},
        activeProject: null,
        isAddModalVisible: false,
    },
    effects: {
        *getTopTotal() {
            const res = yield reqTotalNum();
            this.setTopTotal(res);
        },
        *getProjectList() {
            const res = yield reqProjectList();
            this.setProjectList(res);
        },
        *deleteApplicationOne(id, callback) {
            const res = yield deleteApplication(id);
            callback && callback(res);
        },
        *getTagsList() {
            const res = yield reqTagsList({ type: 'application' });
            this.setTagList(res);
        },
        *changeApplicationOne(id, params = {}, callback) {
            const res = yield changeApplication(id, params);
            callback && callback(res);
        },
        *addApplicationOne(params = {}, callback) {
            const res = yield addApplication(params);
            callback && callback(res);
        },
        *copyApplicationOne(id, option, callback) {
            const res = yield copyApplication(id, option);
            callback && callback(res);
        },
        *getApplicationList(params = {}) {
            let isLibOptions = {
                isLib: true,
                isRecommend: true,
                type: this.key || '2D',
                curPage: 0,
                pageSize: 6,
                ...params,
            };
            let options = {
                type: this.key || '2D',
                curPage: 0,
                pageSize: 5,
                ...params,
            };
            const isLibRes = yield reqApplicationList(isLibOptions);
            const res = yield reqApplicationList(options);
            this.setIsLibResApplicationList(isLibRes);
            this.setApplicationList(res);
        },
    },
    reducers: {
        setKeys(key) {
            this.key = key;
        },
        setTopTotal(res) {
            this.topTotal = res.data;
            this.otherTotal = {
                application: res.data.tpl.application, component: res.data.tpl.component,
                api: res.data.yapi.api, group: res.data.yapi.group,
            };
            this.cardItems = [
                { id: 1, title: ['项目总数'], indexes: [res.data.project] },
                { id: 2, title: ['应用总数'], indexes: [res.data.application] },
                { id: 3, title: ['组件总数'], indexes: [res.data.component] },
                { id: 4, title: ['应用模板总数', '组件模板总数'], indexes: [this.otherTotal.application, this.otherTotal.component] },
                { id: 5, title: ['服务总数', '接口总数'], indexes: [this.otherTotal.group, this.otherTotal.api] },
                this.otherTotal.data ? { id: 6, title: ['数据来源', '模型数据'], indexes: [0, 0] } : { id: 6, title: ['数据来源'], noData: true },
            ];
        },
        setProjectList(res) {
            this.projectList = res.data.list;
        },
        setTagList(res) {
            this.tagList = res.data;

        },
        openAddProjectModal(project) {
            this.activeProject = _.clone(project);
            this.isAddModalVisible = true;
        },
        setActiveCard(item) {
            if (item) {
                this.activeCard = {
                    ...item,
                    projects: item.projects ? item.projects.id : [],
                    tags: item.tags.map(item => item.name)
                };
            } else {
                this.activeCard = {};
            }
        },
        setSlider(obj) {
            this.slider = obj;
        },
        setCarouselPage(page) {
            this.carouselPage = page ? 0 : 1;
        },

        closeAppProjectModal() {
            this.activeProject = null;
            this.isAddModalVisible = false;
        },
        setIsLibResApplicationList(res) {
            this.IsLibApplicationList = res.data;
            if (res.data.list.length !== 0) {
                if (res.data.list.length < 4) {
                    this.swiperData = [[...res.data.list.slice(0, 3)]];
                } else {
                    this.swiperData = [[...res.data.list.slice(0, 3)], [...res.data.list.slice(3)]];
                }
            } else {
                this.swiperData = [];
            }
        },
        setApplicationList(res = {}) {
            this.applicationList = res.data;
        },
    },
};

export default toMobx(model);