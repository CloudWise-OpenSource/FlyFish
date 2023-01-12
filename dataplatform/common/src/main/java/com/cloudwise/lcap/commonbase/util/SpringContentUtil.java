package com.cloudwise.lcap.commonbase.util;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionBuilder;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.lang.annotation.Annotation;

/**
 * bean工厂类
 *
 * @author zhaobo
 * @date 2021/12/20
 */
@Component
public class SpringContentUtil implements ApplicationContextInitializer<ConfigurableApplicationContext> {
    public static ConfigurableApplicationContext applicationContext;


    public static <T> T getBean(Class<T> clazz) {
        return applicationContext.getBean(clazz);
    }

    public static <T> T getBean(String beanName) {
        return (T) applicationContext.getBean(beanName);
    }

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        SpringContentUtil.applicationContext = applicationContext;
    }

    public static <T> T registerBean(Class<T> clazz, Object... args) {
        String beanName = clazz.getSimpleName();
        Annotation[] annotations = clazz.getAnnotations();
        if (annotations.length > 0) {
            boolean annotationPresent = clazz.isAnnotationPresent(Service.class);
            if (annotationPresent) {
                Service annotation = clazz.getAnnotation(Service.class);
                String value = annotation.value();
                if (value.length() > 0) {
                    beanName = value;
                }
            } else {
                annotationPresent = clazz.isAnnotationPresent(Component.class);
                if (annotationPresent) {
                    Component annotation = clazz.getAnnotation(Component.class);
                    String value = annotation.value();
                    if (value.length() > 0) {
                        beanName = value;
                    }
                }
            }

        }
        if (applicationContext.containsBean(beanName)) {
            Object bean = applicationContext.getBean(beanName);
            if (bean.getClass().isAssignableFrom(clazz)) {
                return (T) bean;
            } else {
                throw new RuntimeException("BeanName 重复 " + beanName);
            }
        }
        BeanDefinitionBuilder beanDefinitionBuilder = BeanDefinitionBuilder.genericBeanDefinition(clazz);
        for (Object arg : args) {
            beanDefinitionBuilder.addConstructorArgValue(arg);
        }
        BeanDefinition beanDefinition = beanDefinitionBuilder.getRawBeanDefinition();

        BeanDefinitionRegistry beanFactory = (BeanDefinitionRegistry) applicationContext.getBeanFactory();
        beanFactory.registerBeanDefinition(beanName, beanDefinition);
        return applicationContext.getBean(beanName, clazz);
    }

    public static void publishEvent(ApplicationEvent applicationEvent) {
        applicationContext.publishEvent(applicationEvent);
    }
}
