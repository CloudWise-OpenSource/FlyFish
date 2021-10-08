/**
 * Created by john on 2018/3/14.
 */
import styles from './index.scss'
import { Input } from 'antd'

const Tj_Input = ({...rest}) => {

    let title ={...rest}.title

    return <div className={styles.Tj_Input}>
        <span className={styles["title"]}>{title}:</span>
        <Input {...rest} />
    </div>;
}

export default Tj_Input;
