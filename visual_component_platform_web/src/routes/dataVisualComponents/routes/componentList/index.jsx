/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import ComponentList from '../../components/ComponentList';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        componentListReducer: state.componentListReducer
    };
};

const ComponentListComponent = connect(mapStateToProps)(ComponentList);

export default () => <ComponentListComponent />;
