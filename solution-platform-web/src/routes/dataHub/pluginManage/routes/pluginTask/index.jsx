/**
 * Created by john on 2018/1/24.
 */
import { connect } from 'react-redux';
import PluginTask from '../../components/PluginTask';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
    };
};

const PluginTaskComponent = connect(mapStateToProps)(PluginTask);

export default () => <PluginTaskComponent />;
