/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import BigScreen from '../../components/BigScreen';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        screenListReducer: state.screenListReducer
    };
};

const BigScreenComponent = connect(mapStateToProps)(BigScreen);

export default () => <BigScreenComponent />;
