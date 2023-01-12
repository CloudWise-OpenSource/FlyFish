import React from "react";
import styles from "./assets/style.less";
import { FormattedMessage } from "react-intl";
import { Icon } from "@chaoswise/ui";
import SearchSelect from "../SearchSelect";

export default class SearchList extends React.Component {
  constructor(props) {
    super(props);
    this.selectRefEle = [];
  }

  validate() {
    return new Promise((resolve) => {
      let resultPromsies = [];
      this.selectRefEle.forEach((item) => {
        if (item) {
          resultPromsies.push(item.validate());
        }
      });
      Promise.all(resultPromsies).then((results) => {
        let isValid = true;
        let messages = [];
        results.forEach((result) => {
          if (!result.isValid) {
            isValid = false;
            messages.push(result.message);
          }
        });
        resolve({
          isValid,
          messages,
        });
      });
    });
  }

  setValidResult(list) {
    if (!list || !Array.isArray(list)) {
      list = [];
    }
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (!item.available && item.msg) {
        if (
          this.selectRefEle[i] &&
          typeof this.selectRefEle[i].setValidResult === "function"
        ) {
          this.selectRefEle[i].setValidResult({
            isValid: item.available,
            message: item.msg,
          });
        }
      }
    }
  }

  componentDidMount() {
    this.selectRefEle = [];
  }

  render() {
    let { list, onChange, queryType } = this.props;
    if (!Array.isArray(list)) {
      list = [];
    }

    return (
      <div className={styles.searchListWrap}>
        <div className={styles.searchList}>
          {list.map((item, index) => {
            return (
              <div key={`searchList-${index}`} className={styles.searchItem}>
                <span className={styles.required}>*</span>
                <span className={styles.label}>
                  <FormattedMessage
                    id="pages.dataSearch.groupDetail.searchItemPrefix"
                    defaultValue="查询"
                  />
                  {index + 1}:
                </span>
                <SearchSelect
                  key={`searchItem-${item.key}-${index}`}
                  ref={(instance) => {
                    if (instance) {
                      this.selectRefEle[index] = instance;
                    }
                  }}
                  value={item.value}
                  queryType={queryType}
                  onChange={(val) => {
                    list[index].value = val;
                    onChange && onChange(list);
                  }}
                />
                {list.length > 1 ? (
                  <div className={styles.actionWrap}>
                    <Icon
                      className={styles.action}
                      type="delete"
                      onClick={(e) => {
                        e.preventDefault();
                        this.selectRefEle = this.selectRefEle.filter(
                          (val, innerIndex) => innerIndex !== index
                        );
                        onChange &&
                          onChange(
                            list.filter(
                              (val, innerIndex) => innerIndex !== index
                            )
                          );
                      }}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
