/**
 * Created by willem on 2018/3/16.
 */
import styles from './index.scss';
import { Modal } from 'antd';
import classNames from 'classnames';

const Tj_Modal = (props) => (<Modal
            {...props}
            className={classNames(styles.tj_modalBox, props.className)}
        >{props.children}</Modal>);

export default Tj_Modal;
