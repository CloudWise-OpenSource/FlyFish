/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-06-24 16:45:06
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-09-02 14:35:14
 */

 module.exports = class extends think.Service{
   constructor(){
    super();
    this.sceneModelIns = think.model('visualScene', {}, think.config('custom.appModules.web'));
   }
   /**
     * 新增场景
     * @param {String} sceneName
     * @param {String} desc
     * @param {String} dirPath
     * @param {String} author            
     * @returns {Promise<void>}
     */
    async addScene(params) {
      const {sceneName = '',desc = '',dirPath = '',fileName= '',author = ''} = params;
      const data = {
        sceneName,
        desc,
        dirPath,
        fileName,
        author,
        createTime : Date.now(),
      }
      return await this.sceneModelIns.add(data).catch(err => {
          think.logger.error(err);
          return think.isError(err) ? err : new Error(err)
      });
    }
    /**
     * 新增场景
     * @param {Number} sceneId          
     * @returns {Promise<void>}
     */
    async delScene(sceneId) {
      return await this.sceneModelIns.where({sceneId}).delete().catch(err => {
          think.logger.error(err);
          return think.isError(err) ? err : new Error(err)
      });
    }
    /**
     * 编辑场景
     * @param {String} sceneName
     * @param {String} desc
     * @param {String} dirPath
     * @param {String} author            
     * @returns {Promise<void>}
     */
    async editScene(params) {
      const {sceneId,sceneName = '',desc = '',dirPath = '',fileName= '',author = ''} = params;
      let data = {};
      if (dirPath==''||fileName=='') {
        data = {
          sceneName,
          desc,
          author
        }
      }else{
        data = {
          sceneName,
          desc,
          dirPath,
          fileName,
          author
        }
      }
      return await this.sceneModelIns.where({sceneId}).update(data).catch(err => {
          think.logger.error(err);
          return think.isError(err) ? err : new Error(err)
      });
    }
  /**
     * 查询场景
     * @param {String} sceneName        
     * @returns {Promise<void>}
     */
    async getSceneByName(sceneName) {
      return await this.sceneModelIns.where({sceneName}).softSelect().catch(err => {
          think.logger.error(err);
          return think.isError(err) ? err : new Error(err)
      });
    }
    async getSceneById(sceneId) {
      return await this.sceneModelIns.where({sceneId}).softSelect().catch(err => {
          think.logger.error(err);
          return think.isError(err) ? err : new Error(err)
      });
    }
    /**
     * 分页查询场景    
     * @returns {Promise<void>}
     */
    async queryScene(params) {
      const { page,pageSize } = params;
      return await this.sceneModelIns.page(page, pageSize).softSelect().catch(err => {
          think.logger.error(err);
          return think.isError(err) ? err : new Error(err)
      });
    }
    /**
     * 分页全部场景    
     * @returns {Promise<void>}
     */
    async queryAllScene() {
      return await this.sceneModelIns.softSelect().catch(err => {
          think.logger.error(err);
          return think.isError(err) ? err : new Error(err)
      });
    }
    
    /**
     * 查询场景总数    
     * @returns {Promise<void>}
     */
    async queryTotal(params) {
      return await this.sceneModelIns.count().catch(err => {
          think.logger.error(err);
          return think.isError(err) ? err : new Error(err)
      });
    }
 }