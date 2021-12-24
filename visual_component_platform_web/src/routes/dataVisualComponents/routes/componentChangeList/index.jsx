/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import ComponentChangeList from '../../components/ComponentChangeList';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
    };
};

const ComponentChangeListComponent = connect(mapStateToProps)(ComponentChangeList);

export default () => <ComponentChangeListComponent />;
