window.DATAVI_ENV = (function () {
    const apiDomain = '';

    return {
        debug: true,
        apiDomain,
        uploadImgDir: "",
        componentsDir: '/components',
        componentApiDomain: '',
        apiSuccessCode: 200,
        globalOptions: %s,

        screenAPI: {
            getScreenData: '/applications',
            saveScreenConf: '/applications/{id}/design',
            uploadScreenImg: '/applications/img/{id}',
            deleteUploadScreenImg: '/applications/img/{id}',
            getModelList: '/web/visualScreen/screenEditor/getModelList',
            getModelData: '/web/visualScreen/screenEditor/getModelData',
            getScreenComponentList: '/applications/components/list',
        },
    };
})();
