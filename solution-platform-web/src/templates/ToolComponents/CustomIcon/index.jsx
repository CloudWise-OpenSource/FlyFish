import './icon/iconfont.css';
import styles from './index.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * 自定义icon
 * @param type
 * @param className
 * @param spin
 * @param rest
 * @return {*}
 * @constructor
 */
const CustomIcon = ({ type, className, spin, ...rest }) => {
    const classString = classNames({
        iconfont: true,
        [styles['custom-icon-spin']]: !!spin,
        [`icon-${type}`]: true,
        // anticon: true,
    }, className);

    return <i className={classString} {...rest} />;
};
CustomIcon.propTypes = {
    type: PropTypes.string.isRequired,      // icon类型
    className: PropTypes.string,            // 类名
    spin: PropTypes.bool,                   // 是否旋转
    style: PropTypes.object,                // 样式
};

export default CustomIcon;
