/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import HubMonitorList from '../../components/HubMonitorList';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        hubMonitorListReducer: state.hubMonitorListReducer
    };
};

const HubMonitorListComponent = connect(mapStateToProps)(HubMonitorList);

export default () => <HubMonitorListComponent />;
