function emptyActions() {
  // 警告 提示当前使用的是空 Action
  console.warn("Current execute action is empty!");
}

class Actions {
  // 默认值为空actions
  actions = {
    onGlobalStateChange: emptyActions,
    setGlobalState: emptyActions,
  };

  /**
   * 设置真正的actions
   * @param {*} actions 
   */
  setActions(actions) {
    this.actions = actions;
  }

  /**
   * 映射
   * @param  {...any} args 
   */
  onGlobalStateChange(...args) {
    return this.actions.onGlobalStateChange(...args);
  }

  /**
   * 映射
   * @param  {...any} args 
   */
  setGlobalState(...args) {
    return this.actions.setGlobalState(...args);
  }
}

const actions = new Actions();

export default actions;