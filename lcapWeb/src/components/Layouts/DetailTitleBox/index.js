import React from "react";
import styles from "./assets/style.less";

export default function DetailTitleBox({ title, desc, children }) { 

    return (
      <div className={styles.layoutDetailTitleBox}>
        {title && <h3 className={styles.title}>{title}</h3>}
        {desc && <p className={styles.desc}>{desc}</p>}
        {children}
      </div>
    );
}