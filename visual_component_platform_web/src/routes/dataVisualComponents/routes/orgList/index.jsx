/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import OrgList from '../../components/OrgList';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        orgListReducer: state.orgListReducer
    };
};

const OrgListComponent = connect(mapStateToProps)(OrgList);

export default () => <OrgListComponent />;
