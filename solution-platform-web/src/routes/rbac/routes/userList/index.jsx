/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import UserList from '../../components/UserList';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        userListReducer: state.userListReducer
    };
};

const UserListComponent = connect(mapStateToProps)(UserList);

export default () => <UserListComponent />;
