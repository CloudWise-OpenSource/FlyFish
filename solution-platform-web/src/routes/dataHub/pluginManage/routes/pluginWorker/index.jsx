/**
 * Created by john on 2018/1/24.
 */
import { connect } from 'react-redux';
import PluginWorker from '../../components/PluginWorker';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
    };
};

const PluginWorkerComponent = connect(mapStateToProps)(PluginWorker);

export default () => <PluginWorkerComponent />;
