/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import ImgGroup from '../../components/ImgGroup';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        imgReducer: state.imgReducer
    };
};

const ImgGroupComponent = connect(mapStateToProps)(ImgGroup);

export default () => <ImgGroupComponent />;
