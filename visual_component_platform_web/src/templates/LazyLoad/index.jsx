/**
 * @description 延迟加载工具
 * @author vision <vision.shi@tianjishuju.com>
 * @license www.tianjishuju.com/license
 */
import LazyLoad from './lazyLoad';

export default lazyLoader => props => <LazyLoad {...props} lazyLoader={lazyLoader} />;
