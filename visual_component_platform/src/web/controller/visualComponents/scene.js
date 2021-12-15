/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-06-23 14:56:46
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-09-10 15:33:58
 */
const Base = require('../base');
const path = require('path');
const fs = require('async-file');
var AdmZip = require('adm-zip');
const { v4 } = require('uuid');
const formidable = require('formidable');
const rmDir = require('../../util/rmDir')

module.exports = class extends Base{

    constructor(ctx) {
      super(ctx);
      this.helperService = think.service("helper");
      this.sceneService = think.service('visualComponents/visualScene', think.config("custom.appModules.web"));
    }
    //检查场景信息
    async checkSceneAction() {
      const params = this.post();
      const { sceneName } = params;
      const arr = await this.sceneService.getSceneByName(sceneName);
      if (arr && arr.length) {
        return this.fail('场景名称已存在，请修改！');
      }else{
        return this.success({}, "");
      }
    }
    //检查场景信息
    async checkSceneEditAction() {
      const params = this.post();
      const { sceneName,sceneId } = params;
      const arr = await this.sceneService.getSceneByName(sceneName);
      if (arr && arr.length && arr[0].sceneId!=sceneId) {
        return this.fail('场景名称已存在，请修改！');
      }else{
        return this.success({}, "");
      }
    }
    //添加场景
    async addSceneAction() {
      const params = this.post();
      const result = await this.sceneService.addScene(params);
      if (think.isError(result)){
        return this.fail(result.message);
      }else{
        return this.success({}, "添加成功");
      }
    }
    //编辑场景
    async editSceneAction() {
      const params = this.post();
      const result = await this.sceneService.editScene(params);
      if (think.isError(result)){
        return this.fail(result.message);
      }else{
        return this.success({}, "修改成功");
      }
    }
    //删除场景
    async delSceneAction() {
      const { sceneId } = this.post();
      const arr = await this.sceneService.getSceneById(sceneId);
      const result = await this.sceneService.delScene(sceneId);
      if (think.isError(result)){
        return this.fail(result.message);
      }else{
        if (arr && arr.length) {
          const {dirPath} = arr[0];
          if (dirPath) {
            rmDir(path.resolve(think.config("custom.wwwDirPath")+dirPath));
          }
        }
        return this.success({}, "success");
      }
    }
    //上传场景包
    async uploadFileAction() {
      const { path:filePath,name } = this.ctx.request.body.file.file;
      //检查uploadScenes
      const uploadDir = path.join(think.config("custom.wwwDirPath")+ '/static/uploadScenes');
      if (!(await fs.exists(uploadDir))) {
        await fs.mkdir(uploadDir);
      }
      //创建目录
      const uni = v4().replace(/-/g,'');
      const dest = path.join(think.config("custom.wwwDirPath") + '/static/uploadScenes/'+uni);
      await fs.mkdir(dest);
      //重命名
      const fileName = dest+'/'+name;
      await this.helperService.move(filePath, fileName);
      //解压
      const zip = new AdmZip(fileName);
      zip.extractAllTo(dest+'/',true);
      //获取文件名
      const sceneDir = dest+'/storage/scenes';
      if (!(await fs.exists(sceneDir))) {
        return this.fail('上传文件的内容有误，请检查!')
      }
      const sceneFiles = await fs.readdir(sceneDir);
      let sceneFileName = '';
      sceneFiles.forEach(item=>{
        const ext = path.extname(item);
        if (ext=='.json') {
          sceneFileName=item.replace(ext,'');
        }
      })
      return this.success({
        dirPath:path.join('/static/uploadScenes/'+uni),
        fileName:sceneFileName
      }, "上传成功");
    }
    //分页查询场景
    async querySceneAction() {
      const params = this.post();
      const result = await this.sceneService.queryScene(params);
      //查询总数
      const total = await this.sceneService.queryTotal();
      if (think.isError(result)){
        return this.fail(result.message);
      }else{
        return this.success({
          result,
          total
        }, "success");
      }
  }
  
      //分页查询场景
      async queryAllSceneAction() {
        const result = await this.sceneService.queryAllScene();
        if (think.isError(result)){
          return this.fail(result.message);
        }else{
          return this.success({
            result
          }, "success");
        }
      }
}
