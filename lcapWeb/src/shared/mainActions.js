import { initGlobalState } from "qiankun";

const initialState = {};
const actions = initGlobalState(initialState);

class Actions {

  initialState = {};
  
  actions = actions;

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

    // 存储状态
    this.initialState = {
      ...this.initialState,
      ...args,
    };

    return this.actions.setGlobalState(...args);
  }

}

export default new Actions();