/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import PluginLog from '../../components/PluginLog';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        PluginLogReducer:state.PluginLogReducer
    };
};

const PluginLogComponent = connect(mapStateToProps)(PluginLog);

export default () => <PluginLogComponent />;
