'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
  const { router, controller } = app;

  router.use(app.middleware.authCheck(app.config));
  router.use(app.middleware.accessLogger());

  // users
  router.post('/users/register', controller.user.register);
  router.post('/users/login', controller.user.login);
  router.post('/users/logout', controller.user.logout);
  router.get('/users/info', controller.user.getInfo);
  router.post('/users/list', controller.user.getList);
  router.put('/users/info/:id', controller.user.updateUserInfo);

  // roles
  router.post('/roles', controller.role.add);
  router.get('/roles/get-all', controller.role.getAll);
  router.delete('/roles/:id', controller.role.delete);
  router.get('/roles/info/:id', controller.role.getInfo);
  router.post('/roles/list', controller.role.getList);
  router.put('/roles/:id/basic', controller.role.updateBasicInfo);
  router.put('/roles/:id/members', controller.role.updateMembersInfo);
  router.put('/roles/:id/auth', controller.role.updateAuthInfo);

  // project
  router.post('/projects', controller.project.create);
  router.delete('/projects/:projectId', controller.project.delete);
  router.put('/projects/:projectId', controller.project.edit);
  router.get('/projects/list', controller.project.list);
  router.get('/projects/:projectId', controller.project.info);

  // components
  router.post('/components/uploadComponentImg', controller.component.uploadComponentImg);
  router.post('/components/categories/list', controller.component.getCategoryList);
  router.put('/components/categories', controller.component.updateCategory);
  router.post('/components/list', controller.component.getList);
  router.post('/components', controller.component.add);
  router.post('/components/release/:id', controller.component.release);
  router.put('/components/:id', controller.component.updateInfo);
  router.delete('/components/:id', controller.component.delete);
  router.post('/components/copy/:id', controller.component.copy);
  router.post('/components/compile/:id', controller.component.compile);
  router.post('/components/install/:id', controller.component.installDepend);
  router.post('/components/import-source-code/:componentId', controller.component.importSource);
  router.get('/components/export-source-code/:componentId', controller.component.exportSource);
  router.get('/components/git-history/:id', controller.component.getComponentHistory);
  router.get('/components/git-commit-info/:id', controller.component.getCommitInfo);
  // 注意：放底部
  router.get('/components/:id', controller.component.getInfo);

  // menu
  router.get('/menus/list', controller.menu.list);

  // tag
  router.get('/tags/get-all', controller.tag.getAll);

  // trade
  router.get('/trades', controller.trade.list);

  // application
  router.post('/applications', controller.application.create);
  router.post('/applications/list', controller.application.getList);
  router.put('/applications/:id/basic', controller.application.editBasicInfo);
  router.put('/applications/:id/design', controller.application.editDesignInfo);
  router.delete('/applications/:id', controller.application.delete);
  router.post('/applications/copy/:id', controller.application.copy);
  router.post('/applications/components/list', controller.application.getComponentList);
  router.post('/applications/img/:id', controller.application.uploadApplicationImg);
  router.delete('/applications/img/:id', controller.application.deleteApplicationImg);
  router.get('/applications/export/:id', controller.application.export);
  router.get('/applications/export-source/:id', controller.application.exportSource);
  router.get('/applications/getModelList', controller.application.getModelList);
  router.post('/applications/getModelData', controller.application.getModelData);
  router.get('/applications/exportAll/:id', controller.application.exportAll);

  // 置于最后，莫动！！
  router.get('/applications/:id', controller.application.getInfo);

  router.get('/common/version-info', controller.common.getVersionInfo);
  router.get('/chrome/screenshot', controller.chrome.screenshot);
};
