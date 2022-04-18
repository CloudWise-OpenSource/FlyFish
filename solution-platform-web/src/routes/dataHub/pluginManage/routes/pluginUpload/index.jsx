/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import PluginUpload from '../../components/PluginUpload';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        PluginUploadReducer:state.PluginUploadReducer
    };
};

const PluginUploadComponent = connect(mapStateToProps)(PluginUpload);

export default () => <PluginUploadComponent />;
