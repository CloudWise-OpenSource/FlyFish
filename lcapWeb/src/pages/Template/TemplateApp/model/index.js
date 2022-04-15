import { toMobx } from '@chaoswise/cw-mobx';
import { getApplicationTemplateService, reqTagsList, changeApplication, copyApplication, getTradesService, getTagsService, reqProjectList } from "../services";
import _ from "lodash";

const model = {
    // 唯一命名空间
    namespace: "ApplicationTemplate",
    // 状态
    state: {
        searchParams: {},
        applicationList: [],
        total: 0,
        pageSize: 12,
        curPage: 0,
        type: '',
        tradesList: [],
        tagsList: [],
        activeCard: {},
        isAddModalVisible: false,
        activeProject: {},
        projectList: []
    },
    effects: {
        *changeApplicationOne(id, params = {}, callback) {
            const res = yield changeApplication(id, params);
            callback && callback(res);
        },
        *getProjectList() {
            const res = yield reqProjectList();
            this.setProjectList(res);
        },
        *getApplicationList(params = {}) {
            let options = {
                isLib: true,
                type: this.type || '2D',
                curPage: this.curPage,
                pageSize: this.pageSize,
                ...this.searchParams,
                ...params,
            };
            const res = yield getApplicationTemplateService(options);
            this.setApplicationList(res);
        },
        *getTradesList() {
            const res = yield getTradesService();
            this.setTradesList(res.data.list);
        },
        *getTagsList() {
            const res = yield reqTagsList({ type: 'application' });
            this.setTagsList(res.data);
        },
        *copyApplicationOne(id, option, callback) {
            const res = yield copyApplication(id, option);
            callback && callback(res);
        },
    },
    reducers: {
        setActiveCard(item) {
            if (item) {
                this.activeCard = {
                    ...item,
                    projects: item.projects.id,
                    tags: item.tags.map(item => item.name),
                    developStatus: 'doing'
                };
            } else {
                this.activeCard = {};
            }
        },
        openAddProjectModal(project) {
            this.activeProject = _.clone(project);
            this.isAddModalVisible = true;
        },
        setactiveProject(item) {
            if (item) {
                this.activeProject = {
                    ...item,
                    projects: item.projects.id,
                    tags: item.tags.map(item => item.name)
                };
            } else {
                this.activeProject = {};
            }
        },
        setProjectList(res) {
            this.projectList = res.data.list;
        },
        setTagsList(res) {
            this.tagsList = res;
        },
        setTradesList(res) {
            this.tradesList = res;
        },
        setType(str) {
            this.type = str;
        },
        setCurPage(page) {
            this.curPage = page;
        },
        setPageSize(pageSize) {
            this.pageSize = pageSize;
        },
        clearApplicationList() {
            this.applicationList = [];
            this.curPage = 0;
        },
        setApplicationList(res = {}) {
            this.applicationList = res.data;
            this.total = res.data?.total;
            this.curPage = res.data?.curPage;
            this.pageSize = res.data?.pageSize;
        },
        setSearchParams(searchParams) {
            this.searchParams = searchParams || {};
        },
        closeAppProjectModal() {
            this.isAddModalVisible = false;
        },
    },
};

export default toMobx(model);