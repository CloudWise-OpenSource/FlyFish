#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import re
import sys
import json
import argparse
import datetime
import subprocess
from operator import itemgetter
from collections import Iterable
import logging
import time
import random


class Logging:

    @staticmethod
    def log_new(app_name, path_log):
        logger = logging.getLogger(app_name)
        formatter = logging.Formatter('[%(asctime)s-%(levelname)s]: %(message)s')
        logger.setLevel(level=logging.INFO)
        file_handler = logging.FileHandler(path_log)
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
        return logger


class Core:
    """
    基础类，无需修改
    """

    def __init__(self, switch=True):
        self.success = True  # 参数是否符合规范
        self.local_ip = None  # ip
        self.port = {}  # 端口
        self.install_args = {}  # 自定义安装变量
        self.data_json = []  # data_json
        self.SERVICE_NAME = None  # 服务名称
        self.cluster_name = None  # 集群名称
        self.dependence = None  # 依赖字段
        self.instance_name = None  # 实例名称
        self.para = None  # 传递参数
        self.middle = None  # 中间服务参数，查询被依赖服务使用
        self.switch = switch  # 日志开关
        self.logger = None  # 日志对象
        self.roles = None

    @staticmethod
    def parameters():
        """
        传递参数
        :return: 脚本接收到的参数
        """
        parser = argparse.ArgumentParser()
        parser.add_argument("--data_json", "-data_json", required=True,
                            help="Json文件位置")
        parser.add_argument("--local_ip", "-local_ip", help="指定IP地址")
        parser.add_argument("--version", "-version", help="版本信息")
        parser.add_argument("--backup_path", "-backup_path", help="该服务备份绝对路径")
        param = parser.parse_args()
        return param

    @staticmethod
    def out(msg):
        """
        内容格式化并打印，
        :param msg: 必须含有{},可以被格式化
        """
        print(msg.format(Core.now_f_time()))

    def sys_cmd(self, cmd, ignore_exception=True):
        """
        shell脚本输出
        :param cmd: linux命令
        :param ignore_exception: 默认不抛出异常
        :return:
        """
        shell = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        stdout, stderr = shell.communicate()
        stdout, stderr = bytes.decode(stdout), bytes.decode(stderr)
        if self.switch:
            self.logger.info("执行cmd命令:{0},结果退出码:{1},执行详情:{2}".format(cmd, shell.poll(), stdout))
        # 新增非0异常抛出 by 2022-03-13
        if not ignore_exception:
            if shell.poll() != 0:
                print("执行cmd命令失败，执行cmd命令:{0},结果退出码:{1},执行详情:{2}".format(cmd, shell.poll(), stderr))
                sys.exit(shell.poll())
            else:
                print(stdout)
        return stdout

    def replace(self, file_name, data_dict):
        """
        文件替换
        11-15新增模版替换，幂等替换
        同一文件在同一脚本只能更新一次
        :param file_name:   文件名
        :param data_dict:   代替换数据字典
        :return:
        """
        app_name = self.middle if self.middle else self.SERVICE_NAME
        # ["/data/app"  "conf/xx.config"] "nacos"
        middle_path = file_name.split(app_name, 1)
        base_dir = os.path.join(middle_path[0], app_name)
        # [/data/app/nacos/, TempConfig, conf]
        template_dir = os.path.join(base_dir, "TempConfig", middle_path[1].rsplit("/", 1)[0].lstrip("/"))
        if not os.path.exists(template_dir):
            self.sys_cmd("mkdir -p {0}".format(template_dir))
        tmp_file = file_name.rsplit("/", 1)[1]
        file_tmp = "{0}/{1}.template".format(template_dir, tmp_file)
        if not os.path.exists(file_tmp):
            self.sys_cmd("\\cp {0} {1}".format(file_name, file_tmp))
        self.sys_cmd("\\cp {0} {1}".format(file_tmp, file_name))
        if not self.check_dict_none(data_dict):
            self.out("有占位符变量值为空{0}".format(data_dict))
        if self.switch:
            self.logger.info("执行替换模版：{0},替换的文件{1}".format(data_dict, file_name))
        with open(file_name, 'r+') as f:
            t = f.read()
            for before, after in data_dict.items():
                t = t.replace(("${%s}" % str(before)), str(after))
                # after = str(after) if isinstance(after, int) else after
                # t = t.replace("${{{}}}".format(before.encode()), after.encode())

            f.seek(0, 0)
            f.write(t)
            f.truncate()

    @classmethod
    def now_f_time(cls):
        """
        获取当前时间的格式化字符串
        :return : 当前时间的格式化字符串
        """
        return datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    @staticmethod
    def check_dict_none(check_dict):
        """
        查询dict是否存在空值
        """
        if len(list(filter(lambda x: x is None, check_dict.values()))) != 0:
            return False
        return True

    @staticmethod
    def append_file(path, data):
        """
        判断要添加的内容是否已经在文件中存在
        """
        is_exist = False
        with open(path, "r") as f:
            if str(data) in f.read():
                is_exist = True
        if not is_exist:
            with open(path, "a") as f:
                f.write(str(data))

    @staticmethod
    def clean_write_file(path, data):
        """
        清空文件写入
        """
        with open(path, "w") as f:
            f.write(str(data))

    @staticmethod
    def replace_str(re_pattern, new_str, file_name):
        """
        # 字符跨行替换，支持正则
        # sed -i "s#^user .*##g" ${CW_INSTALL_APP_DIR}/app/conf/app.conf
        """
        content = ''
        with open(file_name, 'r') as fp:
            conf_server = fp.readlines()
            for i in conf_server:
                conf_server = re.sub(re_pattern, new_str, i)
                content = content + conf_server
        with open(file_name, 'w') as fp:
            fp.write(content)

    @staticmethod
    def is_root():
        """当前执行脚本的用户是否为 root"""
        if os.getuid() == 0:
            return True
        else:
            return False

    def change_user(self):
        if self.install_args.get("run_user") == "root":
            self.install_args["run_user"] = "commonuser"

    def format_para(self, paras, local_ip=None):
        """
        读取json文件中的数据并进行解析
        :param paras: 脚本接收到的参数
        :param local_ip 专属nacos慎填写此变量
        """
        self.local_ip = local_ip if local_ip else paras.local_ip
        with open(paras.data_json) as f:
            data_json = f.read()
        self.data_json = json.loads(data_json)
        for para in self.data_json:
            if para.get('name') == self.SERVICE_NAME and para.get('ip') == self.local_ip:
                if isinstance(para.get('ports'), Iterable):
                    for _ in para.get('ports'):
                        self.port[_.get('key')] = _.get('default')
                if isinstance(para.get('install_args'), Iterable):
                    for _ in para.get('install_args'):
                        self.install_args[_.get('key')] = _.get('default')
                self.change_user()
                self.cluster_name = para.get('cluster_name')
                self.dependence = para.get('dependence')
                self.instance_name = para.get('instance_name')
                self.roles = para.get('role', "")
        app_name = self.middle if self.middle else self.SERVICE_NAME
        install_log_dir = os.path.join(os.path.dirname(paras.data_json), "logs")
        if not os.path.exists(install_log_dir):
            os.makedirs(install_log_dir)
        log_dir = os.path.join(
            install_log_dir, "{0}-install.log".format(app_name))
        self.logger = Logging.log_new(app_name, log_dir)

    def dependence_na(self, app_name, info):
        """
        筛选当前服务被谁依赖关系,暂专属nacos
        慎用此函数
        :return:
        重新刷新当前app实例
        """
        result = False
        for para in self.data_json:
            if not para.get("dependence") or para.get("name") != app_name:
                continue
            for dependence in para.get("dependence"):
                if dependence.get("name") == self.middle and dependence.get(info[0]) == info[1]:
                    # 重置当前实例
                    self.SERVICE_NAME = app_name
                    self.format_para(self.para, local_ip=para.get("ip"))
                    result = True
            if result:
                break
        return result

    def dependence_nas(self, app_names, info):
        """
        筛选当前服务被谁依赖关系,关系or发现其中之一则返回
        """
        result = False
        for app_name in app_names:
            result = self.dependence_na(app_name, info)
            if result:
                return result
        return result

    def other_para(self, name, key, cluster_name=None):
        """
        查询别的name的相关字段
        :param name: app_name名称
        :param key: 相对应的key，暂时无多级，后期根据需求更改
        :param cluster_name 需要筛选的cluster_name如果没有则为空或第一顺位集群
        :return: key查出来的value的list
        注释：单实例后期引用至instance_para，此函数专注与cluster配置获取
        """
        key_list = []
        for para in self.data_json:
            if para.get('name') == name and cluster_name == para.get('cluster_name'):
                keys = para.get(key) \
                    if isinstance(key, str) else itemgetter(*key)(para)
                key_list.append(keys)
                if cluster_name is None:
                    return key_list
        return key_list

    def get_service_ip_port_list_str(self, name, port_key, cluster_name="IsNone"):
        """
        查询别的name的相关字段
        :param name: app_name名称
        :param port_key: 需要自定义ports字段变量，例如service_ports
        :param cluster_name 需要筛选的cluster_name如果没有则为空或第一顺位集群
        :return: [node1:2181,node2:2181]
        """
        key = ["ip", "ports"]
        result = self.other_para(name, key, cluster_name)
        port_str = ""
        for _ in result:
            port = [i.get("default") for i in _[1] if i.get("key") == port_key]
            port_str = port_str + "{0}:{1},".format(_[0], port[0])
        port_str = port_str[:-1] if port_str.endswith(",") else port_str
        return port_str

    def instance_para_ip_port_str(self, instance_name, port_key):
        """
        引入instance和dependence概念,解决单实例依赖问题
        :param instance_name: instance_name名称
        :param port_key: port的key
        :return: 如果是单个则返回单个key对应的值，如果是list则返回次list对应的tuple
        """
        key = ["ip", "ports"]
        result = self.instance_para(instance_name, key)
        port = [i.get("default") for i in result[1] if i.get("key") == port_key]
        port_str = "{0}:{1}".format(result[0], port[0])
        return port_str

    def instance_para(self, instance_name, key):
        """
        引入instance和dependence概念,解决单实例依赖问题
        :param instance_name: instance_name名称
        :param key: 查询的值
        :return: 如果是单个则返回单个key对应的值，如果是list则返回次list对应的tuple
        """
        keys = None
        for para in self.data_json:
            if para.get('instance_name') == instance_name:
                keys = para.get(key) \
                    if isinstance(key, str) else itemgetter(*key)(para)
        return keys

    def other_para_install_args(self, name, key):
        """
        原始获取依赖集群的install 信息。后期需要更改
        """
        key_list = self.other_para(name, "install_args")
        result = None
        for _ in key_list[0]:
            if _.get("key") == key:
                result = _.get("default")
        return result

    def get_dependence(self, dependence_name):
        """
        查询依赖或本服务是否是单实例
        :param dependence_name: 当前实例依赖的服务名
        如果存在当前服务集群名，则属于集群返回集群信息，
        如果不存在集群名，证明单实例，返回实例名称
        """
        info = None
        if dependence_name == self.SERVICE_NAME:
            info = {"instance_name": self.instance_name} \
                if self.cluster_name is None \
                else {"cluster_name": self.cluster_name}
        if isinstance(self.dependence, list):
            for _ in self.dependence:
                if _.get("name") == dependence_name:
                    info = {"instance_name": _.get("instance_name")} \
                        if _.get("cluster_name") is None \
                        else {"cluster_name": _.get("cluster_name")}
            return info

    def pub_para(self, key, app_name, instance=None):
        """
        公共获取para类包含本服务
        :param key: 需要查询的key值，可以是多个，类型list
        :param app_name: 想要获取的app_name,如果是本机的app则获取到的是自身的，
        并不会获取别的单实例的信息。如果非本机的则是本机app依赖的信息。
        :param instance: 提供可自定义查询接口，非正向依赖关系的查询，可无关系和被依赖关系
        :return: 单一key的集群：["a"，"b"]
        多key的集群 : [("key1,"key2"),(...)]
        单一key的单实例："a"
        多key的单实例: ("a","b","c")
        """
        instance = instance if instance else self.get_dependence(app_name)
        if "cluster_name" in instance:
            result = self.other_para(app_name, key, cluster_name=instance.get("cluster_name"))
        elif "instance_name" in instance:
            result = self.instance_para(instance.get("instance_name"), key)
        else:
            return None
        return result

    def pub_para_port(self, port_key, app_name):
        """
        筛选依赖服务的单个port
        """
        ports = self.pub_para("ports", app_name)
        if isinstance(ports[0], list):
            ports = ports[0]
        for port in ports:
            if port.get("key") == port_key:
                return port.get("default")

    def pub_para_install(self, key, app_name):
        """
        筛选依赖服务的单个port
        """
        install_args = self.pub_para("install_args", app_name)
        if isinstance(install_args[0], list):
            install_args = install_args[0]
        for args in install_args:
            if args.get("key") == key:
                return args.get("default")

    def pub_ip_port_str(self, app_name, port_key="service_port", instance=None):
        """
        公共类获取str列表
        子函数get_service_ip_port_list_str 和 instance_para_ip_port_str
        自动判断所属app_name的集群或单实例ip和port信息
        :param app_name: 想要获取的app_name,如果是本机的app则获取到的是自身的，
        并不会获取别的单实例的信息。如果非本机的则是本机app依赖的信息。
        :param port_key: port的key变量值默认service_port
        :param instance: 提供可自定义查询接口，非正向依赖关系的查询，可无关系和被依赖关系
        :return: 单一key的集群："ip:port" 或 "ip:port,ip:port"
        """
        instance = instance if instance else self.get_dependence(app_name)
        if "cluster_name" in instance:
            result = self.get_service_ip_port_list_str(
                app_name, port_key, cluster_name=instance.get("cluster_name"))
        elif "instance_name" in instance:
            result = self.instance_para_ip_port_str(
                instance.get("instance_name"), port_key)
        else:
            return None
        return result

    def check_dir(self, check_keys=None):
        """
        检查目录是否存在，不存在即创建
        目标是：一共也就那么几个路径，全加上判断写个大而全的实例方法
        check_keys需要list
        :param check_keys: 需要检查的目录，格式list
        :return: None
        """
        check_keys = check_keys if check_keys else [
            "base_dir", "data_dir", "log_dir"
        ]
        path_dirs = itemgetter(*check_keys)(self.install_args)
        if not isinstance(path_dirs, tuple):
            path_dirs = [path_dirs]
        # 在appdata下新增tmp路径
        if len(check_keys) >= 2 and check_keys[1] == "data_dir":
            tmp_dir = os.path.join(os.path.dirname(path_dirs[1]), "tmp")
            self.sys_cmd("mkdir -p {0} && chmod a+w {0}".format(tmp_dir))
        for _ in path_dirs:
            if _ and not os.path.isdir(_):
                os.makedirs(_)

    def create_user_and_change_owner(self):
        """
        创建用户并更改文件归属
        目标是：一共也就那么几个路径，全加上判断写个大而全的实例方法
        """
        # 用户不存在即创建
        cmd = "cat /etc/passwd |awk -F ':' '{print $1}'"
        user = self.install_args.get('run_user') if \
            self.install_args.get('run_user') else 'root'
        user_list = self.sys_cmd(cmd).split('\n')
        if user not in user_list:
            time.sleep(random.uniform(0, 5))
            self.sys_cmd('useradd -s /bin/bash {}'.format(user))

        #  更改文件归属
        check_keys = [
            "base_dir", "data_dir", "log_dir"
        ]
        path_dirs = itemgetter(*check_keys)(self.install_args)
        if not isinstance(path_dirs, tuple):
            path_dirs = [path_dirs]
        # 在appdata下新增tmp路径
        if len(check_keys) >= 2 and check_keys[1] == "data_dir":
            path_dirs = path_dirs + (os.path.join(os.path.dirname(path_dirs[1]), "tmp"),)
        for _ in path_dirs:
            if _:
                self.sys_cmd('chown -R {} {}'.format(user, _))

    def declare_var(self):
        """
        同步多路径变量问题
        """
        dir_set = set()
        for data in self.data_json:
            if data.get("ip") == self.local_ip:
                for _ in data.get('install_args'):
                    if _.get("key") == "base_dir":
                        dir_set.add(os.path.dirname(_.get("default")))
        for _ in dir_set:
            if not os.path.exists(_):
                os.makedirs(_)
            self.declare_var_one(_)

    def declare_var_one(self, base_dir):
        """
        原declare_var 声明环境变量
        :return:
        """
        path = "export PATH={}/bin/:$PATH".format(self.install_args.get('base_dir'))
        source_file = os.path.join(base_dir, "bash_profile")
        if not os.path.exists(source_file):
            self.sys_cmd("touch {0} && chmod 755 {0}".format(source_file))
        with open(source_file) as f:
            etc_profile = f.read()
        if path not in etc_profile:
            self.sys_cmd("echo '{}' >> {}".format(path, source_file))

    def get_config_product_value_str(self):
        """
        查询当前集群环境存在哪些产品
        """
        product_info = {"gatewayServer": "portal",
                        "doucApi": "douc",
                        "apmWeb": "apm",
                        "doccServer": "docc",
                        "automationServer": "automation",
                        "serviceDeskServer": "dohd",
                        "jkbCollector": "jkb",
                        "dokbServer": "dokb",
                        "datalakeCompute": "datalakeCompute",
                        "cmdbServer": "cmdb",
                        "wisebotServer": "wisebot",
                        "nbdServer": "dodb",
                        "eventServer": "doem",
                        "dosmServerBoot": "dosm"
                        }
        product_str = ""
        for app in self.data_json:
            product_name = product_info.get(app.get("name", ""))
            if product_name:
                product_str = product_str + product_name + ","
        return product_str.rstrip(",")
