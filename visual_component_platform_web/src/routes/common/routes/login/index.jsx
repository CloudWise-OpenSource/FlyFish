import { connect } from 'react-redux';
import Login from '../../components/Login';

const mapStateToProps = (state, ownProps) => {
	return {
		screenListReducer: state.screenListReducer,
		...ownProps
	};
};

const LoginComponent = connect(mapStateToProps)(Login);

export default () => <LoginComponent />;
