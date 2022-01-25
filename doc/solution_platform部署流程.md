### 平台部署流程

#### 一、依赖组件即版本
```
 Node >= 8.9.3
 
 MySQL = 5.x
 
 Redis >= 4.0.8
 
```

#### 二、编辑服务端配置文件
1.进入项目
```
cd solution_platform

```
2.安装依赖
```
npm install
```

3.修改初始化数据库配置
```
vim config/database.dev.json

"host": "数据库主机",
"user": "数据库用户",
"password": "数据库密码",
"database": "solution_platform"
```


4.编辑src/common/config/config.js
```
vim src/common/config/config.js

 port: "服务端口号",
 host: '主机ip',
 workers: 0,
```

5.编辑src/common/config/adapter.js
```
vim src/common/config/adapter.js

// 配置redis
 exports.cache = {
     redis: {
         port: "redis端口",
         host: 'redis主机ip',
         password: ''
     }
 };
 
// 配置MySQL
exports.model = {
    
    mysql: {
        database: 'solution_platform',
        user: '数据库用户',
        password: '数据库密码',
        host: '数据库主机IP',
        port: '数据库端口',
    }
};
```



#### 三、编辑前端配置文件
1. 编辑SOLUTION平台配置文件
```
vim www/static/solution_platform_web/config/ENV.js

var rootPath = '/pw/';     // 路由的根路径
var apiDomain = 'http://ip:port';    // api请求接口

```

2. 编辑大屏配置文件(注意：如果解决方案包括大屏才进行配置)
```
cp www/static/big_screen/config/env.js www/static/big_screen/config/env.production.js

vim www/static/big_screen/config/env.production.js

var apiDomain = 'http://ip:port';    // api请求接口,即解决方案本身的服务地址

```

3. 编辑大屏入口文件
```
1. 第一步
cp www/static/big_screen/editor.html www/static/big_screen/editor.production.html

vim www/static/big_screen/editor.production.html

添加：
<script type="text/javascript" src="{飞鱼平台domain}/static/public_visual_component/{飞鱼平台account_id}/env.component.js"></script>
例如： <script type="text/javascript" src="http://localhost:8362/static/public_visual_component/1/env.component.js"></script>
------------------------------
2. 第二步
cp www/static/big_screen/index.html www/static/big_screen/index.production.html

vim www/static/big_screen/index.production.html

添加：
<script type="text/javascript" src="{飞鱼平台domain}/static/public_visual_component/{飞鱼平台account_id}/env.component.js"></script>
例如： <script type="text/javascript" src="http://localhost:8362/static/public_visual_component/1/env.component.js"></script>

```

4. 编辑平台入口配置文件
```
vim www/static/solution_platform_web/config/ENV.js

platformClassify: [ 
    {
        label: '组件开发平台',
        url: 'http://${服务器ip}:8363',
    },
    {
        label: '数据应用平台',
        url: 'http://${服务器ip}:8362',
    }
]
```

#### 四、启动项目
1.创建数据库
```
CREATE DATABASE IF NOT EXISTS solution_platform DEFAULT CHARSET utf8 COLLATE utf8_general_ci;

```

2.初始化表
```
npm run init_database_dev
```

3.启动应用
```
pm2 start dev.js -n 'flyfish_solution_platform'
```
