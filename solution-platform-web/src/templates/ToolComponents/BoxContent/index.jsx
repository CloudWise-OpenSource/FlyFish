/**
 * Created by chencheng on 17-9-13.
 */
import PropTypes from 'prop-types';
import T from 'utils/T';
import BoxSpin from 'templates/ToolComponents/BoxSpin';
import { Icon } from 'antd';

export default function BoxContent({ notDataBodyStyle = {}, isNotData = false, loading = false, children }) {
    notDataBodyStyle = Object.assign({
        width: '100%',
        height: '100%',
        textAlign: 'center',
        padding: '10px 0px',
    }, notDataBodyStyle);

    if (T.lodash.isFunction(isNotData)) {
        isNotData = isNotData();
    }

    return (
        <div>
            {
                (() => {
                    if (loading) {
                        return <BoxSpin />;
                    } else {
                        return !isNotData ? children : <div style={notDataBodyStyle} data-flex="main:center cross:center">
                            <Icon type="frown-o" />暂无数据
                        </div>;
                    }
                })()

            }
        </div>
    );
}

BoxContent.propTypes = {
    notDataBodyStyle: PropTypes.object,
    isNotData: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    loading: PropTypes.bool
};
