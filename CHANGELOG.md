# [1.6.0](https://git.cloudwise.com/FlyFish/solution-platform-server/compare/v1.5.1...v1.6.0) (2021-09-04)

### 🐛 Fixed

*【前端开发工具-飞鱼】数据应用平台-数据可视化-创建人一直为空 ([f7a6752](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/f7a6752))
*【前端开发工具-飞鱼】数据应用平台-数据可视化-复制大屏失败 ([aa08ba5](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/aa08ba5))
* mod EnumUserRoleOfAdmin value ([4e17ecb](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/4e17ecb))


### 📝 Docs

* add 表结构文档 ([741cc2b](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/741cc2b))



## [1.5.1](https://git.cloudwise.com/FlyFish/solution-platform-server/compare/v1.5.0...v1.5.1) (2021-08-16)

### 🌟 Feature

* getScreenList add condition ([d690f23](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/d690f23))


### 🐛 Fixed

* JIRA-LOWCODE-61 增加大屏获取接口排序字段 ([dc30e80](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/dc30e80))



# [1.5.0](https://git.cloudwise.com/FlyFish/solution-platform-server/compare/v1.4.0...v1.5.0) (2021-08-13)

### 🐛 Fixed

*增加删除大屏资源图片的接口 ([507e6b1](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/507e6b1))
*大屏开发平台大屏设计组件根据标签分类 ([729cf58](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/729cf58))
*设计大屏界面，右侧组件编辑界面增加组件标识，方便查找 ([40f8a6f](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/40f8a6f))



# [1.4.0](https://git.cloudwise.com/FlyFish/solution-platform-server/compare/v1.3.0...v1.4.0) (2021-08-04)

### 🐛 Fixed

*大屏和组件增加创建人和最后操作人 ([d17f13c](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/d17f13c))



# [1.3.0](https://git.cloudwise.com/FlyFish/solution-platform-server/compare/v1.2.0...v1.3.0) (2021-07-27)

### 🌟 Feature

* 下载接口增加免登 ([96ae3b1](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/96ae3b1))
* 大屏列表接口增加免登判断 ([8a1ead8](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/8a1ead8))
* 大屏创建、复制、更新接口增加logo、status字段 ([5871d69](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/5871d69))


### 🐛 Fixed

* 修复拷贝大屏问题 ([ae18841](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/ae18841))
* auth accountid ([b89c1bd](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/b89c1bd))
* 大屏可视化列表支持按照标签筛选 ([fa780ea](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/fa780ea))
* 大屏可视化组件模块支持按标签筛选、支持组件模糊匹配和组件标识搜索 ([4e3d89a](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/4e3d89a))
* 解决大屏编辑可视化组件时必须上传组件包才能更改标签 ([6328297](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/6328297))



# [1.2.0](https://git.cloudwise.com/FlyFish/solution-platform-server/compare/0772cd2...v1.2.0) (2021-07-12)

### 🌟 Feature

* 增加标签搜索功能 ([0c7f38a](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/0c7f38a))
* 增加标签管理接口 ([228846a](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/228846a))
* 增加根据tagId检索组件信息接口 ([edfcaf2](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/edfcaf2))
* 增加根据标签获取标签列表接口 ([19f63df](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/19f63df))
* 大屏增删改标签关联完成 ([897e6f8](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/897e6f8))
* 大屏复制增加标签对照复制功能完成 ([75ff98f](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/75ff98f))
* 组件增删改关联标签 ([4294d90](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/4294d90))
* 添加可视化组件 ([b571b64](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/b571b64))


### 🐛 Fixed

* drop console ([ad468ea](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/ad468ea))
* 修复下载大屏文件去除componentsDir地址 ([fb20a0d](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/fb20a0d))
* 修复分页modal错误 ([d566ac0](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/d566ac0))
* 修复旧数据更新标签问题 ([246c11a](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/246c11a))
* 删除is_default字段;修改migration文件结构;删除无用接口 ([ba06090](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/ba06090))
*修复大屏下载模板参数问题 ([46f63b8](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/46f63b8))
* 0608上线部分配置修改 ([d3c67f7](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/d3c67f7))
* chenge the web static ([e7750af](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/e7750af))
* 导出大屏逻辑修改 ([0772cd2](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/0772cd2))
* 清空下载文件夹 ([db8381e](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/db8381e))
* 解决全局变量问题 ([8ce406d](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/8ce406d))
* 解决组件css文件加载不到问题 ([7bba815](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/7bba815))


### 📦 Ci

* release script ([14d20ac](https://git.cloudwise.com/FlyFish/solution-platform-server/commits/14d20ac))



