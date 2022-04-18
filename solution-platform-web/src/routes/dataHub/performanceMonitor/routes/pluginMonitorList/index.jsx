/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import PluginMonitorList from '../../components/PluginMonitorList';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        pluginMonitorListReducer: state.pluginMonitorListReducer
    };
};

const PluginMonitorListComponent = connect(mapStateToProps)(PluginMonitorList);

export default () => <PluginMonitorListComponent />;
