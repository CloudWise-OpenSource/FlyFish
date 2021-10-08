/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import RoleList from '../../components/RoleList';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        roleListReducer: state.roleListReducer
    };
};

const RoleListComponent = connect(mapStateToProps)(RoleList);

export default () => <RoleListComponent />;
