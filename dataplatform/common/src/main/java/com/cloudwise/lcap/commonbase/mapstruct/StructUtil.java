package com.cloudwise.lcap.commonbase.mapstruct;

import com.cloudwise.lcap.commonbase.entity.*;


import com.cloudwise.lcap.commonbase.vo.*;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
@Component
public interface StructUtil {

  List<TradeVo> convertTradeVo(List<Trade> target);

  List<ComponentCategoryRespVo> convertComponentCategoryRespVo(List<ComponentCategory> target);
  ComponentCategorySubRespVo convertComponentCategorySubRespVo(ComponentCategory target);
  @Mappings ({
      @Mapping(target="isLib",expression="java(component.getIsLib()==0?false:true)")
  })
  ComponentInfoRespVo convertComponentInfoRespVo(com.cloudwise.lcap.commonbase.entity.Component component);
  @Mappings ({
      @Mapping(source="categoryId",target = "category"),
      @Mapping(source="subCategoryId",target = "subCategory"),
      @Mapping(target="isLib",expression="java(component.getIsLib()==0?false:true)")
  })
  ComponentRespVo convertComponentRespVo(com.cloudwise.lcap.commonbase.entity.Component component);
  TagVo convertTagVo(com.cloudwise.lcap.commonbase.entity.Tag tag);
  List<TagVo> convertTagsRespVo(List<Tag> target);

  @Mappings ({
          @Mapping(source = "createTime", target = "time"),
  })

  ComponentVersionVo convertComponentVersionsVo(ComponentVersion target);
  List<ComponentVersionVo> convertComponentVersionsRespVo(List<ComponentVersion> target);

  ProjectRespVo convertProjectRespVo(Project target);
  List<ProjectRespVo> convertProjectsRespVo(List<Project> target);
  @Mappings ({
          @Mapping(source = "componentCover", target = "cover"),
      @Mapping(source = "category", target = "categoryId"),
      @Mapping(source = "subCategory", target = "subCategoryId"),
          @Mapping(target = "dataConfig", expression = "java(target.getDataConfig().toString())")
  })
  com.cloudwise.lcap.commonbase.entity.Component convertComponent(ComponentReqVo target);

  @Mappings ({
          @Mapping(target = "isLib", expression = "java(app.getIsLib()==0?false:true)"),
          @Mapping(target = "isRecommend", expression = "java(app.getIsRecommend()==0?false:true)"),
  })
  ApplicationListRespVo convertApplicationListResVo(com.cloudwise.lcap.commonbase.entity.Application app);

  @Mappings ({
          @Mapping(target = "isLib", expression = "java(app.getIsLib()==0?false:true)"),
          @Mapping(target = "isRecommend", expression = "java(app.getIsRecommend()==0?false:true)"),
  })
  ApplicationDetailRespVo convertApplicationDetailRespVo(com.cloudwise.lcap.commonbase.entity.Application app);


  @Mappings({
      @Mapping(source="category",target = "categoryId"),
      @Mapping(source="subCategory",target = "subCategoryId"),
      @Mapping(target="isLib",expression="java((componentReqDevVo.getIsLib() != null && componentReqDevVo.getIsLib()) ? 1 : 0)")
  })
  com.cloudwise.lcap.commonbase.entity.Component covertAddComponentVoToEntity(ComponentReqDevVo componentReqDevVo);

  AppVarListResVo convertAppVarRespVo(AppVar appVar);
}
