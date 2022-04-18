#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import sys
from Core import Core
python_version = sys.version_info.major
if python_version == 2:
    reload(sys)
    sys.setdefaultencoding('utf-8')


SERVICE_NAME = "lcapServer"


class InstallLcapServer(Core):

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
        self.out('\n *** lcapServer 安装进度 *** \n')
        self.out("1 {} 开始安装")

        username = self.install_args.get("run_user")

        base_dir_path = self.install_args.get("base_dir")
        data_dir_path = self.install_args.get("data_dir")
        log_dir_path = self.install_args.get("log_dir")
        # 创建通用目录
        self.check_dir()
        config_path = os.path.join(base_dir_path, 'config/config.docp.js')
        init_path = os.path.join(base_dir_path, 'scripts/init.py')
        package_path = os.path.join(base_dir_path, 'package.json')

        # 更改文件权限
        scripts_path = os.path.join(base_dir_path, 'bin', 'lcapServer')
        self.sys_cmd('chmod +x {}'.format(scripts_path))

        cw_service_port = self.port.get('service_port')

        cw_db_service_ip = self.pub_para('ip', 'mongodb')
        cw_db_service_port = self.pub_para_port('service_port', 'mongodb')
        cw_db_service_username = self.other_para_install_args('mongodb', 'username')
        cw_db_service_password = self.other_para_install_args('mongodb', 'password')

        cw_lcap_api_service_ips = self.other_para('lcapApiServer', 'ip')
        cw_lcap_api_service_port = self.get_other_para('lcapApiServer', 'service_port')

        cw_lcap_tengine_service_ips = self.other_para('tengine', 'ip')
        cw_lcap_tengine_service_port = self.get_other_para('tengine', 'service_port')

        cw_lcap_web_path = self.other_para_install_args('lcapWeb', 'base_dir')

        # set start script
        place_holder_config_script = {
            "CW_LOCAL_IP": self.local_ip,

            "CW_MAIN_SERVER_IP": self.local_ip,

            "CW_INSTALL_APP_DIR": os.path.dirname(base_dir_path),
            "CW_INSTALL_STATIC_DIR": os.path.dirname(cw_lcap_web_path),

            "CW_YAPI_SERVER_IP": cw_lcap_api_service_ips[0],
            "CW_YAPI_SERVER_PORT": cw_lcap_api_service_port,

            "CW_MONGODB_IP": cw_db_service_ip,
            "CW_MONGODB_PORT": cw_db_service_port,
            "CW_MONGODB_USERNAME": cw_db_service_username,
            "CW_MONGODB_PASSWORD": cw_db_service_password,

            "CW_DOCP_SERVER_IP": cw_lcap_tengine_service_ips[0],
            "CW_DOCP_SERVER_PORT": cw_lcap_tengine_service_port,
        }

        # set start script
        place_holder_bin_script = {
            "CW_RUN_USER": username,
            "CW_LOCAL_IP": self.local_ip,
            "CW_INSTALL_APP_DIR": os.path.dirname(base_dir_path),
            "CW_INSTALL_LOGS_DIR": log_dir_path,
            "CW_INSTALL_DATA_DIR": data_dir_path,
            "CW_SERVICE_PORT": cw_service_port,
        }

        # set init script
        place_holder_init_script = {
            "SERVICE_NAME": SERVICE_NAME,
            "CW_INSTALL_APP_DIR": os.path.dirname(base_dir_path),
        }

        # set init script
        place_holder_package_script = {
            "CW_MAIN_SERVER_PORT": cw_service_port,
        }

        self.replace(config_path, place_holder_config_script)
        self.replace(scripts_path, place_holder_bin_script)
        self.replace(init_path, place_holder_init_script)
        self.replace(package_path, place_holder_package_script)


if __name__ == '__main__':
    _ = InstallLcapServer()
    _.run()
