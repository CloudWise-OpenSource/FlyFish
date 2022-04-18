/**
 * 工具函数库
 * @type {module.exports}
 */
const lodash = require('lodash');
const path = require('path');
const fs = require('async-file');
const _fs = require("fs");
const uuid = require('uuid');
const archiver = require('archiver');
let request = require('request')
const extract = require('extract-zip')

module.exports = class extends think.Service{

    constructor(){
        super();
        // 使用文档 http://www.css88.com/doc/lodash/
        this.lodash = lodash;

        // 使用文档 https://github.com/kelektiv/node-uuid
        this.uuid = uuid;

    }

    /**
     * 异步睡眠
     * @param {Number} time 睡眠时间 单位：毫秒
     * @return {Promise<any>}
     */
    async sleep(time = 0){
        return await new Promise((resolve,reject) => {
            setTimeout(() => {
                resolve();
            }, 2000)
        });
    }

    /**
     * 复制目录、子目录，及其中的文件
     * @param src {String} 源目录
     * @param dist {String} 目标目录
     * @return {Promise}
     */
    async copyDir(src, dist) {
        const access = await fs.exists(dist);
        // 目标目录不存在时创建目录
        if(!access) await fs.mkdir(dist);

        const paths = await fs.readdir(src);
        if(think.isError(paths)) return paths;

        for(let i = 0; i < paths.length; i++){
            const _src = src + '/' +paths[i];
            const _dist = dist + '/' +paths[i];

            const stat = await fs.stat(_src);

            if (think.isError(stat)) return stat;

            // 判断是文件还是目录
            if(stat.isFile()) {
                await fs.writeFile(_dist, await fs.readFile(_src));
            } else if(stat.isDirectory()) {
                // 当是目录是，递归复制
                await this.copyDir(_src, _dist);
            }
        }

        return true;
    }

    /**
     * 复制文件
     * @param {String} srcFile 源文件
     * @param {String} targetFile 目标文件
     * @return {Promise<*>}
     */
    async copyFile(srcFile, targetFile) {
        const srcAccess = await fs.exists(srcFile);
        if (!srcAccess) return new Error('源文件不存在');

        return await fs.writeFile(targetFile, await fs.readFile(srcFile));
    }

    /**
     * 移动文件或目录
     * @param {String} src  源文件或目录
     * @param {String} target 目标文件或目录
     * @return {Promise<*>}
     */
    async move(src, target){
        const srcAccess = await fs.exists(src);
        if (!srcAccess) return new Error('源文件或目录不存在');
        const stat = await fs.stat(src);
        if (stat.isFile()) {
          await this.copyFile(src, target);
        } else if (stat.isDirectory()) {
          await this.copyDir(src, target);
        }
        return await fs.delete(src);
    }


    /**
     * 遍历目录结构(包括文件)
     * @param {String} dirPath      待遍历目录path
     * @param {Array} excludeName   排除的名字
     * @param {String} delimiter    分隔符
     * @param {NULL | String} key
     * @return {Promise<{title: *|Object|T, key: *|Object|T, children: Array}>}
     */
    async readDir(dirPath, excludeName = [], delimiter = "/", key = null) {
        const pathArr = dirPath.split('/');
        const dirName = pathArr.pop();
        if(excludeName.indexOf(dirName) !== -1) return null;

        const data = {
            title:dirName,
            key: key || dirName,
            isFile: false,
            isDir: false,
            children:[]
        };

        if (await fs.exists(dirPath)){
            const stat = await fs.stat(dirPath);
            if (stat.isDirectory()) {
                data.isFile = false;
                data.isDir = true;
                const childDirPaths = await fs.readdir(dirPath);

                for (let i = 0; i < childDirPaths.length; i++) {
                    const childDir = childDirPaths[i];
                    const newDirPath = path.resolve(dirPath, childDir);

                    const child = await this.readDir(newDirPath, excludeName, delimiter, key ? key + delimiter + childDir : dirName + delimiter +childDir);
                    if(child) data.children.push(child);
                }

            } else if (stat.isFile()) {
                data.isFile = true;
                data.isDir = false;
                data.title = dirName;
                data.key = key || dirName ;
            }
        }

        return data;
    }
    /**
     * zip压缩
     * @param {String} srcPath 待压缩的资源路径
     * @param {String} targetPath 目标zip路径
     * @param {Object} [opts] 目标zip路径
     * @return {Promise<any>}
     */
    async zip(srcPath, targetPath, opts = {}) {
        const stat = await fs.stat(srcPath);

        return new Promise((resolve, reject) =>{
            const output = fs.createWriteStream(targetPath);
            const archive = archiver('zip', {
                zlib: { level: 9 }      // 设置压缩等级
            });

            archive.pipe(output);

            output.on('close', function() {
                // console.log(archive.pointer() + ' total bytes');
                resolve(true);
            });

            archive.on('warning', (err) => {
                if (err.code === 'ENOENT') {
                    // log warning
                } else {
                    // throw error
                    reject(err);
                }
            });

            archive.on('error', (err) => {
                reject(err);
            });


            if(stat.isFile()) archive.file(srcPath);
            if(stat.isDirectory()) archive.directory(srcPath, false);

            archive.finalize();
        })
    }
    /**
     * 下载文件
     * @param {String[]} urls  文件地址
     * @param rootPath 根目录
     * @param {String} target 目标文件或目录
     * @return {Promise<*>}
     */
    async download(urls, rootPath, target,isOnly){
        const dominUrl = think.config("custom.screenDownloadUrl")
        return Promise.all(urls.map((url,idx)=>{
            return new Promise(async(r,j)=> {
                let filename =  url.split('/').pop();// 已原网络图片的名称命名本地图片
                let _filePath = url.replace("/main.js","");　　
                _filePath = _filePath.split("/").pop();
                let filePath = path.resolve(rootPath,(isOnly && target) ?target : ("components/"+ (target?target:_filePath)));
                if(!(await fs.exists(filePath))) {
                    await fs.mkdir(filePath,{ recursive: true });
                }
                request({url:dominUrl+ url}).pipe(
                    fs.createWriteStream(path.resolve(filePath,filename)).on("finish",()=> r()).on('close',err=>{  j("写入失败") })
                )  
            }) 
         }))
    }

    /**
     * 删除文件夹
     */
    delDir(path) {
        let files = [];
        const isExists = _fs.existsSync(path);
        if(isExists){
            files = _fs.readdirSync(path);
            files.forEach(async(file, index) => {
                let curPath = path + "/" + file;
                let fileStat = _fs.statSync(curPath);
                if(fileStat.isDirectory()){
                    this.delDir(curPath); //递归删除文件夹
                } else {
                    _fs.unlinkSync(curPath); //删除文件
                }
            });
            _fs.rmdirSync(path);
        }
    }

    /**
     * zip解压
     * @param {String} srcPath      带解压的资源
     * @param {String} targetPath   目标路径
     * @return {Promise<any>}
     * usage:
     *  await this.unzip("/data/test.zip", "/data/test")
     */
     async unzip(srcPath, targetPath){
        const srcAccess = await fs.access(srcPath).catch(e => e)
        const targetAccess = await fs.access(targetPath).catch(e => e);

        return new Promise((resolve, reject) => {

            if(think.isError(srcAccess)) return reject(new Error("srcPath不存在"));
            if(think.isError(targetAccess)) return reject(new Error("targetPath不存在"));

            extract(srcPath, {dir: targetPath}, function (err) {
                if(think.isError(err)) {
                    reject(err);
                }else {
                    resolve(true)
                }
            })
        })

    }
}
