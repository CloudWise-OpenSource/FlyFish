/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import SceneManage from '../../components/SceneManage';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
    };
};

const SceneManageComponent = connect(mapStateToProps)(SceneManage);

export default () => <SceneManageComponent />;
