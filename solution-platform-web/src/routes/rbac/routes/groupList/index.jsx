/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import GroupList from '../../components/GroupList';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        groupListReducer: state.groupListReducer
    };
};

const GroupListComponent = connect(mapStateToProps)(GroupList);

export default () => <GroupListComponent />;
