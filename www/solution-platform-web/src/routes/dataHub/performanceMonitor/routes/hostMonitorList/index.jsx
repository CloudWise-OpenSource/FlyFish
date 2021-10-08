/**
 * Created by willem on 18-1-24.
 */
import { connect } from 'react-redux';
import HostMonitorList from '../../components/HostMonitorList';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        hostMonitorListReducer: state.hostMonitorListReducer
    };
};

const HostMonitorListComponent = connect(mapStateToProps)(HostMonitorList);

export default () => <HostMonitorListComponent />;
