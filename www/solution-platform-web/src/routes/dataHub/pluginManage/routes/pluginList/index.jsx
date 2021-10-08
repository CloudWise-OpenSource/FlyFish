/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import PluginList from '../../components/PluginList';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        PluginListReducer:state.PluginListReducer
    };
};

const PluginListComponent = connect(mapStateToProps)(PluginList);

export default () => <PluginListComponent />;
