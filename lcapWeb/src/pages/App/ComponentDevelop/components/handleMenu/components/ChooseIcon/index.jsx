import React, { Component } from 'react';
import styles from './assets/style.less';
import iconMapping from '../../iconMapping';

export default class ChooseIcon extends Component {
  render() {
    const { value } = this.props;
    const icons = Object.keys(iconMapping);
    return (
      <div className={styles.componentChooseIcon}>
        <div className={styles.chooseIconWrap}>
          <div className={styles.iconList}>
            {icons.map((iconItem) => {
              return (
                <div
                  key={`categoriy-icon-${iconItem}`}
                  className={`${styles.iconItem} ${
                    value === iconItem ? styles.iconItemActive : ''
                  }`}
                  onClick={() => {
                    this.props.onChange && this.props.onChange(iconItem);
                  }}
                >
                  <i
                    className={`categoriy-iconfont ${iconMapping[iconItem]}`}
                  ></i>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.iconProviewWrap}>
          {value && (
            <div className={styles.iconProview}>
              <i
                className={`${styles.iconProviewIcon} categoriy-iconfont ${iconMapping[value]}`}
              ></i>
              <p className={styles.iconProviewText}>图表预览</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
