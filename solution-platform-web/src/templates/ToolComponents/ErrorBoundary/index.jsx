import styles from './index.scss';
import { PureComponent } from 'react';

/**
 * 应用错误便捷
 */
export default class ErrorBoundary extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            info: null,
        };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true, error, info });
    }

    render() {
        if (this.state.hasError) {
            return <h1 className={styles["text-center"]}>页面产生错误，请联系管理员!</h1>;
        }

        return this.props.children;
    }
}
