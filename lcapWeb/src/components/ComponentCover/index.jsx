import React from 'react';
import styles from './style.less';

export default function ComponentCover({ link, onClick, width }) {
  return (
    <div className={styles.ComponentCoverWrap}>
      <img
        className={styles.ComponentCover}
        src={
          window.FLYFISH_CONFIG.snapshotAddress +
          link +
          `?t=${new Date().getTime()}`
        }
        width={width}
        onClick={() => {
          onClick && onClick();
        }}
      ></img>
    </div>
  );
}
