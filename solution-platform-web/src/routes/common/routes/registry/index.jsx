import { connect } from 'react-redux';
import Registry from '../../components/Registry';

const mapStateToProps = (state, ownProps) => {
    return {
        screenListReducer: state.screenListReducer,
        ...ownProps
    };
};

const RegistryComponent = connect(mapStateToProps)(Registry);

export default () => <RegistryComponent />;