package com.cloudwise.lcap.commonbase.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cloudwise.lcap.commonbase.entity.Component;
import com.cloudwise.lcap.commonbase.vo.*;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Collection;
import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author ethan.du
 * @since 2022-08-01
 */
public interface IComponentService extends IService<Component> {

  String getComponentCommitInfo(String id, String hash);

  PageBaseListRespVo getComponentHistory(String id, Integer curPage, Integer pageSize);

  ComponentInfoRespVo getComponentInfo(String id);

  IdRespVo compileComponent(String id);

  void exportComponent(HttpServletRequest requests, HttpServletResponse response, String id);

  IdRespVo importComponent(String id, MultipartFile file);

  IdRespVo toLib(String id, ToLibReqVo updateInfo);

  IdRespVo installComponentDepend(String id);

  void delete(String id);

  PageBaseListRespVo getList(ComponentListReqVo componentListReq);

  IdRespVo updateInfo(String id, ComponentReqVo componentReqVo);

  Long getComponentCount(ComponentListReqVo reqInfo);

  void releaseComponent(String id, CommonReleaseReqVo commonReleaseReqVo);

    List<ComponentCategoryRespVo> getListWithCategory(String id, String name, String type, Integer allowDataSearch);

  PageBaseListRespVo getListByIdName(SearchComponentListReqVo searchComponentListReqVo);
}

