#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import sys
from Core import Core
python_version = sys.version_info.major
if python_version == 2:
    reload(sys)
    sys.setdefaultencoding('utf-8')


# 服务名称，按需修改
SERVICE_NAME = "lcapWeb"

class InstallDoccWeb(Core):

    def __init__(self):
        """
        初始化json数据 及 基础方法
        """
        Core.__init__(self)
        self.SERVICE_NAME = SERVICE_NAME
        self.param = self.parameters()  # 脚本接收到的参数
        self.format_para(self.param)  # 解析脚本接收到的参数， 并初始化参数

    def get_other_para(self, app_name, port_key):
        port = {}
        for para in self.data_json:
            if para.get('name') == app_name:
                port = {}
                for _ in para.get('ports'):
                    port[_.get('key')] = _.get('default')

        return port.get(port_key)

    def run(self):

        run_user = self.pub_para_install("run_user", "tengine")
        self.sys_cmd('chown -R {}:{} {}'.format(run_user, run_user, self.install_args.get("base_dir")))

        base_dir_path = self.install_args.get("base_dir")
        # 创建通用目录
        self.check_dir(['base_dir'])
        config_path = os.path.join(base_dir_path, 'conf/env-config.js')

        cw_lcap_tengine_service_port = self.pub_para_port('service_port', 'tengine')
        cw_lcap_api_service_port = self.get_other_para('lcapApiServer', 'service_port')
        cw_lcap_code_service_port = self.get_other_para('lcapCodeServer', 'service_port')

        # set start script
        place_holder_config_script = {
            "CW_LOCAL_IP": self.local_ip,
            
            "CW_INSTALL_APP_DIR": os.path.dirname(base_dir_path),
            "CW_LOCAL_PORT": cw_lcap_tengine_service_port,
            "CW_YAPI_SERVER_PORT": cw_lcap_api_service_port,
            "CW_CODE_SERVER_PORT": cw_lcap_code_service_port,
        }


        self.replace(config_path, place_holder_config_script)

if __name__ == '__main__':
    auto = InstallDoccWeb()
    auto.run()