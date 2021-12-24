/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import OperateLogList from '../../components/OperateLogList';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        operateLogListReducer: state.operateLogListReducer
    };
};

const OperateLogListComponent = connect(mapStateToProps)(OperateLogList);

export default () => <OperateLogListComponent />;
