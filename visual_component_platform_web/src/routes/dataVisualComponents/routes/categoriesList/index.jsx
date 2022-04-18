/**
 * Created by chencheng on 17-8-8.
 */
import { connect } from 'react-redux';
import CategoriesList from '../../components/CategoriesList';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
		categoriesListReducer: state.categoriesListReducer
    };
};

const CategoriesListComponent = connect(mapStateToProps)(CategoriesList);

export default () => <CategoriesListComponent />;
