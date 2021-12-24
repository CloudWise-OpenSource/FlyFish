import styles from "./index.scss";
import img_404 from './img/404.svg';
import img_403 from './img/403.svg';
import img_500 from './img/500.svg';

import {createElement} from 'react';
import { Button } from 'antd';

const config = {
    403: {
        img: img_403,
        title: '403',
        desc: '抱歉，你无权访问该页面',
    },
    404: {
        img: img_404,
        title: '404',
        desc: '抱歉，你访问的页面不存在',
    },
    500: {
        img: img_500,
        title: '500',
        desc: '抱歉，服务器出错了',
    },
};

export default ({ className = "", linkElement = 'a', type, title, desc, img, ...rest }) => {
    const pageType = type in config ? type : '404';

    return (
        <div className={styles.exception + " " + className} {...rest}>
            <div className={styles.imgBlock}>
                <div
                    className={styles.imgEle}
                    style={{ backgroundImage: `url(${img || config[pageType].img})` }}
                />
            </div>
            <div className={styles.content}>
                <h1>{title || config[pageType].title}</h1>
                <div className={styles.content}>{desc || config[pageType].desc}</div>
                <div className={styles.actions}>
                    {
                        createElement(linkElement, {
                            to: window.ENV.rootPath,
                            href: window.ENV.rootPath,
                        }, <Button type="primary">返回首页</Button>)
                    }
                </div>
            </div>
        </div>
    );
};
