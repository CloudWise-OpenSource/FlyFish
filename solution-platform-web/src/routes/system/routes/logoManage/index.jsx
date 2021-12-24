import { connect } from 'react-redux';
import LogoManage from '../../components/LogoManage';

const mapStateToProps = (state, ownProps) =>{
    return{
        ...ownProps
    };
};

const LogoManageComponent = connect(mapStateToProps)(LogoManage);

export default () => <LogoManageComponent />;
