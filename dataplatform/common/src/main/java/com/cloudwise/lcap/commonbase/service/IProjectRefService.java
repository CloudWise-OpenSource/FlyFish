package com.cloudwise.lcap.commonbase.service;


import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author luke.miao
 * @since 2022-08-04
 */
public interface IProjectRefService {
    void updateProjectsRef(String id, List<String> projectIds, String type);
}
