/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import Permission from '../../components/Permission';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
    };
};

const PermissionComponent = connect(mapStateToProps)(Permission);

export default () => <PermissionComponent />;
