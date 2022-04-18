/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import ImgIndex from '../../components/ImgIndex';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        imgReducer: state.imgReducer
    };
};

const ImgIndexComponent = connect(mapStateToProps)(ImgIndex);

export default () => <ImgIndexComponent />;
