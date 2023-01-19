package com.cloudwise.lcap.commonbase.service.impl;

import cn.hutool.core.collection.CollectionUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cloudwise.lcap.commonbase.contants.Constant;
import com.cloudwise.lcap.commonbase.entity.*;
import com.cloudwise.lcap.commonbase.enums.InitFrom;
import com.cloudwise.lcap.commonbase.enums.ResultCode;
import com.cloudwise.lcap.commonbase.exception.BaseException;
import com.cloudwise.lcap.commonbase.mapper.ProjectMapper;
import com.cloudwise.lcap.commonbase.mapper.TradeMapper;
import com.cloudwise.lcap.commonbase.mapstruct.StructUtil;
import com.cloudwise.lcap.commonbase.service.*;
import com.cloudwise.lcap.commonbase.threadlocal.ThreadLocalContext;
import com.cloudwise.lcap.commonbase.util.ResourceUtil;
import com.cloudwise.lcap.commonbase.vo.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author ethan.du
 * @since 2022-08-01
 */
@Service
public class ProjectServiceImpl extends ServiceImpl<ProjectMapper, Project> implements
        IProjectService {

    @Autowired
    ITradeService iTradeService;

    @Autowired
    TradeMapper tradeMapper;
    @Autowired
    IProjectTradeRefService iProjectTradeRefService;

    @Autowired
    IApplicationService iApplicationService;

    @Autowired
    IComponentProjectRefService iComponentProjectRefService;

    @Autowired
    StructUtil structUtil;
    @Autowired
    public BaseUserService baseUserService;

    @Override
    public IdRespVo add(ProjectReqVo projectCreateReqVo) {
        Long accountId = projectCreateReqVo.getAccountId() != null ? projectCreateReqVo.getAccountId() : ThreadLocalContext.getAccountId();
        Long userId = projectCreateReqVo.getUserId() != null ? projectCreateReqVo.getUserId() : ThreadLocalContext.getUserId();

        LambdaQueryWrapper<Project> projectLambdaQueryWrapper = new LambdaQueryWrapper<>();
        projectLambdaQueryWrapper
                .in(Project::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID));
        projectLambdaQueryWrapper.eq(Project::getName, projectCreateReqVo.getName());
        if (baseMapper.selectOne(projectLambdaQueryWrapper) != null) {
            throw new BaseException(ResultCode.ALREADY_EXISTS.getCode(),
                    ResultCode.ALREADY_EXISTS.getMsg());
        }
        List<TradeVo> tradeReqVos = projectCreateReqVo.getTrades();

        List<String> tradeNames = tradeReqVos.stream().map(TradeVo::getName).collect(
                Collectors.toList());

        //修改原有逻辑，根据tradeName去库里面查询
        LambdaQueryWrapper<Trade> tradeLambdaQueryWrapper = new LambdaQueryWrapper<>();
        tradeLambdaQueryWrapper.in(Trade::getName, tradeNames)
                .in(Trade::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID));
        List<Trade> existTrades = iTradeService.getBaseMapper().selectList(tradeLambdaQueryWrapper);

        //数据库已经存在的id及name
        List<String> oldTradeNames = existTrades.stream().map(Trade::getName).collect(Collectors.toList());

        //根据名字过滤出库里面没有的也就是要插入数据库的
        tradeNames.removeAll(oldTradeNames);

        //排除重复的name
        Set<String> tradeNameSets = new HashSet<>(tradeNames);

        List<Trade> insertTrades = tradeNameSets.stream().map(tradeName -> {
            Trade trade = new Trade();
            trade.setName(tradeName);
            return trade;
        }).collect(Collectors.toList());

        if (!insertTrades.isEmpty()) {
            iTradeService.saveBatch(insertTrades);
        }

        Project project = new Project();
        project.setAccountId(accountId);
        project.setUpdater(userId);
        project.setCreator(userId);
        project.setName(projectCreateReqVo.getName());
        project.setDesc(projectCreateReqVo.getDesc());
        baseMapper.insert(project);

        //insertTrades插入ref表
        List<Trade> insertRefTrades = new ArrayList<>();
        insertRefTrades.addAll(insertTrades);
        insertRefTrades.addAll(existTrades);

        List<ProjectTradeRef> projectTradeRefs = insertRefTrades.stream().map(trade -> {
            ProjectTradeRef projectTradeRef = new ProjectTradeRef();
            projectTradeRef.setProjectId(project.getId());
            projectTradeRef.setTradeId(trade.getId());
            return projectTradeRef;
        }).collect(Collectors.toList());

        if (!projectTradeRefs.isEmpty()) {
            iProjectTradeRefService.saveBatch(projectTradeRefs);
        }
        return new IdRespVo(project.getId());
    }

    @Override
    public void delete(String id) {
        checkAuth(id);
        LambdaQueryWrapper<ComponentProjectRef> lambdaQueryWrapper = new LambdaQueryWrapper<>();
        lambdaQueryWrapper.eq(ComponentProjectRef::getProjectId, id);
        ComponentProjectRef projectComponentRef = iComponentProjectRefService.getOne(lambdaQueryWrapper);

        LambdaQueryWrapper<Application> applicationLambdaQueryWrapper = new LambdaQueryWrapper<>();
        applicationLambdaQueryWrapper.eq(Application::getProjectId, id);
        applicationLambdaQueryWrapper.eq(Application::getInvalid, 0);

        Application projectApp = iApplicationService.getOne(applicationLambdaQueryWrapper);
        if (projectComponentRef != null || projectApp != null) {
            throw new BaseException(ResultCode.EXISTS_ALREADY_PROJECT_REF.getCode(),
                    ResultCode.EXISTS_ALREADY_PROJECT_REF.getMsg());
        }
        baseMapper.deleteById(id);
        iProjectTradeRefService.deleteProjectTradeRefByProjectId(id);

    }

    @Override
    public IdRespVo edit(String id, ProjectReqVo projectCreateReqVo) {
        Long accountId = ThreadLocalContext.getAccountId();
        checkAuth(id);
        LambdaQueryWrapper<Project> lambdaQueryWrapper = new LambdaQueryWrapper<>();
        lambdaQueryWrapper.ne(Project::getId, id).eq(Project::getName, projectCreateReqVo.getName());
        Long projectCount = baseMapper.selectCount(lambdaQueryWrapper);
        if (projectCount > 0) {
            throw new BaseException(ResultCode.ALREADY_EXISTS.getCode(),
                    ResultCode.ALREADY_EXISTS.getMsg());
        }

        List<TradeVo> tradeReqVos = projectCreateReqVo.getTrades();

        List<String> tradeNames = tradeReqVos.stream().map(TradeVo::getName).collect(
                Collectors.toList());

        //修改原有逻辑，根据tradeName去库里面查询
        LambdaQueryWrapper<Trade> tradeLambdaQueryWrapper = new LambdaQueryWrapper<>();
        tradeLambdaQueryWrapper.in(Trade::getName, tradeNames)
                .in(Trade::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID));
        List<Trade> existTrades = iTradeService.getBaseMapper().selectList(tradeLambdaQueryWrapper);

        //数据库已经存在的id及name
        List<String> oldTradeIds = existTrades.stream().map(Trade::getId).collect(Collectors.toList());
        List<String> oldTradeNames = existTrades.stream().map(Trade::getName).collect(Collectors.toList());

        //根据名字过滤出库里面没有的也就是要插入数据库的
        tradeNames.removeAll(oldTradeNames);

        //删除关联表数据
        if (!oldTradeIds.isEmpty()) {
            iProjectTradeRefService.deleteProjectTradeRefByProjectId(id);
        }

        //排除重复的name
        Set<String> tradeNameSets = new HashSet<>(tradeNames);

        List<Trade> insertTrades = tradeNameSets.stream().map(tradeName -> {
            Trade trade = new Trade();
            trade.setName(tradeName);
            return trade;
        }).collect(Collectors.toList());

        if (!insertTrades.isEmpty()) {
            iTradeService.saveBatch(insertTrades);
        }
        List<Trade> tradeList = new ArrayList<>();

        tradeList.addAll(insertTrades);
        tradeList.addAll(existTrades);

        LambdaUpdateWrapper<Project> lambdaUpdateWrapper = new LambdaUpdateWrapper<>();
        lambdaUpdateWrapper.eq(Project::getId, id);

        Project project = new Project();
        if (projectCreateReqVo.getName() != null) {
            project.setName(projectCreateReqVo.getName());
        }
        if (projectCreateReqVo.getDesc() != null) {
            project.setDesc(projectCreateReqVo.getDesc());
        }
        baseMapper.update(project, lambdaUpdateWrapper);

        List<ProjectTradeRef> projectTradeRefs = tradeList.stream().map(trade -> {
            ProjectTradeRef projectTradeRef = new ProjectTradeRef();
            projectTradeRef.setProjectId(id);
            projectTradeRef.setTradeId(trade.getId());
            return projectTradeRef;
        }).collect(Collectors.toList());
        if (!projectTradeRefs.isEmpty()) {
            iProjectTradeRefService.saveBatch(projectTradeRefs);
        }
        return new IdRespVo(id);

    }

    private void checkAuth(String id) {
        Project project = ResourceUtil.checkResource(baseMapper, id);
        if (project.getAccountId() != null && Objects
                .equals(project.getAccountId(), Constant.INNER_ACCOUNT_ID)
                || project.getInitFrom() != null && project.getInitFrom().equals(InitFrom.DOMA
                .getType())) {
            throw new BaseException(ResultCode.NO_AUTH.getCode(),
                    ResultCode.NO_AUTH.getMsg());
        }
    }


    @Override
    public ProjectRespVo get(String id) {
        Project project = ResourceUtil.checkResource(baseMapper, id);

        ProjectRespVo projectRespVo = structUtil.convertProjectRespVo(project);
        List<String> tradeIds = iProjectTradeRefService
                .getProjectTradeRefsByProjectId(Collections.singletonList(id)).stream().map(
                        ProjectTradeRef::getTradeId)
                .collect(Collectors.toList());
        if (!tradeIds.isEmpty()) {
            List<Trade> trades = iTradeService.getTradesByIds(tradeIds);
            projectRespVo
                    .setTrades(trades != null ? structUtil.convertTradeVo(trades) : new ArrayList<>());
        } else {
            projectRespVo.setTrades(new ArrayList<>());
        }

        projectRespVo.setCreatorName(getUserName(project.getCreator()));
        return projectRespVo;
    }

    /**
     * TODO 用户信息
     *
     * @param userId
     * @return
     */
    private String getUserName(Long userId) {
        //doucApi 获取用户信息
        if (null == userId) {
            return null;
        }
        BaseUser byId = baseUserService.getById(userId);
        if (byId != null) {
            return byId.getUsername();
        } else {
            return "-";
        }
    }

    @Override
    public PageBaseListRespVo getList(String name, Integer curPage, Integer pageSize) {
        PageBaseListRespVo pageBaseListRespVo = new PageBaseListRespVo();
        Long accountId = ThreadLocalContext.getAccountId();

        LambdaQueryWrapper<Project> projectLambdaQueryWrapper = new LambdaQueryWrapper<>();
        projectLambdaQueryWrapper.in(Project::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID));

        if (StringUtils.isNotEmpty(name)) {
            List<String> tradeIds = iTradeService.getTradeIdByLikeName(name);

            List<String> projectIds = new ArrayList<>();
            if (tradeIds != null && !tradeIds.isEmpty()) {
                projectIds = iProjectTradeRefService.getProjectIdByTradeIds(tradeIds);
            }

            List<String> finalProjectIds = projectIds;
            projectLambdaQueryWrapper.and(i -> i.in(!finalProjectIds.isEmpty(), Project::getId, finalProjectIds)
                    .or().like(Project::getName, name).or().like(Project::getDesc, name));
        }

        projectLambdaQueryWrapper.orderByDesc(Project::getUpdateTime);
        List<Project> projectList;
        long total;
        if (curPage != null && pageSize != null) {
            Page<Project> page = new Page<>(curPage, pageSize);
            Page<Project> projectPage = baseMapper.selectPage(page, projectLambdaQueryWrapper);
            total = projectPage.getTotal();
            projectList = projectPage.getRecords();
        } else {
            projectList = baseMapper.selectList(projectLambdaQueryWrapper);
            total = projectList.size();
        }
        Map<String, List<TradeVo>> projectTrades = new HashMap<>();
        if (CollectionUtil.isNotEmpty(projectList)) {
            List<String> projectIds = projectList.stream().map(Project::getId).collect(Collectors.toList());
            List<TradeVo> jsonObjects = tradeMapper.findTradesByProjectIds(projectIds);
            projectTrades = jsonObjects.stream().collect(Collectors.groupingBy(o -> o.getProjectId()));
        }

        Map<String, List<TradeVo>> finalProjectTrades = projectTrades;
        List<ProjectRespVo> projectRespVos = projectList.stream().map(i -> {
            ProjectRespVo projectRespVo = structUtil.convertProjectRespVo(i);
            List<TradeVo> trades = finalProjectTrades.get(projectRespVo.getId());
            if (CollectionUtil.isEmpty(trades)) {
                trades = new ArrayList<>();
            }
            projectRespVo.setTrades(trades);
            projectRespVo.setCreatorName(getUserName(projectRespVo.getCreator()));
            return projectRespVo;
        }).collect(Collectors.toList());

        pageBaseListRespVo.setList(projectRespVos);
        pageBaseListRespVo.setCurPage(curPage);
        pageBaseListRespVo.setPageSize(pageSize);
        pageBaseListRespVo.setTotal(total);
        return pageBaseListRespVo;
    }

    @Override
    public Project findByInitFrom(String initFrom) {
        LambdaQueryWrapper<Project> lambdaQueryWrapper = new LambdaQueryWrapper<>();
        lambdaQueryWrapper.eq(Project::getInitFrom, initFrom);
        return baseMapper.selectOne(lambdaQueryWrapper);
    }

    @Override
    public List<Project> getProjectList(List<String> id) {
        LambdaQueryWrapper<Project> lambdaQueryWrapper = new LambdaQueryWrapper<>();
        lambdaQueryWrapper.in(Project::getId, id);
        return baseMapper.selectList(lambdaQueryWrapper);
    }

    @Override
    public Long getProjectCount() {
        Long accountId = ThreadLocalContext.getAccountId();
        LambdaQueryWrapper<Project> projectLambdaQueryWrapper = new LambdaQueryWrapper<>();
        projectLambdaQueryWrapper
                .in(Project::getAccountId, Arrays.asList(accountId, Constant.INNER_ACCOUNT_ID));
        return baseMapper.selectCount(projectLambdaQueryWrapper);
    }
}
