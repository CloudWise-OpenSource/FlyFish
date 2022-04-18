/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import ComponentCreate from '../../components/ComponentCreate';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
    };
};

const ComponentCreateComponent = connect(mapStateToProps)(ComponentCreate);

export default () => <ComponentCreateComponent />;
