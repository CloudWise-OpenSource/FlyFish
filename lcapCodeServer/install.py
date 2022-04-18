#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import sys
from Core import Core
python_version = sys.version_info.major
if python_version == 2:
    reload(sys)
    sys.setdefaultencoding('utf-8')


SERVICE_NAME = "lcapCodeServer"


class InstallLcapCodeServer(Core):

    def __init__(self):
        """
        初始化json数据 及 基础方法
        """
        Core.__init__(self)
        self.SERVICE_NAME = SERVICE_NAME
        self.param = self.parameters()  # 脚本接收到的参数
        self.format_para(self.param)  # 解析脚本接收到的参数， 并初始化参数

    def run(self):
        self.out('\n *** lcapCodeServer 安装进度 *** \n')
        self.out("1 {} 开始安装")

        username = self.install_args.get("run_user")

        base_dir_path = self.install_args.get("base_dir")
        data_dir_path = self.install_args.get("data_dir")
        log_dir_path = self.install_args.get("log_dir")
        # 创建通用目录
        self.check_dir()
        config_path = os.path.join(base_dir_path, 'config.yaml')

        # 更改文件权限
        scripts_path = os.path.join(base_dir_path, 'bin', 'lcapCodeServer')
        self.sys_cmd('chmod +x {}'.format(scripts_path))

        cw_service_port = self.port.get('service_port')

        # set start script
        place_holder_config_script = {
            "CW_LOCAL_IP": self.local_ip,
            "CW_MAIN_SERVER_PORT": cw_service_port,
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

        self.replace(config_path, place_holder_config_script)
        self.replace(scripts_path, place_holder_bin_script)


if __name__ == '__main__':
    _ = InstallLcapCodeServer()
    _.run()
