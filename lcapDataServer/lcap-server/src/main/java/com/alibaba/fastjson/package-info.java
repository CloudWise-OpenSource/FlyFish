package com.alibaba.fastjson;

/**
 * dubbo依赖fastjson,而fastjson存在漏洞，在排除fastjson时dubbo的部分依赖报错;
 * 此处的JSON、JSONObject做类补偿用，勿删改！！！
 */