#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
from Core import Core
import sys
import base64
try:
    from http import HTTPStatus
    from urllib.request import Request, urlopen, ProxyHandler, HTTPSHandler, build_opener
    from urllib.parse import urlencode, unquote, quote
    from urllib.error import HTTPError, URLError
except ImportError:
    import httplib as HTTPStatus
    from urllib2 import Request, urlopen, HTTPError, URLError, ProxyHandler, HTTPSHandler, build_opener
    from urllib import urlencode, unquote, quote
    base64.encodebytes = base64.encodestring
    reload(sys)
    sys.setdefaultencoding('utf8')

# 服务名称，按需修改
SERVICE_NAME = "lcapWeb"

class UpgradeLcapWeb(Core):

    def __init__(self):
        """
        初始化json数据 及 基础方法
        """
        Core.__init__(self)
        self.SERVICE_NAME = SERVICE_NAME
        self.para = self.parameters()  # 脚本接收到的参数
        self.format_para(self.para)  # 解析脚本接收到的参数， 并初始化参数

    def run(self):
        self.out('\n *** lcapWeb升级进度 *** \n')
        # if self.para.version != '5.4.0':
        #     print("更新失败，版本匹配失败")
        #     sys.exit(0)

        # 拼接安装目录
        self.check_dir(['base_dir'])
        app_path = self.install_args.get("base_dir")
        run_user = self.pub_para_install('run_user', 'tengine')
        self.sys_cmd('chown -R {0}:{0} {1}'.format(run_user, app_path))

        # 替换占位符
        base_dir_path = self.install_args.get("base_dir")
        config_path = os.path.join(base_dir_path, 'conf/env-config.js')
        www_config_path = os.path.join(base_dir_path, 'www/web/screen/config/env.js')

        cw_lcap_tengine_service_port = self.pub_para_port('service_port', 'tengine')
        place_holder_config_script = {
            "CW_LOCAL_IP": self.local_ip,
            "CW_LOCAL_PORT": cw_lcap_tengine_service_port,
            
            "CW_INSTALL_APP_DIR": os.path.dirname(base_dir_path),
        }
        self.replace(config_path, place_holder_config_script)
        self.replace(www_config_path, place_holder_config_script)

        # 获取已备份lcapWeb下的服务
        back_path = os.path.join(self.para.backup_path, "www/components/*")
        target_path = os.path.join(app_path, "www/components")

        # 执行命令
        self.sys_cmd("cp -rf {} {}/".format(back_path, target_path))
        self.out("{} lcapWeb升级成功")


if __name__ == '__main__':
    _ = UpgradeLcapWeb()
    _.run()