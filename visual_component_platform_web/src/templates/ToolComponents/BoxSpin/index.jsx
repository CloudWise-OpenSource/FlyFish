/**
 * Created by chencheng on 17-9-13.
 */
import PropTypes from 'prop-types';
import { Spin } from 'antd';

export default function BoxSpin({ style = {}, spinProps = {}}) {
    style = Object.assign({
        position: 'relative',
        width: '100%',
        minHeight: 200,
        textAlign: 'center',
    }, style);

    return (
        <div style={style} data-flex="main:center cross:center">
            <Spin {...spinProps} />
        </div>
    );
}

BoxSpin.propTypes = {
    style: PropTypes.object,
    spinProps: PropTypes.object
};
