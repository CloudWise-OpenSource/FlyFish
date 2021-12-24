/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import MonitorList from '../../components/MonitorList';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps
    };
};

const MonitorListComponent = connect(mapStateToProps)(MonitorList);

export default () => <MonitorListComponent />;
