/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import PluginConf from '../../components/PluginConf';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        PluginConfReducer: state.PluginConfReducer
    };
};

const PluginConfComponent = connect(mapStateToProps)(PluginConf);

export default () => <PluginConfComponent />;
