/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import ComponentChangeDetail from '../../components/ComponentChangeDetail';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
    };
};

const ComponentChangeDetailComponent = connect(mapStateToProps)(ComponentChangeDetail);

export default () => <ComponentChangeDetailComponent />;
