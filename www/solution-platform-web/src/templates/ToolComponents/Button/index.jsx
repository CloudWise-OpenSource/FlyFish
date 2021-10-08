/**
 * Created by john on 2018/3/14.
 */
import styles from './index.scss'
import {Button} from 'antd'

const Tj_Button = ({...rest})=> {
    return <Button className={styles.Tj_Button} {...rest}>{{...rest}.children}</Button>
}

export default Tj_Button
