import React, { Component } from "react";
import { Input, Collapse, Tooltip } from "@chaoswise/ui";
import styles from "./assets/style.less";
import noComponnetViewImg from "./assets/noComponnetView.png";
import _ from "lodash";

const { Search } = Input;
const { Panel } = Collapse;

const filterComponentList = (componentList, searchContent) => {
  if (!searchContent) {
    return componentList;
  }
  if (!Array.isArray(componentList) || componentList.length === 0) {
    return componentList;
  }
  const copyComponentList = _.cloneDeep(componentList);

  const newScomponentList = [];
  for (
    let componentIndex = 0;
    componentIndex < copyComponentList.length;
    componentIndex++
  ) {
    const componentItem = copyComponentList[componentIndex];
    let isShow = false;
    if (
      Array.isArray(componentItem.subCategories) &&
      componentItem.subCategories.length > 0
    ) {
      const newSubCatories = [];
      for (
        let subCatoryIndex = 0;
        subCatoryIndex < componentItem.subCategories.length;
        subCatoryIndex++
      ) {
        const subCategory = componentItem.subCategories[subCatoryIndex];
        if (
          Array.isArray(subCategory.components) &&
          subCategory.components.length > 0
        ) {
          subCategory.components = subCategory.components.filter(
            (c) => c.name.indexOf(searchContent) !== -1
          );
          if (subCategory.components.length > 0) {
            isShow = true;
            newSubCatories.push(subCategory);
          }
        }
      }
      componentItem.subCategories = newSubCatories;
    }
    if (isShow) {
      newScomponentList.push(componentItem);
    }
  }
  return newScomponentList;
};
export default class ComponentCard extends Component {
  state = {
    searchContent: "",
  };

  onSearchChanged(e) {
    this.setState({ searchContent: e.target.value });
  }

  render() {
    const { searchContent } = this.state;
    const { componentList, activeComponent, onActiveComponentChanged } =
      this.props;
    let currentShowComponentList = [];
    if (searchContent) {
      currentShowComponentList = filterComponentList(
        _.cloneDeep(componentList),
        searchContent
      );
    } else {
      currentShowComponentList = componentList;
    }
    return (
      <div className={styles.componentCardWrap}>
        <div className={styles.componentCardSearch}>
          <Search
            className={styles.componentCardSearchInput}
            placeholder="按名字查找组件"
            value={this.state.searchContent || ""}
            onChange={(e) => this.onSearchChanged(e)}
          />
        </div>
        <div className={styles.componentCardContent}>
          <Collapse defaultActiveKey={componentList.map((c) => c.id)}>
            {currentShowComponentList.map((componentGroup) => (
              <Panel
                header={
                  <div className="collapse-header-content">
                    <div className="collapse-header-name">
                      <Tooltip title={componentGroup.name}>
                        {componentGroup.name}
                      </Tooltip>
                    </div>
                  </div>
                }
                key={componentGroup.id}
              >
                <Collapse
                  className={styles.componentSubCategories}
                  defaultActiveKey={componentGroup.subCategories.map(
                    (s) => s.id
                  )}
                >
                  {componentGroup.subCategories.map((subCategory) => (
                    <Panel
                      header={
                        <div className="collapse-header-content">
                          <div className="collapse-header-name">
                            <Tooltip title={subCategory.name}>
                              {subCategory.name}
                            </Tooltip>
                          </div>
                        </div>
                      }
                      key={subCategory.id}
                    >
                      <div className="single-component-card-list">
                        {subCategory.components.map((component) => (
                          <div
                            className={`${styles.singleComponentCard} ${
                              activeComponent &&
                              component.id === activeComponent.id
                                ? styles.singleComponentCardActive
                                : ""
                            }`}
                            onClick={() => {
                              onActiveComponentChanged &&
                                onActiveComponentChanged(component);
                            }}
                            key={`component-card-${component.id}`}
                          >
                            <img
                              src={`${window.LCAP_CONFIG.snapshotAddress}${component.cover}`}
                              className={styles.singleComponentCardImg}
                              onError={(e) => {
                                // 替换的图片
                                e.target.src = noComponnetViewImg;
                                e.onError = null;
                              }}
                            />
                            <div className={styles.singleComponentCardName}>
                              <Tooltip
                                className={styles.tableItemName}
                                title={component.name}
                              >
                                {component.name}
                              </Tooltip>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Panel>
                  ))}
                </Collapse>
              </Panel>
            ))}
          </Collapse>
        </div>
      </div>
    );
  }
}
