package com.cloudwise.lcap.commonbase.util;

/**
 * TODO 写点注释吧
 *
 * @author liuzhiheng
 * @version V1.0.0
 * @since V1.0.0
 */
public interface ITableFieldConditionDecision {
	public boolean adjudge(String tableName, String fieldName) ;

	public boolean isAllowNullValue() ;
}
