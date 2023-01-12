package com.cloudwise.lcap.commonbase.util;

import cn.hutool.json.JSONObject;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * @author yinqiqi
 */
public class BusinessUtils {

    /**
     * 大屏 pages 字段规则修改：如某些图片相对路径不带前缀
     * @param pageList
     * @return
     */
    public static void renderPagesConfig(List<JSONObject> pageList) {
        if (!CollectionUtils.isEmpty(pageList)){
            for (JSONObject page : pageList) {
                JSONObject options = page.getJSONObject("options");
                if (options != null && !StringUtils.isEmpty(options.getStr("backgroundImage")) && !options.getStr("backgroundImage").startsWith("/")) {
                    options.set("backgroundImage", "/" + options.getStr("backgroundImage"));
                }

                List<JSONObject> components = page.getBeanList("components", JSONObject.class);
                if (!CollectionUtils.isEmpty(components)) {
                    for (JSONObject component : components) {
                        if (!"PageLink".equals(component.getStr("type")) && null != component.getJSONObject("options")) {
                            JSONObject componentOption = component.getJSONObject("options");
                            String image  = componentOption.getStr("image");
                            if (image != null && !image.startsWith("/")) {
                                componentOption.set("image", "/" + image);
                            }
                        }
                    }
                }
                page.set("components",components);
            }
        }
    }
}
