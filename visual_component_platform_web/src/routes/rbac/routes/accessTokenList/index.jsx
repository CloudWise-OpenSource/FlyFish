/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import AccessToken from '../../components/AccessToken';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        accessTokenListReducer: state.accessTokenListReducer
    };
};

const AccessTokenComponent = connect(mapStateToProps)(AccessToken);

export default () => <AccessTokenComponent />;
