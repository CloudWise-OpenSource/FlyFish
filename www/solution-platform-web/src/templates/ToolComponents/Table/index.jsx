import styles from "./index.scss";
import { Table } from 'antd';

/**
 * 表格
 * @param rest
 * @returns {*}
 * @constructor
 */
const Tj_Table = ({...rest}) => <Table className={styles.tj_table} {...rest} />;

export default Tj_Table;
