

/**
 * 枚举所有类型
 * @type {string}
 */
exports.EnumAllType = 'all';


/**
 * 枚举数据操作类型
 *
 * 注意: 资源类型是唯一
 * @type {{db: {mysql: string, postgreSQL: string, oracle: string, snappy: string, druid: string, elasticsearch: string, hdfs: string}, middleware: {kafka: string}, file: {excel: string, csv: string}, api: {restful: string}}}
 */
exports.EnumDataOperateType = {
    // 数据库类型
    db: {
        mysql: 'mysql',
        postgreSQL: 'postgreSQL',
        oracle: 'oracle',
        snappy: 'snappy',
        druid: 'druid',
        elasticsearch: 'elasticSearch',
        hdfs: 'hdfs'
    },

    // 中间件类型
    middleware:{
        kafka: 'kafka'
    },

    // 文件类型
    file: {
        excel: 'excel',
        csv: 'csv'
    },

    // 接口类型
    api: {
        restful: 'restful'
    }
}
