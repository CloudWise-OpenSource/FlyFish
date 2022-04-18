/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import threeEdit from '../../components/3dEdit';

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    threeEdit: state.screenListReducer
  };
};

const ThreeEditComponent = connect(mapStateToProps)(threeEdit);

export default () => <ThreeEditComponent />;
